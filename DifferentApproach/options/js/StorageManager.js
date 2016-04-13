/**
 * Created by Kolpa on 23.03.2016.
 */
var StorageManager = function (key, cb) {
    var self = this;

    self.storageKey = key;

    chrome.storage.sync.get(self.storageKey, function (restoreValues) {
        self.storeValues = storeValues;
        cb(self);
    });
};

StorageManager.prototype.update = function() {
    chrome.storage.sync.set({}[this.storageKey] = this.storeValues);
};

StorageManager.prototype.set = function(key, value) {
    this.storeValues[key] = value;
    this.update();
};

StorageManager.prototype.get = function (key) {
    return this.storeValues[key];
};

StorageManager.prototype.has = function (key) {
    return !!this.storeValues[key];
};