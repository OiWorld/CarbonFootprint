var optionsData;

var currencyCodes = ["AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BOV","BRL","BSD","BTN","BWP","BYR","BZD","CAD","CDF","CHE","CHF","CHW","CLF","CLP","CNY","COP","COU","CRC","CUP","CVE","CYP","CZK","DJF","DKK","DOP","DZD","EEK","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LTL","LVL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRO","MTL","MUR","MVR","MWK","MXN","MXV","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SKK","SLL","SOS","SRD","STD","SYP","SZL","THB","TJS","TMM","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","USD","USN","USS","UYU","UZS","VEB","VND","VUV","WST","XAF","XAG","XAU","XBA","XBB","XBC","XBD","XCD","XDR","XFO","XFU","XOF","XPD","XPF","XPT","XTS","XXX","YER","ZAR","ZMK","ZWD"];

function switchtab(){
  $('.tab-button.selected').removeClass('selected');
  $(this).addClass(' selected');
  $('.tab.open').removeClass('open');
  $('.tab:nth-child('+($('.tab-button.selected').index()+1)+')').addClass('open');
}

// Function to handle all 3 tabs save  click
function saveOptions() {
  var distance=parseFloat($('#distance-value').val());
  var fuel=parseFloat($('#fuel-value').val());
  var consumption=fuel/distance;
  optionsData.set('consumption',consumption);
  var ftype=$('#fuel-type').val();
  var co=parseFloat($('#emission').val());
  var cost=parseFloat($('#fuel-cost').val());
  var curr=$('#currency-codes').val();
  var USgalToL=3.785411784;
  //var miTokm=1.609344;
  var kgTolbs=2.204622621848775;
  //console.log(co,mass,cost,curr,ftype,funit,dunit,fuel,distance);
  //Saving input type
  //optionsData.set('savedTab',$('.emission-input.open').index());
  // Saving PRIMITVE VARIABLES- fuelType

  optionsData.set('fuelType',parseInt(ftype));
  // Saving PRIMITVE VARIABLES- fuelCost
  
  optionsData.set('fuelCost',{
    value: parseFloat(cost),
    curr: curr
  });
  
  optionsData.set('unitSystem',$('.save>:checkbox:checked').attr('id'));
  
  if(optionsData.get('unitSystem')=="metric"){
    optionsData.set('units',{
      m: 'kg',
      v: 'L',
      d: 'km'
    });
  }
  else{
    optionsData.set('units',{
      m: 'lbs',
      v: 'gal',
      d: 'mi'
    });
  }


  optionsData.set('inputSource',$('.tab>>:checkbox:checked').attr('id'));

  //console.log(optionsData.get('inputSource'));
  //console.log(optionsData.get());
  /**
   * TO STORE EVERYTYPE OF INFO IN TERMS OF PRIMITVE VARIABLES-
   * fuelConsumption
   */
  switch(optionsData.get('inputSource')) {
  case "by-fuel-consumption":
    if(distance<=0||fuel<=0){
      showMessage("error","error");
      return;
    }
    if(optionsData.get('unitSystem')=="metric"){
      //co in kg/km
      co = consumption*Utils.fuelInfo[ftype]['CO2Emission']/1000
    }
    else{
      //co in lbs/mi
      co = consumption*Utils.fuelInfo[ftype]['CO2Emission']/1000*USgalToL*kgTolbs;
    }
    optionsData.set('emissionRate',co);
    break;
  case "direct-co-emission":
    if(co<=0){
      showMessage("error","error");
      return;
    }
    optionsData.set('emissionRate',co);
    break;
  }
  //set travel rate
  optionsData.set('showTravelCost',$('#display-travel-cost:checkbox:checked').length);
  if(optionsData.get('showTravelCost')){
    optionsData.set('travelRate',consumption*cost);
  }

  optionsData.store();
  // Update status to let user know options were saved.
  showMessage("saved","good");
}

function showMessage(msgcode,type){
  var status =  $('#message');
  switch(type){
  case "error":
    status
      .html(chrome.i18n.getMessage(msgcode))
      .css('display','table')
      .css('background-color','#fb5151');
    break;
  case "good":
    status
      .html(chrome.i18n.getMessage(msgcode))
      .css('display','table')
      .css('background-color','#a6ff4d');
    setTimeout(function() {
      status.css('display','none');
    }, 1200);
    break;
  }
}
//function to set emission rate
/*
function setTravelRate() {
  var fuelCostObj = optionsData.get('fuelCost');
  var consumptionObj = optionsData.get('fuelConsumption');
  var fuelRate = null;
  //cost($/volume) and consumption (volume/distance)
  fuelRate = fuelCostObj['value'] * Utils.Converter.convert(consumptionObj['value'],consumptionObj['unit1'],fuelCostObj['unit2'],consumptionObj['unit2'],'km');
  
  //Fetching display travel cost checkbox value
  var displayTravelCost = document.getElementById("display-travel-cost").checked;
  
  optionsData.set('travelRate', Math.round(fuelRate * 10000) / 10000 );
  optionsData.set('showTravelCost', displayTravelCost);
}*/

function loadOldData() {
  //restore only if options html was saved once
  if(optionsData.has('savedTab')) {
    // Fuel type restore
    $('#fuel-type').val(optionsData.get('fuelType'));
    // Fuel Cost restore
    $('#fuel-cost').val(optionsData.get('fuelCost')['value']);
    $('#fuel-cost-unit2').val(optionsData.get('fuelCost')['unit2']);
    //  Storing input field on type
    $($('.emission-input-type')[optionsData.get('savedTab')]).click();
    
    $('#display-travel-cost').attr('checked', optionsData.get('showTravelCost'));
    
    switch(optionsData.get('savedTab')) {
    case 0 :  $('#consumption').val(optionsData.get('fuelConsumption')['value']);
      $('#consumption-unit1').val(optionsData.get('fuelConsumption')['unit1']);
      $('#consumption-unit2').val(optionsData.get('fuelConsumption')['unit2']);
      break;
      
    case 1 :  $('#efficiency').val( 1 / optionsData.get('fuelConsumption')['value']);
      $('#efficiency-unit1').val(optionsData.get('fuelConsumption')['unit2']);
      $('#efficiency-unit2').val(optionsData.get('fuelConsumption')['unit1']);
      break;
      
    case 2 :  var emissionVal = Utils.Converter.convert(optionsData.get('emissionRate'),'g',optionsData.get('emissionDisplayUnit'),'km',optionsData.get('fuelConsumption')['unit2']);
      $('#emission').val(Math.round(emissionVal*100)/100);
      $('#emission-unit1').val(optionsData.get('emissionDisplayUnit'));
      $('#emission-unit2').val(optionsData.get('fuelConsumption')['unit2']);
      break;                            
    }
  }
}

function toggleInputSource(){
  if($(this).prop('id')==="by-fuel-consumption"){
    if($(this).prop('checked')){
      $('#direct-co-emission').prop('checked',false);
      $('.by-fuel input,.by-fuel select').prop('disabled',false);
      $('.by-co input,.by-co select').prop('disabled',true);
    }
    else{
      $(this).prop('checked',true);
    }
  }
  if($(this).prop('id')==="direct-co-emission"){
    if($(this).prop('checked')){
      $('#by-fuel-consumption').prop('checked',false);
      $('.by-fuel input,.by-fuel select').prop('disabled',true);
      $('.by-co input,.by-co select').prop('disabled',false);
    }
    else{
      $(this).prop('checked',true);
    }
  }
}

function toggleInputType(){
  if($(this).prop('id')==="fuel-efficiency"){
    if($(this).prop('checked')){
      $('#fuel-value').val(1).prop('disabled',true);
      $('#distance-value').prop('disabled',false);
      $('#fuel-consumed-per').prop('checked',false);
      $('#custom-values').prop('checked',false);
      $('#usage-message').html(chrome.i18n.getMessage("feMessage"));
    }
    else{
      $('#fuel-value').prop('disabled',false);
    }
  }
  else if($(this).prop('id')==="fuel-consumed-per"){
    if($(this).prop('checked')){
      $('#distance-value').val(100).prop('disabled',true);
      $('#fuel-value').prop('disabled',false);
      $('#fuel-efficiency').prop('checked',false);
      $('#custom-values').prop('checked',false);
      $('#usage-message').html(chrome.i18n.getMessage("fcpMessage"));
    }
    else{
      $('#distance-value').prop('disabled',false);
    }
  }
  else{
    if($(this).prop('checked')){
      $('#distance-value').prop('disabled',false);
      $('#fuel-value').prop('disabled',false);
      $('#fuel-consumed-per').prop('checked',false);
      $('#fuel-efficiency').prop('checked',false);
      $('#usage-message').html(chrome.i18n.getMessage("cvMessage"));
    }
    else{
      $('#distance-value').prop('disabled',false);
    }
  }
}

function toggleTravelCost(){
  if($(this).prop('checked')){
    $('#fuel-cost,#fuel-cost-volume,#currency-codes').prop('disabled',false);
  }
  else{
    $('#fuel-cost,#fuel-cost-volume,#currency-codes').prop('disabled',true);
  }
}

function toggleUnits(){
  if($(this).prop('id')==="metric"){
    if($(this).prop('checked')){
      $('#distance-unit option,#emission-unit-distance option')
        .val("km")
        .html("km");
      $('#fuel-cost-volume option,#fuel-unit option').val("L").html("L");
      $('#emission-unit-mass option').val("kg").html("kg");
      $('#uscustomary').prop('checked',false);
    }
    else{
      $(this).prop('checked',true);
    }
  }
  else{
    if($(this).prop('checked')){
      $('#fuel-cost-volume option,#fuel-unit option').val("gal").html("gal");
      $('#emission-unit-mass option').val("lbs").html("lbs");
      $('#distance-unit option,#emission-unit-distance option')
        .val("mi")
        .html("mi");
      $('#metric').prop('checked',false);
    }
    else{
      $(this).prop('checked',true);
    } 
  }
}


$(document).bind('DOMContentLoaded', function () {
  optionsData = new StorageManager('calculationObject', function() {
    
    //assigning click listener to the save for each tabs
    document.getElementById('save-button').addEventListener('click', saveOptions);
    
    //assigning click listener to the tabs
    $('.tab-button').on('click',switchtab);

		$('#by-fuel-consumption,#direct-co-emission').on('click',toggleInputSource);

    $('#fuel-efficiency,#fuel-consumed-per,#custom-values').on('click',toggleInputType);

    $('#display-travel-cost').on('click',toggleTravelCost);

    $('#metric,#uscustomary').on('click',toggleUnits);
    /**
     * Prevents adding Hyphen(-) in the input field.
     */
    $('#consumption,#emission,#efficiency').bind('keypress',function(evtmin){
      if(evtmin.which === 45){
        evtmin.preventDefault();
      }
    });

    for(var i=0;i<currencyCodes.length;i++) {
      $('#currency-codes')
        .append($('<option></option>')
                .html(currencyCodes[i])
                .val(currencyCodes[i])
               )
    }
    
    // Added multiple language support. replaces text with user language
    for(var i=0;i< $('[data-language]').length;++i) {
      $($('[data-language]')[i]).html(chrome.i18n.getMessage($($('[data-language]')[i]).data('language')))
    }
    
    loadOldData();
  });

});

googleAnalytics('UA-1471148-11');
