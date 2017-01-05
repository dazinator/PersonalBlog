---
layout: post
published: true
title: "ASP.NET 5 (vNext) Projects - Your NuGet Package May Fail to Install Correctly"
comments: true
sharing: true
categories: 
  - ASP.NET
  - NuGet
  - "ASP.NET,NuGet"
  - "ASP.NET,NuGet,ASP.NET,NuGet"
---

### Don't assume NuGet Packages that you have authored will continue to work with ASP.NET 5 (vNext) projects.

Over the past year or so, I have authored [a number of NuGet packages](https://www.nuget.org/packages?q=darrell.tunnell) - because, well... I am just an all around great guy.

Recently, [I was contacted by someone](http://stackoverflow.com/questions/27762659/error-while-adding-nuget-package-to-asp-net-vnext-project#comment44383264_27762659) who was trying to use one of my NuGet packages with an ASP.NET vNext project (Preview release). Not something I have tried before - and this is where things get a little interesting.
<!-- more -->

### When NuGet packages are installed into an ASP.NET vNext project - powershell scripts included in the package, are not run.

As most NuGet package authors will already know, it's a [standard feature of NuGet](http://docs.nuget.org/docs/creating-packages/creating-and-publishing-a-package#Automatically_Running_PowerShell_Scripts_During_Package_Installation_and_Removal) that you can include powershell scripts within your NuGet package, that will then be executed when your package is installed (or uninstalled) into a visual studio project / solution. 

Many NuGet packages out there currently rely on this feature - else they will not work.

Well, the issue with my NuGet package failing to install into an ASP.NET vNext project  was eventually posted on the asp.net forums, and [David Fowler](http://forums.asp.net/members/davidfowl.aspx ) (who's on the ASP.NET team) - kindly responded with some insight into the matter. He seems to suggest that [ASP.NET v5 does not support running the packages powershell scripts when you install a NuGet package into an ASP.NET v5 project.](http://forums.asp.net/t/2027698.aspx?Error+while+adding+NuGet+package+to+ASP+NET+vNext+project) 

I wanted to confirm that with him a second time - because **that's a huge problem for some of my NuGet packages**, but as you will see from that thread, I am still awaiting a secondary confirmation of this - although his first answer seems pretty clear cut.

### Surely this is documented somewhere - or perhaps ASP.NET 5 offers an alternative mechanism for running tasks on installation / uninstallation of a NuGet package?
I have tried to look for more information. At the moment all I have to go on is David Fowlers response. Perhaps this is because there is still work in progress in this area, who knows. All I can suggest is that if your NuGet package currently requires custom tasks to be performed and you are using an `init`, `install` or `uninstall` ps1 script - then be prepared for the fact that it may not work with ASP.NET 5 projects - and also be prepared for the fact that there may not be any workaround either. I seriously hope this is false speculation on my part - but if this does turn out the be true after ASP.NET 5 is released, I'll be left with a slightly bitter taste in my mouth.

### So where from here?
I am generally really excited about ASP.NET 5. I love what the team are doing. However I beleive that the ASP.NET team really should put some guidance out there to the NuGet community, so that NuGet package authors can gain an understanding of how their packages might have to change to work in the context of ASP.NET 5 projects. 

At a minimum, if ASP.NET 5 will indeed no longer support the running of these powershell scripts, then it should atleast warn you that the package contains such scripts and that they will not be executed - which means the package may not beahve as desired.  

My hope is that David Fowler or someone from the ASP.NET team will offer a clarification, insight, or workaround for this issue that makes it a non issue. Fingers crossed.