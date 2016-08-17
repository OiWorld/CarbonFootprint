/**
 * loads extension settings
 * @author Kolpa (Kolya Opahle)
 * @author heychirag (Chirag Arora)
 */

/**
 * script injector namespace
 */

var injector = {};

/**
 * matching patterns for Google Maps
 * Note: include both https and http links in different lines
 * because safari won't accept '*://'
 */

injector.googleMaps = [
  'https://*.google.ad/maps*',
  'https://*.google.am/maps*',
  'https://*.google.at/maps*',
  'https://*.google.az/maps*',
  'https://*.google.by/maps*',
  'https://*.google.be/maps*',
  'https://*.google.ba/maps*',
  'https://*.google.bg/maps*',
  'https://*.google.hr/maps*',
  'https://*.google.cz/maps*',
  'https://*.google.dk/maps*',
  'https://*.google.ee/maps*',
  'https://*.google.es/maps*',
  'https://*.google.fi/maps*',
  'https://*.google.fr/maps*',
  'https://*.google.ge/maps*',
  'https://*.google.de/maps*',
  'https://*.google.com.gi/maps*',
  'https://*.google.gr/maps*',
  'https://*.google.gg/maps*',
  'https://*.google.hu/maps*',
  'https://*.google.is/maps*',
  'https://*.google.ie/maps*',
  'https://*.google.im/maps*',
  'https://*.google.it/maps*',
  'https://*.google.je/maps*',
  'https://*.google.kz/maps*',
  'https://*.google.lv/maps*',
  'https://*.google.li/maps*',
  'https://*.google.lu/maps*',
  'https://*.google.mt/maps*',
  'https://*.google.md/maps*',
  'https://*.google.nl/maps*',
  'https://*.google.no/maps*',
  'https://*.google.pl/maps*',
  'https://*.google.pt/maps*',
  'https://*.google.co.uk/maps*',
  'https://*.google.com.ar/maps*',
  'https://*.google.com.bo/maps*',
  'https://*.google.com.br/maps*',
  'https://*.google.cl/maps*',
  'https://*.google.com.co/maps*',
  'https://*.google.com.ec/maps*',
  'https://*.google.com.gy/maps*',
  'https://*.google.com.py/maps*',
  'https://*.google.com.pe/maps*',
  'https://*.google.com.uy/maps*',
  'https://*.google.co.ve/maps*',
  'https://*.google.as/maps*',
  'https://*.google.com.au/maps*',
  'https://*.google.co.ck/maps*',
  'https://*.google.fm/maps*',
  'https://*.google.com.fj/maps*',
  'https://*.google.ki/maps*',
  'https://*.google.nr/maps*',
  'https://*.google.co.nz/maps*',
  'https://*.google.nu/maps*',
  'https://*.google.com.nf/maps*',
  'https://*.google.pn/maps*',
  'https://*.google.ws/maps*',
  'https://*.google.com.sb/maps*',
  'https://*.google.tk/maps*',
  'https://*.google.to/maps*',
  'https://*.google.vu/maps*',
  'https://*.google.com.ai/maps*',
  'https://*.google.com.ag/maps*',
  'https://*.google.bs/maps*',
  'https://*.google.com.bz/maps*',
  'https://*.google.vg/maps*',
  'https://*.google.ca/maps*',
  'https://*.google.co.cr/maps*',
  'https://*.google.com.cu/maps*',
  'https://*.google.dm/maps*',
  'https://*.google.com.do/maps*',
  'https://*.google.com.sv/maps*',
  'https://*.google.gl/maps*',
  'https://*.google.gp/maps*',
  'https://*.google.com.gt/maps*',
  'https://*.google.ht/maps*',
  'https://*.google.hn/maps*',
  'https://*.google.com.jm/maps*',
  'https://*.google.com.mx/maps*',
  'https://*.google.ms/maps*',
  'https://*.google.com.ni/maps*',
  'https://*.google.com.pa/maps*',
  'https://*.google.com.pr/maps*',
  'https://*.google.com.vc/maps*',
  'https://*.google.tt/maps*',
  'https://*.google.com/maps*',
  'https://*.google.co.vi/maps*',
  'https://*.google.com.af/maps*',
  'https://*.google.com.bh/maps*',
  'https://*.google.com.bd/maps*',
  'https://*.google.com.bn/maps*',
  'https://*.google.kh/maps*',
  'https://*.google.cn/maps*',
  'https://*.google.com.hk/maps*',
  'https://*.google.co.in/maps*',
  'https://*.google.co.id/maps*',
  'https://*.google.co.il/maps*',
  'https://*.google.co.jp/maps*',
  'https://*.google.jo/maps*',
  'https://*.google.kg/maps*',
  'https://*.google.co.kr/maps*',
  'https://*.google.la/maps*',
  'https://*.google.com.my/maps*',
  'https://*.google.mv/maps*',
  'https://*.google.mn/maps*',
  'https://*.google.com.np/maps*',
  'https://*.google.com.om/maps*',
  'https://*.google.com.pk/maps*',
  'https://*.google.com.ph/maps*',
  'https://*.google.com.qa/maps*',
  'https://*.google.ru/maps*',
  'https://*.google.com.sa/maps*',
  'https://*.google.com.sg/maps*',
  'https://*.google.lk/maps*',
  'https://*.google.com.tj/maps*',
  'https://*.google.co.th/maps*',
  'https://*.google.tl/maps*',
  'https://*.google.tm/maps*',
  'https://*.google.ae/maps*',
  'https://*.google.co.uz/maps*',
  'https://*.google.com.vn/maps*',
  'https://*.google.it.ao/maps*',
  'https://*.google.co.bw/maps*',
  'https://*.google.bi/maps*',
  'https://*.google.ci/maps*',
  'https://*.google.cd/maps*',
  'https://*.google.dj/maps*',
  'https://*.google.com.eg/maps*',
  'https://*.google.com.et/maps*',
  'https://*.google.gm/maps*',
  'https://*.google.com.gh/maps*',
  'https://*.google.co.ke/maps*',
  'https://*.google.co.ls/maps*',
  'https://*.google.com.ly/maps*',
  'https://*.google.mw/maps*',
  'https://*.google.mu/maps*',
  'https://*.google.co.ma/maps*',
  'https://*.google.com.na/maps*',
  'https://*.google.com.ng/maps*',
  'https://*.google.cg/maps*',
  'https://*.google.rw/maps*',
  'https://*.google.sh/maps*',
  'https://*.google.st/maps*',
  'https://*.google.sn/maps*',
  'https://*.google.sc/maps*',
  'https://*.google.co.za/maps*',
  'https://*.google.co.ug/maps*',
  'https://*.google.co.zm/maps*',
  'https://*.google.co.zw/maps*',
  'http://*.google.ad/maps*',
  'http://*.google.am/maps*',
  'http://*.google.at/maps*',
  'http://*.google.az/maps*',
  'http://*.google.by/maps*',
  'http://*.google.be/maps*',
  'http://*.google.ba/maps*',
  'http://*.google.bg/maps*',
  'http://*.google.hr/maps*',
  'http://*.google.cz/maps*',
  'http://*.google.dk/maps*',
  'http://*.google.ee/maps*',
  'http://*.google.es/maps*',
  'http://*.google.fi/maps*',
  'http://*.google.fr/maps*',
  'http://*.google.ge/maps*',
  'http://*.google.de/maps*',
  'http://*.google.com.gi/maps*',
  'http://*.google.gr/maps*',
  'http://*.google.gg/maps*',
  'http://*.google.hu/maps*',
  'http://*.google.is/maps*',
  'http://*.google.ie/maps*',
  'http://*.google.im/maps*',
  'http://*.google.it/maps*',
  'http://*.google.je/maps*',
  'http://*.google.kz/maps*',
  'http://*.google.lv/maps*',
  'http://*.google.li/maps*',
  'http://*.google.lu/maps*',
  'http://*.google.mt/maps*',
  'http://*.google.md/maps*',
  'http://*.google.nl/maps*',
  'http://*.google.no/maps*',
  'http://*.google.pl/maps*',
  'http://*.google.pt/maps*',
  'http://*.google.co.uk/maps*',
  'http://*.google.com.ar/maps*',
  'http://*.google.com.bo/maps*',
  'http://*.google.com.br/maps*',
  'http://*.google.cl/maps*',
  'http://*.google.com.co/maps*',
  'http://*.google.com.ec/maps*',
  'http://*.google.com.gy/maps*',
  'http://*.google.com.py/maps*',
  'http://*.google.com.pe/maps*',
  'http://*.google.com.uy/maps*',
  'http://*.google.co.ve/maps*',
  'http://*.google.as/maps*',
  'http://*.google.com.au/maps*',
  'http://*.google.co.ck/maps*',
  'http://*.google.fm/maps*',
  'http://*.google.com.fj/maps*',
  'http://*.google.ki/maps*',
  'http://*.google.nr/maps*',
  'http://*.google.co.nz/maps*',
  'http://*.google.nu/maps*',
  'http://*.google.com.nf/maps*',
  'http://*.google.pn/maps*',
  'http://*.google.ws/maps*',
  'http://*.google.com.sb/maps*',
  'http://*.google.tk/maps*',
  'http://*.google.to/maps*',
  'http://*.google.vu/maps*',
  'http://*.google.com.ai/maps*',
  'http://*.google.com.ag/maps*',
  'http://*.google.bs/maps*',
  'http://*.google.com.bz/maps*',
  'http://*.google.vg/maps*',
  'http://*.google.ca/maps*',
  'http://*.google.co.cr/maps*',
  'http://*.google.com.cu/maps*',
  'http://*.google.dm/maps*',
  'http://*.google.com.do/maps*',
  'http://*.google.com.sv/maps*',
  'http://*.google.gl/maps*',
  'http://*.google.gp/maps*',
  'http://*.google.com.gt/maps*',
  'http://*.google.ht/maps*',
  'http://*.google.hn/maps*',
  'http://*.google.com.jm/maps*',
  'http://*.google.com.mx/maps*',
  'http://*.google.ms/maps*',
  'http://*.google.com.ni/maps*',
  'http://*.google.com.pa/maps*',
  'http://*.google.com.pr/maps*',
  'http://*.google.com.vc/maps*',
  'http://*.google.tt/maps*',
  'http://*.google.com/maps*',
  'http://*.google.co.vi/maps*',
  'http://*.google.com.af/maps*',
  'http://*.google.com.bh/maps*',
  'http://*.google.com.bd/maps*',
  'http://*.google.com.bn/maps*',
  'http://*.google.kh/maps*',
  'http://*.google.cn/maps*',
  'http://*.google.com.hk/maps*',
  'http://*.google.co.in/maps*',
  'http://*.google.co.id/maps*',
  'http://*.google.co.il/maps*',
  'http://*.google.co.jp/maps*',
  'http://*.google.jo/maps*',
  'http://*.google.kg/maps*',
  'http://*.google.co.kr/maps*',
  'http://*.google.la/maps*',
  'http://*.google.com.my/maps*',
  'http://*.google.mv/maps*',
  'http://*.google.mn/maps*',
  'http://*.google.com.np/maps*',
  'http://*.google.com.om/maps*',
  'http://*.google.com.pk/maps*',
  'http://*.google.com.ph/maps*',
  'http://*.google.com.qa/maps*',
  'http://*.google.ru/maps*',
  'http://*.google.com.sa/maps*',
  'http://*.google.com.sg/maps*',
  'http://*.google.lk/maps*',
  'http://*.google.com.tj/maps*',
  'http://*.google.co.th/maps*',
  'http://*.google.tl/maps*',
  'http://*.google.tm/maps*',
  'http://*.google.ae/maps*',
  'http://*.google.co.uz/maps*',
  'http://*.google.com.vn/maps*',
  'http://*.google.it.ao/maps*',
  'http://*.google.co.bw/maps*',
  'http://*.google.bi/maps*',
  'http://*.google.ci/maps*',
  'http://*.google.cd/maps*',
  'http://*.google.dj/maps*',
  'http://*.google.com.eg/maps*',
  'http://*.google.com.et/maps*',
  'http://*.google.gm/maps*',
  'http://*.google.com.gh/maps*',
  'http://*.google.co.ke/maps*',
  'http://*.google.co.ls/maps*',
  'http://*.google.com.ly/maps*',
  'http://*.google.mw/maps*',
  'http://*.google.mu/maps*',
  'http://*.google.co.ma/maps*',
  'http://*.google.com.na/maps*',
  'http://*.google.com.ng/maps*',
  'http://*.google.cg/maps*',
  'http://*.google.rw/maps*',
  'http://*.google.sh/maps*',
  'http://*.google.st/maps*',
  'http://*.google.sn/maps*',
  'http://*.google.sc/maps*',
  'http://*.google.co.za/maps*',
  'http://*.google.co.ug/maps*',
  'http://*.google.co.zm/maps*',
  'http://*.google.co.zw/maps*'
];

/**
 * matching patterns for Open Street Map
 * Note: include both https and http links in different lines
 * because safari won't accept '*://'
 */

injector.openStreetMap = [
  'https://*.openstreetmap.org/*',
  'http://*.openstreetmap.org/*'
];

/**
 * matching patterns for Bing Maps
 * Note: include both https and http links in different lines
 * because safari won't accept '*://'
 */

injector.bingMaps = [
  'http://*.bing.com/mapspreview*',
  'https://*.bing.com/mapspreview*',
];

/**
 * matching patterns for Here Maps
 * Note: include both https and http links in different lines
 * because safari won't accept '*://'
 */

injector.hereMaps = [
  'https://*.here.com/*',
  'http://*.here.com/*'
];

/**
 * matching patterns for Map Quest
 * Note: include both https and http links in different lines
 * because safari won't accept '*://'
 */

injector.mapQuest = [
  'https://*.mapquest.com/*',
  'http://*.mapquest.com/*'
];

/**
 * matching patterns for all map services
 */

injector.allMaps = injector.googleMaps;

injector.allMaps = injector.allMaps.concat(injector.openStreetMap,
                        injector.bingMaps,
                        injector.hereMaps,
                        injector.mapQuest);

/**
 * base URL of the extension in Safari
 */

injector.URL = safari.extension.baseURI;

/**
 * script in Vanilla JS to load Stylesheet (main.css)
 * Note: native addContentStyleSheetFromURL method
 * doesn't work for some reason
 */

injector.styleSheet = "var head  = document.getElementsByTagName('head')[0];" +
      "var link  = document.createElement('link');" +
      "link.rel  = 'stylesheet';" +
      "link.type = 'text/css';" +
      "link.href = safari.extension.baseURI + 'core/css/main.css';" +
      'head.appendChild(link);';

safari
  .extension
  .addContentScript(styleSheet, injector.allMaps, [], true);


/**
 * links to scripts that are common to all map services
 */

injector.commonScripts = [
  injector.URL + 'core/settings/SafariSettingsProvider.js',
  injector.URL + 'core/init.js',
  injector.URL + 'core/CarbonFootprintCore.js',
  injector.URL + 'core/helpers/SafariHelper.js'
];

for (var i in injector.commonScripts) {
  safari
    .extension
    .addContentScriptFromURL(injector.commonScripts[i],
                             injector.allMaps, [], true);
}

safari
  .extension
  .addContentScriptFromURL(injector.URL + 'core/maps/GoogleMapsManager.js',
                           injector.googleMaps, [], true);

safari
  .extension
  .addContentScriptFromURL(injector.URL + 'core/maps/OpenMapsManager.js',
                           injector.openStreetMap, [], true);

safari
  .extension
  .addContentScriptFromURL(injector.URL + 'core/maps/BingMapsManager.js',
                           injector.bingMaps, [], true);

safari
  .extension
  .addContentScriptFromURL(injector.URL + 'core/maps/HereMapsManager.js',
                           injector.hereMaps, [], true);

safari
  .extension
  .addContentScriptFromURL(injector.URL + 'core/maps/MapQuestMapsManager.js',
                           injector.mapQuest, [], true);
