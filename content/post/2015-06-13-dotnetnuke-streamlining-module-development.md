---
layout: post
published: true
title: "DotNetNuke - Streamlining Module Development Workflow"
date: 2015-06-13
comments: true
categories: 
    - "DotNetNuke"
    - "DnnPackager"
---



## Module Debugging - Two Approaches

When developing DotNetNuke modules people take many different approaches but they boil down to two alternatives in terms of workflow:

1. Placing / checking out your source code directly into the \DesktopModules folder of a DotNetNuke website, and having your module dll's output to directly into the DotNetNuke website's \bin folder.

2. Checking out and working on your code wherever you like, but having to deploy your module (content and assemblies) to a local DNN website when you are ready to run it.

Both approaches require that you "attach to process" from within Visual Studio in order to debug your module.

<!-- more -->
### I hate approach #1
I have all sorts of issues with approach #1. Yes it’s technically possible, but it’s also nasty in my view (not very clean) - I have elaborated on that elsewhere so won’t do so again here in depth, aside to say that I believe #2 is the "cleanest" approach and that many forms of debugging use #2 as the approach, not #1. For example, xamarin devs, when they debug an android app, you will see that xamarin actually deploys their project to the device / emulator, and then attaches the debugger to the remote process that's running on the device / emulator. The result is that they click "Play" in VS, and a shortwhile later they are attached and stepping through their code.. It may not be obvious that a deployment took place - but it did. Lastly. i'll point out that #1 creates a coupling between how you structure your source code, and where it needs to be when it's actually deployed. 

### But approach #2 is lacking
So deciding to take approach #2, having to manually copy / deploy your module content  to the DotNetNuke website each time you want to test your module, is just not an efficient use of your time!

What's needed is some nice visual studio integration so that when you are ready to "Run / Debug" your module, you click one button and bam! chrome opens up, displaying your module, with the debugger attached so you can step through code.

### Can anything be done?
I have allready made strides to address the inefficiences of #2 so that it's now a lot more streamlined: https://github.com/dazinator/DnnPackager - it's a NuGet package that you add to any VS project, and it will produce the Dnn module installation zip for you when you build the project. It then also extends the package manager console window in VS with an additional command you can run, that will deploy the module project to a local DNN website. So this is the workflow I currently use for module debugging:

1. Make a change to the code
2. Hit “up” arrow and then hit “enter” in package manager console (this runs the previous command which is the DnnPackager one I spoke of, that builds and deploys my module project to my local dnn website)
3. Refresh my browser page, and attach Visual Studio (ctrl + alt + p) to the w3w process.

This is a bit more streamlined! This makes approach #2 workable in my opinion.

### Room for Improvements!
1. What if I don’t have a DNN website already installed - for example I am new to Dnn development and just want to get up and running as quickly as possible.
2. What if I am curious to know if my module runs in DNN 6.5.1 and I only have DNN7 installed? 
3. What if this is the first time I am testing this particular module - I have to make sure I go to DotNetNuke website, Create a page and add my module to that page right?

These things are all tedious. Most developers (new to DNN) expect to be able to click Debug and immediately be debugging their code - they don’t expect to have to jump through these additional hurdles / barriers.

This is why DotNetNuke development can be a bit of a culture shock for many developers.

### Next Feature!
So the next feature I am thinking of adding to DnnPackager is one that addresses those concerns mentioned above. I’d be really greatful if anyone with such a curiousity wouldn't mind reading it and offering their feedback on this proposed awesome feature https://github.com/dazinator/DnnPackager/issues/14 - just so I can get a feel for whether there is much demand for such a capability. 

### Feedback?
Do you disagree?
Would this new feature https://github.com/dazinator/DnnPackager/issues/14 help you?


Darrell Tunnell
http://darrelltunnell.net
