/**
 * Fetch files.
 *
 * @author indeep-xyz
 * @version 0.1.2
 *
 * @class
 * @constructor
 * @example
 *
 * var fetcher = new SimplyFetch({
 *   prefix: 'sample/',
 *   callback: {
 *     successAll: function(dataArray) {
 *     },
 *   }
 * });
 *
 * @param {Object[]} options
 * @param {String} options[].prefix - the prefix of file urlSources for fetching
 * @param {String} options[].responseType - the property of XMLHttpRequest
 * @param [Object[]] options[].callback
 * @param {SimplyFetch~successCallback} options[].callback[].success - the function is called when a process of fetching a file succeeds
 * @param {SimplyFetch~successAllCallback} options[].callback[].successAll - the function is called when the all processes of fetching file succeed
 * @param {SimplyFetch~errorCallback} options[].callback[].error - the function is called when error occurs
 * @return {undefined}
 */
var SimplyFetch = function(options) {
  options = options || {};

  // options for loading
  this.prefix = options.prefix || '';
  this.responseType = options.responseType || 'text';

  // callback functions
  callback = options.callback || {};
  this.callback = {
    success: callback.success || function() {},
    successAll: callback.successAll || function() {},
    error: callback.error || function() {}
  };
};

/**
 * Callback after per file fetched.
 *
 * @callback SimplyFetch~successCallback
 * @param {String} aan URL source which has used to fetch
 * @param {String} fetched data
 */

/**
 * Callback after all files fetched.
 *
 * @callback SimplyFetch~successAllCallback
 * @param {Object<String>} several fetched data
 */

/**
 * Callback after per error occurred.
 *
 * @callback SimplyFetch~errorCallback
 * @param {String} an URL source which has used to fetch
 */

/**
 * Fetch files at each URLs which are
 * joined url sources and the prefix the instance has.
 *
 * @example
 *
 * fetcher.fetch([urlSource, urlSource]);
 *
 * @param {Array<String>} urlSources
 * @return {undefined}
 */
SimplyFetch.prototype.fetch = function(urlSources) {
  var self = this;
  var loaded = {
      data: {},
      count: 0
  }

  for (i = 0; i < urlSources.length; i++) {
    loadFile(urlSources[i]);
  }

  return;

  // - - - - - - - - - - - - - - - - - - - - -
  // private functions

  function loadFile(urlSource){
    var url = self.prefix + urlSource;
    var xhr = new XMLHttpRequest();

    var loadEventListener = xhr.addEventListener('load', function(event) {
      xhr.removeEventListener('load', loadEventListener);

      addData(urlSource, this.responseText);
      callbackSucceeded(urlSource);
      tryAllSucceeded();
    });

    xhr.responseType = self.responseType;
    xhr.open('GET', url, true);

    try {
      xhr.send();
    }
    catch (err) {
      xhr.removeEventListener('load', loadEventListener);
      console.error(err);

      raiseError(urlSource);
    }


    // - - - - - - - - - - - - - - - - - - - - -
    // private functions - in loadFile

    function addData(key, text) {
      loaded.data[key] = text;
      loaded.count++;
    }

    function callbackSucceeded(urlSource) {
      self.callback.success(urlSource, loaded.data[urlSource]);
    }

    function callbackAllSucceeded(){
      self.callback.successAll(loaded.data);
    }

    function raiseError(urlSource){
      self.callback.error(urlSource);
    }

    function tryAllSucceeded(){
      if (loaded.count >= urlSources.length) {
        callbackAllSucceeded();
      }
    }
  }
};