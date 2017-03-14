// Hanldes actions related to knowMore.html 's  UI
function toggleAccordion(e) {
    // console.log(e); // sometimes it doesn't hurt to logout events to figure out what's going on!
    var panelHeading = $(e.target).prev('.panel-heading');
    var chevron = panelHeading.find('i.fa');
    //controls chevron icon behavior
    chevron.toggleClass('fa-chevron-right fa-chevron-down');
    chevron.css('transition', 'background 0.5s ease');
    // controls accordion heading background color
    panelHeading.toggleClass('highlight');
    // controls accordion heading text
    panelHeading.find('.panel-title>a').toggleClass('highlight-text');
    //Experimental - // controls chevron icon color
    //don't delete it! - can be enable in future version
    // chevron.toggleClass('highlight-text');
}

// http://api.jquery.com/jquery/#jQuery3
$(function() {
    //set up event listener accordians
    $('#accordion').on('hidden.bs.collapse', toggleAccordion);
    $('#accordion').on('shown.bs.collapse', toggleAccordion);
    $('#accordionCalories').on('hidden.bs.collapse', toggleAccordion);
    $('#accordionCalories').on('shown.bs.collapse', toggleAccordion);
});
