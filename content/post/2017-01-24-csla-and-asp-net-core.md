---
comments: true
published: true
title: "CSLA and ASP.NET Core"
slug: "csla-and-asp.net-core"
date: 2017-01-24
categories:
    - "Development"      
tags:
    - "CSLA"
    - "ASP.NET CORE"
---
I am a fan of CSLA and I recently came accross a need to make a shiny CSLA business layer work nicely within the context of an ASP.NET Core application.
This post is aimed at CSLA developers with a similar need.
As of the [current release](https://www.nuget.org/packages/CSLA-Core/4.6.500), there are a few things that you will need to take care of in order to get CSLA working smoothly, and I will cover those in this post.
<!--more-->

### Csla.ApplicationContext

CSLA developers should be familiar with `Csla.ApplicationContext` which provides the means to access useful context, as well as the current `User` / `IPrinciple`.
However when running under ASP.NET Core, `Csla.ApplicationContext` doesn't work correctly - as CSLA decides that your application is not a web application (as `HttpContext.Current` is null under ASP.NET Core) and so
it ends up storing things that should be stored in `HttpContext` on the current `Thread` instead.

To overcome this, however, is pretty straight forward. You just need to implement an extensibility point that Rocky has provided, called an `IContextManager`.

### IContextManager for ASP.NET Core.

Here is an implementation of an `IContextManager` that resolves the `HttpContext` using the `IHttpContextAccessor` instead:

{{< highlight csharp "linenos=true,style=default" >}}

  /// <summary>
    /// Application context manager that uses HttpContextAccessor whenr esolving HttpContext
    /// to store context values.
    /// </summary>
    public class HttpContextAccessorContextMananger : IContextManager
    {

        private const string _localContextName = "Csla.LocalContext";
        private const string _clientContextName = "Csla.ClientContext";
        private const string _globalContextName = "Csla.GlobalContext";

        private readonly IServiceProvider _serviceProvider;

        public HttpContextAccessorContextMananger(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
      

        protected virtual HttpContext GetHttpContext()
        {
            var httpContextAccessor = (IHttpContextAccessor)_serviceProvider.GetService(typeof(IHttpContextAccessor));
            if (httpContextAccessor != null)
            {
                if (httpContextAccessor.HttpContext == null)
                {
                    //   Debugger.Break();
                }
                return httpContextAccessor.HttpContext;
            }

            // Debugger.Break();
            return null;
        }


        /// <summary>
        /// Gets a value indicating whether this
        /// context manager is valid for use in
        /// the current environment.
        /// </summary>
        public bool IsValid
        {
            get
            {
                return GetHttpContext() != null;
            }
        }

        /// <summary>
        /// Gets the current principal.
        /// </summary>
        public System.Security.Principal.IPrincipal GetUser()
        {
            return GetHttpContext()?.User;
        }

        /// <summary>
        /// Sets the current principal.
        /// </summary>
        /// <param name="principal">Principal object.</param>
        public void SetUser(System.Security.Principal.IPrincipal principal)
        {
            var context = GetHttpContext();
            if (context != null)
            {
                context.User = (ClaimsPrincipal)principal;
            }
            else
            {
                //  Debugger.Break();
            }
           
        }

        /// <summary>
        /// Gets the local context.
        /// </summary>
        public ContextDictionary GetLocalContext()
        {
            return (ContextDictionary)GetHttpContext()?.Items[_localContextName];
        }

        /// <summary>
        /// Sets the local context.
        /// </summary>
        /// <param name="localContext">Local context.</param>
        public void SetLocalContext(ContextDictionary localContext)
        {
            var context = GetHttpContext();
            if (context != null)
            {
                context.Items[_localContextName] = localContext;
            }
            else
            {
              //  Debugger.Break();
            }
        }

        /// <summary>
        /// Gets the client context.
        /// </summary>
        public ContextDictionary GetClientContext()
        {
            return (ContextDictionary)GetHttpContext()?.Items[_clientContextName];
        }

        /// <summary>
        /// Sets the client context.
        /// </summary>
        /// <param name="clientContext">Client context.</param>
        public void SetClientContext(ContextDictionary clientContext)
        {
            var context = GetHttpContext();
            if (context != null)
            {
                context.Items[_clientContextName] = clientContext;
            }
            else
            {
              //  Debugger.Break();
            }
        }

        /// <summary>
        /// Gets the global context.
        /// </summary>
        public ContextDictionary GetGlobalContext()
        {
            return (ContextDictionary)GetHttpContext()?.Items[_globalContextName];
        }

        /// <summary>
        /// Sets the global context.
        /// </summary>
        /// <param name="globalContext">Global context.</param>
        public void SetGlobalContext(ContextDictionary globalContext)
        {
            var context = GetHttpContext();
            if (context != null)
            {
                context.Items[_globalContextName] = globalContext;
            }
            else
            {
              //  Debugger.Break();
            }
        }
    }

{{< / highlight >}}


### Configuring CSLA

Now that you have this implementation, you need to tell CSLA to use it. In the ASP.NET Core world, we are used to nice extension methods that we can use in our
`startup.cs` classes, in order to configure things fluently.

CSLA doesn't provide one of these just yet, but we can create one fairly easily:

{{< highlight csharp "linenos=true,style=default" >}}

 public static class CslaConfiguration
    {
        public static IServiceCollection ConfigureCsla(this IServiceCollection services, Action<CslaOptions, IServiceProvider> setupAction = null)
        {
            services.AddSingleton<CslaOptions>((sp) =>
            {
                var options = new CslaOptions();
                setupAction?.Invoke(options, sp);
                return options;
            });

            return services;
        }

        public static IApplicationBuilder UseCsla(this IApplicationBuilder appBuilder)
        {
            // grab the options
            var options = appBuilder.ApplicationServices.GetRequiredService<CslaOptions>();

            // configure csla according to options.
            Csla.Server.FactoryDataPortal.FactoryLoader = options.ObjectFactoryLoader;
            Csla.ApplicationContext.WebContextManager = options.WebContextManager ?? new HttpContextAccessorContextMananger(appBuilder.ApplicationServices);
            
            return appBuilder;
        }

        public class CslaOptions
        {
            public IObjectFactoryLoader ObjectFactoryLoader { get; set; }

            public IContextManager WebContextManager { get; set; }           

        }
    }

{{< / highlight >}}

So we can now configure CSLA in our `startup.cs` like this:

{{< highlight csharp "linenos=true,style=default" >}}

    public class Startup
    {              
       
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Configure Csla
           services.ConfigureCsla((options, sp) => {               
                // could configure other CSLA hooks / options here in future.
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login")
            });
           app.UseCsla();      
        }        
    }

{{< / highlight >}}

CSLA `ApplicationContext` should now behave correctly thanks to the custom `IContextManager` for ASP.NET Core.

### Conclusion

I also went a few steps further in my particular application, to enable DI to flow from my ASP.NET Core `IServiceProvider` into my CSLA business tier, but that's a topic for another article.

I suspect that Rocky will release improved support for ASP.NET Core in the future, so that this post becomes obsolete.
Until then, Bon Appétit!