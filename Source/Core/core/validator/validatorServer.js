/**
 * Server namespace.
 * @constructor
 */
 var Server = function(){
   Raven.config('https://e21c0743051946a899ed8d6680d1c58c@sentry.io/185232').install();
 };

/**
 * Send error report to server
 * @param {string} website
 * @param {string} error
 */

 Server.prototype.error = function(website, error){
   console.error(error + " on " + website);
   Raven.captureMessage(error, {
     extra: {
       website: website,
     }
   });
 };
