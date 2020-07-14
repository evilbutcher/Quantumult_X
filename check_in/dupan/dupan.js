/*

百度网盘iPhone客户端-我的-右上角积分，点开自动获取Cookie。

[rewrite_local]
https:\/\/pan\.baidu\.com\/pmall\/points\/signin url script-request-header dupan.js
https:\/\/pan\.baidu\.com\/pmall\/points\/balance url script-request-header dupan.js

[task_local]
5 0 * * * dupan.js

hostname = pan.baidu.com
*/

const $ = new Env("百度网盘");
const signurl = "evil_signurl";
const signcookie = "evil_signcookie";
const infourl = "evil_infourl";
const infocookie = "evil_infocookie";

var siurl = $.getdata(signurl);
var sicookie = $.getdata(signcookie);
var ifurl = $.getdata(infourl);
var ifcookie = $.getdata(infocookie);

!(async () => {
  if (typeof $request != "undefined") {
    getCookie();
    return;
  }
  signin();
  getinfo();
  $.done();
})()
  .catch(e => {
    $.log("", `❌失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function signin() {
  var time = new Date().getTime();
  var siheader = { Cookie: sicookie };
  var siurlsend = siurl
    .replace(new RegExp(/time\=.*?&/), `time\=${time}&`)
    .replace(new RegExp(/&\_t\=.*?/), `&\_t\=${time}`);
  return new Promise(resolve => {
    const signinRequest = {
      url: siurl,
      headers: siheader
    };
    $.get(signinRequest, (error, response, data) => {
      var body = response.body;
      var obj = JSON.parse(body);
      if (obj.errno == 373) {
        //$.msg("百度网盘", "", "今日已签到");
        console.log(obj);
      } else {
        console.log(obj);
      }
      resolve();
    });
  });
}

function getinfo() {
  $.wait(1000)
  //var time = new Date().getTime();
  var ifheader = { Cookie: ifcookie };
  return new Promise(resolve => {
    const infoRequest = {
      url: ifurl,
      headers: ifheader
    };
    $.get(infoRequest, (error, response, data) => {
      var body = response.body;
      var obj = JSON.parse(body);
      if (obj.errno == 0) {
        var all = obj.balance;
        var exp = obj["exp_points"];
        if (exp != 0) {
          var tip = "有积分将要过期，请尽快使用";
        } else {
          tip = "";
        }
        $.msg("百度网盘", `${tip}`, `总积分：${all}分，将要过期：${exp}分`);
      } else {
        console.log(obj);
      }
      resolve();
    });
  });
}

function getCookie() {
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/points\/signin\?rand/)
  ) {
    const siurl = $request.url;
    $.log(siurl);
    const sicookie = $request.headers["Cookie"];
    $.log(sicookie);
    $.setdata(siurl, signurl);
    $.setdata(sicookie, signcookie);
    $.msg("百度网盘", "", "获取签到Cookie成功🎉");
  }
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/points\/balance\?\_t/)
  ) {
    const ifurl = $request.url;
    $.log(ifurl);
    const ifcookie = $request.headers["Cookie"];
    $.log(ifcookie);
    $.setdata(ifurl, infourl);
    $.setdata(ifcookie, infocookie);
    $.msg("百度网盘", "", "获取信息Cookie成功🎉");
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
