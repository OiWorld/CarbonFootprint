/**
 * Created by Kolpa on 23.03.2016.
 */
var RestoreManager = function (cb) {
    var self = this;
    this.storageKey = 'restoreValues';
    chrome.storage.sync.get(this.storageKey, function (restoreValues) {
        self.restoreValues = restoreValues;
        cb(self);
    });
};

RestoreManager.prototype.update = function() {
    chrome.storage.sync.set({}[this.storageKey] = this.restoreValues);
};

RestoreManager.prototype.set = function(key, value) {
    this.restoreValues[key] = value;
    this.update();
};

RestoreManager.prototype.get = function (key) {
    return this.restoreValues[key];
};