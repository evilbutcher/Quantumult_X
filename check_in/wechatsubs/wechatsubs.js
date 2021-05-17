/*
【公众号监控】@evilbutcher

【仓库地址】https://github.com/evilbutcher/Quantumult_X/tree/master（欢迎star🌟）

【BoxJs】https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json

【致谢】
感谢Peng-YM的OpenAPI.js！

⚠️【免责声明】
------------------------------------------
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。


【使用说明】
脚本或BoxJs填入要监控的关键词即可，以中文逗号“，”分隔。

【Surge】
-----------------
[Script]
公众号监控 = type=cron,cronexp=5 0 * * *,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/wechatsubs/wechatsubs.js

【Loon】
-----------------
[Script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/wechatsubs/wechatsubs.js, tag=公众号监控

【Quantumult X】
-----------------
[task_local]
5 0 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/wechatsubs/wechatsubs.js, tag=公众号监控

【Icon】
透明：https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/picture/wechat_tran.png
彩色：https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/picture/wechat.png
*/

const $ = new API("Wechatsubs", true);
const ERR = MYERR();

var keyword1 = [""]; //👈本地关键词在这里设置。
var keyword2 = [""];
$.refreshtime = 6; //重复内容默认在6小时内不再通知，之后清空，可自行修改
$.saveditem = [];

!(async () => {
  init();
  await checkall(keyword1, keyword2);
})()
  .catch((err) => {
    if (err instanceof ERR.ParseError) {
      $.notify("公众号监控", "❌ 解析数据出现错误", err.message);
    } else {
      $.notify(
        "公众号监控",
        "❌ 出现错误",
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      );
    }
  })
  .finally(() => $.done());

async function checkall(group1, group2) {
  for (var i = 0; i < group1.length; i++) {
    for (var j = 0; j < group2.length; j++) {
      await check(group1[i], group2[j], $.saveditem);
    }
  }
  $.write(JSON.stringify($.saveditem), "wechatsaveditem");
}

function check(word1, word2, saveditem) {
  const url = `https://wx.sogou.com/weixin?type=2&query=${encodeURIComponent(
    word1
  )}+${encodeURIComponent(word2)}`;
  const headers = {
    Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
    Connection: `keep-alive`,
    Referer: `https://wx.sogou.com/`,
    "Accept-Encoding": `gzip, deflate, br`,
    Host: `wx.sogou.com`,
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1`,
    "Accept-Language": `zh-cn`,
  };
  const myRequest = {
    url: url,
    headers: headers,
  };
  $.log(myRequest);
  return $.http.get(myRequest).then((response) => {
    if (response.statusCode == 200) {
      var geturl = /a\starget\=\\\"\_blank\\\"\shref\=\\\"\/.*?\\\"/;
      var gettitle = /article\_title\_0\\\"\>.*?\<\/a/;
      var getdescription = /summary\_0\\\"\>.*?\<\/p/;
      $.data = JSON.stringify(response.body);
      var pretitle = $.data.match(gettitle);
      var preurl = $.data.match(geturl);
      var predescription = $.data.match(getdescription);
      var title = JSON.stringify(pretitle)
        .replace(new RegExp(/\\n/, "gm"), "")
        .replace(new RegExp(/\s/, "gm"), "")
        .replace(new RegExp(/\<.*?\>/, "gm"), "")
        .replace(new RegExp(/&ldquo;/, "gm"), "“")
        .replace(new RegExp(/&rdquo;/, "gm"), "”")
        .replace(new RegExp(/&middot;/, "gm"), "·")
        .replace(new RegExp(/&bull;/, "gm"), "•")
        .replace(new RegExp(/&mdash;/, "gm"), "—")
        .slice(22, -5);
      var description = JSON.stringify(predescription)
        .replace(new RegExp(/\\n/, "gm"), "")
        .replace(new RegExp(/\s/, "gm"), "")
        .replace(new RegExp(/\<.*?\>/, "gm"), "")
        .replace(new RegExp(/&ldquo;/, "gm"), "“")
        .replace(new RegExp(/&rdquo;/, "gm"), "”")
        .replace(new RegExp(/&middot;/, "gm"), "·")
        .replace(new RegExp(/&bull;/, "gm"), "•")
        .replace(new RegExp(/&mdash;/, "gm"), "—")
        .slice(16, -5);
      var url =
        "https://wx.sogou.com/" +
        JSON.stringify(preurl)
          .slice(36, -6)
          .replace(new RegExp(/\s/, "gm"), "");
      $.info(title);
      $.log(description);
      $.log(url);
      if (saveditem.indexOf(title) == -1) {
        $.notify("公众号监控", title, description, { "open-url": url });
        saveditem.push(title);
      }
    } else {
      $.error(JSON.stringify(response));
      $.notify("公众号监控", "", "❌ 未知错误，请查看日志");
    }
  });
}

function init() {
  if ($.read("wechatkeyword1") != "" && $.read("wechatkeyword1") != undefined) {
    keyword1 = $.read("wechatkeyword1").split("，");
  }
  if ($.read("wechatkeyword2") != "" && $.read("wechatkeyword2") != undefined) {
    keyword2 = $.read("wechatkeyword2").split("，");
  }
  $.nowtime = new Date().getTime();
  if (
    $.read("wechatsavedtime") != undefined &&
    $.read("wechatsavedtime") != ""
  ) {
    $.savedtime = $.read("wechatsavedtime"); //读取保存时间
  } else {
    $.savedtime = new Date().getTime(); //保存时间为空时，保存时间=当前时间
    $.write(JSON.stringify($.nowtime), "wechatsavedtime"); //写入时间记录
    $.write("[]", "wechatsaveditem"); //写入本地记录
  }
  $.refreshtime = $.read("wechatrefreshtime") || $.refreshtime;
  var minus = $.nowtime - $.savedtime; //判断时间
  if (minus > $.refreshtime * 3600000) {
    $.info("达到设定时间清空本地记录并更新时间");
    $.write(JSON.stringify($.nowtime), "wechatsavedtime");
    $.write("[]", "wechatsaveditem");
  }
  if (
    $.read("wechatsaveditem") != undefined &&
    $.read("wechatsaveditem") != ""
  ) {
    var storeitem = JSON.parse($.read("wechatsaveditem"));
  } else {
    storeitem = [];
  }
  for (var i = 0; i < storeitem.length; i++) {
    $.saveditem.push(storeitem[i]);
  }
  $.info(`关键词：${keyword1}和${keyword2}`);
  if ($.saveditem.length != 0) {
    $.info("\n刷新时间内不再通知的内容👇\n" + $.saveditem + "\n");
  }
}

function MYERR() {
  class ParseError extends Error {
    constructor(message) {
      super(message);
      this.name = "ParseError";
    }
  }
  return {
    ParseError,
  };
}

/**
 * OpenAPI
 * @author: Peng-YM
 * https://github.com/Peng-YM/QuanX/blob/master/Tools/OpenAPI/README.md
 */
function ENV() {
  const isQX = typeof $task !== "undefined";
  const isLoon = typeof $loon !== "undefined";
  const isSurge = typeof $httpClient !== "undefined" && !isLoon;
  const isJSBox = typeof require == "function" && typeof $jsbox != "undefined";
  const isNode = typeof require == "function" && !isJSBox;
  const isRequest = typeof $request !== "undefined";
  const isScriptable = typeof importModule !== "undefined";
  return {
    isQX,
    isLoon,
    isSurge,
    isNode,
    isJSBox,
    isRequest,
    isScriptable,
  };
}

function HTTP(
  defaultOptions = {
    baseURL: "",
  }
) {
  const { isQX, isLoon, isSurge, isScriptable, isNode } = ENV();
  const methods = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"];
  const URL_REGEX =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  function send(method, options) {
    options =
      typeof options === "string"
        ? {
            url: options,
          }
        : options;
    const baseURL = defaultOptions.baseURL;
    if (baseURL && !URL_REGEX.test(options.url || "")) {
      options.url = baseURL ? baseURL + options.url : options.url;
    }
    options = {
      ...defaultOptions,
      ...options,
    };
    const timeout = options.timeout;
    const events = {
      ...{
        onRequest: () => {},
        onResponse: (resp) => resp,
        onTimeout: () => {},
      },
      ...options.events,
    };

    events.onRequest(method, options);

    let worker;
    if (isQX) {
      worker = $task.fetch({
        method,
        ...options,
      });
    } else if (isLoon || isSurge || isNode) {
      worker = new Promise((resolve, reject) => {
        const request = isNode ? require("request") : $httpClient;
        request[method.toLowerCase()](options, (err, response, body) => {
          if (err) reject(err);
          else
            resolve({
              statusCode: response.status || response.statusCode,
              headers: response.headers,
              body,
            });
        });
      });
    } else if (isScriptable) {
      const request = new Request(options.url);
      request.method = method;
      request.headers = options.headers;
      request.body = options.body;
      worker = new Promise((resolve, reject) => {
        request
          .loadString()
          .then((body) => {
            resolve({
              statusCode: request.response.statusCode,
              headers: request.response.headers,
              body,
            });
          })
          .catch((err) => reject(err));
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

    return (
      timer
        ? Promise.race([timer, worker]).then((res) => {
            clearTimeout(timeoutid);
            return res;
          })
        : worker
    ).then((resp) => events.onResponse(resp));
  }

  const http = {};
  methods.forEach(
    (method) =>
      (http[method.toLowerCase()] = (options) => send(method, options))
  );
  return http;
}

function API(name = "untitled", debug = false) {
  const { isQX, isLoon, isSurge, isNode, isJSBox, isScriptable } = ENV();
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
            fs,
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

    // persistence
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
            {
              flag: "wx",
            },
            (err) => console.log(err)
          );
        }
        this.root = {};

        // create a json file with the given name if not exists
        fpath = `${this.name}.json`;
        if (!this.node.fs.existsSync(fpath)) {
          this.node.fs.writeFileSync(
            fpath,
            JSON.stringify({}),
            {
              flag: "wx",
            },
            (err) => console.log(err)
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
      const data = JSON.stringify(this.cache, null, 2);
      if (isQX) $prefs.setValueForKey(data, this.name);
      if (isLoon || isSurge) $persistentStore.write(data, this.name);
      if (isNode) {
        this.node.fs.writeFileSync(
          `${this.name}.json`,
          data,
          {
            flag: "w",
          },
          (err) => console.log(err)
        );
        this.node.fs.writeFileSync(
          "root.json",
          JSON.stringify(this.root, null, 2),
          {
            flag: "w",
          },
          (err) => console.log(err)
        );
      }
    }

    write(data, key) {
      this.log(`SET ${key}`);
      if (key.indexOf("#") !== -1) {
        key = key.substr(1);
        if (isSurge || isLoon) {
          return $persistentStore.write(data, key);
        }
        if (isQX) {
          return $prefs.setValueForKey(data, key);
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
        if (isSurge || isLoon) {
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
        if (isSurge || isLoon) {
          return $persistentStore.write(null, key);
        }
        if (isQX) {
          return $prefs.removeValueForKey(key);
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

      if (isQX) $notify(title, subtitle, content, options);
      if (isSurge) {
        $notification.post(
          title,
          subtitle,
          content + `${mediaURL ? "\n多媒体:" + mediaURL : ""}`,
          {
            url: openURL,
          }
        );
      }
      if (isLoon) {
        let opts = {};
        if (openURL) opts["openUrl"] = openURL;
        if (mediaURL) opts["mediaUrl"] = mediaURL;
        if (JSON.stringify(opts) === "{}") {
          $notification.post(title, subtitle, content);
        } else {
          $notification.post(title, subtitle, content, opts);
        }
      }
      if (isNode || isScriptable) {
        const content_ =
          content +
          (openURL ? `\n点击跳转: ${openURL}` : "") +
          (mediaURL ? `\n多媒体: ${mediaURL}` : "");
        if (isJSBox) {
          const push = require("push");
          push.schedule({
            title: title,
            body: (subtitle ? subtitle + "\n" : "") + content_,
          });
        } else {
          console.log(`${title}\n${subtitle}\n${content_}\n\n`);
        }
      }
    }

    // other helper functions
    log(msg) {
      if (this.debug) console.log(`[${this.name}] LOG: ${this.stringify(msg)}`);
    }

    info(msg) {
      console.log(`[${this.name}] INFO: ${this.stringify(msg)}`);
    }

    error(msg) {
      console.log(`[${this.name}] ERROR: ${this.stringify(msg)}`);
    }

    wait(millisec) {
      return new Promise((resolve) => setTimeout(resolve, millisec));
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

    stringify(obj_or_str) {
      if (typeof obj_or_str === "string" || obj_or_str instanceof String)
        return obj_or_str;
      else
        try {
          return JSON.stringify(obj_or_str, null, 2);
        } catch (err) {
          return "[object Object]";
        }
    }
  })(name, debug);
}
