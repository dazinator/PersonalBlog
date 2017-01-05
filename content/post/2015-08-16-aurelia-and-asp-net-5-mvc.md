---
layout: post
comments: true
categories: 
    - "ASP.NET"
    - "Aurelia"
    - "Gulp"
published: true
title: "ASP.NET 5 Projects - NuGet-NPM-Gulp-Bower-Jspm-Aurelia"
date: 2015-08-16
---





**This post is part 1 of a series. Part 2 is [here](http://darrelltunnell.net/blog/2016/01/24/aurelia-and-asp-net-5-mvc-part2/)**
## ASP (A Sea of Packages).NET 5

When you create a new ASP.NET 5 project, you will see all sorts of new-ness. I am going to guide you, the uninitiated ASP.NET 5 web developer, through creating your first ASP.NET 5 MVC application, but we won't stop there. In the next post of this series, we will then enhance the project with a number of features:

1. Bundling and Minification.
2. Auto browser refresh (as you make changes to files during development)

In addition, I will touch upon important tooling that you need to be aware of:

1. NPM
2. Bower and why we are going to replace it with Jspm
3. Gulp - and why is it useful

To be able to do all of this, we will be creating an ASP.NET MVC 5 project, and then we will be using [Aurelia](http://aurelia.io/) to run an Aurelia application on Home page (Index.cshtml) 
<!-- more -->

## New Project
The first step on our quest is simply to create a new ASP.NET application. I am sure you know the drill:

1. In VS 2015, File --> New Project
2. "ASP.NET Web Application"
![new aspnet project.PNG]({{site.baseurl}}/assets/posts/new aspnet project.PNG)
3. "Web Application"
![new aspnet project 2.PNG]({{site.baseurl}}/assets/posts/new aspnet project 2.PNG)

## Project Structure
At this point, with the project created, let's stop and appreciate some noteworthy files in our new project.

![asp net project sol explorer.PNG]({{site.baseurl}}/assets/posts/asp net project sol explorer.PNG)

- `project.json` - this is the new form of the project file. It replaces for example the older `.csproj` and `.vbproj` files.
- `package.json` - this file is managed by [NPM](https://docs.npmjs.com/). It records the dependencies that your application has on NPM packages. More on NPM later.
- `bower.json` - this file is managed by [Bower](http://bower.io/). It records the dependencies that your application has on Bower packages. More on Bower later. 
- `gulpfile.js` - this file contains `tasks` that can be executed by [Gulp](http://gulpjs.com/) as part of your development workflow, for example, whenever the project is built, cleaned etc. More on this later.
- `Startup.cs` this is the entry point for your application. For the purposes of this article, the default code is fine and we won't be amending anything in this file. It contains bootstrapping code such as setting up and registering services such as authentication.

### NPM - it's an important citizen
[NPM](https://docs.npmjs.com/) is now a first class citizen of an ASP.NET 5 project. This is why you have a `package.json` file in your project.

![packages json file.PNG]({{site.baseurl}}/assets/posts/packages json file.PNG)

NPM is a package manager - the Node Package Manager to be precise. Think `NuGet` but for NodeJs packages. You could be forgiven for thinking it stands for "Not another Package Manager" - it doesn't, I checked.

If you aren't yet familiar with NPM, stop here and do yourself a favour - go [get familiar](https://docs.npmjs.com/), you will be seeing a lot of it in your ASP.NET 5 projects in the days to come!

### Hold on, another Package Manager? But we allready have NuGet?
NuGet is for .NET libraries like log4net silly. Npm has a vast array of packages not available through NuGet. Why wouldn't you want to tap into those also? 

### Bower
Here is where things get a tiny bit confusing. Bower is a package, that is also another package manager. I am tempted to move on.. but I'll explain.

Bower is a NodeJs program, and is therefore distributed as a NodeJs package, via `NPM`. However it's purpose in life is to be a package manager, but specifically for client (website) dependencies such as javascript or css. Think Jquery. If you want to add Jquery, or Bootstrap, or any other client side library to your project, then Bower would be the package manager to use to achieve that. Not NPM ([although you could](https://www.npmjs.com/package/jquery)), and not NuGet ([although you could](https://www.nuget.org/packages/jQuery/)). The ASP.NET team thinks `Bower` is the package manager to use as Bower specialises for client dependencies - so the ASP.NET 5 project is set up by default to use Bower and you may allready see some Bower packages downloaded into your `bower_components` folder within your project. The `bower.json` file keeps track of your bower dependencies.

However, in this walkthrough, we shall be scrapping `Bower` and using a different package manager for our JQueries and our Bootstraps. One called [Jspm](http://jspm.io/). Jspm is recomended for it's additional capabilities, mainly that it provides not just package management features (at dev time) but package loading features, that your application uses at runtime. 

### Gulp
[Gulp](http://gulpjs.com/) is what all the cool kids are using to automate their development workflows.

Gulp basically lets you define `tasks` in a javascript file (gulpfile.js) that can then be run at an appropirate point. VS 2015 has a `Task Runner Explorer` window in which you can pick which Gulp tasks (the ones defined in your gulpfile.js) that you would like to run and when. For example, you can have your gulp task executed whenever the project is built, or cleaned etc. You can also execute your gulp task via the command line (see the Gulp docs)

We are going to write some Gulp tasks in gulpfile.js, and have them executed as part of the our project's build process. These tasks are going to automatically handle bundling and minification of our javascript files for us. 

Our web application is going to reference the "bundle" of javascript that gulp outputs, rather than the individual javascript files that we download using jspm. Which means our application is going to be nice and optimised as the browser will have to do less roundtrips with the server (network requests) to load the required javascript.

### But won't bundling and minification lead to a poor debugging experience?

Not if sourcemaps are enabled. I will show you how to enable this. This will mean the browser will be requesting and running the optimised bundle of javascript - but you the developer, will be stepping through and reading the original source code in your browser's dev tools, thanks to the magical power of source maps.

However, I will also show you what to do if you just don't want to bundle / minify your javascript during development (not all browsers will support source maps yet). If bundling and minification is something you only want to do at the time of a release build - which is pretty sensible - then I'll cover that too.

## Stay tuned
In the next post/s, we will begin modifying our ASP.NET 5 project to do the things I have discussed:

1. [Replace Bower with JSPM](http://darrelltunnell.net/blog/2016/01/24/aurelia-and-asp-net-5-mvc-part2/)
2. Bring in Aurelia
3. Get an Aurelia application working on the Index.cshtml page
4. Enable bundling and minification via a Gulp task
5. Enable automatic browser refresh
6. Disable bundling when our application is running in development (to maintain an easy debugging experience should your browser not support source maps)

If there is anything else you would like me to cover in this series, drop me a comment below!
