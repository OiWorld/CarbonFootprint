---
title: First Blog Post
atid: "1751900"
commit: "https://github.com/OiWorld/CarbonFootprintGoogleMaps/pull/53"
---
This is going to be my first blog post on the GSoC project carbon footprint for maps ill use these to highlight milestones difficulties and other fun stuff i come across while working on this project.

For the first one i've decied to talk about the rewrite that i did of the chrome extension, moving it to a more modular approach and adding support for simple extension to other maps services, i have started this even before the GSoC began since i wanted to go into it with a clean slate and a simple way of extending to other map services and browsers.

The process started with refactoring the old extension which had a seperate js file for each map service into a modular set of a main calculation and settings manager and a single manager file for each map service as seen [here](https://github.com/OiWorld/CarbonFootprintGoogleMaps/tree/master/Source/core).

This new approach works in a way which lets the manifest decide which map manager file to load in addition to the core which you can see in this snipped of the manifest file for bing.com

```json
{
	"matches": [
		"http://www.bing.com/mapspreview*",
		"https://www.bing.com/mapspreview*"
	],
	"css": ["core/css/main.css"],
	"js" : [
		"core/CarbonFootprintCore.js",
		"core/settings/ChromeSettingsProvider.js",
		"core/maps/BingMapsManager.js",
		"core/init.js"
	],
	"run_at" : "document_end",
	"all_frames" : true
}
```

The init script generates an instance of the appropriated map manager and settings provider and hands them over to the carbon footprint core which then does the calculations and tells the appropriated map manager to display the results, using this we should have easy access to all important things that change between different map services.

For me the hardest part of this first big chunk of work was creating a sensible and useable base for a map manager and the system core while also understanding how the extension worked before and keeping all that functionallity alive.

Well i guess this is almost it for the first post ill do some more technical stuff later when the real sprints start and i get to do some more minor changes. For now ill leave you with a bit more info about the blog, the picture on top of this post is the profile picture of the github account that posted the blog and down below there should hopefully be a button with the github logo linking to relevant commits or pull requests concerning the current post and thats about it for the "fancy" stuff that i've come up with untill now.

This has been Kolya see you all next blog post.