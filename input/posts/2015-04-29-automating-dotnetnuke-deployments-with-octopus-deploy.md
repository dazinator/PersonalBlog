---
published: 2015-04-29T17:50:00Z
title: "Automating DotNetNuke deployments with Octopus Deploy"
slug: "automating-dotnetnuke-deployments-with-octopus-deploy"
date: 2015-04-29T17:50:00Z
comments: true
categories: 
    - "Development"
tags: 
    - "DotNetNuke"
    - "Octopus"
---

### Automating DotNetNuke Deployments using Octopus Deploy

Because I am an awesome dude, i'll share with you how I automate dotnetnuke delivery / deployments. This works. It takes some effort to get this set up though, but it will be well worth it in the end.

First i'll explain the process for automating the deployment of the DotNetNuke website itself. Then I'll explain how you can automate the deployment of modules / extensions on a continous basis.
<!--more-->
### Preparation work

1. Set up a brand new DotNetNuke website, and go through the install wizard until you are greeted with an empty default dotnetnuke website.
2. Stop the website. Create a NuGet package containing the website folder.
3. Put that on your internal NuGet feed.
4. Go to the dotnetnuke database, and generate the create scripts (with data).
5. Create a new console application that uses [dbup](http://dbup.github.io/) to run the above sql scripts when it is executed (as described [here](http://dbup.github.io/)). Remember to replace things like server name etc in the sql scripts with appropriate $variablename$. Dbup can substitute $variablename$ in the sql scripts with their actual values (which you can pass through from Octopus) before it executes them.
6. Add [OctoPack](http://docs.octopusdeploy.com/display/OD/Using+OctoPack) to your Console Application so that it is packaged up into a NuGet package. Put this NuGet package on your internal NuGet feed.

You should now be in this position:

1. You have a NuGet package on your feed containing the DotNetNuke website content 
2. You have a NuGet package on your feed containing your wonderful console application (DbUp) which will run the database scripts.

Next Step - to Octopus!

1. Create a project in Octopus to deploy a "DotNetNuke" website. For the deployment process you will need the NuGet packages prepared previously. The deployment process should:

  - Create a website in IIS using the website NuGet package.
  - Create the database by executing the executable within the Database NuGet package.

There are lot's of things to remember when deploying dotnetnuke. I won't go into detail but things like:

  - Granting full permission to the app pool identity that the website runs under to the website folder.
  - Updating the portalalias table with appropriate access url.

... and other things. The Dnn install process has been covered elsewhere so I won't go into any further detail here.

### Congratulations (partly)

You should now be in a postion where you can roll out a DotNetNuke website via Octopus.. BUT WHAT ABOUT THE MODULES I'M DEVELOPING!! - I hear you exclaim.

### Automating Module Deployments

1. When you build your module projects (via build server etc) you want them packaged as DotNetNuke install packages, inside a NuGet deployment package, which is then published to your NuGet feed. You can use [DnnPackager](https://github.com/dazinator/DnnPackager) for this (which is something I created).

2. You'd need something that can copy a set of zip files to the "Install/Module" folder of a DotNetNuke website, and then monitor that folder, whilst calling the DotNetNuke url to install packages (www.dotnetnuke.com/install/install.aspx?mode=installresources). I wrote a quick console application to do this. It repeats calls to that URL all the time the number of zips in the install folder decrements (dotnetnuke deletes them after they are installed). If after x calls, there are the same number of zips left in the directory, it assumes they cannot be installed and reports a failure (return code).
You should package this tool up into a NuGet package and, you guessed it, stick it on your internal feed.

3.Create a project in Octopus for "Module" deployment. You want the deployment process to:

  - Dowload the NuGet package containing your module zips.
  - Download the NuGet package containing your module deployment utility (that console app i spoke of)
  - Invoke your deployment tool exe, passing in arguments for where the module zip files were placed, what the website url is, and potentially the path to the Install/Modules folder on disk (although my own tool interrogated IIS based on the website URL to find the website directory)
  
 ## Full Congratulations
 
 You will now find that you can create a release of your module project in Octopus and deploy all your lates modules to any DotNetNuke website at the push of a button.