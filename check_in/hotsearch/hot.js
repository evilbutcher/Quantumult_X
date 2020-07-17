/*

热门监控@evilbutcher，仓库地址：https://github.com/evilbutcher/Quantumult_X/tree/master

1、打开微博热搜、知乎热榜、百度风云榜（http://top.baidu.com/m/#buzz/1/515）获取Cookie即可。
2、本地直接修改关键词，远程可通过BoxJs修改关键词，有关键词更新时会通知，否则不通知。
3、可选择是否附带话题跳转链接。

本地脚本keyword设置关键词，注意是英文逗号；BoxJs是用中文逗号。

【BoxJs】订阅链接
———————————————————————————————————————
https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json
订阅后，可以在BoxJs里面修改关键词，设置清除Cookie、开启对应榜单等。

仅测试Quantumult X、Loon，理论上也支持Surge（没surge无法测试）。

【Surge】配置
———————————————————————————————————————
  热门监控微博cookie获取 = type=http-request,pattern=https:\/\/api\.weibo\.cn\/2\/page ,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false
  热门监控知乎cookie获取 = type=http-request,pattern=https:\/\/api\.zhihu\.com\/topstory\/hot-lists\/total ,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false
  热门监控百度cookie获取 = type=http-request,pattern=http:\/\/top\.baidu\.com\/mobile_v2\/buzz ,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false
  热门监控 = type=cron,cronexp="30 0 8-22/2 * * *",script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,wake-system=true,timeout=600

  [MITM]
  hostname = api.weibo.cn, api.zhihu.com, top.baidu.com

【Loon】配置
——————————————————————————————————————
  [script]
  cron "30 0 8-22/2 * * *" script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js, timeout=600, tag=热门监控
  http-request https:\/\/api\.weibo\.cn\/2\/page script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false, tag=热门监控微博cookie获取
  http-request https:\/\/api\.zhihu\.com\/topstory\/hot-lists\/total script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false, tag=热门监控知乎cookie获取
  http-request http:\/\/top\.baidu\.com\/mobile_v2\/buzz script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false, tag=热门监控百度cookie获取
  
  [MITM]
  hostname = api.weibo.cn, api.zhihu.com, top.baidu.com


【Quantumult X】配置
——————————————————————————————————————
  [rewrite_local]
  https:\/\/api\.weibo\.cn\/2\/page url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js
  https:\/\/api\.zhihu\.com\/topstory\/hot-lists\/total url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js
  http:\/\/top\.baidu\.com\/mobile_v2\/buzz url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js

  [task_local]
  30 0 8-22/2 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js, tag=热门监控

  [MITM]
  hostname = api.weibo.cn, api.zhihu.com, top.baidu.com
*/
const $ = new Env("热门监控");

var keyword = ["中国", "万茜"]; //👈本地脚本关键词在这里设置。 ⚠️用英文逗号、英文双引号⚠️
$.deletecookie = false; //👈清除Cookie选项
$.weibo = true; //是否开启相应榜单监控
$.zhihu = true; //是否开启相应榜单监控
$.baidu = true; //是否开启相应榜单监控
$.attachurl = true; //是否附带跳转链接

if (
  $.getdata("evil_wb_keyword") != undefined &&
  $.getdata("evil_wb_keyword") != ""
) {
  var key = $.getdata("evil_wb_keyword");
  keyword = key.split("，");
}
$.deletecookie = JSON.parse(
  $.getdata("evil_wb_deletecookie") || $.deletecookie
);
$.weibo = JSON.parse($.getdata("evil_wb") || $.weibo);
$.zhihu = JSON.parse($.getdata("evil_zh") || $.zhihu);
$.baidu = JSON.parse($.getdata("evil_bd") || $.baidu);
$.attachurl = JSON.parse($.getdata("evil_attachurl") || $.attachurl);

const url = "evil_hotsearchurl";
const cookie = "evil_hotsearchcookie";
const urlzh = "evil_zhihuurl";
const cookiezh = "evil_zhihucookie";
const urlbd = "evil_baiduurl";
const cookiebd = "evil_baiducookie";
var siurl = $.getdata(url);
var sicookie = $.getdata(cookie);
var zhurl = $.getdata(urlzh);
var zhcookie = $.getdata(cookiezh);
var bdurl = $.getdata(urlbd);
var bdcookie = $.getdata(cookiebd);
var items = [];
var items2 = [];
var items3 = [];
var urls = [];
var urls2 = [];
var urls3 = [];
var result = [];

!(async () => {
  if (typeof $request != "undefined") {
    getCookie();
    return;
  }
  if ($.deletecookie == true) {
    $.setdata("", url);
    $.setdata("", cookie);
    $.setdata("", urlzh);
    $.setdata("", cookiezh);
    $.setdata("", urlbd);
    $.setdata("", cookiebd);
    $.log("停止");
    $.msg("热门监控", "", "Cookie已清除🆑");
    return;
  }
  if (keyword.length == 0) {
    $.msg("热门监控", "", "请输入要监控的关键词");
    return;
  }
  if ($.weibo == true) {
    if (ifwbcanrun() == true) {
      $.log("微博Cookie完整🉑️");
      await gethotsearch();
    } else {
      $.log("微博热搜Cookie未获取或不完整😫\n请获取Cookie后再试❌");
    }
  } else {
    $.log("微博热搜未获取😫");
  }
  if ($.zhihu == true) {
    if (ifzhcanrun() == true) {
      $.log("知乎Cookie完整🉑️");
      await gethotlist();
    } else {
      $.log("知乎热榜Cookie未获取或不完整😫\n请获取Cookie后再试❌");
    }
  } else {
    $.log("知乎热榜未获取😫");
  }
  if ($.baidu == true) {
    if (ifbdcanrun() == true) {
      $.log("百度Cookie完整🉑️");
      await getfylist();
    } else {
      $.log("百度风云榜Cookie未获取或不完整😫\n请获取Cookie后再试❌");
    }
  } else {
    $.log("百度风云榜未获取😫");
  }
  output();
  $.done();
})()
  .catch(e => {
    $.log("", `❌失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function ifwbcanrun() {
  if (
    siurl != undefined &&
    sicookie != undefined &&
    siurl != "" &&
    sicookie != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function ifzhcanrun() {
  if (
    zhurl != undefined &&
    zhcookie != undefined &&
    zhurl != "" &&
    zhcookie != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function ifbdcanrun() {
  if (
    bdurl != undefined &&
    bdcookie != undefined &&
    bdurl != "" &&
    bdcookie != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function gethotsearch() {
  $.log("开始获取微博榜单...");
  return new Promise(resolve => {
    try {
      const wbRequest = {
        url: siurl,
        headers: sicookie
      };
      $.get(wbRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          var group = obj.cards[0]["card_group"];
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].desc;
            var url = group[i].scheme;
            items.push(item);
            urls.push(url);
          }
          $.log("微博热搜获取成功✅\n" + items);
        } else {
          $.log("获取微博热搜出现错误❌\n" + response);
        }
        resolve();
      });
    } catch (e) {
      console.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function gethotlist() {
  $.log("开始获取知乎榜单...");
  return new Promise(resolve => {
    try {
      const zhRequest = {
        url: zhurl,
        headers: zhcookie
      };
      $.get(zhRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          var group = obj.data;
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].target.title;
            var oriurl = group[i].target.url;
            var url = oriurl.replace("https://api.zhihu.com/", "zhihu://");
            items2.push(item);
            urls2.push(url);
          }
          $.log("知乎热榜获取成功✅\n" + items2);
        } else {
          $.log("获取知乎热榜出现错误❌\n" + response);
        }
        resolve();
      });
    } catch (e) {
      console.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function getfylist() {
  $.log("开始获取百度榜单...");
  return new Promise(resolve => {
    try {
      const bdRequest = {
        url: bdurl,
        headers: bdcookie
      };
      $.get(bdRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          var group = obj.result.descs;
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].content.data[0].title;
            var url = group[i].content.data[0].originlink;
            items3.push(item);
            urls3.push(url);
          }
          $.log("百度风云榜获取成功✅\n" + items3);
        } else {
          $.log("获取百度风云榜出现错误❌\n" + response);
        }
        resolve();
      });
    } catch (e) {
      console.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function findkeywordurl(text, output, key, array, array2) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].indexOf(key) != -1) {
      output.push(
        `🎉来自“${text}”，您订阅的关键词"${key}"有更新啦！\n具体内容：${array[i]}\n${array2[i]}`
      );
    }
  }
}

function findkeyword(text, output, key, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].indexOf(key) != -1) {
      output.push(`🎉来自“${text}”，具体内容：${array[i]}`);
    }
  }
}

function output() {
  if ($.attachurl == true) {
    for (var j = 0; j < keyword.length; j++) {
      findkeywordurl("微博", result, keyword[j], items, urls);
    }
    for (j = 0; j < keyword.length; j++) {
      findkeywordurl("知乎", result, keyword[j], items2, urls2);
    }
    for (j = 0; j < keyword.length; j++) {
      findkeywordurl("百度", result, keyword[j], items3, urls3);
    }
  } else {
    for (j = 0; j < keyword.length; j++) {
      findkeyword("微博", result, keyword[j], items);
    }
    for (j = 0; j < keyword.length; j++) {
      findkeyword("知乎", result, keyword[j], items2);
    }
    for (j = 0; j < keyword.length; j++) {
      findkeyword("百度", result, keyword[j], items3);
    }
  }
  $.log("\n关键词为👇\n" + keyword + "\n");
  if (result.length != 0) {
    if ($.attachurl == true) {
      for (var m = 0; m < result.length; m++) {
        $.this_msg = ``;
        $.this_msg += `${result[m]}`;
        $.msg("热门监控", "", $.this_msg);
      }
    } else {
      $.this_msg = ``;
      for (m = 0; m < result.length; m++) {
        if (m == 0) {
          $.this_msg += `${result[m]}`;
        } else {
          $.this_msg += `\n${result[m]}`;
        }
      }
      $.msg("热门监控", `您订阅的关键词"${key}"有更新啦！`, $.this_msg);
    }
  } else if (
    ifwbcanrun() == false &&
    ifzhcanrun() == false &&
    ifbdcanrun() == false
  ) {
    $.msg("热门监控", "Cookie未获取或不完整😫", "请获取Cookie后再尝试哦❌");
  } else if ($.weibo == false && $.zhihu == false && $.baidu == false) {
    $.msg(
      "热门监控",
      "哎呀！您关闭了全部的榜单😫",
      "请打开一个榜单监控再尝试哦😊"
    );
  } else {
    $.log(`😫您订阅的关键词"${keyword}"暂时没有更新`);
  }
}

function getCookie() {
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/display\_time/)
  ) {
    const siurl = $request.url;
    $.log(siurl);
    const sicookie = JSON.stringify($request.headers);
    $.log(sicookie);
    $.setdata(siurl, url);
    $.setdata(sicookie, cookie);
    $.msg("热门监控", "", "获取微博热搜Cookie成功🎉");
  }
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/hot\-lists/)
  ) {
    const zhurl = $request.url;
    $.log(zhurl);
    const zhcookie = JSON.stringify($request.headers);
    $.log(zhcookie);
    $.setdata(zhurl, urlzh);
    $.setdata(zhcookie, cookiezh);
    $.msg("热门监控", "", "获取知乎热榜Cookie成功🎉");
  }
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/b\=1\&c\=515/)
  ) {
    const bdurl = $request.url;
    $.log(bdurl);
    const bdcookie = JSON.stringify($request.headers);
    $.log(bdcookie);
    $.setdata(bdurl, urlbd);
    $.setdata(bdcookie, cookiebd);
    $.msg("热门监控", "", "获取百度风云榜Cookie成功🎉");
  }
}

//chavyleung
function Env(s) {
  (this.name = s),
    (this.data = null),
    (this.logs = []),
    (this.isSurge = () => "undefined" != typeof $httpClient),
    (this.isQuanX = () => "undefined" != typeof $task),
    (this.isNode = () => "undefined" != typeof module && !!module.exports),
    (this.log = (...s) => {
      (this.logs = [...this.logs, ...s]),
        s ? console.log(s.join("\n")) : console.log(this.logs.join("\n"));
    }),
    (this.msg = (s = this.name, t = "", i = "") => {
      this.isSurge() && $notification.post(s, t, i),
        this.isQuanX() && $notify(s, t, i);
      const e = [
        "",
        "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="
      ];
      s && e.push(s), t && e.push(t), i && e.push(i), console.log(e.join("\n"));
    }),
    (this.getdata = s => {
      if (this.isSurge()) return $persistentStore.read(s);
      if (this.isQuanX()) return $prefs.valueForKey(s);
      if (this.isNode()) {
        const t = "box.dat";
        return (
          (this.fs = this.fs ? this.fs : require("fs")),
          this.fs.existsSync(t)
            ? ((this.data = JSON.parse(this.fs.readFileSync(t))), this.data[s])
            : null
        );
      }
    }),
    (this.setdata = (s, t) => {
      if (this.isSurge()) return $persistentStore.write(s, t);
      if (this.isQuanX()) return $prefs.setValueForKey(s, t);
      if (this.isNode()) {
        const i = "box.dat";
        return (
          (this.fs = this.fs ? this.fs : require("fs")),
          !!this.fs.existsSync(i) &&
            ((this.data = JSON.parse(this.fs.readFileSync(i))),
            (this.data[t] = s),
            this.fs.writeFileSync(i, JSON.stringify(this.data)),
            !0)
        );
      }
    }),
    (this.wait = (s, t = s) => i =>
      setTimeout(() => i(), Math.floor(Math.random() * (t - s + 1) + s))),
    (this.get = (s, t) => this.send(s, "GET", t)),
    (this.post = (s, t) => this.send(s, "POST", t)),
    (this.send = (s, t, i) => {
      if (this.isSurge()) {
        const e = "POST" == t ? $httpClient.post : $httpClient.get;
        e(s, (s, t, e) => {
          t && ((t.body = e), (t.statusCode = t.status)), i(s, t, e);
        });
      }
      this.isQuanX() &&
        ((s.method = t),
        $task.fetch(s).then(
          s => {
            (s.status = s.statusCode), i(null, s, s.body);
          },
          s => i(s.error, s, s)
        )),
        this.isNode() &&
          ((this.request = this.request ? this.request : require("request")),
          (s.method = t),
          (s.gzip = !0),
          this.request(s, (s, t, e) => {
            t && (t.status = t.statusCode), i(null, t, e);
          }));
    }),
    (this.done = (s = {}) => (this.isNode() ? null : $done(s)));
}
