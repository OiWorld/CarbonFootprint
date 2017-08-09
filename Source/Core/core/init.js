/**
 * initialises the extension when maps webpage is opened
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

new SettingsProvider(function(settingsProvider) {
    settingsProvider.addUsingDefaultListener(function() {
        var optionsUrl = Helper.getFilePath('pages/options.html');
        Helper.openUrl(optionsUrl);
        console.log('calling window open on ' + optionsUrl);
    });

    var core = new CarbonFootprintCore(settingsProvider, Helper),
        websiteManager = new WebsiteManager(core, settingsProvider),
        Inform = new inform();

    Helper.showPageAction(function() {
        console.log('Page Action Visible!');
    });

    //check if its a flight ticket website, assign update function if it is
    if(core.flights){
      websiteManager.update = function(){
        var processedList = websiteManager.getList();
        if(core.airplanesData && core.airportsData){
            processedList = websiteManager.getEmission(
              websiteManager.getDistances(
                websiteManager.getCoordinates(processedList)));
            websiteManager.insertInDom(processedList);
        }
        console.log(processedList);
      };
    }

    /*Because some websites need it to be true while some want false
      defaults to false if nothing specified*/
    var childList;
    if(websiteManager.childList !== undefined){
      childList = websiteManager.childList;
    }
    else{
      childList = true;
    }

    var target = document.getElementsByTagName('body')[0],
        observer = new MutationObserver(function() {
            console.log('Observing!');
            Inform.permission(websiteManager);
        });
    observer.observe(target, {
        attributes: true,
        childList: childList,
        characterData: true,
        subtree: websiteManager.subtree
    });
});
