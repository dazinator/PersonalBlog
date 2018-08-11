---
title: "Modular Multi-tenant ASP.NET Core Application with Dotnettency - Part 1"
slug: "creating-modular-multi-tenant-asp-net-core-application-with-dotnettency-part-1"
date: 2017-08-06T13:18:44+01:00
published: 2017-08-06T13:18:44+01:00
tags: 
    - "dotnettency"
    - "asp.net core"
    - "multitenancy" 
    - "aspnetcore"
categories:
    - "Development"
images: ["/img/new-aspnetcore-project.PNG"]
ShowInNavbar: false
Tutorial: "Building Modular Multi-tenant ASP.NET Core Applications with Dotnettency"
Name: "Part 1"
Part: 1
SourceCodeUrl: "https://github.com/dazinator/Dotnettency.Samples"
---

In this first part of the tutorial, we will create a shiny new asp.net core project that we will use moving forwards. We will then add some very basic multi-tenancy! We will expand on this in future posts.
Before starting this tutortial, you may wish to [read to the introduction](/tutorial/creating-modular-multi-tenant-asp-net-core-application-with-dotnettency) although this isn't a necessity. Ok if you are ready, let's dive in!
<!--more--> 
## Project Setup

Open VS2017 and create a new "empty" ASP.NET Core Web project:

![new-aspnetcore-project.PNG](/img/new-aspnetcore-project.PNG)

Add the `dotnettency` nuget package:

![neget-dotnettency.PNG](/img/nugetdotnettency.PNG)

In `Program.cs` allow kestrel to listen / bind to multiple ports.

```csharp
        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseUrls("http://*:5000", "http://*:5001", "http://*:5002", "http://*:5003")
                .Build();

            host.Run();
        }
```

Create a class to represent the `Tenant`. It can have whatever properties you feel are useful:

```csharp
    public class Tenant
    {
        public Tenant(Guid tenantGuid, string name)
        {
            TenantGuid = tenantGuid;   
            Name = name;                 
        }
      
        public Guid TenantGuid { get; set; }
        public string Name { get; set; }
    }
```

Now that we have our tenant, we need to create a class that `dotnettency` will use when it needs to load our tenant. Create a class that implements `ITenantShellFactory<TTenant>`:


```csharp
    public class TenantShellFactory : ITenantShellFactory<Tenant>
    {
        public Task<TenantShell<Tenant>> Get(TenantDistinguisher distinguisher)
        {
            if (distinguisher.Uri.Port == 5000 || distinguisher.Uri.Port == 5001)
            {
                Guid tenantId = Guid.Parse("049c8cc4-3660-41c7-92f0-85430452be22");
                var tenant = new Tenant(tenantId, "Moogle");
                // Also adding any additional Uri's that should be mapped to this same tenant.
                var result = new TenantShell<Tenant>(tenant, new Uri("http://localhost:5000"),
                                                             new Uri("http://localhost:5001"));
                return Task.FromResult(result);
            }

            if (distinguisher.Uri.Port == 5002)
            {
                Guid tenantId = Guid.Parse("b17fcd22-0db1-47c0-9fef-1aa1cb09605e");
                var tenant = new Tenant(tenantId, "Gicrosoft");
                var result = new TenantShell<Tenant>(tenant);
                return Task.FromResult(result);
            }


            throw new NotImplementedException("Please make request on ports 5000 - 5003 to see various behaviour.");

        }
```

In our implementation above, we return `Moogle` when accessed on ports `5000` or `5001`, and `Gicrosoft` when accessed on port `5002`. If we are accessed under anything else (e.g port 5003) then we throw an exception for the time being. We will see in a future a couple of different options for handling unknown tenants.

When returning `Moogle`, we are also including other `Uri`'s that should be automatically resolved to this `Tenant`.

The `TenantDistinguisher` is just a wrapper around a `Uri` and captures information about the current request by default (host, port, scheme etc). If this is not sufficient for your purposes (e.g perhaps you need to differentiate tenant's based on a cookie value or something) then this can be tailored to your precise needs, and we will look a that in a future post.

In Startup.cs, add a using statement for `dotnettency`:

```csharp
using Dotnettency;
```

In `ConfigureServices`:

```csharp
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMultiTenancy<Tenant>((multiTenancyOptions) =>
            {
                multiTenancyOptions
                    .InitialiseTenant<TenantShellFactory>();
            });
        }
```

In `Configure` we want to `UseMultitenancy` to add the `dotnettency` middleware:

```csharp
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMultitenancy<Tenant>((options) =>
            {
                
            });

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Hello World!");
            });
        }
```

Now we are all setup, we can have fun actually injecting our `Tenant`.

## Seeing it all in action

Change the `app.Run()` in `startup.cs` to this:

```csharp
            app.Run(async (context) =>
            {
                var tenantTask = context.RequestServices.GetRequiredService<Task<Tenant>>();
                var tenant = await tenantTask;

                await context.Response.WriteAsync("Hello: " + tenant.Name);
            });
```


Now start the project, but before you do, double check you are runing under kestreal, if it says IISExpress then switch it:

![dotnettency-pick-kestrelproject.PNG](/img/dotnettencypickkestrelproject.PNG)

Now browse to the site on [localhost:5000](http://localhost:5000) or [5001](http://localhost:5001) and you will see:

![dotnettency-helloworld-moogle.PNG](/img/dotnettencyhelloworldmoogle.PNG)

.. and on [5002](http://localhost:5002) you will see:

![dotnettency-helloworld-gicrosoft.PNG](/img/dotnettencyhelloworldgicrosoft.PNG)

## Tenant Injection Options

With this now set up, anywhere in your application (Views, Controllers etc) where you need access to the current `Tenant` you can inject any of the following:

- Inject `Task<TTenant>` which gives you non-blocking access to the current `Tenant` (recommended)
- Inject `TTenant` directly. (Has potential to be blocking so not recommended)
- Inject `ITenantAccessor<TTenant>` if you would prefer to inject something more descriptive than `Task<TTenant>` then inject this. It provides access to the same `Task<TTenant>` (via a `Lazy` property) that you can await to get access to the current `TTenant`. 

## What Next?

In the next post, I will show you how to extend this sample to identify tenants based on some information that isn't available from a normal request `Uri` - like a cookie.

Overall, we still have a lot of `dotnettency` features to get through in this series. So stay tuned for things like:

1. Per Tenant Container / Services
2. Per Tenant Middleware
3. Per Tenant `IHostingEnvironment` (for sandboxing file access)
4. Modules (Shared and Routed)
