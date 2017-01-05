---
layout: post
comments: true
categories: 
    - "DotNetNuke"
    - "DnnPackager"
published: true
title: "Dnn Extensions - Sources Packages?"
date: 2016-03-19
---

## Sources Packages

I have been doing some work on DnnPackager recently, and I've come accross the concept of "Source" packages. I have to admit I am not entirely new to these, but I've never personally used them for my projects in the past.

Source packages are basically identical to the ordinary install zip's for your dnn module / extension, i.e you "install" them into your Dnn site like any other install package, except that they also include "source code" files within them, like .cs, .vb files etc. 

## Why would you want to include source code in your install zip?
Well this is where things get a little interesting. 
<!-- more -->

The two main reasons I can fathom why you would want to include source code in an install zip are that:

1. Your module uses dynamic compilation, and so unless you include source files with the module installation, then it just won't work.
2. You want to distribute your source code, so that developer's (who pay for it?) can open it up in VS and own it / make changes (improvements?). Usually you'd charge for this option, but it's faesible you are just an extremely generous developer (like me) who gives stuff away for free.


Number 1 is a necessity really to cater for modules that use dynamic compilation. 

Number 2 is an optional thing about you as a developer (or commercial entity), distributing your solution source code in a format that thrid parties can "own" it - irrespective of whether you have used dynamic compilation or not. 

Note: If you are using Dynamic compilation for your module, then people allready have the ability to make changes to the code by simply going into the website directory after the module has been installed, and modifying the code files. But you already knew that right!! Whether they are legally entitled to do so ofcourse, would be down to the licence agreement. 

Number 1 and 2 are different. 

## Why are they different?
Because in the first scenario, you are giving IIS the files it needs to compile and run your code within a Dnn website instance. In the second scenario, you are giving **developers** the files they need, to open up your project / solution and **build**, and compile your code, in a manner that spits out everything needed by scenario 1. In other words, the build and compilation that developers do, produces the output that's needed within the website for the compilation that IIS does. 

## Why was that last bit important
Because files related to the build that developers do - i,e the ones that prodice the output that actually needs to be installed to the dnn site, arguable have no business being installed into a Dnn website. Key files, project files, solution files etc etc - there are all completely unrelated to the working / running of your module within Dnn, and have nothing to do with IIS dynamic compilation or anything. They shouldn't be installed in a website period (imho).


## Dual purpose

There seems to be a dual purpose for the sources package that doesn't sit right with me. 
Using it to install source code into the website to support dynamic compilation seems like what it is meant for imho - it is a Dnn installation zip after all.

Using it to provide a third party with your VS solution / project files so that they can open up the solution in an IDE, build and compile the code is a completely different scenario, and I can't see how that second scenario can work reliably just by including a .csproj in a dnn sources install zip - except for in the most simplisitic and basic of scenarios, which rarely happen in the real world.


## Example of some issues with including Sln / Csproj in a sources zip package.

Currently, if you use widely available project templates to produce "sources" packages, they will by default, produce a sources "zip" file for each of the module projects in your solution, and this will contain source code files copied form your project, as well as the csproj, and sln file. (I think the sln will only get included if it lives within the project directory).

Already we hit an issue, as if you have multiple projects in your solution, and the sln file lives in a parent directory of those projects like this:

```

solution/mysln.sln
solution/projectA/projectA.csproj
solution/projectB/projectB.csproj

```

(which is fairly normal) then the sln file usually won't be included in the sources packages for any of your particular modules as it doesn't live directly within a project directory.

Secondly, if ProjectA has a project reference to ProjectB, and someone downloads the sources package for your projectA module, and opens up the csproj file that you have included in that sources package - the project is going to have a missing project reference to projectB so it won't compile.

There are yet more problems. If your .csproj files reference assemblies from some lib directory within your checkout directory somewhere, as this lib directory won't be included in the sources package (because it doesn't live within the project dir), anyone opening the project file in VS will see missing assembly references, they will have to manually correct them - otherwise the solution won't compile.

If your project files include some custom build targets that live on your machine, or within your checkout directory somewhere, etc etc - you guessed it the person opening the .csproj file is going to have issues because they won't be included in the same location within the sources package.

## Alternatives?

If you want to give away your VS solution (or sell the source) to a third party, there are better / easier ways to provide access to it without shoehorning it in to the dnn install zip imho!

The easiest may be to just zip up your entire solution (checkout directory), and allow that to be downloaded from some protected location. This does not have to be in a "dnn" install package format, just a simple zip file that the person recieving can extract and then open up the VS sln file. You want it to be like they just checked out the solution from source control and are now opening up the VS sln file - just like you do right?

If there are some pre-requisites to being able to open and build the solution, add a readme to the zip that explains what a developer must do before attempting to open the solution. This is usually handy to have in your source control anyway - in case you ever need to checkout and open the solution on a new machine one day that doesn't have your dependencies set up. These should be the same steps that any developer new to the company has to go through (including you) when checking out the code for the first time and wanting to open it.


## How does this all tie in with DnnPackager?

Well, for the next realease of DnnPacakger, I have added rudimentary support for Sources packages (thanks to [@nvisionative](https://github.com/nvisionative) for requesting this feature) - so that it will now produce "sources" packages alongside the standard install zip. However this is currently for the purposes of supporting modules that need to include source files in their installation process into Dnn, which I suspect will mainly just be ones that use dynamic compilation. 

It won't include .csproj files or .sln files because at this point in time, I can't see how including them would lead to a reliable experience for the developer opening these up at the other end. 

Disagree? Leave some comments below, I'd love to be convinced - or to just hear your views!















