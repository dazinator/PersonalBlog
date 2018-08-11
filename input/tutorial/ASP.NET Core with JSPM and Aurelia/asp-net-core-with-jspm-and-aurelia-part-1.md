---
comments: true
published: 2018-08-11T17:50:00Z
title: "ASP.NET Core with JSPM and Aurelia"
slug: "asp-net-core-with-jspm-and-aurelia"
date: 2018-08-11T17:50:00Z
Name: "Part 1 - Create New Project"
Part: 0
---

### ASP (A Sea of Packages).NET Core

When you create a new ASP.NET Core project, it can be hard to orientate yourself. You may even be familiar with ASP.NET Core web development but perhaps you are looking for insights or inspiration to improve your productivity.
I am going to guide you, the number one ASP.NET Core web developer of the future, through creating an ASP.NET Core MVC application, and then configuring a productive workflow.

1. Bringing web dependencies under control with NPM and JSPM
2. Bundling and Minification.
3. Auto browser refresh (as you make changes to files during development)

To be able to do all of this, we will be creating a new ASP.NET Core MVC project, and then we will be using [Aurelia](http://aurelia.io/) to run an Aurelia application on Home page (Index.cshtml) 
<!--more-->

### New Project
The first step on our quest is simply to create a new ASP.NET Core application. I am sure you know the drill:

1. In `Visual Studio`, File --> New Project.
2. Under "Web" select "ASP.NET Core Web Application".

You will see a Project Creation Dialog:

![new aspnet project.PNG](/img/VSNewAspNetCoreMvsProject.PNG)

Make sure to select:

1. "Web Application (Model-View-Controller).
2. "Individual User Accounts" for the authentication.

You should now have a shiny new project, which is great.

Now that we have got a new shiny project created, keep your eyes peeled for the next parts of the tutorial series where things will get a lot more interesting.

If there is anything else you would specificaly like me to cover in this series, drop me a comment below!