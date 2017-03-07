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
    'https://*.google.ac/maps*',
    'https://*.google.ad/maps*',
    'https://*.google.ae/maps*',
    'https://*.google.al/maps*',
    'https://*.google.am/maps*',
    'https://*.google.as/maps*',
    'https://*.google.at/maps*',
    'https://*.google.az/maps*',
    'https://*.google.ba/maps*',
    'https://*.google.be/maps*',
    'https://*.google.bf/maps*',
    'https://*.google.bg/maps*',
    'https://*.google.bi/maps*',
    'https://*.google.bj/maps*',
    'https://*.google.bs/maps*',
    'https://*.google.bt/maps*',
    'https://*.google.by/maps*',
    'https://*.google.ca/maps*',
    'https://*.google.cat/maps*',
    'https://*.google.cc/maps*',
    'https://*.google.cd/maps*',
    'https://*.google.cf/maps*',
    'https://*.google.cg/maps*',
    'https://*.google.ch/maps*',
    'https://*.google.ci/maps*',
    'https://*.google.cl/maps*',
    'https://*.google.cm/maps*',
    'https://*.google.cn/maps*',
    'https://*.google.co.ao/maps*',
    'https://*.google.co.bw/maps*',
    'https://*.google.co.ck/maps*',
    'https://*.google.co.cr/maps*',
    'https://*.google.co.id/maps*',
    'https://*.google.co.il/maps*',
    'https://*.google.co.in/maps*',
    'https://*.google.co.jp/maps*',
    'https://*.google.co.ke/maps*',
    'https://*.google.co.kr/maps*',
    'https://*.google.co.ls/maps*',
    'https://*.google.co.ma/maps*',
    'https://*.google.co.mz/maps*',
    'https://*.google.co.nz/maps*',
    'https://*.google.co.th/maps*',
    'https://*.google.co.tz/maps*',
    'https://*.google.co.ug/maps*',
    'https://*.google.co.uk/maps*',
    'https://*.google.co.uz/maps*',
    'https://*.google.co.ve/maps*',
    'https://*.google.co.vi/maps*',
    'https://*.google.co.za/maps*',
    'https://*.google.co.zm/maps*',
    'https://*.google.co.zw/maps*',
    'https://*.google.com/maps*',
    'https://*.google.com.af/maps*',
    'https://*.google.com.ag/maps*',
    'https://*.google.com.ai/maps*',
    'https://*.google.com.ar/maps*',
    'https://*.google.com.au/maps*',
    'https://*.google.com.bd/maps*',
    'https://*.google.com.bh/maps*',
    'https://*.google.com.bn/maps*',
    'https://*.google.com.bo/maps*',
    'https://*.google.com.br/maps*',
    'https://*.google.com.bz/maps*',
    'https://*.google.com.co/maps*',
    'https://*.google.com.cu/maps*',
    'https://*.google.com.cy/maps*',
    'https://*.google.com.do/maps*',
    'https://*.google.com.ec/maps*',
    'https://*.google.com.eg/maps*',
    'https://*.google.com.et/maps*',
    'https://*.google.com.fj/maps*',
    'https://*.google.com.gh/maps*',
    'https://*.google.com.gi/maps*',
    'https://*.google.com.gt/maps*',
    'https://*.google.com.gy/maps*',
    'https://*.google.com.hk/maps*',
    'https://*.google.com.jm/maps*',
    'https://*.google.com.kh/maps*',
    'https://*.google.com.kw/maps*',
    'https://*.google.com.lb/maps*',
    'https://*.google.com.lc/maps*',
    'https://*.google.com.ly/maps*',
    'https://*.google.com.mm/maps*',
    'https://*.google.com.mt/maps*',
    'https://*.google.com.mx/maps*',
    'https://*.google.com.my/maps*',
    'https://*.google.com.na/maps*',
    'https://*.google.com.nf/maps*',
    'https://*.google.com.ng/maps*',
    'https://*.google.com.ni/maps*',
    'https://*.google.com.np/maps*',
    'https://*.google.com.om/maps*',
    'https://*.google.com.pa/maps*',
    'https://*.google.com.pe/maps*',
    'https://*.google.com.pg/maps*',
    'https://*.google.com.ph/maps*',
    'https://*.google.com.pk/maps*',
    'https://*.google.com.pr/maps*',
    'https://*.google.com.py/maps*',
    'https://*.google.com.qa/maps*',
    'https://*.google.com.sa/maps*',
    'https://*.google.com.sb/maps*',
    'https://*.google.com.sg/maps*',
    'https://*.google.com.sl/maps*',
    'https://*.google.com.sv/maps*',
    'https://*.google.com.tj/maps*',
    'https://*.google.com.tr/maps*',
    'https://*.google.com.tw/maps*',
    'https://*.google.com.ua/maps*',
    'https://*.google.com.uy/maps*',
    'https://*.google.com.vc/maps*',
    'https://*.google.com.vn/maps*',
    'https://*.google.cv/maps*',
    'https://*.google.cx/maps*',
    'https://*.google.cz/maps*',
    'https://*.google.de/maps*',
    'https://*.google.dj/maps*',
    'https://*.google.dk/maps*',
    'https://*.google.dm/maps*',
    'https://*.google.dz/maps*',
    'https://*.google.ee/maps*',
    'https://*.google.es/maps*',
    'https://*.google.eu/maps*',
    'https://*.google.fi/maps*',
    'https://*.google.fm/maps*',
    'https://*.google.fr/maps*',
    'https://*.google.ga/maps*',
    'https://*.google.ge/maps*',
    'https://*.google.gf/maps*',
    'https://*.google.gg/maps*',
    'https://*.google.gl/maps*',
    'https://*.google.gm/maps*',
    'https://*.google.gp/maps*',
    'https://*.google.gr/maps*',
    'https://*.google.gy/maps*',
    'https://*.google.hn/maps*',
    'https://*.google.hr/maps*',
    'https://*.google.ht/maps*',
    'https://*.google.hu/maps*',
    'https://*.google.ie/maps*',
    'https://*.google.im/maps*',
    'https://*.google.io/maps*',
    'https://*.google.iq/maps*',
    'https://*.google.is/maps*',
    'https://*.google.it/maps*',
    'https://*.google.it.ao/maps*',
    'https://*.google.je/maps*',
    'https://*.google.jo/maps*',
    'https://*.google.kg/maps*',
    'https://*.google.kh/maps*',
    'https://*.google.ki/maps*',
    'https://*.google.kz/maps*',
    'https://*.google.la/maps*',
    'https://*.google.li/maps*',
    'https://*.google.lk/maps*',
    'https://*.google.lt/maps*',
    'https://*.google.lu/maps*',
    'https://*.google.lv/maps*',
    'https://*.google.md/maps*',
    'https://*.google.me/maps*',
    'https://*.google.mg/maps*',
    'https://*.google.mk/maps*',
    'https://*.google.ml/maps*',
    'https://*.google.mn/maps*',
    'https://*.google.ms/maps*',
    'https://*.google.mt/maps*',
    'https://*.google.mu/maps*',
    'https://*.google.mv/maps*',
    'https://*.google.mw/maps*',
    'https://*.google.ne/maps*',
    'https://*.google.nf/maps*',
    'https://*.google.nl/maps*',
    'https://*.google.no/maps*',
    'https://*.google.nr/maps*',
    'https://*.google.nu/maps*',
    'https://*.google.pl/maps*',
    'https://*.google.pn/maps*',
    'https://*.google.ps/maps*',
    'https://*.google.pt/maps*',
    'https://*.google.ro/maps*',
    'https://*.google.rs/maps*',
    'https://*.google.ru/maps*',
    'https://*.google.rw/maps*',
    'https://*.google.sc/maps*',
    'https://*.google.se/maps*',
    'https://*.google.sh/maps*',
    'https://*.google.si/maps*',
    'https://*.google.sk/maps*',
    'https://*.google.sm/maps*',
    'https://*.google.sn/maps*',
    'https://*.google.so/maps*',
    'https://*.google.sr/maps*',
    'https://*.google.st/maps*',
    'https://*.google.td/maps*',
    'https://*.google.tg/maps*',
    'https://*.google.tk/maps*',
    'https://*.google.tl/maps*',
    'https://*.google.tm/maps*',
    'https://*.google.tn/maps*',
    'https://*.google.to/maps*',
    'https://*.google.tt/maps*',
    'https://*.google.vg/maps*',
    'https://*.google.vu/maps*',
    'https://*.google.ws/maps*'
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
    'https://*.bing.com/maps*',
    'http://*.bing.com/maps*'
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
    .addContentScript(injector.styleSheet, injector.allMaps, [], true);


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
