const $ = new API("NASA");
const ERR = MYERR();
const translate = JSON.parse($.read("translate")) || "false";

!(async () => {
  if (!$.read("nasaapi")) {
    throw new ERR.TokenError("❌ 未获取或填写NASA API");
  } else {
    await getpic();
    if (translate == true) await translatetitle();
    if (translate == true) await translateexp();
    showmsg();
  }
})()
  .catch(err => {
    if (err instanceof ERR.TokenError) {
      $.notify("NASA每日一图 - API 错误", "", err.message, {
        "open-url": "https://api.nasa.gov/"
      });
    } else {
      $.notify("NASA每日一图", "❌ 出现错误", JSON.stringify(err));
    }
  })
  .finally($.done());

function getpic() {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${$.read(
    "nasaapi"
  )}`;
  return $.http.get(url).then(response => {
    $.log(response);
    if (response.statusCode == 200) {
      var obj = JSON.parse(response.body);
      $.data = obj;
    } else if (response.statusCode == 404) {
      $.notify("NASA每日一图", "", "暂无图片更新，晚点再来看看吧~");
    } else {
      $.error(JSON.stringify(response));
      $.notify("NASA每日一图", "", "未知错误，请查看日志");
    }
  });
}

function translateexp() {
  var wtext = $.data.explanation.replace(new RegExp(" ", "gm"), "%20") || "无";
  const tranexp = {
    url: `http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh_cn&q=${wtext}`
  };
  return $.http.get(tranexp).then(response => {
    $.transexp = JSON.parse(response.body).sentences;
    $.log($.transexp);
  });
}

function translatetitle() {
  var wtitle = $.data.title.replace(new RegExp(" ", "gm"), "%20") || "无";
  const trantitle = {
    url: `http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh_cn&q=${wtitle}`
  };
  return $.http.get(trantitle).then(response => {
    $.log(response);
    $.transtitle = JSON.parse(response.body).sentences;
    $.log($.transtitle);
  });
}

function showmsg() {
  var exp = "";
  if (translate == true) {
    for (var i = 0; i < $.transexp.length; i++) {
      exp += $.transexp[i].trans;
    }
    var title = $.transtitle[0].trans;
    var time = $.data.date || "无";
    var copyright = $.data.copyright || "无";
    var detail = `©️版权：${copyright}\n⌚️时间：${time}\n${exp}`;
  } else {
    exp = $.data.explanation || "None";
    title = $.data.title || "None";
    time = $.data.date || "None";
    copyright = $.data.copyright || "None";
    detail = `©️Copyright：${copyright}\n⌚️Date：${time}\n${exp}`;
  }
  var cover = $.data.url;
  $.notify("NASA每日一图", title, detail, { "media-url": cover });
}

function MYERR() {
  class TokenError extends Error {
    constructor(message) {
      super(message);
      this.name = "TokenError";
    }
  }
  return {
    TokenError
  };
}

//From Peng-YM's OpenAPI.js
function ENV() {
  const isQX = typeof $task != "undefined";
  const isLoon = typeof $loon != "undefined";
  const isSurge = typeof $httpClient != "undefined" && !this.isLoon;
  const isJSBox = typeof require == "function" && typeof $jsbox != "undefined";
  const isNode = typeof require == "function" && !isJSBox;
  const isRequest = typeof $request !== "undefined";
  return { isQX, isLoon, isSurge, isNode, isJSBox, isRequest };
}

function HTTP(baseURL, defaultOptions = {}) {
  const { isQX, isLoon, isSurge } = ENV();
  const methods = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"];

  function send(method, options) {
    options = typeof options === "string" ? { url: options } : options;
    options.url = baseURL ? baseURL + options.url : options.url;
    options = { ...defaultOptions, ...options };
    const timeout = options.timeout;
    const events = {
      ...{
        onRequest: () => {},
        onResponse: resp => resp,
        onTimeout: () => {}
      },
      ...options.events
    };

    events.onRequest(method, options);

    let worker;
    if (isQX) {
      worker = $task.fetch({ method, ...options });
    } else {
      worker = new Promise((resolve, reject) => {
        const request = isSurge || isLoon ? $httpClient : require("request");
        request[method.toLowerCase()](options, (err, response, body) => {
          if (err) reject(err);
          else
            resolve({
              statusCode: response.status || response.statusCode,
              headers: response.headers,
              body
            });
        });
      });
    }

    let timeoutid;
    const timer = timeout
      ? new Promise((_, reject) => {
          timeoutid = setTimeout(() => {
            events.onTimeout();
            return reject(
              `${method} URL: ${options.url} exceeds the timeout ${timeout} ms`
            );
          }, timeout);
        })
      : null;

    return (timer
      ? Promise.race([timer, worker]).then(res => {
          clearTimeout(timeoutid);
          return res;
        })
      : worker
    ).then(resp => events.onResponse(resp));
  }

  const http = {};
  methods.forEach(
    method => (http[method.toLowerCase()] = options => send(method, options))
  );
  return http;
}

function API(name = "untitled", debug = false) {
  const { isQX, isLoon, isSurge, isNode, isJSBox } = ENV();
  return new (class {
    constructor(name, debug) {
      this.name = name;
      this.debug = debug;

      this.http = HTTP();
      this.env = ENV();

      this.node = (() => {
        if (isNode) {
          const fs = require("fs");

          return {
            fs
          };
        } else {
          return null;
        }
      })();
      this.initCache();

      const delay = (t, v) =>
        new Promise(function (resolve) {
          setTimeout(resolve.bind(null, v), t);
        });

      Promise.prototype.delay = function (t) {
        return this.then(function (v) {
          return delay(t, v);
        });
      };
    }
    // persistance

    // initialize cache
    initCache() {
      if (isQX) this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}");
      if (isLoon || isSurge)
        this.cache = JSON.parse($persistentStore.read(this.name) || "{}");

      if (isNode) {
        // create a json for root cache
        let fpath = "root.json";
        if (!this.node.fs.existsSync(fpath)) {
          this.node.fs.writeFileSync(
            fpath,
            JSON.stringify({}),
            { flag: "wx" },
            err => console.log(err)
          );
        }
        this.root = {};

        // create a json file with the given name if not exists
        fpath = `${this.name}.json`;
        if (!this.node.fs.existsSync(fpath)) {
          this.node.fs.writeFileSync(
            fpath,
            JSON.stringify({}),
            { flag: "wx" },
            err => console.log(err)
          );
          this.cache = {};
        } else {
          this.cache = JSON.parse(
            this.node.fs.readFileSync(`${this.name}.json`)
          );
        }
      }
    }

    // store cache
    persistCache() {
      const data = JSON.stringify(this.cache);
      if (isQX) $prefs.setValueForKey(data, this.name);
      if (isLoon || isSurge) $persistentStore.write(data, this.name);
      if (isNode) {
        this.node.fs.writeFileSync(
          `${this.name}.json`,
          data,
          { flag: "w" },
          err => console.log(err)
        );
        this.node.fs.writeFileSync(
          "root.json",
          JSON.stringify(this.root),
          { flag: "w" },
          err => console.log(err)
        );
      }
    }

    write(data, key) {
      this.log(`SET ${key}`);
      if (key.indexOf("#") !== -1) {
        key = key.substr(1);
        if (isSurge & isLoon) {
          $persistentStore.write(data, key);
        }
        if (isQX) {
          $prefs.setValueForKey(data, key);
        }
        if (isNode) {
          this.root[key] = data;
        }
      } else {
        this.cache[key] = data;
      }
      this.persistCache();
    }

    read(key) {
      this.log(`READ ${key}`);
      if (key.indexOf("#") !== -1) {
        key = key.substr(1);
        if (isSurge & isLoon) {
          return $persistentStore.read(key);
        }
        if (isQX) {
          return $prefs.valueForKey(key);
        }
        if (isNode) {
          return this.root[key];
        }
      } else {
        return this.cache[key];
      }
    }

    delete(key) {
      this.log(`DELETE ${key}`);
      if (key.indexOf("#") !== -1) {
        key = key.substr(1);
        if (isSurge & isLoon) {
          $persistentStore.write(null, key);
        }
        if (isQX) {
          $prefs.removeValueForKey(key);
        }
        if (isNode) {
          delete this.root[key];
        }
      } else {
        delete this.cache[key];
      }
      this.persistCache();
    }

    // notification
    notify(title, subtitle = "", content = "", options = {}) {
      const openURL = options["open-url"];
      const mediaURL = options["media-url"];

      const content_ =
        content +
        (openURL ? `\n点击跳转: ${openURL}` : "") +
        (mediaURL ? `\n多媒体: ${mediaURL}` : "");

      if (isQX) $notify(title, subtitle, content, options);
      if (isSurge) $notification.post(title, subtitle, content_);
      if (isLoon) $notification.post(title, subtitle, content, openURL);
      if (isNode) {
        if (isJSBox) {
          const push = require("push");
          push.schedule({
            title: title,
            body: (subtitle ? subtitle + "\n" : "") + content_
          });
        } else {
          console.log(`${title}\n${subtitle}\n${content_}\n\n`);
        }
      }
    }

    // other helper functions
    log(msg) {
      if (this.debug) console.log(msg);
    }

    info(msg) {
      console.log(msg);
    }

    error(msg) {
      console.log("ERROR: " + msg);
    }

    wait(millisec) {
      return new Promise(resolve => setTimeout(resolve, millisec));
    }

    done(value = {}) {
      if (isQX || isLoon || isSurge) {
        $done(value);
      } else if (isNode && !isJSBox) {
        if (typeof $context !== "undefined") {
          $context.headers = value.headers;
          $context.statusCode = value.statusCode;
          $context.body = value.body;
        }
      }
    }
  })(name, debug);
}
