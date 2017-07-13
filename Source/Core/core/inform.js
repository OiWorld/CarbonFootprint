
/**
 * Inform.js checks whether the website is allowed by the user
 * to show footprints from all the current services
 * @author vaibsharma (Vaibhav Sharma)
 */


console.log('inform.js');

/**
 * Inform namespace to know which website is allowed
 * by the user
 */

var inform = function(manager){
    this.isSafari = false;
    this.isChrome = false;
    this.isFirefox = false;
    this.__init__();
};

/**
 * Function to initialize browser information
 */

inform.prototype.__init__ = function(){
    if (navigator.userAgent.toLowerCase().indexOf("chrom") != -1)
    {
        this.isChrome = true;
        console.log("I am in chrom(e)(ium)");
    }
    else if (navigator.userAgent.toLowerCase().indexOf('safari') != -1)
    {
        this.isSafari = true;
        console.log("I am in safari");
    }
    else if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1)
    {
        this.isFirefox = true;
        console.log("I am in mozilla");
    }
};

/**
 * Callback for storage API
 * @param {object} result
 * @param {class} serviceManager
 */

var cb = function(result,serviceManager){
    var question = location.href,flag=true;
    console.log(result['data']);
    var data = result['data'];
    for(var id in data){
        for(var key in data[id]){
            var check = data[id][key]['regex'];
            var regex = new RegExp(check);
            console.log(regex);
            console.log(regex.test(question));
            console.log(data[id][key]['status']);
            if(regex.test(question) && !data[id][key]['status']){
                flag = false;
                console.log('this site is disabled');
            }
        }
    }
    if(flag){
        console.log("this should run");
        serviceManager.update();
    }
};

/**
 * Function that give permission for manager update service
 *     to run.
 * @param {class} serviceManager
 */

inform.prototype.permission = function(serviceManager){
    if(this.isChrome){
        chrome.storage.sync.get('data',function(data){
            cb(data,serviceManager);
        });
    }
    else if(this.isSafari){
        //chrome.storage.sync.get('data',cb);
    }
    else if(this.isFirefox){
        browser.storage.sync.get('data',function(data){
            cb(data,serviceManager);
        });
    }
};
