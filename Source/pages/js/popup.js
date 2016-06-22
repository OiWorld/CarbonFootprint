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
  console.log('yo', element);
  window.close();
  chrome.tabs.create({
    url: chrome.extension.getURL('pages/' + element + '.html')
  });
}

$('.tab').click(function() {
  openTab($(this).data('tab'));
});
