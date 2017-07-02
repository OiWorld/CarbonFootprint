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
    'http://*.google.ac/maps*',
    'http://*.google.ad/maps*',
    'http://*.google.ae/maps*',
    'http://*.google.al/maps*',
    'http://*.google.am/maps*',
    'http://*.google.as/maps*',
    'http://*.google.at/maps*',
    'http://*.google.az/maps*',
    'http://*.google.ba/maps*',
    'http://*.google.be/maps*',
    'http://*.google.bf/maps*',
    'http://*.google.bg/maps*',
    'http://*.google.bi/maps*',
    'http://*.google.bj/maps*',
    'http://*.google.bs/maps*',
    'http://*.google.bt/maps*',
    'http://*.google.by/maps*',
    'http://*.google.ca/maps*',
    'http://*.google.cat/maps*',
    'http://*.google.cc/maps*',
    'http://*.google.cd/maps*',
    'http://*.google.cf/maps*',
    'http://*.google.cg/maps*',
    'http://*.google.ch/maps*',
    'http://*.google.ci/maps*',
    'http://*.google.cl/maps*',
    'http://*.google.cm/maps*',
    'http://*.google.cn/maps*',
    'http://*.google.co.ao/maps*',
    'http://*.google.co.bw/maps*',
    'http://*.google.co.ck/maps*',
    'http://*.google.co.cr/maps*',
    'http://*.google.co.id/maps*',
    'http://*.google.co.il/maps*',
    'http://*.google.co.in/maps*',
    'http://*.google.co.jp/maps*',
    'http://*.google.co.ke/maps*',
    'http://*.google.co.kr/maps*',
    'http://*.google.co.ls/maps*',
    'http://*.google.co.ma/maps*',
    'http://*.google.co.mz/maps*',
    'http://*.google.co.nz/maps*',
    'http://*.google.co.th/maps*',
    'http://*.google.co.tz/maps*',
    'http://*.google.co.ug/maps*',
    'http://*.google.co.uk/maps*',
    'http://*.google.co.uz/maps*',
    'http://*.google.co.ve/maps*',
    'http://*.google.co.vi/maps*',
    'http://*.google.co.za/maps*',
    'http://*.google.co.zm/maps*',
    'http://*.google.co.zw/maps*',
    'http://*.google.com/maps*',
    'http://*.google.com.af/maps*',
    'http://*.google.com.ag/maps*',
    'http://*.google.com.ai/maps*',
    'http://*.google.com.ar/maps*',
    'http://*.google.com.au/maps*',
    'http://*.google.com.bd/maps*',
    'http://*.google.com.bh/maps*',
    'http://*.google.com.bn/maps*',
    'http://*.google.com.bo/maps*',
    'http://*.google.com.br/maps*',
    'http://*.google.com.bz/maps*',
    'http://*.google.com.co/maps*',
    'http://*.google.com.cu/maps*',
    'http://*.google.com.cy/maps*',
    'http://*.google.com.do/maps*',
    'http://*.google.com.ec/maps*',
    'http://*.google.com.eg/maps*',
    'http://*.google.com.et/maps*',
    'http://*.google.com.fj/maps*',
    'http://*.google.com.gh/maps*',
    'http://*.google.com.gi/maps*',
    'http://*.google.com.gt/maps*',
    'http://*.google.com.gy/maps*',
    'http://*.google.com.hk/maps*',
    'http://*.google.com.jm/maps*',
    'http://*.google.com.kh/maps*',
    'http://*.google.com.kw/maps*',
    'http://*.google.com.lb/maps*',
    'http://*.google.com.lc/maps*',
    'http://*.google.com.ly/maps*',
    'http://*.google.com.mm/maps*',
    'http://*.google.com.mt/maps*',
    'http://*.google.com.mx/maps*',
    'http://*.google.com.my/maps*',
    'http://*.google.com.na/maps*',
    'http://*.google.com.nf/maps*',
    'http://*.google.com.ng/maps*',
    'http://*.google.com.ni/maps*',
    'http://*.google.com.np/maps*',
    'http://*.google.com.om/maps*',
    'http://*.google.com.pa/maps*',
    'http://*.google.com.pe/maps*',
    'http://*.google.com.pg/maps*',
    'http://*.google.com.ph/maps*',
    'http://*.google.com.pk/maps*',
    'http://*.google.com.pr/maps*',
    'http://*.google.com.py/maps*',
    'http://*.google.com.qa/maps*',
    'http://*.google.com.sa/maps*',
    'http://*.google.com.sb/maps*',
    'http://*.google.com.sg/maps*',
    'http://*.google.com.sl/maps*',
    'http://*.google.com.sv/maps*',
    'http://*.google.com.tj/maps*',
    'http://*.google.com.tr/maps*',
    'http://*.google.com.tw/maps*',
    'http://*.google.com.ua/maps*',
    'http://*.google.com.uy/maps*',
    'http://*.google.com.vc/maps*',
    'http://*.google.com.vn/maps*',
    'http://*.google.cv/maps*',
    'http://*.google.cx/maps*',
    'http://*.google.cz/maps*',
    'http://*.google.de/maps*',
    'http://*.google.dj/maps*',
    'http://*.google.dk/maps*',
    'http://*.google.dm/maps*',
    'http://*.google.dz/maps*',
    'http://*.google.ee/maps*',
    'http://*.google.es/maps*',
    'http://*.google.eu/maps*',
    'http://*.google.fi/maps*',
    'http://*.google.fm/maps*',
    'http://*.google.fr/maps*',
    'http://*.google.ga/maps*',
    'http://*.google.ge/maps*',
    'http://*.google.gf/maps*',
    'http://*.google.gg/maps*',
    'http://*.google.gl/maps*',
    'http://*.google.gm/maps*',
    'http://*.google.gp/maps*',
    'http://*.google.gr/maps*',
    'http://*.google.gy/maps*',
    'http://*.google.hn/maps*',
    'http://*.google.hr/maps*',
    'http://*.google.ht/maps*',
    'http://*.google.hu/maps*',
    'http://*.google.ie/maps*',
    'http://*.google.im/maps*',
    'http://*.google.io/maps*',
    'http://*.google.iq/maps*',
    'http://*.google.is/maps*',
    'http://*.google.it/maps*',
    'http://*.google.it.ao/maps*',
    'http://*.google.je/maps*',
    'http://*.google.jo/maps*',
    'http://*.google.kg/maps*',
    'http://*.google.kh/maps*',
    'http://*.google.ki/maps*',
    'http://*.google.kz/maps*',
    'http://*.google.la/maps*',
    'http://*.google.li/maps*',
    'http://*.google.lk/maps*',
    'http://*.google.lt/maps*',
    'http://*.google.lu/maps*',
    'http://*.google.lv/maps*',
    'http://*.google.md/maps*',
    'http://*.google.me/maps*',
    'http://*.google.mg/maps*',
    'http://*.google.mk/maps*',
    'http://*.google.ml/maps*',
    'http://*.google.mn/maps*',
    'http://*.google.ms/maps*',
    'http://*.google.mt/maps*',
    'http://*.google.mu/maps*',
    'http://*.google.mv/maps*',
    'http://*.google.mw/maps*',
    'http://*.google.ne/maps*',
    'http://*.google.nf/maps*',
    'http://*.google.nl/maps*',
    'http://*.google.no/maps*',
    'http://*.google.nr/maps*',
    'http://*.google.nu/maps*',
    'http://*.google.pl/maps*',
    'http://*.google.pn/maps*',
    'http://*.google.ps/maps*',
    'http://*.google.pt/maps*',
    'http://*.google.ro/maps*',
    'http://*.google.rs/maps*',
    'http://*.google.ru/maps*',
    'http://*.google.rw/maps*',
    'http://*.google.sc/maps*',
    'http://*.google.se/maps*',
    'http://*.google.sh/maps*',
    'http://*.google.si/maps*',
    'http://*.google.sk/maps*',
    'http://*.google.sm/maps*',
    'http://*.google.sn/maps*',
    'http://*.google.so/maps*',
    'http://*.google.sr/maps*',
    'http://*.google.st/maps*',
    'http://*.google.td/maps*',
    'http://*.google.tg/maps*',
    'http://*.google.tk/maps*',
    'http://*.google.tl/maps*',
    'http://*.google.tm/maps*',
    'http://*.google.tn/maps*',
    'http://*.google.to/maps*',
    'http://*.google.tt/maps*',
    'http://*.google.vg/maps*',
    'http://*.google.vu/maps*',
    'http://*.google.ws/maps*',
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
 * matching patterns for Yandex Quest
 * Note: include both https and http links in different lines
 * because safari won't accept '*://'
 */

injector.yandexMaps = [
    'http://*.yandex.com/maps*',
    'http://*.yandex.ru/maps*',
    'https://*.yandex.com/maps*',
    'https://*.yandex.ru/maps*'
];

injector.wazeMaps = [
    'http://www.waze.com/livemap*'
];

/**
 * matching patterns for ViaMichelin maps
 * Note: include both https and http links in different lines
 * because safari won't accept '*://'
 */

injector.viaMichelinMaps = [
    'http://*.viamichelin.com/*',
    'https://*.viamichelin.com/*',
    'https://*.viamichelin.be/*',
    'http://*.viamichelin.be/*',
    'https://*.viamichelin.fr/*',
    'http://*.viamichelin.fr/*',
    'https://*.viamichelin.it/*',
    'http://*.viamichelin.it/*',
    'https://*.viamichelin.es/*',
    'http://*.viamichelin.es/*',
    'https://*.viamichelin.co.uk/*',
    'http://*.viamichelin.co.uk/*',
    'https://*.viamichelin.de/*',
    'http://*.viamichelin.de/*',
    'https://*.viamichelin.nl/*',
    'http://*.viamichelin.nl/*',
    'https://*.viamichelin.at/*',
    'http://*.viamichelin.at/*',
    'https://*.viamichelin.ch/*',
    'http://*.viamichelin.ch/*',
    'https://*.viamichelin.pl/*',
    'http://*.viamichelin.pl/*',
    'https://*.viamichelin.pt/*',
    'http://*.viamichelin.pt/*',
    'https://*.viamichelin.ie/*',
    'http://*.viamichelin.ie/*'
];

injector.cleartrip = [
     'https://www.cleartrip.com/flights/*'
];

injector.expedia = [
    'https://www.expedia.com/*',
    'https://www.expedia.ca/*',
    'https://www.expedia.co.in/*',
    'https://www.expedia.com.ar/*',
    'https://www.expedia.at/*',
    'https://www.expedia.com.au/*',
    'https://www.expedia.be/*',
    'https://www.expedia.com.br/*',
    'https://www.expedia.ch/*',
    'https://www.expedia.dk/*',
    'https://www.expedia.fi/*',
    'https://www.expedia.fr/*',
    'https://www.expedia.de/*',
    'https://www.expedia.com.hk/*',
    'https://www.expedia.co.id/*',
    'https://www.expedia.ie/*',
    'https://www.expedia.it/*',
    'https://www.expedia.co.jp/*',
    'https://www.expedia.co.kr/*',
    'https://www.expedia.com.my/*',
    'https://www.expedia.mx/*',
    'https://www.expedia.nl/*',
    'https://www.expedia.co.nz/*',
    'https://www.expedia.no/*',
    'https://www.expedia.com.ph/*',
    'https://www.expedia.com.sg/*',
    'https://www.expedia.es/*',
    'https://www.expedia.se/*',
    'https://www.expedia.com.tw/*',
    'https://www.expedia.co.th/*',
    'https://www.expedia.co.uk/*',
    'https://www.expedia.com/*',
    'https://www.expedia.com.vn/*',
    'https://www.expedia.cn/*'
];

injector.googleFlights = [
    'http://*.google.ac/flights*',
    'http://*.google.ad/flights*',
    'http://*.google.ae/flights*',
    'http://*.google.al/flights*',
    'http://*.google.am/flights*',
    'http://*.google.as/flights*',
    'http://*.google.at/flights*',
    'http://*.google.az/flights*',
    'http://*.google.ba/flights*',
    'http://*.google.be/flights*',
    'http://*.google.bf/flights*',
    'http://*.google.bg/flights*',
    'http://*.google.bi/flights*',
    'http://*.google.bj/flights*',
    'http://*.google.bs/flights*',
    'http://*.google.bt/flights*',
    'http://*.google.by/flights*',
    'http://*.google.ca/flights*',
    'http://*.google.cat/flights*',
    'http://*.google.cc/flights*',
    'http://*.google.cd/flights*',
    'http://*.google.cf/flights*',
    'http://*.google.cg/flights*',
    'http://*.google.ch/flights*',
    'http://*.google.ci/flights*',
    'http://*.google.cl/flights*',
    'http://*.google.cm/flights*',
    'http://*.google.cn/flights*',
    'http://*.google.co.ao/flights*',
    'http://*.google.co.bw/flights*',
    'http://*.google.co.ck/flights*',
    'http://*.google.co.cr/flights*',
    'http://*.google.co.id/flights*',
    'http://*.google.co.il/flights*',
    'http://*.google.co.in/flights*',
    'http://*.google.co.jp/flights*',
    'http://*.google.co.ke/flights*',
    'http://*.google.co.kr/flights*',
    'http://*.google.co.ls/flights*',
    'http://*.google.co.ma/flights*',
    'http://*.google.co.mz/flights*',
    'http://*.google.co.nz/flights*',
    'http://*.google.co.th/flights*',
    'http://*.google.co.tz/flights*',
    'http://*.google.co.ug/flights*',
    'http://*.google.co.uk/flights*',
    'http://*.google.co.uz/flights*',
    'http://*.google.co.ve/flights*',
    'http://*.google.co.vi/flights*',
    'http://*.google.co.za/flights*',
    'http://*.google.co.zm/flights*',
    'http://*.google.co.zw/flights*',
    'http://*.google.com/flights*',
    'http://*.google.com.af/flights*',
    'http://*.google.com.ag/flights*',
    'http://*.google.com.ai/flights*',
    'http://*.google.com.ar/flights*',
    'http://*.google.com.au/flights*',
    'http://*.google.com.bd/flights*',
    'http://*.google.com.bh/flights*',
    'http://*.google.com.bn/flights*',
    'http://*.google.com.bo/flights*',
    'http://*.google.com.br/flights*',
    'http://*.google.com.bz/flights*',
    'http://*.google.com.co/flights*',
    'http://*.google.com.cu/flights*',
    'http://*.google.com.cy/flights*',
    'http://*.google.com.do/flights*',
    'http://*.google.com.ec/flights*',
    'http://*.google.com.eg/flights*',
    'http://*.google.com.et/flights*',
    'http://*.google.com.fj/flights*',
    'http://*.google.com.gh/flights*',
    'http://*.google.com.gi/flights*',
    'http://*.google.com.gt/flights*',
    'http://*.google.com.gy/flights*',
    'http://*.google.com.hk/flights*',
    'http://*.google.com.jm/flights*',
    'http://*.google.com.kh/flights*',
    'http://*.google.com.kw/flights*',
    'http://*.google.com.lb/flights*',
    'http://*.google.com.lc/flights*',
    'http://*.google.com.ly/flights*',
    'http://*.google.com.mm/flights*',
    'http://*.google.com.mt/flights*',
    'http://*.google.com.mx/flights*',
    'http://*.google.com.my/flights*',
    'http://*.google.com.na/flights*',
    'http://*.google.com.nf/flights*',
    'http://*.google.com.ng/flights*',
    'http://*.google.com.ni/flights*',
    'http://*.google.com.np/flights*',
    'http://*.google.com.om/flights*',
    'http://*.google.com.pa/flights*',
    'http://*.google.com.pe/flights*',
    'http://*.google.com.pg/flights*',
    'http://*.google.com.ph/flights*',
    'http://*.google.com.pk/flights*',
    'http://*.google.com.pr/flights*',
    'http://*.google.com.py/flights*',
    'http://*.google.com.qa/flights*',
    'http://*.google.com.sa/flights*',
    'http://*.google.com.sb/flights*',
    'http://*.google.com.sg/flights*',
    'http://*.google.com.sl/flights*',
    'http://*.google.com.sv/flights*',
    'http://*.google.com.tj/flights*',
    'http://*.google.com.tr/flights*',
    'http://*.google.com.tw/flights*',
    'http://*.google.com.ua/flights*',
    'http://*.google.com.uy/flights*',
    'http://*.google.com.vc/flights*',
    'http://*.google.com.vn/flights*',
    'http://*.google.cv/flights*',
    'http://*.google.cx/flights*',
    'http://*.google.cz/flights*',
    'http://*.google.de/flights*',
    'http://*.google.dj/flights*',
    'http://*.google.dk/flights*',
    'http://*.google.dm/flights*',
    'http://*.google.dz/flights*',
    'http://*.google.ee/flights*',
    'http://*.google.es/flights*',
    'http://*.google.eu/flights*',
    'http://*.google.fi/flights*',
    'http://*.google.fm/flights*',
    'http://*.google.fr/flights*',
    'http://*.google.ga/flights*',
    'http://*.google.ge/flights*',
    'http://*.google.gf/flights*',
    'http://*.google.gg/flights*',
    'http://*.google.gl/flights*',
    'http://*.google.gm/flights*',
    'http://*.google.gp/flights*',
    'http://*.google.gr/flights*',
    'http://*.google.gy/flights*',
    'http://*.google.hn/flights*',
    'http://*.google.hr/flights*',
    'http://*.google.ht/flights*',
    'http://*.google.hu/flights*',
    'http://*.google.ie/flights*',
    'http://*.google.im/flights*',
    'http://*.google.io/flights*',
    'http://*.google.iq/flights*',
    'http://*.google.is/flights*',
    'http://*.google.it/flights*',
    'http://*.google.it.ao/flights*',
    'http://*.google.je/flights*',
    'http://*.google.jo/flights*',
    'http://*.google.kg/flights*',
    'http://*.google.kh/flights*',
    'http://*.google.ki/flights*',
    'http://*.google.kz/flights*',
    'http://*.google.la/flights*',
    'http://*.google.li/flights*',
    'http://*.google.lk/flights*',
    'http://*.google.lt/flights*',
    'http://*.google.lu/flights*',
    'http://*.google.lv/flights*',
    'http://*.google.md/flights*',
    'http://*.google.me/flights*',
    'http://*.google.mg/flights*',
    'http://*.google.mk/flights*',
    'http://*.google.ml/flights*',
    'http://*.google.mn/flights*',
    'http://*.google.ms/flights*',
    'http://*.google.mt/flights*',
    'http://*.google.mu/flights*',
    'http://*.google.mv/flights*',
    'http://*.google.mw/flights*',
    'http://*.google.ne/flights*',
    'http://*.google.nf/flights*',
    'http://*.google.nl/flights*',
    'http://*.google.no/flights*',
    'http://*.google.nr/flights*',
    'http://*.google.nu/flights*',
    'http://*.google.pl/flights*',
    'http://*.google.pn/flights*',
    'http://*.google.ps/flights*',
    'http://*.google.pt/flights*',
    'http://*.google.ro/flights*',
    'http://*.google.rs/flights*',
    'http://*.google.ru/flights*',
    'http://*.google.rw/flights*',
    'http://*.google.sc/flights*',
    'http://*.google.se/flights*',
    'http://*.google.sh/flights*',
    'http://*.google.si/flights*',
    'http://*.google.sk/flights*',
    'http://*.google.sm/flights*',
    'http://*.google.sn/flights*',
    'http://*.google.so/flights*',
    'http://*.google.sr/flights*',
    'http://*.google.st/flights*',
    'http://*.google.td/flights*',
    'http://*.google.tg/flights*',
    'http://*.google.tk/flights*',
    'http://*.google.tl/flights*',
    'http://*.google.tm/flights*',
    'http://*.google.tn/flights*',
    'http://*.google.to/flights*',
    'http://*.google.tt/flights*',
    'http://*.google.vg/flights*',
    'http://*.google.vu/flights*',
    'http://*.google.ws/flights*',
    'https://*.google.ac/flights*',
    'https://*.google.ad/flights*',
    'https://*.google.ae/flights*',
    'https://*.google.al/flights*',
    'https://*.google.am/flights*',
    'https://*.google.as/flights*',
    'https://*.google.at/flights*',
    'https://*.google.az/flights*',
    'https://*.google.ba/flights*',
    'https://*.google.be/flights*',
    'https://*.google.bf/flights*',
    'https://*.google.bg/flights*',
    'https://*.google.bi/flights*',
    'https://*.google.bj/flights*',
    'https://*.google.bs/flights*',
    'https://*.google.bt/flights*',
    'https://*.google.by/flights*',
    'https://*.google.ca/flights*',
    'https://*.google.cat/flights*',
    'https://*.google.cc/flights*',
    'https://*.google.cd/flights*',
    'https://*.google.cf/flights*',
    'https://*.google.cg/flights*',
    'https://*.google.ch/flights*',
    'https://*.google.ci/flights*',
    'https://*.google.cl/flights*',
    'https://*.google.cm/flights*',
    'https://*.google.cn/flights*',
    'https://*.google.co.ao/flights*',
    'https://*.google.co.bw/flights*',
    'https://*.google.co.ck/flights*',
    'https://*.google.co.cr/flights*',
    'https://*.google.co.id/flights*',
    'https://*.google.co.il/flights*',
    'https://*.google.co.in/flights*',
    'https://*.google.co.jp/flights*',
    'https://*.google.co.ke/flights*',
    'https://*.google.co.kr/flights*',
    'https://*.google.co.ls/flights*',
    'https://*.google.co.ma/flights*',
    'https://*.google.co.mz/flights*',
    'https://*.google.co.nz/flights*',
    'https://*.google.co.th/flights*',
    'https://*.google.co.tz/flights*',
    'https://*.google.co.ug/flights*',
    'https://*.google.co.uk/flights*',
    'https://*.google.co.uz/flights*',
    'https://*.google.co.ve/flights*',
    'https://*.google.co.vi/flights*',
    'https://*.google.co.za/flights*',
    'https://*.google.co.zm/flights*',
    'https://*.google.co.zw/flights*',
    'https://*.google.com/flights*',
    'https://*.google.com.af/flights*',
    'https://*.google.com.ag/flights*',
    'https://*.google.com.ai/flights*',
    'https://*.google.com.ar/flights*',
    'https://*.google.com.au/flights*',
    'https://*.google.com.bd/flights*',
    'https://*.google.com.bh/flights*',
    'https://*.google.com.bn/flights*',
    'https://*.google.com.bo/flights*',
    'https://*.google.com.br/flights*',
    'https://*.google.com.bz/flights*',
    'https://*.google.com.co/flights*',
    'https://*.google.com.cu/flights*',
    'https://*.google.com.cy/flights*',
    'https://*.google.com.do/flights*',
    'https://*.google.com.ec/flights*',
    'https://*.google.com.eg/flights*',
    'https://*.google.com.et/flights*',
    'https://*.google.com.fj/flights*',
    'https://*.google.com.gh/flights*',
    'https://*.google.com.gi/flights*',
    'https://*.google.com.gt/flights*',
    'https://*.google.com.gy/flights*',
    'https://*.google.com.hk/flights*',
    'https://*.google.com.jm/flights*',
    'https://*.google.com.kh/flights*',
    'https://*.google.com.kw/flights*',
    'https://*.google.com.lb/flights*',
    'https://*.google.com.lc/flights*',
    'https://*.google.com.ly/flights*',
    'https://*.google.com.mm/flights*',
    'https://*.google.com.mt/flights*',
    'https://*.google.com.mx/flights*',
    'https://*.google.com.my/flights*',
    'https://*.google.com.na/flights*',
    'https://*.google.com.nf/flights*',
    'https://*.google.com.ng/flights*',
    'https://*.google.com.ni/flights*',
    'https://*.google.com.np/flights*',
    'https://*.google.com.om/flights*',
    'https://*.google.com.pa/flights*',
    'https://*.google.com.pe/flights*',
    'https://*.google.com.pg/flights*',
    'https://*.google.com.ph/flights*',
    'https://*.google.com.pk/flights*',
    'https://*.google.com.pr/flights*',
    'https://*.google.com.py/flights*',
    'https://*.google.com.qa/flights*',
    'https://*.google.com.sa/flights*',
    'https://*.google.com.sb/flights*',
    'https://*.google.com.sg/flights*',
    'https://*.google.com.sl/flights*',
    'https://*.google.com.sv/flights*',
    'https://*.google.com.tj/flights*',
    'https://*.google.com.tr/flights*',
    'https://*.google.com.tw/flights*',
    'https://*.google.com.ua/flights*',
    'https://*.google.com.uy/flights*',
    'https://*.google.com.vc/flights*',
    'https://*.google.com.vn/flights*',
    'https://*.google.cv/flights*',
    'https://*.google.cx/flights*',
    'https://*.google.cz/flights*',
    'https://*.google.de/flights*',
    'https://*.google.dj/flights*',
    'https://*.google.dk/flights*',
    'https://*.google.dm/flights*',
    'https://*.google.dz/flights*',
    'https://*.google.ee/flights*',
    'https://*.google.es/flights*',
    'https://*.google.eu/flights*',
    'https://*.google.fi/flights*',
    'https://*.google.fm/flights*',
    'https://*.google.fr/flights*',
    'https://*.google.ga/flights*',
    'https://*.google.ge/flights*',
    'https://*.google.gf/flights*',
    'https://*.google.gg/flights*',
    'https://*.google.gl/flights*',
    'https://*.google.gm/flights*',
    'https://*.google.gp/flights*',
    'https://*.google.gr/flights*',
    'https://*.google.gy/flights*',
    'https://*.google.hn/flights*',
    'https://*.google.hr/flights*',
    'https://*.google.ht/flights*',
    'https://*.google.hu/flights*',
    'https://*.google.ie/flights*',
    'https://*.google.im/flights*',
    'https://*.google.io/flights*',
    'https://*.google.iq/flights*',
    'https://*.google.is/flights*',
    'https://*.google.it/flights*',
    'https://*.google.it.ao/flights*',
    'https://*.google.je/flights*',
    'https://*.google.jo/flights*',
    'https://*.google.kg/flights*',
    'https://*.google.kh/flights*',
    'https://*.google.ki/flights*',
    'https://*.google.kz/flights*',
    'https://*.google.la/flights*',
    'https://*.google.li/flights*',
    'https://*.google.lk/flights*',
    'https://*.google.lt/flights*',
    'https://*.google.lu/flights*',
    'https://*.google.lv/flights*',
    'https://*.google.md/flights*',
    'https://*.google.me/flights*',
    'https://*.google.mg/flights*',
    'https://*.google.mk/flights*',
    'https://*.google.ml/flights*',
    'https://*.google.mn/flights*',
    'https://*.google.ms/flights*',
    'https://*.google.mt/flights*',
    'https://*.google.mu/flights*',
    'https://*.google.mv/flights*',
    'https://*.google.mw/flights*',
    'https://*.google.ne/flights*',
    'https://*.google.nf/flights*',
    'https://*.google.nl/flights*',
    'https://*.google.no/flights*',
    'https://*.google.nr/flights*',
    'https://*.google.nu/flights*',
    'https://*.google.pl/flights*',
    'https://*.google.pn/flights*',
    'https://*.google.ps/flights*',
    'https://*.google.pt/flights*',
    'https://*.google.ro/flights*',
    'https://*.google.rs/flights*',
    'https://*.google.ru/flights*',
    'https://*.google.rw/flights*',
    'https://*.google.sc/flights*',
    'https://*.google.se/flights*',
    'https://*.google.sh/flights*',
    'https://*.google.si/flights*',
    'https://*.google.sk/flights*',
    'https://*.google.sm/flights*',
    'https://*.google.sn/flights*',
    'https://*.google.so/flights*',
    'https://*.google.sr/flights*',
    'https://*.google.st/flights*',
    'https://*.google.td/flights*',
    'https://*.google.tg/flights*',
    'https://*.google.tk/flights*',
    'https://*.google.tl/flights*',
    'https://*.google.tm/flights*',
    'https://*.google.tn/flights*',
    'https://*.google.to/flights',
    'https://*.google.tt/flights*',
    'https://*.google.vg/flights*',
    'https://*.google.vu/flights*',
    'https://*.google.ws/flights*'
];

injector.hipmunk = [
    'https://www.hipmunk.com/*'
];

injector.kayak = [
    'https://www.ca.kayak.com/flights/*',
    'https://www.kayak.es/flights/*',
    'https://www.kayak.com/flights/*',
    'https://www.kayak.co.in/flights/*',
    'https://www.kayak.co.uk/flights/*',
    'https://www.kayak.de/flights/*',
    'https://www.kayak.co.au/flight*',
    'https://www.kayak.ie/flights/*',
    'https://www.kayak.co.jp/flights/*'
];

injector.makemytrip = [
    'https://www.makemytrip.com/air/*'
];

injector.priceline = [
    'https://www.skyscanner.co.in/transport/flights/*',
    'https://www.skyscanner.com/transport/flights/*',
    'https://www.skyscanner.net/transport/flights/*',
    'https://www.skyscanner.com.au/transport/flights/*',
    'https://www.skyscanner.co.id/transport/flights/*',
    'https://www.espanol.skyscanner.com/transport/flights/*',
    'https://www.skyscanner.ru/transport/flights/*',
    'https://www.skyscanner.co.kr/transport/flights/*',
    'https://www.skyscanner.jp/transport/flights/*',
    'https://www.skyscanner.com.sg/transport/flights/*',
    'https://www.skyscanner.co.th/transport/flights/*',
    'https://www.skyscanner.com.vn/transport/flights/*',
    'https://www.skyscanner.com.my/transport/flights/*',
    'https://www.skyscanner.com.ph/transport/flights/*',
    'https://www.skyscanner.com.tr/transport/flights/*',
    'https://www.skyscanner.com.ph/transport/flights/*'
];

injector.skyscanner = [
    'https://www.priceline.com/m/fly/*'
];

injector.travelocity = [
    'https://www.travelocity.com/*'
];

injector.eurostar = [
    'https://booking.eurostar.com/*/train-search/standard*'
];

injector.ouigo = [
    'https://ventes.ouigo.com/Schedule/Select*'
];

injector.tgvlyria = [
    'https://www.tgv-lyria.com/en/booking/timetables-and-fares/timetables*'
];

injector.voyages = [
    'https://en.voyages-sncf.com/en/results*'
];

/**
 * matching patterns for all map services
 */

injector.allMaps = [];

injector.allMaps = injector.allMaps.concat(injector.bingMaps,
                                           injector.googleMaps,
                                           injector.hereMaps,
                                           injector.mapQuest,
                                           injector.openStreetMap,
                                           injector.viaMichelinMaps,
                                           injector.wazeMaps,
                                           injector.yandexMaps
);

/**
 * matching patterns for all flight services
 */

injector.allFlights = [];

injector.allFlights = injector.allFlights.concat(injector.cleartrip,
                                                 injector.expedia,
                                                 injector.googleFlights,
                                                 injector.hipmunk,
                                                 injector.kayak,
                                                 injector.makemytrip,
                                                 injector.priceline,
                                                 injector.skyscanner,
                                                 injector.travelocity
);

/**
 * matching patterns for all train services
 */

injector.allTrains = [];

injector.allTrains = injector.allTrains.concat(injector.eurostar,
                                               injector.ouigo,
                                               injector.tgvlyria,
                                               injector.voyages
);

/**
 * base URL of the extension in Safari
 */

injector.URL = safari.extension.baseURI;

/**
 * legacy method: script in Vanilla JS to load Stylesheet (main.css)

injector.styleSheetMain = 'var head  = document.getElementsByTagName(\'head\')[0];' +
    'var link  = document.createElement(\'link\');' +
    'link.rel  = \'stylesheet\';' +
    'link.type = \'text/css\';' +
    'link.href = safari.extension.baseURI + \'core/css/main.css\';' +
  'head.appendChild(link);';

safari
  .extension
  .addContentScript(injector.styleSheetMain, injector.allMaps, [], true);

injector.styleSheetFlight = 'var head  = document.getElementsByTagName(\'head\')[0];' +
    'var link  = document.createElement(\'link\');' +
    'link.rel  = \'stylesheet\';' +
    'link.type = \'text/css\';' +
    'link.href = safari.extension.baseURI + \'core/css/flights.css\';' +
    'head.appendChild(link);';

safari
  .extension
  .addContentScript(injector.styleSheetFlight, injector.allFlights, [], true);*/

injector.styleSheetMain = injector.URL + 'core/css/main.css';

safari
  .extension
  .addContentStyleSheetFromURL(injector.styleSheetMain,
                               injector.allMaps, [], true);

injector.styleSheetFlight = injector.URL + 'core/css/flights.css';

safari
  .extension
  .addContentStyleSheetFromURL(injector.styleSheetFlight,
                               injector.allFlights, [], true);

/**
 * links to manager script for different services
 */

injector.allMapManagers = [
    injector.URL + 'core/maps/BingMapsManager.js',
    injector.URL + 'core/maps/GoogleMapsManager.js',
    injector.URL + 'core/maps/HereMapsManager.js',
    injector.URL + 'core/maps/MapQuestMapsManager.js',
    injector.URL + 'core/maps/OpenMapsManager.js',
    injector.URL + 'core/maps/ViaMichelinMapsManager.js',
    injector.URL + 'core/maps/WazeMapsManager.js',
    injector.URL + 'core/maps/YandexMapsManager.js'
];

injector.allFlightManagers = [
    injector.URL + 'core/flights/cleatrip.js',
    injector.URL + 'core/flights/expedia.js',
    injector.URL + 'core/flights/googleflights.js',
    injector.URL + 'core/flights/hipmunk.js',
    injector.URL + 'core/flights/kayak.js',
    injector.URL + 'core/flights/makemytrip.js',
    injector.URL + 'core/flights/priceline.js',
    injector.URL + 'core/flights/skyscanner.js',
    injector.URL + 'core/flights/travelocity.js'
];

injector.allTrainManagers = [
    injector.URL + 'core/trains/eurostar.js',
    injector.URL + 'core/trains/ouigo.js',
    injector.URL + 'core/trains/tgv-lyria.js',
    injector.URL + 'core/trains/voyages-sncf.js'
];

/**
 * Matching URLs for different services
 */

injector.allMapURLs = [
    injector.bingMaps,
    injector.googleMaps,
    injector.hereMaps,
    injector.mapQuest,
    injector.openStreetMap,
    injector.viaMichelinMaps,
    injector.wazeMaps,
    injector.yandexMaps
];

injector.allFlightURLs = [
    injector.cleartrip,
    injector.expedia,
    injector.googleFlights,
    injector.hipmunk,
    injector.kayak,
    injector.makemytrip,
    injector.priceline,
    injector.skyscanner,
    injector.travelocity
];

injector.allTrainURLs = [
    injector.eurostar,
    injector.ouigo,
    injector.tgvlyria,
    injector.voyages
];

/**
 * links safari to different map services
 */

for(injector.i in injector.allMapURLs){
    safari.
        extension.
        addContentScriptFromURL(injector.allMapManagers[injector.i],
                                 injector.allMapURLs[injector.i], [], true);
}

/**
 * links safari to different flight services
 */

for(injector.i in injector.allFlightURLs){
    safari.
        extension.
        addContentScriptFromURL(injector.allFlightManagers[injector.i],
                                injector.allFlightURLs[injector.i], [], true);
}


/**
 * links safari to different train services
 */

for(injector.i in injector.allTrainURLs){
    safari.
        extension.
        addContentScriptFromURL(injector.allTrainManagers[injector.i],
                                injector.allTrainURLs[injector.i], [], true);
}

/**
 * links to scripts that are common to all services
 */

injector.commonScripts = [
    injector.URL + 'core/SettingsProviderCore.js',
    injector.URL + 'core/settings/SafariSettingsProvider.js',
    injector.URL + 'core/helpers/SafariHelper.js',
    injector.URL + 'core/validator/basicValidator.js',
    injector.URL + 'core/validator/validatorServer.js'
];

/**
 * links to scripts that are common to all map services
 */

injector.commonScriptsMaps = injector.commonScripts.concat([
  injector.URL + 'core/CarbonFootprintCore.js',
  injector.URL + 'core/init.js',
  injector.URL + 'core/validator/mapsValidator.js'
]);

/**
 * links to scripts that are common to all flight services
 */

injector.commonScriptsFlights = injector.commonScripts.concat([
  injector.URL + 'core/FlightsFootprintCore.js',
  injector.URL + 'core/helpers/flightDataHelper.js',
  injector.URL + 'core/initFlight.js',
  injector.URL + 'core/validator/flightsValidator.js'
]);

/**
 * links to scripts that are common to all train services
 */

injector.commonScriptsTrains = injector.commonScripts.concat([
  injector.URL + 'core/TrainsFootprintCore.js',
  injector.URL + 'core/initTrain.js',
  injector.URL + 'core/validator/trainsValidator.js'
]);

for(injector.i in injector.commonScriptsMaps){
  safari
    .extension
    .addContentScriptFromURL(injector.commonScriptsMaps[injector.i],
                             injector.allMaps, [], true);
}

for(injector.i in injector.commonScriptsFlights){
  safari
    .extension
    .addContentScriptFromURL(injector.commonScriptsFlights[injector.i],
                            injector.allFlights, [], true);
}

for(injector.i in injector.commonScriptsTrains){
  safari
    .extension
    .addContentScriptFromURL(injector.commonScriptsTrains[injector.i],
                            injector.allTrains, [], true);
}
