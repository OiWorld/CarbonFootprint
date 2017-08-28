/**
 * Storage Manager namespace.
 * @constructor
 */

var storageManager = function(){
	this.isChrome = false;
	this.isFirefox = false;
	this.isSafari = false;
	if (navigator.userAgent.toLowerCase().indexOf('chrom') != -1)
    {
       	this.isChrome = true;
       	console.log('I am in chrom(e)(ium)');
   	}
   	else if (navigator.userAgent.toLowerCase().indexOf('safari') != -1)
   	{
       	this.isSafari = true;
       	console.log('I am in safari');
   	}
   	else if (navigator.userAgent.toLowerCase().indexOf('firefox') != -1)
   	{
       	this.isFirefox = true;
       	console.log('I am in mozilla');
   	}
}

/**
 * Used to get storage from extension Storage
 * @param {string} key
 * @callback cb
 */

storageManager.prototype.getStorage = function(key,cb){
	console.log('use sync data');
    var self = this;
    try{
    if(self.isChrome){
        chrome.storage.sync.get(key,cb);
    }
    else if(self.isFirefox){
        browser.storage.sync.get(key,cb);
    }
    else if(self.isSafari){
        console.log('we expect something from here');
        safari.self.tab.dispatchMessage(key, {
            type: 'getItem'
        });
        safari.self.addEventListener('message', function(response) {
            if (response.name === key) {
                console.log(response.message);
                if (response.message !== null){
                	var data = {};
                	data[key] = response.message;
                	cb(data);
                }
                else
                    cb({});
            }
        }, false);
    }
    else{
        console.log('we found nothing');
    }
  }
  catch (err){
    var req = new XMLHttpRequest(),
      link = '../pages/data/settings.json';
    req.open('GET', link);
    req.onreadystatechange = function(ev) {
      if (req.readyState == 4) {
        if (req.status == 200) {
          cb(JSON.parse(req.responseText));
        }
      }
    };
    req.send();
  }
}

/**
 * Use to save data in extension storage
 * @param {string} key
 * @param {object} data
 * @callback cb
 */

storageManager.prototype.insertStorage = function(key,data,cb){
	if(data.hasOwnProperty(key)){
			console.log("updating data",data);
			var self = this;
		    if(self.isChrome){
		        chrome.storage.sync.set(data,function(){
		            console.log("data added in (chrome)");
		            cb(data);
		        });
		    }
		    else if(self.isFirefox){
		        browser.storage.sync.set(data).then(function(){
		            console.log("data added in (firefox)");
		            cb(data);
		        });
		    }
		    else if(self.isSafari){
		        console.log("we expect something from here");
		        safari.self.tab.dispatchMessage(key, {
		            type: 'setItem',
		            item: data[key]
		        });
		        cb(data);
		    }
		    console.log("inserted data is ",data);
	}
	else{
		cb({})
	}
}