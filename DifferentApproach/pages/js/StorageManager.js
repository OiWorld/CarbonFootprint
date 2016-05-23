/**
 * Created by Kolpa on 23.03.2016.
 */
var StorageManager = function (key, cb) {
    var self = this;

    self.storageKey = key;

    chrome.storage.sync.get(self.storageKey, function (storeValues) {
        if (storeValues[self.storageKey])
            self.storeValues = storeValues[self.storageKey];
        else
            self.storeValues = {};

        cb(self);
    });
};

StorageManager.prototype.update = function() {
    var storeObject = {};
    storeObject[this.storageKey] = this.storeValues;

    chrome.storage.sync.set(storeObject);
};

StorageManager.prototype.set = function(key, value) {
    console.log(key,value);
    this.storeValues[key] = value;
};

StorageManager.prototype.get = function (key) {
    return this.storeValues[key];
};

StorageManager.prototype.has = function (key) {
    return !!this.storeValues[key];
};