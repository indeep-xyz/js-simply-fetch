(function(){
  var loadedListener = window.addEventListener('DOMContentLoaded', initHtmlElements);
  var fileNames = ['lorem1', 'lorem2'];

  // - - - - - - - - - - - - - - - -
  // initialize

  function initHtmlElements(event){
    window.removeEventListener('DOMContentLoaded', loadedListener);

    initFetchButton1();
    initFetchButton2();
    initErrorableFetchButton();
    initClearButton();

    // - - - - - - - - - - - - - - - -
    // parivate functions - in initHtmlElements

    function initClearButton () {
      addEvent('clear', 'click', clearTextarea);

      // - - - - - - - - - - - - - - - -
      // parivate functions - in initClearButton

      function clearTextarea() {
        var textarea = document.querySelectorAll('#data textarea');
        for (var i = 0; i < textarea.length; i++ ){
          textarea[i].value = '';
        }
      }
    }

    function initFetchButton1 () {
      addEvent('fetch-1', 'click', fetchSamples);

      // - - - - - - - - - - - - - - - -
      // parivate functions - in initFetchButton1

      function fetchSamples() {
        var fetcher = new SimplyFetch({
            prefix: 'sample/',
            callback: {
              successAll: afterAllSucceeded
            }
        });

        fetcher.fetch(fileNames);
      }

      function afterAllSucceeded(data) {
        console.log("all loaded");

        for (var key in data){
          updateTextarea(key, data[key]);
        }
      }
    }

    function initFetchButton2 () {
      addEvent('fetch-2', 'click', fetchSamples);

      // - - - - - - - - - - - - - - - -
      // parivate functions - in initFetchButton2

      function fetchSamples() {
        var fetcher = new SimplyFetch({
            prefix: 'sample/',
            callback: {
              success: afterSucceeded
            }
        });

        fetcher.fetch(fileNames);
      }

      function afterSucceeded(key, data) {
        console.log("%s loaded", key);

        updateTextarea(key, data);
      }
    }

    function initErrorableFetchButton () {
      var fileNames = ['lorem1', 'lorem-non-existent'];
      addEvent('fetch-errorable', 'click', fetchSamples);

      // - - - - - - - - - - - - - - - -
      // parivate functions - in initErrorableFetchButton

      function fetchSamples() {
        var fetcher = new SimplyFetch({
            prefix: 'sample/',
            callback: {
              success: afterSucceeded,
              error: afterFailed
            }
        });

        fetcher.fetch(fileNames);
      }

      function afterSucceeded(key, data) {
        console.log("%s loaded", key);

        updateTextarea(key, data);
      }

      function afterFailed(key) {
        console.log("%s failed", key);
      }
    }

    // - - - - - - - - - - - - - - - -
    // other

    function addEvent(id, eventName, callback) {
      document
          .getElementById(id)
          .addEventListener(eventName, callback);
    }

    function updateTextarea(id, text) {
      var textarea = document.getElementById(id);
      textarea.value = text;
    }
  }
})();
