/**
 * script for extension popup
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * opens a new tab
 * @param {element} element
 */

function openTab(element) {
  var isSafari = false;
  if (!(navigator.userAgent.toLowerCase().indexOf('chrom') != -1)) {
    if (navigator.userAgent.toLowerCase().indexOf('safari') != -1) {
      isSafari = true;
    }
  }
  if (!isSafari) {
    chrome.tabs.create({
      url: chrome.extension.getURL('pages/' + element + '.html')
    });
    window.close();
  }
  else {
    safari.application.activeBrowserWindow.openTab().url =
      safari.extension.baseURI + 'pages/' + element + '.html';
    safari.self.hide();
  }
}

$('.tab').click(function() {
  openTab($(this).data('tab'));
});
