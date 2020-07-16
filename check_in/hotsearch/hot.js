/*

热搜监控@evilbutcher，仓库地址：https://github.com/evilbutcher/Quantumult_X

打开微博热搜获取Cookie即可，仅测试Quantumult X，理论上也支持Surge和Loon。

本地脚本keyword按照样例设置关键词，注意英文逗号；BoxJs用中文逗号。

有更新时会通知，否则不通知。

[rewrite_local]
https:\/\/api\.weibo\.cn\/2\/page url script-request-header Local/check_in/hotsearch/hot.js
https:\/\/api\.zhihu\.com\/topstory\/hot-lists\/total url script-request-header Local/check_in/hotsearch/hot.js

[task_local]
30 0 8-22/2 * * * Local/check_in/hotsearch/hot.js

hostname = api.weibo.cn, api.zhihu.com
*/
const $ = new Env("热门监控");

var keyword = ["万茜"]; //👈关键词在这里设置
var deletecookie = false; //👈清除Cookie

if (
  $.getdata("evil_wb_keyword") != undefined &&
  $.getdata("evil_wb_keyword") != ""
) {
  var key = $.getdata("evil_wb_keyword");
  keyword = key.split("，");
}
if ($.getdata("evil_wb_deetecookie") != undefined) {
  if (
    $.getdata("evil_wb_deetecookie") == true ||
    $.getdata("evil_wb_deetecookie") == "true"
  ) {
    deletecookie == true;
  } else deletecookie == false;
}

var url = "evil_hotsearchurl";
var cookie = "evil_hotsearchcookie";
var urlzh = "evil_zhihuurl";
var cookiezh = "evil_zhihucookie";
var siurl = $.getdata(url);
var sicookie = $.getdata(cookie);
var zhurl = $.getdata(urlzh);
var zhcookie = $.getdata(cookiezh);
var items = [];
var items2 = [];
var result = [];

!(async () => {
  if (typeof $request != "undefined") {
    getCookie();
    return;
  }
  if (deletecookie == true) {
    $.setdata("", url);
    $.setdata("", cookie);
    $.setdata("", urlzh);
    $.setdata("", cookiezh);
    $.log("停止");
    $.msg("热门监控", "", "Cookie已清除🆑");
    return;
  }
  if (
    siurl == undefined ||
    sicookie == undefined ||
    zhurl == undefined ||
    zhcookie == undefined ||
    siurl == "" ||
    sicookie == "" ||
    zhurl == "" ||
    zhcookie == ""
  ) {
    $.log("停止");
    $.msg("热门监控", "", "请先获取Cookie❌");
    return;
  } else if (keyword.length == 0) {
    $.msg("热门监控", "", "请输入要监控的关键词");
  } else {
    $.log("开始\n");
    await gethotsearch();
    await gethotlist();
    output();
    $.done();
  }
})()
  .catch(e => {
    $.log("", `❌失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function gethotsearch() {
  return new Promise(resolve => {
    const wbRequest = {
      url: siurl,
      headers: sicookie
    };
    $.get(wbRequest, (error, response, data) => {
      var body = response.body;
      var obj = JSON.parse(body);
      var group = obj.cards[0]["card_group"];
      var num = group.length;
      for (var i = 0; i < num; i++) {
        var item = group[i].desc;
        items.push(item);
      }
      $.log("微博热搜结果👇\n" + items);
      resolve();
    });
  });
}

function gethotlist() {
  return new Promise(resolve => {
    const zhRequest = {
      url: zhurl,
      headers: zhcookie
    };
    $.get(zhRequest, (error, response, data) => {
      var body = response.body;
      var obj = JSON.parse(body);
      var group = obj.data;
      var num = group.length;
      for (var i = 0; i < num; i++) {
        var item = group[i].target.title;
        items2.push(item);
      }
      $.log("\n知乎热榜结果👇\n" + items2);
      resolve();
    });
  });
}

function findkeyword(output, key, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].indexOf(key) != -1) {
      if (i < 51) {
        output.push(`微博--${array[i]}`);
      } else {
        output.push(`知乎--${array[i]}`);
      }
    }
  }
}

function output() {
  var all = items.concat(items2);
  for (var j = 0; j < keyword.length; j++) {
    findkeyword(result, keyword[j], all);
  }
  //$.log(result);
  $.log("\n关键词为👇\n" + keyword + "\n");
  if (result.length != 0) {
    $.this_msg = ``;
    for (var m = 0; m < result.length; m++) {
      $.this_msg += `${result[m]}\n`;
      //$.log(`${result[m]}`)
      if (m == result.length - 1) {
        $.msg("热门监控", "⚠️您订阅的关键词有更新啦", $.this_msg);
      }
    }
  } else {
    $.log("热门监控", "😫您订阅的关键词暂时没有更新", "");
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
