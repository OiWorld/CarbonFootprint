<div style='{text-align:center;}'><h1>GSoC-2017 Contribution - by vaibsharma</h1>

Its been an awesome summer working with some of the brilliant people while contributing to AOSSIE during GSoC 2017.

I have contributed to two projects [Carbon Footprint](https://gitlab.com/aossie/CarbonFootprint) and [Carbon Footprint API](https://gitlab.com/aossie/CarbonFootprint-API). The goals and the work for which I proposed for GSoC 2017 are :

<h2>Carbon Footprint</h2>

The team member with me in this project was [nakulh](https://gitlab.com/nakulh) .

<strong> Project URL </strong> : https://gitlab.com/aossie/CarbonFootprint

* <strong>Adding more flights website in the extension : This was perhaps the easiest task as once we got the flow for one or two websites, for the other rest we just needed to handle the process according to the structure of website.</strong>
	
	<i>Related MRs </i> :

	* [Flights](https://gitlab.com/aossie/CarbonFootprint/merge_requests/194)  <strong><i>Merged</i></strong>  : Earlier logic couldn't take care of the stops more than 1 during the travel. This MR attempted to fix that bug.
		
	* [Priceline](https://gitlab.com/aossie/CarbonFootprint/merge_requests/195)  <strong><i>Merged</i></strong>  : For flight emission priceline is working
		
	* [Closes #173](https://gitlab.com/aossie/CarbonFootprint/merge_requests/202)  <strong><i>Merged</i></strong>  : This MR fix #173 (closed) .
		
	* [Work on Cleartrip, kayak, Google Flights,Travelocity,Expedia,Hipmunk](https://gitlab.com/aossie/CarbonFootprint/merge_requests/201)  <strong><i>Merged</i></strong>  : Work on Cleartrip, kayak, Google Flights,Travelocity,Expedia,Hipmunk
		
	* [closes #179](https://gitlab.com/aossie/CarbonFootprint/merge_requests/207)  <strong><i>Merged</i></strong>  : MR is regarding the issue #179 (closed) . This is now fixed by taking the depart and arrival IATA codes of airports from the url.

* <strong>Adding the Enable and Disable Feature to display Carbon footprints from the extension's setting's page.</strong>

	<i>Related MR </i> :
	* [Issue#181](https://gitlab.com/aossie/CarbonFootprint/merge_requests/210)  <strong><i>Merged</i></strong>  :This MR resolve issue #181 (closed) .

* <strong>Binding the feature added by me in [MR!210] (https://gitlab.com/aossie/CarbonFootprint/merge_requests/210) and by [nakulh](https://gitlab.com/nakulh) in [MR!204](https://gitlab.com/aossie/CarbonFootprint/merge_requests/204)</strong>

	<i>Related MR </i> :
	*  [Issue#183](https://gitlab.com/aossie/CarbonFootprint/merge_requests/221)  <strong><i>Merged</i></strong>  : This MR addresses the issue [#183](https://gitlab.com/aossie/CarbonFootprint/issues/183) .

* <strong>Other MRs while debuging, inhancing extensions features.</strong>

	<i>Related MRs </i> :
	* [gulp error fixed](https://gitlab.com/aossie/CarbonFootprint/merge_requests/203)  <strong><i>Merged</i></strong>  : Typo in gulpfile

	* [closes #179](https://gitlab.com/aossie/CarbonFootprint/merge_requests/207)  <strong><i>Merged</i></strong>  : This MR was related to [issue#179](https://gitlab.com/aossie/CarbonFootprint/issues/179) .


<h2>Carbon Footprint API</h2>
	
The team members with me in this project were [saisankargochhayat](https://gitlab.com/saisankargochhayat) and [r0hitgupta](https://gitlab.com/r0hitgupta) .

<strong>APP URL</strong> : https://www.carbonhub.xyz

<strong>Documentation</strong> : https://docs.carbonhub.xyz

<strong>Project URL</strong> : https://gitlab.com/aossie/CarbonFootprint-API

* <strong>The first task was to add all the existing functionality from browser extension to the Node Application so that they can be reused.</strong>
		
	<i>Related MR </i> :
	* [Starting with GSOC 2017 :)](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/5) <strong><i>Reverted</i></strong> : This MR tries to import all the functionality that extension provides locally. Every function is tied with the promise so that we can specify the error in API parameters.

* <strong> for inserting data in Database for trains.</strong>

	<i>Related MR </i> :
	* [Addition of Google Map API , Trees and Train data and End points for the same.](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/11)  <strong><i>Merged</i></strong>  : Most of the work in this MR is done by other team members . The only commit by me is :
		* db script for trains - Commit f1c9d820

* <strong>Contributing to Documentation of API and Project README</strong>

	<i>Related MRs </i> :
	* [Readme.md](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/12)  <strong><i>Merged</i></strong> .
	* [Updated readme](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/13)  <strong><i>Merged</i></strong>  .
	* [updated note in README.md](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/17)  <strong><i>Merged</i></strong>  .
	* [Docs](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/22)  <strong><i>Merged</i></strong>  : In this MR [saisankargochhayat](https://gitlab.com/saisankargochhayat) also woked.
		<strong>My commits were</strong> :
		* doc init - Commit 636dc372
		* added assets - Commit d6a86ad5
		* Added auth doc - Commit 8619315d
		* added python - Commit 4548ac13
		* Bash added - Commit f7e02e52
		* added javascript requests - Commit 065fbead
		* changed access-key to api-key - Commit aee896a2
		* minor fix - Commit 1ea49ff9
		* edit contribute.md - Commit 0a416e64
		* java added - Commit 0c104dba
	* [Poultry docs](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/35)  <strong><i>Merged</i></strong>  : Poultry documentation .

* <strong>Binding React with Node server for the very first time in the project.</strong>

	<i>Related MR </i> :
	* [Added visualisations for electricity emissions](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/14)
	 <strong><i>Merged</i></strong>  : In this MR my job was to bind react with node server for the frontend.
	<strong>My commits were</strong> :
		* added babaerc file for preset config - Commit 95662b9e
		* added webpack config for transpiling - Commit a4a15d50
		* added npm packages and build script - Commit 7d77ef04
		* route for frontend(can be change) - Commit e5182fb4
		* slight changes in rohit's code -Commit 0717a209
		* added transpiled bundle.js - Commit 24497715
		* React combined with node router - Commit 5c4a855d
		* added map working - Commit 18c22971
		* minor fix - Commit 84b8db87

* <strong>MR related to all the work for /profile endpoint and its related features.</strong>

	<i>Related MRs </i> :
	* [User profile and API key allocation.](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/21)  <strong><i>Merged</i></strong>  : In this MR I worked totally on the profile page of user. Later  most of the code was used by [r0hitgupta](https://gitlab.com/r0hitgupta) for making redesign version of earlier profile page.
	<strong>My commits were</strong> : 
		* header works after logout - Commit 6a299ac
		* font awesome added - Commit 4d915c0
		* shows user profile when login - Commit a8f64b7
		* css for working header - Commit c79f8a7
		* copy of API works - Commit ae4cb57
		* added css - Commit 571277d
		* added icons - Commit 73e23e1
		* apiroutes error fixed - Commit 792b00c
		* added request handler for API key - Commit 11d89b3
		* GET,POST,DELETE API key from profile done! - Commit 4287cfa
		* config fixed - Commit d6a1da6
		
	<strong>Note</strong> : All these commits are not merged as they were copied in redesign version of profile page in MR [!21](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/21). 

	* [Edit](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/25)  <strong><i>Merged</i></strong>  : Extended Profile page features with the edit functionality.

* <strong>Automated scripting for all the data insertion handling file(db_scripts)</strong> 

	<i>Related MR </i> :
	* [Automated scripts](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/15)  <strong><i>Merged</i></strong>  : Automated script runners for the data insertion in database.

* <strong>Endpoint for poultry Emissions</strong>

	<i>Related MR </i> :
	* [Issue#24](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/28)  <strong><i>Merged</i></strong>  : Different types of poultry emissions that currently added are: Beef, Lamp, Pork, Broiler Chicken, Turkey Bird, Egg (currently we have data only for eggs produced in british columbia)

* <strong>Config for Production build of React.</strong>

	<i>Related MR </i>:
	* [adding the config for production build](https://gitlab.com/aossie/CarbonFootprint-API/merge_requests/31) <strong><i>Merged</i></strong>  : Using react production build configuration for production.