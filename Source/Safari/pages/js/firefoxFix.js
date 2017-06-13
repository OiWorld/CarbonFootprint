console.log('loading Firefox Fix');

var translationRequests = [];

var firefoxApi = {};

var storageGetBuffer = [];
var storageGetBufferIndex = 0;

self.port.on('translationResponse', function(tr) {
  for (var i in translationRequests) {
    var translationRequest = translationRequests[i];
    if (tr.key === translationRequest.key)
      translationRequest.callback(tr.translation);
  }
});

self.port.on('storageGetResponse', function(storage) {
  for (var i in storageGetBuffer) {
    var storageGet = storageGetBuffer[i];
    if (storage.tag === storageGet.tag)
      storageGet.callback(storage.values);
  }
});

function getTranslation(key, index, cb) {
  self.port.emit('translationRequest', {
    key: key
  });
  translationRequests.push({
    key: key,
    callback: function(translation) {
      cb(translation, index);
    }
  });
}

function getStorage(key, cb) {
  self.port.emit('storageGetRequest', {
    tag: storageGetBufferIndex,
    storageKey: key
  });
  storageGetBuffer.push({
    tag: storageGetBufferIndex,
    callback: function(values) {
      cb(values);
    }
  });
  storageGetBufferIndex += 1;
}

function saveStorage(data) {
  self.port.emit('storageSetRequest', {
    data: data
  });
}

var clone = cloneInto(firefoxApi, unsafeWindow);

exportFunction(getTranslation, clone, {
  defineAs: 'getTranslation'
});
exportFunction(getStorage, clone, {
  defineAs: 'getStorage'
});
exportFunction(saveStorage, clone, {
  defineAs: 'saveStorage'
});

/**
 * Exposes the defined functions to the javascript of the content window
 */

unsafeWindow.firefoxApi = clone;

console.log('loaded Firefox Fix');
