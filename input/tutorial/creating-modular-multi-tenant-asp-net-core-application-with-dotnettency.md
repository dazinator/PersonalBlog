---
title: "Modular Multi-tenant ASP.NET Core Application with Dotnettency"
date: 2017-08-03T15:06:44+01:00
published: 2017-08-03T15:06:44+01:00
tags: 
    - "dotnettency"
    - "asp.net core"
    - "multitenancy" 
    - "aspnetcore" 
categories:
    - "Development"
Tutorial: "Building Modular Multi-tenant ASP.NET Core Applications with Dotnettency"
Name: "Introduction"
Part: 0
---

## Multitenancy who?

Just in case you need a quick recap, a muti-tenant web application is one that can cater to multiple (but completely seperate) audiences, simultaneously. Each seperate audience is called a `tenant`. To to all intense and purposes, each tenant is just a collection of users who are using the application "unaware" of the other tenants who's users are also doing the same. 
 
A multi-tenant application is essentially an application that splits itself into multiple applications - one for each  tenant - so that one Tenant can have a completely different `view of the world` than another.

Now that we are all caught up, let's get down to business!

<!--more--> 

## But wait.. Why would I want this?

Some indicators as to why you might want multi-tenancy are that, for certain audiences, you might want to:

1. Display a different branding / appearance.
2. Have different functionality enabled or disabled.
3. Have different content or files accessible.

For example one tenant could look like this:

<iframe src="https://giphy.com/embed/3oKIPwoeGErMmaI43S" width="480" height="361" frameBorder="0" class="giphy-embed img-responsive" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/culture--run-3oKIPwoeGErMmaI43S">via GIPHY</a></p>

Whilst the other is simultaneously looking like this:

<iframe src="https://giphy.com/embed/JltOMwYmi0VrO" width="480" height="403" frameBorder="0" class="giphy-embed img-responsive" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/JltOMwYmi0VrO">via GIPHY</a></p>

For the sake of this series we will be using a couple of ficticious tenants:
 - Gicrosoft
 - Moogle

## What are we going to cover?

 During this series, I will take you through the following, starting with basic stuff like tenant resolution, and slowly adding more advanced features. However it would help if you already have a good understanding of:
 
     1. The Middleware Pipeline.
     2. DI Containers.

 For a high level view of the sort of architecture we will be exploring, here is a quick diagram of he type of architecture that `dotnettency` allows you to easily setup within your application:

![dotnettencyhighlevel.PNG](/img/dotnettencyhighlevel.png)

Notice that you can achieve multiple layers of isloation (all of which are ofcourse optional) depending upon your needs. You can isolate things both at a tenant level, and at an individual module level, whilst ensuring that your host application will always behave a certain way by default.

## Isolation, Isolation, Isolation - but optional.

 Dotnettency's approach as a multi-tenancy library is to allow you to use as much, or as little isolation as you require. For example you can choose to do any of these:

 1. Isolate each tenant from other tenants (you dont have to)
 2. Isolate modules from other modules. (you don't have to, and could do this with some modules and not others)
 3. Isolate a tenants view of the host file system, from other tenants (i.e so one tenants files can not conflict with another tenants files - even though they might use the same paths. )

 Before I go any further I would like to mention Ben Foster's wonderful `saaskit` library which was a big inspiration for many of the features in `dotnettency` and I would highly recommend [you read Ben's blog](http://benfoster.io/blog/saaskit-multi-tenancy-made-easy) - after mine, ofcourse ;-)

## Ok so what is this tutorial series going to look like?

We will be creating a basic asp.net core website (from the starting template) and then enhancing with one multi-tenancy feature at a time, provided by `dotnettency`, so that our site:

 - Has multiple tenants (Gicrosoft and Moogle) and we can distguish between them.
 - Has a null (default) tenant enabled (or disabled - thats up to you)
 - Allows each Tenant to have it's own isolated `DI Contaainer` so `Gicrosoft`'s services can be isolated from `Moogle` services. Think of this if you want each tenant to be able to configure which `IPaymentProvider` they will use or something similar.
 - Allows each Tenant to have it's own Middleware Pipeline - so `Gicrosoft`'s can have `Welcome Page` middleware enabled for example, where as `Moogle` will have no such middleware enabled.
 - We will allow each Tenant to have its own `View of the world` in terms of file access. (i.e so that `Gicrosoft` and `Moogle` can't interfere with each other files, or overwrite system level files (but could optionally `override` the system level files with their own version of the file, keeping the same path)
 - Modules. We will discuss `dotnettency`s concept of Modules. Modules can be enabled at the application or for particular tenants. Right now, these come in two flavours: 
    - Shared (or Library) Modules: These provide services or middleware. They can be added at the application level (so will impact all tenants) or on a per tenant basis. 
    - Routed Modules: Modules that have their own isolated container that will be restored during the request when they are routed too. Routed Modules are so called because they must have routes registered with the asp.net core routing system. Dotnettency makes it really easy. If you are developing an extension for your application that has MVC Controllers, then this would be an example of a `Routed Module`. Dotnettency does not tie your module to a particular technology - you could have a mixture `MVC` and `Nancy` based modules running for a particular tenant.


At the end of this tutorial, you will have a multi-tenant, modular & extensible application to serve as a good basis for developing your next multi-tenant capable web application.

If there is anything else you would like me to cover, please let me know in the comments.

In the meantime, if you would like to check out `dotnettency` and run the samples etc, feel free -it's on [Github](https://github.com/dazinator/Dotnettency)
