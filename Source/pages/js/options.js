var optionsData,fuels,countries;
var ftype;
var units={
  m: 'kg',
  v: 'L',
  d: 'km',
  e: 'kWh'
};

$.ajaxSetup({
  async: false
});

var currencyCodes = ["AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BOV","BRL","BSD","BTN","BWP","BYR","BZD","CAD","CDF","CHE","CHF","CHW","CLF","CLP","CNY","COP","COU","CRC","CUP","CVE","CYP","CZK","DJF","DKK","DOP","DZD","EEK","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LTL","LVL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRO","MTL","MUR","MVR","MWK","MXN","MXV","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SKK","SLL","SOS","SRD","STD","SYP","SZL","THB","TJS","TMM","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","USD","USN","USS","UYU","UZS","VEB","VND","VUV","WST","XAF","XAG","XAU","XBA","XBB","XBC","XBD","XCD","XDR","XFO","XFU","XOF","XPD","XPF","XPT","XTS","XXX","YER","ZAR","ZMK","ZWD"];



function switchtab(){
  $('.tab-button.selected').removeClass('selected');
  $(this).addClass(' selected');
  $('.tab.open').removeClass('open');
  $('.tab:nth-child('+($('.tab-button.selected').index()+1)+')').addClass('open');
}

function saveOptions() {
  var distance=parseFloat($('#distance-value').val());
  var fuel=parseFloat($('#fuel-value').val());
  var funit=$('#fuel-unit').val();
  optionsData.set('distance',distance);
  optionsData.set('fuelUnit',funit);
  optionsData.set('fuel',fuel);
  var co=parseFloat($('#emission').val());
  optionsData.set('co',co);
  var cost=parseFloat($('#fuel-cost').val());
  var curr=parseFloat($('#currency-codes').val());
  var USgalToL=3.785411784;
  var ImpgalToL=4.54609;
  //var miTokm=1.609344;
  var kgTolbs=2.204622621848775;
  var consumption;
  optionsData.set('fuelType',parseInt(ftype));
  // Saving PRIMITVE VARIABLES- fuelCost
  
  optionsData.set('unitSystem',$('.save>:checkbox:checked').attr('id'));

  optionsData.set('inputType',$('.inputType>:checkbox:checked').attr('id'));

  optionsData.set('units',units);

  optionsData.set('fuelCost',{
    value: cost,
    curr: curr
  });

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
    consumption=fuel/distance;
    if(optionsData.get('unitSystem')=="metric"){
      //co in kg/km
      co = consumption*Utils.fuelInfo[ftype]["CO2Emission"]/1000;
    }
    else if(optionsData.get('unitSystem')=="uscustomary"){
      //co in lbs/mi
      co = consumption*Utils.fuelInfo[ftype]["CO2Emission"]/1000*USgalToL*kgTolbs;
    }
    else{
      co = consumption*Utils.fuelInfo[ftype]["CO2Emission"]/1000*ImpgalToL*kgTolbs;
    }
    optionsData.set('emissionRate',co);
    break;
  case "direct-co-emission":
    if(co<=0){
      showMessage("error","error");
      return;
    }
    if(optionsData.get('unitSystem')=="metric"){
      //co in kg/km
      consumption = co/Utils.fuelInfo[ftype]['CO2Emission']*1000;
    }
    else{
      //co in lbs/mi
      consumption = co/Utils.fuelInfo[ftype]['CO2Emission']*1000/USgalToL/kgTolbs;
    }
    optionsData.set('emissionRate',co);
    break;
  }

  //set travel rate
  optionsData.set('showTravelCost',
                  document.getElementById('display-travel-cost').checked
                 );
  if(optionsData.get('showTravelCost')){
    if(cost<=0){
      showMessage("error","error");
      return;
    }
    else{
      optionsData.set('travelRate',consumption*cost);
    }
  }
  // Update status to let user know options were saved.
  showMessage("saved","good");
}

var showMessage = function(msgcode,type){
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
    optionsData.set('init',true);
    optionsData.store();
    setTimeout(function() {
      status.css('display','none');
    }, 1200);
    break;
  }
};

var saveLocation = function(){
  var geoData={},
      city="locality,political",
      country="country,political",
      state="administrative_area_level_1,political",
      gc=new google.maps.Geocoder();
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude,
        lng = position.coords.longitude,
        latlng=new google.maps.LatLng(lat,lng);
    gc.geocode({'latLng': latlng}, function (results, status) {
      var addComps = results[0].address_components;
      for (var i=0;i<addComps.length;i++) {
        if(addComps[i].types==city||
           addComps[i].types==country||
           addComps[i].types==state){
          geoData[addComps[i].types[0]] = addComps[i].long_name;
        }
      }
      optionsData.set('geoData',geoData);
      optionsData.set('renPer',
                      {"wiki": countries[ optionsData
                                 .get('geoData')
                                 .country.replace(/\s/g,"")]
                       .RenewablePer});
      optionsData.store();
    });
  });
};

function loadSavedData() {
  //restore only if options html was saved once
  if(optionsData.has('init')) {
    $('[id="fuel-type"]').val(optionsData.get('fuelType'));
    $('#fuel-cost').val(optionsData.get('fuelCost')['value']);
    $('#currency-codes').val(optionsData.get('fuelCost')['curr']);
    $('#distance-value').val(optionsData.get('distance'));    
    $('#fuel-value').val(optionsData.get('fuel'));
    $('#emission').val(optionsData.get('co'));
    if(optionsData.get('showTravelCost')){
      $('#display-travel-cost').attr('checked', true);
      toggleTravelCost($('#display-travel-cost'));
    }
    $('#'+optionsData.get('inputSource')).attr('checked', true);
    toggleInputSource($('#'+optionsData.get('inputSource')));    
    $('#'+optionsData.get('unitSystem')).attr('checked', true);
    toggleUnits($('#'+optionsData.get('unitSystem')));
  }
  if(!optionsData.has('geoData')){
    saveLocation();
  }
  ftype = $('#fuel-type').val();
}

function toggleInputSource(elem){
  if(elem.prop('id')==="by-fuel-consumption"){
    if(elem.prop('checked')){
      $('#direct-co-emission').prop('checked',false);
      $('.by-fuel input,.by-fuel select').prop('disabled',false);
      $('.by-co input,.by-co select').prop('disabled',true);
      if(optionsData.has('init')){
        $('#'+optionsData.get('inputType')).prop('checked',true);
        toggleInputType($('#'+optionsData.get('inputType')));
      }else{
        toggleInputType($('.inputType>:checkbox:checked'));
      }
      $('.cost-fields :eq(0)').hide();
    }
    else{
      elem.prop('checked',true);
    }
  }
  if(elem.prop('id')==="direct-co-emission"){
    if(elem.prop('checked')){
      $('#by-fuel-consumption').prop('checked',false);
      $('.by-fuel input,.by-fuel select').prop('disabled',true);
      $('.by-co input,.by-co select').prop('disabled',false);
      $('.cost-fields :eq(0)').show();
    }
    else{
      elem.prop('checked',true);
    }
  }
}

function toggleInputType(elem){
  if(elem.prop('id')==="fuel-efficiency"){
    if(elem.prop('checked')){
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
  else if(elem.prop('id')==="fuel-consumed-per"){
    if(elem.prop('checked')){
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
    if(elem.prop('checked')){
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

function toggleTravelCost(elem){
  if(elem.prop('checked')){
    $('.cost-fields select,.cost-fields input').prop('disabled',false);
  }
  else{
    $('.cost-fields select,.cost-fields input').prop('disabled',true);
  }
}

function toggleUnits(elem){
  if(elem.prop('id')==="metric"){
    units.m='kg';
    units.v='L';
    units.d='km';
    if(elem.prop('checked')){
      $('#uscustomary,#imperial').prop('checked',false);
    }
    else{
      elem.prop('checked',true);
    }
  }
  else{
    if(elem.prop('checked')){
      units.m='lbs';
      units.v='gal';
      units.d='mi';
      $('#metric').prop('checked',false);
      if(elem.prop('id')==="uscustomary"){
        $('#imperial').prop('checked',false);
      }
      else{
        $('#uscustomary').prop('checked',false);
      }
    }
    else{
      elem.prop('checked',true);
    } 
  }
  $('#distance-unit option,#emission-unit-distance option')
    .val(units.d)
    .html(units.d);
  $('#emission-unit-mass option').val(units.m).html(units.m);
  if(ftype<7){
    $('#fuel-unit option').val(units.v).html(units.v);
  }
  else if(ftype>=7&&ftype<9){
    $('#fuel-unit option').val(units.m).html(units.m);
  }
  else{
    $('#fuel-unit option').val(units.e).html(units.e);
  }
}

function mirrorFuelValues(elem){
  ftype=elem.prop('value');
  $('[id="fuel-type"]').val(ftype);
  toggleUnits($('.save>:checkbox:checked'));
}

$(document).bind('DOMContentLoaded', function () {
  optionsData = new StorageManager('calculationObject', function() {
    //assigning click listener to the save for each tabs
    $('#save-button').on('click', saveOptions);
    //assigning click listener to the tabs
    $('.tab-button').on('click',switchtab);

		$('#by-fuel-consumption,#direct-co-emission').on('click',function(){
      toggleInputSource($(this));
    });
    
    $('#fuel-efficiency,#fuel-consumed-per,#custom-values').on('click',function(){
      toggleInputType($(this));
    });

    $('#display-travel-cost').on('click',function(){
      toggleTravelCost($(this));
    });
    
    $('#metric,#uscustomary,#imperial').on('click',function(){
      toggleUnits($(this));
    });

    $('[id="fuel-type"]').on('change',function(){
      mirrorFuelValues($(this));
    });

    /**
     * Prevents adding Hyphen(-) in the input field.
     */
    $('#distance-value,#emission,#fuel-value,#fuel-cost')
      .bind('keypress',function(evtmin){
        if(evtmin.which === 45){
          evtmin.preventDefault();
        }
      });
    var i;
    for(i=0;i<currencyCodes.length;i++) {
      $('#currency-codes')
        .append($('<option></option>')
                .html(currencyCodes[i])
                .val(i)
               );
    }

    $.getJSON("/core/resources/countries.json",function(resp){
      countries=resp.countries;
      console.log(countries);
    });

    $.getJSON("/core/resources/fuels.json",function(response){
      fuels=response.fuels;
      console.log(fuels);
    });

    for(i=0;i<fuels.length;i++) {
      $('[id="fuel-type"]')
        .append($('<option></option>')
                .html(fuels[i].fuel)
                .val(i)
                .attr('data-language',fuels[i].langKey)
               );
    }
    
    // Added multiple language support. replaces text with user language
    for(i=0;i<$('[data-language]').length;i++) {
      $($('[data-language]')[i])
        .html(chrome.i18n.getMessage($($('[data-language]')[i])
                                     .data('language')
                                    )
             );
    }
    loadSavedData();
  });
});

googleAnalytics('UA-1471148-11');
