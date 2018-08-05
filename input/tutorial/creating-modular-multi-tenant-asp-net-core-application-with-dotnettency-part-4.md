---
title: "Modular, Multi-tenant, ASP.NET Core Applications with Dotnettency - Part 4"
slug: "creating-modular-multi-tenant-asp-net-core-application-with-dotnettency-part-4"
date: 2017-10-01T22:31:00+01:00
published: 2017-10-01T22:31:00+01:00
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
Name: "Part 4"
Part: 4
SourceCodeUrl: "https://github.com/dazinator/Dotnettency.Samples"
---

In [the previous tutorials](/tutorials#creating-modular-multi-tenant-asp-net-core-application-with-dotnettency) we have seen how to configure an asp.net core application for multiple tenants, which included setting up the `Moogle` and `Gicrosoft` tenants.
In this tutorial, we will allow each tenant to have it's own middleware pipeline. This allows us to precisely control which middlware runs for which tenants!
This feature is sometimes referred to as `Per Tenant Middleware` in ASP.NET Core.
<!--more--> 

## Per Tenant Middleware you say?

Suppose you have some middleware, like:

- `UseWelcomePage`
- `UseMvc`
- `UseBlah`

Great! But your application is also used by multiple Tenants. You would like to enable the welcome page middleware for one of those tenants but not for the others!
Let's see how the `Dotnettency.MiddlewarePipeline` nuget package is your friend!

## Welcome Moogle!

We are goiing to call the `UseWelcomePage()` on an `IApplicationBuilder` to add the `WelcomePage` middleware - nothing unusual here. The only difference is, 
the `IApplicationBuilder` we call this on will be for the `Moogle` Tenant. The `Gicrosoft` tenant will remain unaffected.

1. Ensure you have a `Package Reference` to [Dotnettency.MiddlewarePipeline](https://www.nuget.org/packages/Dotnettency.MiddlewarePipeline/) nuget package,
2. In `startup.cs` in `ConfigureServices()` - find your call to `AddMultiTenancy()` as per the below:
```csharp

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            return services.AddMultiTenancy<Tenant>((multiTenancyOptions) =>
            {
                multiTenancyOptions
                    .InitialiseTenant<TenantShellFactory>()
                    .ConfigureTenantContainers((containerBuilder)=> {
                        containerBuilder.WithStructureMap((tenant, tenantServices) =>
                        {

                        });
                    })
                    .ConfigureTenantMiddleware((tenantsMiddlewareBuilder) =>
                    {
                        tenantsMiddlewareBuilder.OnInitialiseTenantPipeline((context, appBuilder) =>
                        {
                           
                        });
                    });
            });
        }

```

3. Inside `ConfigureTenantMiddleware` is where we can add any tenant specific middleware. If the above seems unfamiliar to you, please refer to the [the previous tutorials](/tutorials#creating-modular-multi-tenant-asp-net-core-application-with-dotnettency). Let's add the `WelcomePage` middleware for the `Moogle` tenant:
```csharp

                    .ConfigureTenantMiddleware((tenantsMiddlewareBuilder) =>
                    {
                        tenantsMiddlewareBuilder.OnInitialiseTenantPipeline((context, appBuilder) =>
                        {
                            if (context.Tenant.Name == "Moogle")
                            {
                                appBuilder.UseWelcomePage();
                            }
                        });
                    });                            

```


I won't cover the `TenantShellFactory` in this tutorial as it has already been [covered previously](/tutorials#creating-modular-multi-tenant-asp-net-core-application-with-dotnettency). Suffice it to say that 
this class is responsible for identifying who the current Tenant is, based on the URL or any other accessible value. In our sample we have mapped 
`localhost:5000` to the `Moogle` Tenant and `localhost:5002` to `Gicrosoft` Tenant.

If we run the application, and browse on `localhost:5000` (i.e `Moogle`) we get:

![hellopagemiddleware.PNG](/img/hellopagemiddleware.PNG)

Success! That's a beautiful looking welcome page. Very blue.

If we browse our application on `localhost:5002` we get:

![error500.PNG](/img/error500.PNG)

Hurray! This means our middleware is only running for the Tenant we wanted it to run for!

Furthermore, this works with any existing asp.net core `Middleware` today. The middleware does not have to be written with multitenancy in mind in any way.

## What's next?

Have any multitenant scenarios you want me to cover for asp.net core? Let me know!
Stay tuned for:

3. Per Tenant `IHostingEnvironment` (each tenant has its own virtual file system)
4. Modules (Shared and Routed)

Don't forget to leave a comment if you find this stuff useful!
