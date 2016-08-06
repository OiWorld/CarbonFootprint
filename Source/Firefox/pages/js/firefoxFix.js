console.log('loading Firefox Fix');

var translationRequests = [];

var firefoxApi = {};

self.port.on('translationResponse', function(tr) {
	for (var i in translationRequests) {
		var translationRequest = translationRequests[i];
		if (tr.key === translationRequest.key)
			translationRequest.callback(tr.translation);
	}
});

function getTranslation(key, index, cb) {
	self.port.emit('translationRequest', {key: key});
	translationRequests.push({
		key: key,
		callback: function (translation) {
			cb(translation, index);
		}
	});
}

var clone = cloneInto(firefoxApi, unsafeWindow);

exportFunction(getTranslation, clone, {defineAs: 'getTranslation'});

unsafeWindow.firefoxApi = clone;

console.log('loaded Firefox Fix');