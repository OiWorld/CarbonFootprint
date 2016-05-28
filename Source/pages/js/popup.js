function openTab(element) {
  console.log("yo",element);
  window.close();
  chrome.tabs.create({url: chrome.extension.getURL('pages/'+element+'.html')});
}

$('.tab').click(function(){
  openTab($(this).data('tab'));
});