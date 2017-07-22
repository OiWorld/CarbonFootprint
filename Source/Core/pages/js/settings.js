/**
 * Namespace for settings page
 * @author vaibsharma (Vaibhav Sharma)
 */

console.log("settings running");

var Settings = function(){
    this.isSafari = false;
    this.isChrome = false;
    this.isFirefox = false;
    this.enable = "#4caf50";
    this.disable = "#f44336";
    this.category;
    this.name;
    this.active;
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
        console.log("I am in safari");
        return safari.extension.baseURI + shortLink;
    }
    else if(this.isFirefox){
        console.log("I am firefox");
        return browser.extension.getURL(shortLink);
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
            console.log("data added in (firefox)");
            cb(data);
        });
    }
    else if(self.isSafari){
        console.log("we expect something from here");
        safari.self.tab.dispatchMessage('data', {
            type: 'setItem',
            item: data
        });
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
            console.log("link is found, default setting is used");
            dData=data;
            self.updateData(data['data'],cb);
        },
        error:function(err){
            console.log(err);
            cb(err,dData);
        }
    });
};

/**
 * Function to update parameters in db
 * @param {string} category
 * @param {string} name
 * @param {string} status
 */

Settings.prototype.onChange = function(category,name,active){
    console.log('update');
    var self = this;
    self.category=category;
    self.name=name;
    self.active=active;
    console.log(self.active,self.name,self.category);
    var cb = function(self,result){
        var data = result['data'];
        console.log(data);
        if(data.hasOwnProperty(category)){
            //console.log(data[category]);
            if(data[category].hasOwnProperty(name)){
                //console.log(data[category][name]);
                data[category][name]['active'] = active;
                console.log(data[category][name]['active']);
            }
        }
        self.updateData(data,function(result){
            console.log("data updated",result);
        });
    };
        if(self.isSafari){
            console.log('we expect something from here');
            safari.self.tab.dispatchMessage('data', {
                type: 'getItem'
            });
            safari.self.addEventListener('message', function(response) {
                if (response.name === 'data') {
                    console.log(response.message);
                    if (response.message !== null)
                        cb(self,{"data":response.message});
                    else
                        cb(self,{});
                }
            }, false);
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
            });
        }
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
            if(data[id][key]['active']){
                color=setting.enable;
            }
            else color=setting.disable;
            block.append($('<div \>',{
                class:'item col-md-2'
            }).append( $('<div \>',{
                class:'logo'
            }).append($('<img>',{
                src : './img/websites/'+id+'/'+key+'.png',
                title: key
            }))).append($('<div \>',{
                class:'switch'
            }).append($('<label \>').append('Disable').append($('<input >',{
                type:'checkbox',
                checked: data[id][key]['active']
            })).append($('<span \>',{
                class: 'lever'
            })).append('Enable'))).append($('<div \>',{
                class:'status',
                style:'background-color:'+color+';'
            })));
        }
        console.log(block);
        $('#'+id).html(block);
    }
};

/**
 * Function to use data from the storage
 * @param {callback} cb
 */

Settings.prototype.useSyncData = function(cb){
    console.log('use sync data');
    var self = this;
    var onGetStorage = function(data){
        if(!data['data']){
            console.log('actually we didn\'t found any data');
            self.updateDefaultData(cb);
            console.log('Hey already called for update. will let you know when I am done');
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
        console.log('we expect something from here');
        safari.self.tab.dispatchMessage('data', {
            type: 'getItem'
        });
        safari.self.addEventListener('message', function(response) {
            if (response.name === 'data') {
                console.log(response.message);
                if (response.message !== null)
                    onGetStorage({"data":response.message});
                else
                    onGetStorage({});
            }
        }, false);
    }
    else{
        console.log('we found nothing');
    }
};

/**
 * Function to initialize Settings namespace operation
 */

Settings.prototype.__init__ = function(){
    var self = this;
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
    this.useSyncData(this.prepareBlock);
};

var setting = new Settings;

/**
 * function use to define click event on the 'item' element
 * Includes : update the data instantly when the checkbox is clicked
 */

$('.items').on('click','.item',function(){
    console.log('hey I am clicked');
    console.log($(this));
    var thisItem = $(this).parent()[0];
    var category = $(thisItem).parent()[0].id;
    var item = $(this);
    var name = item[0].getElementsByTagName('img')[0].getAttribute('title');
    var active = item[0].getElementsByTagName('input')[0].checked;
    var statusBlock = item[0].getElementsByClassName('status')[0];
    console.log();
    if(active){
        $(statusBlock).css('background-color',setting.enable);
      }
      else{
          $(statusBlock).css('background-color',setting.disable);
      }
    console.log(category,name,active);

    setting.onChange(category,name,active);
});

setting.__init__();
