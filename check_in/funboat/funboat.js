/*
【Funboat】@evilbutcher

【仓库地址】https://github.com/evilbutcher/Quantumult_X/tree/master（欢迎star🌟）

【BoxJs】https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json

【致谢】
本脚本使用了Chavy的Env.js，感谢！

微信搜索小程序Funboat，如想购买Funko手办可关注，脚本还在测试中。

【Quantumult X】
————————————————
[rewrite_local]
https:\/\/h5\.youzan\.com\/wscump\/checkin\/checkin url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js
https:\/\/h5\.youzan\.com\/wscuser\/membercenter\/stats url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js

[task_local]
5 8 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js

【Surge】

【Loon】

【All App MitM】
hostname = h5.youzan.com

*/
const $ = new Env("Funboat");
const signurl = "evil_funkourl";
const signcookie = "evil_funkocookie";
const statusurl = "evil_funkostatusurl";
const statuscookie = "evil_funkostatuscookie";

var siurl = $.getdata(signurl);
var sicookie = $.getdata(signcookie);
var sturl = $.getdata(statusurl);
var stcookie = $.getdata(statuscookie);

var detail;
var all;

!(async () => {
  if (typeof $request != "undefined") {
    getCookie();
    return;
  }
  await checkin();
  await getall();
  out();
})()
  .catch(e => {
    $.log("", `❌失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function checkin() {
  const checkRequest = {
    url: siurl,
    headers: { "Extra-Data": sicookie }
  };
  console.log("checkRequest");
  console.log(checkRequest);
  return new Promise(resolve => {
    $.get(checkRequest, (error, response, data) => {
      if (response.statusCode == 200) {
        var body = response.body;
        var obj = JSON.parse(body);
        console.log(obj);
        if (obj.code == 0) {
          var prize = obj.data.prizes[0].points;
          var count = obj.data.times;
          detail =
            "本次签到获得 " +
            prize +
            "积分\n当前周期连签天数 " +
            count +
            "天 ✅";
          console.log(detail);
        } else {
          detail = obj.msg;
          console.log(detail);
        }
        resolve();
      } else {
        console.log("出错啦⚠️详情查看日志🔎");
        console.log(response);
        resolve();
      }
    });
  });
}

function getall() {
  const allRequest = {
    url: sturl,
    headers: { "Extra-Data": stcookie }
  };
  console.log("\nallRequest");
  console.log(allRequest);
  return new Promise(resolve => {
    $.get(allRequest, (error, response, data) => {
      if (response.statusCode == 200) {
        var body = response.body;
        var obj = JSON.parse(body);
        console.log(obj);
        if (obj.code == 0) {
          var allpoints = obj.data.stats.points;
          all = "总积分 " + allpoints + "分 🎉";
          console.log(all);
        } else {
          all = obj.msg;
          console.log(all);
        }
        resolve();
      } else {
        console.log("出错啦⚠️详情查看日志🔎");
        console.log(response);
        resolve();
      }
    });
  });
}

function out() {
  var msg = detail + "\n" + all;
  $.msg("Funboat", "", msg, {
    "media-url":
      "https://github.com/evilbutcher/Quantumult_X/raw/master/picture/img.png"
  });
}

function getCookie() {
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/checkin\_id/)
  ) {
    const siurl = $request.url;
    $.log(siurl);
    const sicookie = $request.headers["Extra-Data"];
    $.log(sicookie);
    $.setdata(siurl, signurl);
    $.setdata(sicookie, signcookie);
    $.msg("Funboat", "", "获取签到Cookie成功🎉");
  }
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/version/)
  ) {
    const sturl = $request.url;
    $.log(sturl);
    const stcookie = $request.headers["Extra-Data"];
    $.log(stcookie);
    $.setdata(sturl, statusurl);
    $.setdata(stcookie, statuscookie);
    $.msg("Funboat", "", "获取积分Cookie成功🎉");
  }
}

//From chavyleung's Env.js
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
