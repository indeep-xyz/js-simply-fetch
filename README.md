SimplyFetch
====

Fetch files by XMLHttpRequest on JavaScript.

For browser environment.

Installation
----

Download from the following URL and include your project.

[https://raw.githubusercontent.com/indeep-xyz/js-simply-fetch/master/lib/simply-fetch.js](https://raw.githubusercontent.com/indeep-xyz/js-simply-fetch/master/lib/simply-fetch.js)

Usage
----

### 1

Fetch files and the callback runs after all files are successfully loaded.

The argument "hash" passed to the callback function is an object which has the key name based on filename of an array passed to SimplyFetch#fetch. The result of fetching is kept at the place of each key name.

```javascript
var fetcher = new SimplyFetch({
  prefix: 'sample/',
  callback: {
    successAll: function(hash) {
      console.log(hash['filename1']);
      console.log(hash['filename2']);
    },
  }
});

fetcher.fetch(['filename1', 'filename2']);
```

Then it outputs the following text when the all fetching succeeds.

```
...content of filename1...
...content of filename2...
```

### 2

Fetch files and the callback runs when per file is successfully loaded.

The meaning of the arguments to the callback function is the following.

- key
  - The filename of an array passed to SimplyFetch#fetch.
- data
  - The result of fetching using each filename.

```javascript
var fetcher = new SimplyFetch({
  prefix: 'sample/',
  callback: {
    success: function(key, data) {
      console.log(key, data);
    },
  }
});

fetcher.fetch(['filename1', 'filename2']);
```

Then it outputs the following text when the all fetching succeeds. The order of them may change by the loading condition.

```
...content of filename1...
...content of filename2...
```

### 3

Try fetching files, and then the callbacks run when per file is successfully loaded or per file is failed.

The callback function "error" runs when the process of loading failed.

```javascript
var fetcher = new SimplyFetch({
  prefix: 'dir/',
  callback: {
    success: function(key, data) {
      console.log(key, data);
    },
    error: function(key) {
      console.log(key + " failed");
    },
  }
});

fetcher.fetch(['filename1', '__NOT_FOUND__']);
```

Then it outputs the following text when the all fetching succeeds or fails. The order of them may change by the loading condition.

```
...content of filename1...
__NOT_FOUND__ failed
```

Contributing
----

Bug reports and pull requests are welcome on GitHub at https://github.com/indeep-xyz/js-simply-fetch.

License
---

This JavaScript tool is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).