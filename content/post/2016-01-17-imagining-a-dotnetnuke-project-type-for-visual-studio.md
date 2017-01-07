---
layout: post
comments: true
categories: 
    - "Development"
tags: 
    - "DotNetNuke"
    - "DnnPackager"
    - "Dnn Project System"
published: true
title: "Imagining a DotNetNuke Project Type for Visual Studio"
date: 2016-01-17
---

### Introduction

When developing DotNetNuke extensions, we typically use one of the existing Visual Studio Project Type's, for example - an ASP.NET Web Application project.

Even when using a Project Template such as Christoc's, the project template is still based upon one of the standard Visual Studio project types - usually an ASP.NET Web Application project.

However these Project Types do not "gel" well with DotNetNuke development in a number of areas, the main ones being:

1. Running the project in VS (clicking play) - wants to run the extensions as a Web Application, but this makes no sense for a Dnn extension - which has to be hosted by the DotNetNuke website.
2. Deploying the extension - there is no support for that in the project system - you have to manually deploy your extensions to the Dnn instance.
3. Debugging the extension - you have to manually attach to process.

So.. what if there was a new Project Type, one that was purpose built for DotNetNuke development? What would that look like?

<!--more-->
### Introducing the "DotNetNuke" Project Type

I am currently developing a new VS Project Type explicitly for DotNetNuke development. The rest of this blog post will describe my vision for how this will work.

#### Installing the Project Type

You would start by installing the VSIX package from the VS gallery. This will install the DotNetNuke project type, and make this project type available to you when you create new projects in VS.

#### Create a New Project

You can now create a new "DotNetNuke" project using Visual Studio.

![new dnn project.PNG]({{site.baseurl}}/assets/posts/new dnn project.PNG)

This creates your new project. It also imports the "DnnPackager" NuGet package automatically - [something I have blogged about seperately.](http://darrelltunnell.net/blog/2015/12/01/dnnpackager-getting-started/)

![adding DnnPackager.PNG]({{site.baseurl}}/assets/posts/adding DnnPackager.PNG)

Your new project, has it's own ".dnnproj" file. This is a new project type and that's why it has its own file extension ".dnnproj".

![SolutionExplorer1.PNG]({{site.baseurl}}/assets/posts/SolutionExplorer1.PNG)

#### Adding Content

You can now add items to your project. If you "Add new item" - you will be able select from a number of standard DotNetNuke item templates. For example a "Module View". 

![AddModuleView.png]({{site.baseurl}}/assets/posts/AddModuleView.png)

Initially, I will just show Dnn 7 compatible item templates, but eventually I'd also like to add a seperate group for Dnn 8 item templates, which would include item templates for the new MVC and SPA stuff.

When you add the new item, not only do the source code files get added to your project, but any required dependencies also get brought in by the magical power of NuGet:

![AddingDotNetNukeCoreNuget.PNG]({{site.baseurl}}/assets/posts/AddingDotNetNukeCoreNuget.PNG)

So for example, adding a Module View for Dnn 7, will automatically bring in the DotNetNuke.Core NuGet package for Dnn7 as depicted above.

In other words, you don't need to worry about adding any Dnn assembly references for the most part, as they will be bought in for you as you add items to your project. Ofcourse, you are still free to add references to other dependencies you might have as normal. 

#### Running and Debugging

When you want to run and debug your extension, for those of you that have read my previous blog about DnnPackager, you may recall that this could be accomplished via a command that you could enter in the Package Manager Console window and DnnPackager would handle the deployment and attaching the debugger.

Well that approach was only ever necessary because there was not any first class support within VS itself. Something I am going to rectify with the DotNetNuke project type.

In VS, I am going to extend the debugging toolbar (where the "play" button is)

![debug toolbar.PNG]({{site.baseurl}}/assets/posts/debug toolbar.PNG)

You can see in the screenshot there is an empty dropdown at present, but this will list your DotNetNuke websites that you have on your local IIS. The first one in that list will be selected by default.

You may also notice there a new Debugger selected in that screenshot called "Local Dnn Website". That's my own custom debugger that's available only for this project type. 

All you need to do is click "Play" and it will:

1. Build your project to output the deployment zip.
2. Deploy your install zip to the Dnn website selected in the dropdown.
3. Attach the debugger to Dnn website's worker process that is selected in the dropwdown.
4. Launch a new browser window, navigated to that dnn websites home page.

Therefore, to use a different Dnn website as the host for running and debugging your module, you would just select that website in the drop down instead, before you click the "play" button.

This is going to wayyyy better than previous workflows for Dnn development. 

### What Now?

Well.. I am pretty far into the development of this at the moment, which is why I have been able to include some screenshots. However it is a steep learning curve, and I am continuosly hitting hurdles with [Microsoft's new Project System (CPS)](https://github.com/Microsoft/VSProjectSystem). This is my first attempt at developing a VS project type and I don't have any in roads with microsoft or any support. So all of this means, I am "hoping" I can pull this off, and the signs are promising, but I'm not through the woods yet. The (very) dark, mystical woods, of VS project type development.

Still, I'd love to hear what others think of this - even though I appreciate it's very premature. Would you use such a system? Any ideas for improvements? I'll release a new blog post when things are looking a bit more finalised, and perhaps again when I have something for beta release. 

Lastly, if there are any guru's out there who have expertise with [CPS](https://github.com/Microsoft/VSProjectSystem) - I can always use a hand ;)



