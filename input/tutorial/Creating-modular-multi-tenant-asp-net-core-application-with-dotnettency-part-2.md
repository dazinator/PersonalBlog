---
title: "Modular Multi-tenant ASP.NET Core Application with Dotnettency - Part 2"
slug: "creating-modular-multi-tenant-asp-net-core-application-with-dotnettency-part-2"
date: 2017-08-07T06:20:44+01:00
published: 2017-08-07T06:20:44+01:00
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
Name: "Part 2"
Part: 2
SourceCodeUrl: "https://github.com/dazinator/Dotnettency.Samples"
---

In the [previous part of the this tutorial](/tutorial/creating-modular-multi-tenant-asp-net-core-application-with-dotnettency-part-1/) we saw how we could do some very basic `Tenant` resolution. We were identifying who the current `tenant` is based on values available in the `URL` such as port number etc. In this post, we will see how we can also use values not available in the `URL` such as a cookie value (or anything else), to identify the current tenant also. 

<!--more--> 
## Tenant Identification

When a request is received, `dotnettency` creates an `identifier` that indicates the current tenant. By default, the `identifier` is based on the request `url`. However we can override this.

First, derive from `HttpContextTenantDistinguisherFactory<TTenant>` and override `GetTenantDistinguisher`:

```csharp

    public class CookieTenantDistinguisherFactory : HttpContextTenantDistinguisherFactory<Tenant>
    {
        public CookieTenantDistinguisherFactory(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        protected override TenantDistinguisher GetTenantDistinguisher(HttpContext context)
        {
            // We will return the request uri by default to identify the tenant,
            // unless a tenant cookie is available, in which case we will return a URI with a custom scheme.
            var uri = context.Request.GetUri();

            var cookie = context.Request.Cookies["tenant"];
            if (!string.IsNullOrWhiteSpace(cookie))
            {
                switch (cookie)
                {
                    case "Moogle":
                        return new TenantDistinguisher(new Uri("tenant://Moogle"));

                    case "Gicrosoft":
                        return new TenantDistinguisher(new Uri("tenant://Gicrosoft"));
                }
            }

            return uri;
        }
    }

```

Notice how, when a cookie is present, we return a `URI` with our own custom scheme - i.e `tenant://` and with a hostname that indicates the tenant specified by the cookie.

Next, get `dotnettency` use our new implementation, in `startup.cs`:

```csharp

            services.AddMultiTenancy<Tenant>((multiTenancyOptions) =>
            {
                multiTenancyOptions
                    .DistinguishTenantsWith<CookieTenantDistinguisherFactory>()
                    .InitialiseTenant<TenantShellFactory>();
            });

```

Now lastly, we need to adjust our `TenantShellFactory` to handle our custom `URI`'s:

```csharp

    public class TenantShellFactory : ITenantShellFactory<Tenant>
    {
        public Task<TenantShell<Tenant>> Get(TenantDistinguisher distinguisher)
        {
            // If cookie was present, then scheme will be our own custom one.         
            if (distinguisher.Uri.Scheme == "tenant")
            {
                var tenant = distinguisher.Uri.Host.ToLowerInvariant();
                switch (tenant)
                {
                    case "moogle":
                        return CreateMoogleTenant();
                    case "gicrosoft":
                        return CreateGicrosoftTenant();
                }

            }

            // Otherwise, just pick tenant based on port as before.
            if (distinguisher.Uri.Port == 5000 || distinguisher.Uri.Port == 5001)
            {
                return CreateMoogleTenant();
            }

            if (distinguisher.Uri.Port == 5002)
            {
                return CreateGicrosoftTenant();
            }


            throw new NotImplementedException("Please make request on ports 5000 - 5003 to see various behaviour.");

        }

        private Task<TenantShell<Tenant>> CreateGicrosoftTenant()
        {
            Guid tenantId = Guid.Parse("b17fcd22-0db1-47c0-9fef-1aa1cb09605e");
            var tenant = new Tenant(tenantId, "Gicrosoft");
            var result = new TenantShell<Tenant>(tenant);
            return Task.FromResult(result);
        }

        private Task<TenantShell<Tenant>> CreateMoogleTenant()
        {
            Guid tenantId = Guid.Parse("049c8cc4-3660-41c7-92f0-85430452be22");
            var tenant = new Tenant(tenantId, "Moogle");
            // Also adding any additional Uri's that should be mapped to this same tenant.
            var result = new TenantShell<Tenant>(tenant, new Uri("http://localhost:5000"),
                                                         new Uri("http://localhost:5001"));
            return Task.FromResult(result);
        }
    }

```

## Seeing it in action

Now to see this in action, install your favourite cookie editing tool in your browser. I personally use [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?)

Start the application running and browse on [localhost:5000](http://localhost:5000) and you will see:

![dotnettency-helloworld-moogle.PNG](/img/dotnettencyhelloworldmoogle.PNG)

Now, add a cookie named "tenant" with a value "Gicrosoft". Refresh the page:

![dotnettency-cookie-gicrosoft.PNG](/img/dotnettencycookiegicrosoft.PNG)

Hurray! It works! (If it doesn't, then you can compare against the [sample code here](https://github.com/dazinator/Dotnettency.Samples))

## What's next?

Stay tuned for:

1. Per Tenant Container / Services
2. Per Tenant Middleware
3. Per Tenant `IHostingEnvironment` (for sandboxing file access)
4. Modules (Shared and Routed)

Don't forget to leave a comment if you find this stuff useful!


*This is part of a series. [You can find the other parts here](/tags/dotnettency)*

*You can find the sample code for this post [here](https://github.com/dazinator/Dotnettency.Samples)*