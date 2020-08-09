/*
【Funboat】@evilbutcher

【仓库地址】https://github.com/evilbutcher/Quantumult_X/tree/master（欢迎star🌟）

【BoxJs】https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json

【致谢】
本脚本使用了Chavy的Env.js，感谢！

⚠️【免责声明】
------------------------------------------
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

微信搜索小程序Funboat，如想购买Funko手办可关注。点我的，提示获取积分Cookie成功，手动签到一次，提示获取签到Cookie成功，即可使用。
⚠️其他基于有赞的小程序也可能触发获取Cookie，请获取完后及时禁用获取Cookie重写/脚本。

【Quantumult X】
————————————————
[rewrite_local]
https:\/\/h5\.youzan\.com\/wscump\/checkin\/checkin url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js
https:\/\/h5\.youzan\.com\/wscuser\/membercenter\/stats url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js

[task_local]
5 8 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js

【Surge】
————————————————
[Script]
Funboat签到 = type=cron,cronexp=5 0 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js
Funboat获取签到Cookie = type=http-request,pattern=https:\/\/h5\.youzan\.com\/wscump\/checkin\/checkin,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js
Funboat获取积分Cookie = type=http-request,pattern=https:\/\/h5\.youzan\.com\/wscuser\/membercenter\/stats,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js

【Loon】
————————————————
[Script]
cron "5 0 * * *" tag=Funboat签到, script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js
http-request https:\/\/h5\.youzan\.com\/wscump\/checkin\/checkin tag=Funboat获取签到Cookie, script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js
http-request https:\/\/h5\.youzan\.com\/wscuser\/membercenter\/stats tag=Funboat获取积分Cookie, script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/funboat/funboat.js

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
      "https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/picture/img.png"
  });
}

function getCookie() {
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/checkin\_id/) &&
    $request.url.match(/wx9b5caf9d1669dc96/)
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
    $request.url.match(/stats/) &&
    $request.url.match(/wx9b5caf9d1669dc96/)
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
function Env(t, s) {
  return new (class {
    constructor(t, s) {
      (this.name = t),
        (this.data = null),
        (this.dataFile = "box.dat"),
        (this.logs = []),
        (this.logSeparator = "\n"),
        (this.startTime = new Date().getTime()),
        Object.assign(this, s),
        this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    loaddata() {
      if (!this.isNode()) return {};
      {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s);
        if (!e && !i) return {};
        {
          const i = e ? t : s;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (e) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s),
          o = JSON.stringify(this.data);
        e
          ? this.fs.writeFileSync(t, o)
          : i
          ? this.fs.writeFileSync(s, o)
          : this.fs.writeFileSync(t, o);
      }
    }
    lodash_get(t, s, e) {
      const i = s.replace(/\[(\d+)\]/g, ".$1").split(".");
      let o = t;
      for (const t of i) if (((o = Object(o)[t]), void 0 === o)) return e;
      return o;
    }
    lodash_set(t, s, e) {
      return Object(t) !== t
        ? t
        : (Array.isArray(s) || (s = s.toString().match(/[^.[\]]+/g) || []),
          (s
            .slice(0, -1)
            .reduce(
              (t, e, i) =>
                Object(t[e]) === t[e]
                  ? t[e]
                  : (t[e] = Math.abs(s[i + 1]) >> 0 == +s[i + 1] ? [] : {}),
              t
            )[s[s.length - 1]] = e),
          t);
    }
    getdata(t) {
      let s = this.getval(t);
      if (/^@/.test(t)) {
        const [, e, i] = /^@(.*?)\.(.*?)$/.exec(t),
          o = e ? this.getval(e) : "";
        if (o)
          try {
            const t = JSON.parse(o);
            s = t ? this.lodash_get(t, i, "") : s;
          } catch (t) {
            s = "";
          }
      }
      return s;
    }
    setdata(t, s) {
      let e = !1;
      if (/^@/.test(s)) {
        const [, i, o] = /^@(.*?)\.(.*?)$/.exec(s),
          h = this.getval(i),
          a = i ? ("null" === h ? null : h || "{}") : "{}";
        try {
          const s = JSON.parse(a);
          this.lodash_set(s, o, t),
            (e = this.setval(JSON.stringify(s), i)),
            console.log(`${i}: ${JSON.stringify(s)}`);
        } catch (e) {
          const s = {};
          this.lodash_set(s, o, t),
            (e = this.setval(JSON.stringify(s), i)),
            console.log(`${i}: ${JSON.stringify(s)}`);
        }
      } else e = $.setval(t, s);
      return e;
    }
    getval(t) {
      return this.isSurge() || this.isLoon()
        ? $persistentStore.read(t)
        : this.isQuanX()
        ? $prefs.valueForKey(t)
        : this.isNode()
        ? ((this.data = this.loaddata()), this.data[t])
        : (this.data && this.data[t]) || null;
    }
    setval(t, s) {
      return this.isSurge() || this.isLoon()
        ? $persistentStore.write(t, s)
        : this.isQuanX()
        ? $prefs.setValueForKey(t, s)
        : this.isNode()
        ? ((this.data = this.loaddata()),
          (this.data[s] = t),
          this.writedata(),
          !0)
        : (this.data && this.data[s]) || null;
    }
    initGotEnv(t) {
      (this.got = this.got ? this.got : require("got")),
        (this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
        (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
        t &&
          ((t.headers = t.headers ? t.headers : {}),
          void 0 === t.headers.Cookie &&
            void 0 === t.cookieJar &&
            (t.cookieJar = this.ckjar));
    }
    get(t, s = () => {}) {
      t.headers &&
        (delete t.headers["Content-Type"], delete t.headers["Content-Length"]),
        this.isSurge() || this.isLoon()
          ? $httpClient.get(t, (t, e, i) => {
              !t && e && ((e.body = i), (e.statusCode = e.status), s(t, e, i));
            })
          : this.isQuanX()
          ? $task.fetch(t).then(
              t => {
                const { statusCode: e, statusCode: i, headers: o, body: h } = t;
                s(null, { status: e, statusCode: i, headers: o, body: h }, h);
              },
              t => s(t)
            )
          : this.isNode() &&
            (this.initGotEnv(t),
            this.got(t)
              .on("redirect", (t, s) => {
                try {
                  const e = t.headers["set-cookie"]
                    .map(this.cktough.Cookie.parse)
                    .toString();
                  this.ckjar.setCookieSync(e, null), (s.cookieJar = this.ckjar);
                } catch (t) {
                  this.logErr(t);
                }
              })
              .then(
                t => {
                  const {
                    statusCode: e,
                    statusCode: i,
                    headers: o,
                    body: h
                  } = t;
                  s(null, { status: e, statusCode: i, headers: o, body: h }, h);
                },
                t => s(t)
              ));
    }
    post(t, s = () => {}) {
      if (
        (t.body &&
          t.headers &&
          !t.headers["Content-Type"] &&
          (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
        delete t.headers["Content-Length"],
        this.isSurge() || this.isLoon())
      )
        $httpClient.post(t, (t, e, i) => {
          !t && e && ((e.body = i), (e.statusCode = e.status), s(t, e, i));
        });
      else if (this.isQuanX())
        (t.method = "POST"),
          $task.fetch(t).then(
            t => {
              const { statusCode: e, statusCode: i, headers: o, body: h } = t;
              s(null, { status: e, statusCode: i, headers: o, body: h }, h);
            },
            t => s(t)
          );
      else if (this.isNode()) {
        this.initGotEnv(t);
        const { url: e, ...i } = t;
        this.got.post(e, i).then(
          t => {
            const { statusCode: e, statusCode: i, headers: o, body: h } = t;
            s(null, { status: e, statusCode: i, headers: o, body: h }, h);
          },
          t => s(t)
        );
      }
    }
    msg(s = t, e = "", i = "", o) {
      const h = t =>
        !t || (!this.isLoon() && this.isSurge())
          ? t
          : "string" == typeof t
          ? this.isLoon()
            ? t
            : this.isQuanX()
            ? { "open-url": t }
            : void 0
          : "object" == typeof t && (t["open-url"] || t["media-url"])
          ? this.isLoon()
            ? t["open-url"]
            : this.isQuanX()
            ? t
            : void 0
          : void 0;
      this.isSurge() || this.isLoon()
        ? $notification.post(s, e, i, h(o))
        : this.isQuanX() && $notify(s, e, i, h(o)),
        this.logs.push(
          "",
          "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="
        ),
        this.logs.push(s),
        e && this.logs.push(e),
        i && this.logs.push(i);
    }
    log(...t) {
      t.length > 0
        ? (this.logs = [...this.logs, ...t])
        : console.log(this.logs.join(this.logSeparator));
    }
    logErr(t, s) {
      const e = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      e
        ? $.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack)
        : $.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.message);
    }
    wait(t) {
      return new Promise(s => setTimeout(s, t));
    }
    done(t = null) {
      const s = new Date().getTime(),
        e = (s - this.startTime) / 1e3;
      this.log(
        "",
        `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`
      ),
        this.log(),
        (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }
  })(t, s);
}
