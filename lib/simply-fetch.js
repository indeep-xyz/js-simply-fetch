/**
 * Fetch files.
 *
 * @author indeep-xyz
 * @version 0.1.2
 *
 * @class
 * @constructor
 *
 *
 *
 * @example
 *
 * // Fetch files and the callback runs after all files are successfully loaded.
 * var fetcher = new SimplyFetch({
 *   prefix: 'sample/',
 *   callback: {
 *     successAll: function(dataArray) {
 *     },
 *   }
 * });
 *
 * fetcher.fetch(['filename1', 'filename2']);
 *
 *
 *
 * @example
 *
 * // Fetch files and the callback runs when per file is successfully loaded.
 * var fetcher = new SimplyFetch({
 *   prefix: 'sample/',
 *   callback: {
 *     success: function(key, data) {
 *       console.log(key, data);
 *     },
 *   }
 * });
 *
 * fetcher.fetch(['filename1', 'filename2']);
 *
 *
 *
 * @example
 *
 * // Try fetching files, and then the callbacks run when per file is successfully loaded or per file is failed.
 * var fetcher = new SimplyFetch({
 *   prefix: 'sample/',
 *   callback: {
 *     success: function(key, data) {
 *       console.log(key, data);
 *     },
 *     error: function(key) {
 *       console.log(key + " failed");
 *     },
 *   }
 * });
 *
 * fetcher.fetch(['filename1', '__NOT_FOUND__']);
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
 * Callback when per file fetched.
 *
 * @callback SimplyFetch~successCallback
 * @param {String} A filename of an array passed to SimplyFetch#fetch.
 * @param {String} The result of fetching.
 */

/**
 * Callback after all files fetched.
 *
 * @callback SimplyFetch~successAllCallback
 * @param {Object<String>}
 *   An object which has the key name based on filename of an array passed to SimplyFetch#fetch.
 *   The result of fetching is kept at the place of each key name.
 */

/**
 * Callback when per error occurred.
 *
 * @callback SimplyFetch~errorCallback
 * @param {String} A filename of an array passed to SimplyFetch#fetch.
 */

/**
 * Fetch file data from URLs.
 * The URLs are made from the argument "urlSource"
 * and the property "prefix" of an instance.
 *
 * @public
 * @since 0.1.0
 *
 * @example
 * fetcher.fetch([urlSource, urlSource]);
 *
 * @param {Array<String>} urlSources - An array including parts of URL. It joins with the property "prefix" of an instance.
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

    /**
     * Add the loaded data into the stock variable.
     *
     * @private
     * @since 0.1.0
     *
     * @param {String} key - the URL source passed to SimplyFetch#fetch
     * @param {String} text - the result of fetching
     */
    function addData(key, text) {
      loaded.data[key] = text;
      loaded.count++;
    }

    /**
     * Run the callback of an instance when per fetching file succeeds.
     *
     * @private
     * @since 0.1.0
     *
     * @param {String} key - the URL source passed to SimplyFetch#fetch
     */
    function callbackSucceeded(key) {
      self.callback.success(key, loaded.data[key]);
    }

    /**
     * Run the callback of an instance after all fetching files succeed.
     *
     * @private
     * @since 0.1.0
     */
    function callbackAllSucceeded(){
      self.callback.successAll(loaded.data);
    }

    /**
     * Raise the error callback of an instance.
     *
     * @private
     * @since 0.1.2
     *
     * @param {String} key - the URL source passed to SimplyFetch#fetch
     * @return {undefined}
     */
    function raiseError(key){
      self.callback.error(key);
    }

    /**
     * Check whether the fetching task is succeeded all,
     * run the particular callback if it passes.
     *
     * @private
     * @since 0.1.0
     */
    function tryAllSucceeded(){
      if (loaded.count >= urlSources.length) {
        callbackAllSucceeded();
      }
    }
  }
};