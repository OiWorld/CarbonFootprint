
/**
 * Namespace for settings page
 * @author vaibsharma (Vaibhav Sharma)
 */

console.log("settings running");

var Settings = function(){
    this.enable = "#4caf50";
    this.disable = " #f44336";
    this.category;
    this.name;
    this.status;
    this.isSafari = false;
    this.isChrome = false;
    this.firefox = false;
    //this.updateDefaultData(function(){});
};

/**
 * Function to get link for the static files
 * @param {string} shortLink
 */

Settings.prototype.getLink = function(shortLink){
    if(this.isChrome){
        console.log("I am chrome");
        return chrome.extension.getURL(shortLink);
    }
    else if(this.isSafari){
        console.log("something is expected from too");
    }
    else if(this.isFirefox){
        console.log("I am firefox");
        return browser.extension.getURL(shortLink);
    }
};


Settings.prototype.build = function(){
    this.defaultData();
};

/**
 * Function for automated insertion of elements
 * @param {object}
 */

Settings.prototype.prepareBlock = function(data){
    console.log("preparing block");
    console.log(data);
    for(var id in data){
        var block = $('<div \>').empty(),
            color;
        for(var key in data[id]){
            if(data[id][key]['status']){
                color=setting.enable;
            }
            else color=setting.disable;
            block.append($('<div \>',{
                class:"item col-md-2"
            }).append( $('<div \>',{
                class:"logo"
            }).append($("<img>",{
                src : "./img/websites/"+id+"/"+key+".png",
                title: key
            })).append($("<div \>",{
                class:"switch"
            }).append($("<label \>").append("Disable").append($('<input >',{
                type:"checkbox",
                checked: data[id][key]['status']
            })).append($('<span \>',{
                class: "lever"
            })).append("Enable"))).append($("<div \>",{
                class:"status",
                style:"background-color:"+color+";"
            }))));
        }
        console.log(block);
        $('#'+id).prepend(block);
    }
};

/**
 * Function to update the storage
 * @param {object} data
 * @param {function} cb
 */

Settings.prototype.updateData = function(data,cb){
    console.log("updating data",data);
    var self = this;
    if(self.isChrome){
        chrome.storage.sync.set({"data":data},function(){
            console.log("data added in (chrome)");
            cb(data);
        });
    }
    else if(self.isFirefox){
        browser.storage.sync.set({"data":data}).then(function(){
            console.log("data added in (mozilla)");
            cb(data);
        });
    }
    else if(self.isSafari){
        console.log("we expect something from here");
        cb(data);
    }
    console.log("inserted data is ",data);
};

/**
 * Function to add default data in storage
 * @param {callback}
 */

Settings.prototype.updateDefaultData = function(cb){
    var link = "pages/data/settings.json";
    link = this.getLink(link);
    var self = this;
    console.log("Am I called",link);
    var dData = {};
    $.ajax({
        url: link,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            console.log("i am here");
            dData=data;
            self.updateData(data['data'],cb);
        },
        error:function(err){
            console.log(err);
        }
    });
};

/**
 * Function to initialize Settings namespace operation
 */

Settings.prototype.__init__ = function(){
    var self = this;
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
    this.useSyncData(this.prepareBlock);
};

/**
 * Function to update parameters in db
 * @param {string} category
 * @param {string} name
 * @param {string} status
 */

Settings.prototype.update = function(category,name,status){
    console.log("update");
    var self = this;
    self.category=category;
    self.name=name;
    self.status=status;
    console.log(self.status,self.name,self.category);
    var cb = function(self,result){
        var data = result['data'];
        console.log(data);
        if(data.hasOwnProperty(category)){
            //console.log(data[category]);
            if(data[category].hasOwnProperty(name)){
                //console.log(data[category][name]);
                data[category][name]["status"] = status;
                console.log(data[category][name]['status']);
            }
        }
        self.updateData(data,function(){
            console.log("data updated");
        });
    };

        if(self.isSafari){
            console.log("we expect something to do here as well");
        }
        else if(self.isChrome){
            chrome.storage.sync.get('data',function(result){
                console.log("result found from chrome",result['data']);
                cb(self,result);
            });
        }
        else if(this.isFirefox){
            browser.storage.sync.get('data',function(result){
                console.log("result found from firefox");
                cb(self,result);
            })
        }
};

/**
 * Function to use data from the storage
 * @param {callback} cb
 */

Settings.prototype.useSyncData = function(cb){
    console.log("use sync data");
    var self = this;
    var onGetStorage = function(data){
        if(!data['data']){
            console.log("actually we didn't found any data");
            self.updateDefaultData(cb);
            console.log("Hey already called for update. will let you know when I am done");
        }
        else{
            console.log(data);
            cb(data['data']);
        }
    };
    if(self.isChrome){
        chrome.storage.sync.get('data',onGetStorage);
    }
    else if(self.isFirefox){
        browser.storage.sync.get('data',onGetStorage);
    }
    else if(self.isSafari){
        console.log("we expect something from here");

        // if(true){
        //     self.updateDefaultData();
        // }

    }
    else{
        console.log("we found nothing");
    }
};

var setting = new Settings;

/**
 * function use to define click event on the 'item' element
 * Includes : update the data instantly when the checkbox is clicked
 */

$('.items').on('click','.item',function(){
    console.log("hey I am clicked");
    console.log($(this));
    var thisItem = $(this).parent()[0];
    var category = $(thisItem).parent()[0].id;
    var item = $(this);
    var name = item[0].getElementsByTagName('img')[0].getAttribute('title');
    var status = item[0].getElementsByTagName('input')[0].checked;
    var statusBlock = item[0].getElementsByClassName('status')[0];
    console.log();
    if(status){
        $(statusBlock).css('background-color',setting.enable);
      }
      else{
          $(statusBlock).css('background-color',setting.disable);
      }
    console.log(category,name,status);

    setting.update(category,name,status);
});

setting.__init__();
