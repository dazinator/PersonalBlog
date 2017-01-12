---
layout: post
comments: true
published: true
title: "ASPNET Core TagHelper's - A Better @addTagHelper type resolver"
date: 2016-07-25
categories:
    - "Development"      
tags:
    - "ASP.NET CORE"
---
### What's this about?

This is about TagHelper's in ASP.NET Core, and how to get more flexible `@addTagHelper` directives. 
<!--more-->

Suppose your application loads some assemblies dynamically - for example, from a plugins folder, and those assemblies contain `TagHelper`'s.

In startup.cs you would have something like this to register your assemblies with the MVC parts system:

{{< highlight csharp "linenos=true,style=default" >}}

 var assy = Assembly.LoadFile("C:\\SomePath\Plugin.Authentication.dll");
 mvcBuilder.AddApplicationPart(assy);

 var assy = Assembly.LoadFile("C:\\SomePath\Plugin.Markdown.dll");
 mvcBuilder.AddApplicationPart(assy);

{{< / highlight >}}

Now suppose you have a Razor View with some markup that can be targeted by those tag helpers:

{{< highlight html "linenos=true,style=colorful" >}}

 <plugin-authentication />
 <plugin-markdown visible="true"/>

{{< / highlight >}}

If you run your application, those TagHelper's won't work. 
This is because you don't have any `@addTagHelper` directive yet in your razor view, and so razor doesn't know it should be using them. This is where things get a bit interesting!

<!-- more -->

### Let's add an `addTagHelper` directive

So we add the directive to our __ViewImports.cshtml file:

{{< highlight bat "linenos=true,style=default" >}}
@addTagHelper "*, Plugin.Markdown"
{{< / highlight >}}

Now when we start our application, BOOM:

{{< highlight bat "linenos=true,style=default" >}}

An error occurred during the compilation of a resource required to process this request. Please review the following specific error details and modify your source code appropriately.

/Views/_ViewImports.cshtml

Cannot resolve TagHelper containing assembly 'Plugin.Markdown'. Error: Could not load file or assembly 'Plugin.Markdown' or one of its dependencies. The system cannot find the file specified.
@addTagHelper "*, Plugin.Markdown"


{{< / highlight >}}

This is because by defualt MVC does not resolve `TagHelper` assemblies registered with the parts system (atleast this is true as of RTM 1.0.0) so it complains when it processes that directive, saying it can't find such an assembly - because it can only see assemblies that are in the bin folder by default. So it can't see your plugin assembly.

### How do we solve?

Well if you add this line:

{{< highlight csharp "linenos=true,style=default" >}}

mvcBuilder.AddTagHelpersAsServices();

{{< / highlight >}}

That will register some replacement services that will check the application parts system when trying to resolve the tag helper assemblies based on the name provided by the addTagHelper directive.

However - this now works but it's still not ideal because we still have to add a directive for each `plugin` before it will work on our page/s. So when someone develops a new plugin, it won't work until we modify our `_ViewImports.cshtml` file and add another line:

{{< highlight csharp "linenos=true,style=default" >}}
@addTagHelper "*, Plugin.Markdown"
@addTagHelper "*, Plugin.Another"
@addTagHelper "*, Plugin.YetAnother"
{{< / highlight >}}

This can be incredibly frustrating because if you are wanting an extensibile system where plugins can be installed on the fly, then they should just work without constant modifications to source code.


### So Can We Do Better?

Yup. So here is my solution to this issue, and that is to allow `globbing` to be supported in the `addTagHelper` directive for the assembly name, just like it is for the TypeName portion.

So this is how you do that.

### ITagHelperTypeResolver


We need to create an `ITagHelperTypeResolver` and implement it's `Resolve` method. This method takes the string provided by in the `addTagHelper` directive and returns all `TagHelper` type's that are matches to that string. We will make our implementation support globbing on the assembly name so it can match `TagHelper` types accross multiple assemblies registered with the `Application Parts` system, instead of just from a single one. 

Here is my quick and dirty implementation, where I took a lot of the code from the microsoft implementation, and just added a few tweaks for globbing:

{{< highlight csharp "linenos=true,style=default" >}}

public class AssemblyNameGlobbingTagHelperTypeResolver : ITagHelperTypeResolver
    {
       
        private static readonly System.Reflection.TypeInfo ITagHelperTypeInfo = typeof(ITagHelper).GetTypeInfo();

        protected TagHelperFeature Feature { get; }

        public AssemblyNameGlobbingTagHelperTypeResolver(ApplicationPartManager manager)
        {
            if (manager == null)
            {
                throw new ArgumentNullException(nameof(manager));
            }

            Feature = new TagHelperFeature();
            manager.PopulateFeature(Feature);

            // _manager = manager;

        }

        /// <inheritdoc />
        public IEnumerable<Type> Resolve(
            string name,
            SourceLocation documentLocation,
            ErrorSink errorSink)
        {
            if (errorSink == null)
            {
                throw new ArgumentNullException(nameof(errorSink));
            }

            if (string.IsNullOrEmpty(name))
            {
                var errorLength = name == null ? 1 : Math.Max(name.Length, 1);
                errorSink.OnError(
                    documentLocation,
                    "Tag Helper Assembly Name Cannot Be Empty Or Null",
                    errorLength);

                return Type.EmptyTypes;
            }


            IEnumerable<TypeInfo> libraryTypes;
            try
            {
                libraryTypes = GetExportedTypes(name);
            }
            catch (Exception ex)
            {
                errorSink.OnError(
                    documentLocation,
                    $"Cannot Resolve Tag Helper Assembly: {name}, {ex.Message}",
                    name.Length);

                return Type.EmptyTypes;
            }

            return libraryTypes;

        }


        /// <inheritdoc />
        protected IEnumerable<System.Reflection.TypeInfo> GetExportedTypes(string assemblyNamePattern)
        {
            if (assemblyNamePattern == null)
            {
                throw new ArgumentNullException(nameof(assemblyNamePattern));
            }

            var results = new List<System.Reflection.TypeInfo>();

            for (var i = 0; i < Feature.TagHelpers.Count; i++)
            {
                var tagHelperAssemblyName = Feature.TagHelpers[i].Assembly.GetName();

                if (assemblyNamePattern.Contains("*")) // is it actually a pattern?
                {
                    if (tagHelperAssemblyName.Name.Like(assemblyNamePattern))
                    {
                        results.Add(Feature.TagHelpers[i]);
                        continue;
                    }
                }

                // not a pattern so treat as normal assembly name.
                var assyName = new AssemblyName(assemblyNamePattern);
                if (AssemblyNameComparer.OrdinalIgnoreCase.Equals(tagHelperAssemblyName, assyName))
                {
                    results.Add(Feature.TagHelpers[i]);
                    continue;
                }
            }

            return results;
        }

        private class AssemblyNameComparer : IEqualityComparer<AssemblyName>
        {
            public static readonly IEqualityComparer<AssemblyName> OrdinalIgnoreCase = new AssemblyNameComparer();

            private AssemblyNameComparer()
            {
            }

            public bool Equals(AssemblyName x, AssemblyName y)
            {
                // Ignore case because that's what Assembly.Load does.
                return string.Equals(x.Name, y.Name, StringComparison.OrdinalIgnoreCase) &&
                       string.Equals(x.CultureName ?? string.Empty, y.CultureName ?? string.Empty, StringComparison.Ordinal);
            }

            public int GetHashCode(AssemblyName obj)
            {
                var hashCode = 0;
                if (obj.Name != null)
                {
                    hashCode ^= obj.Name.GetHashCode();
                }

                hashCode ^= (obj.CultureName ?? string.Empty).GetHashCode();
                return hashCode;
            }
        }


    }


{{< / highlight >}}

Now we just register this on startup, after we have registered `MVC`:

{{< highlight csharp "linenos=true,style=default" >}}

  services.AddSingleton<ITagHelperTypeResolver, AssemblyNameGlobbingTagHelperTypeResolver>();

{{< / highlight >}}

Now we can just add one directive to our __ViewImports.cshtml file, like this:


{{< highlight csharp "linenos=true,style=default" >}}
@addTagHelper "*, Plugin.*"

{{< / highlight >}}

Now that will include all TagHelpers that live in assemblies matching that glob. We can drop new plugins in and their tag helpers will light up automatically.

You are welcome.
