/*
【app版本及价格监控】修改自t.me/QuanXApp群友分享 
Modified by evilbutcher

【仓库地址】https://github.com/evilbutcher/Quantumult_X/tree/master（欢迎star🌟）

【BoxJs】https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json

【致谢】
感谢来自t.me/QuanXApp群友分享脚本！
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

【Quantumult X】
————————————————
30 7-22 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/appstore/AppMonitor.js, tag=App价格监控

【Surge】
————————————————
App价格监控 = type=cron,cronexp="30 7-22 * * *",script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/appstore/AppMonitor.js,wake-system=true,timeout=600

【Loon】
————————————————
cron "30 7-22 * * *" script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/appstore/AppMonitor.js, timeout=600, tag=App价格监控

app可单独设置区域，未单独设置区域，则采用reg默认区域
设置区域方式apps=["1443988620:hk","1443988620/us","1443988620-uk","1443988620_jp","1443988620 au"]
以上方式均可 分隔符支持 空格/:|_-

*/
const $ = new API("App价格监控");
let apps = [
  "1443988620|hk",
  "1312014438 cn",
  "499470113/vn",
  "1314212521-jp",
  "1282297037_au",
  "932747118:ie",
  "1116905928",
  "1373567447"
]; //app跟踪id
if ($.read("apps") != "" && $.read("apps") != undefined) {
  apps = $.read("apps").split("，");
}
let reg = "cn"; //默认区域：美国us 中国cn 香港hk
if ($.read("reg") != "" && $.read("reg") != undefined) {
  reg = $.read("reg");
}
let notifys = [];
format_apps(apps);
function format_apps(x) {
  let apps_f = {};
  x.forEach(n => {
    if (/^[a-zA-Z0-9:/|\-_\s]{1,}$/.test(n)) {
      n = n.replace(/[/|\-_\s]/g, ":");
      let n_n = n.split(":");
      if (n_n.length === 1) {
        if (apps_f.hasOwnProperty(reg)) {
          apps_f[reg].push(n_n);
        } else {
          apps_f[reg] = [];
          apps_f[reg].push(n_n[0]);
        }
      } else if (n_n.length === 2) {
        if (apps_f.hasOwnProperty(n_n[1])) {
          apps_f[n_n[1]].push(n_n[0]);
        } else {
          apps_f[n_n[1]] = [];
          apps_f[n_n[1]].push(n_n[0]);
        }
      } else {
        notifys.push(`ID格式错误:【${n}】`);
      }
    } else {
      notifys.push(`ID格式错误:【${n}】`);
    }
  });
  if (Object.keys(apps_f).length > 0) {
    post_data(apps_f);
  }
}
async function post_data(d) {
  try {
    let app_monitor = $.read("app_monitor");
    if (app_monitor === "" || app_monitor === undefined) {
      app_monitor = {};
    } else {
      app_monitor = JSON.parse(app_monitor);
      console.log(app_monitor);
    }
    let infos = {};
    await Promise.all(
      Object.keys(d).map(async k => {
        let config = {
          url: "https://itunes.apple.com/lookup?id=" + d[k] + "&country=" + k
        };
        await $.http
          .get(config)
          .then(response => {
            let results = JSON.parse(response.body).results;
            if (Array.isArray(results) && results.length > 0) {
              results.forEach(x => {
                infos[x.trackId] = {
                  n: x.trackName,
                  v: x.version,
                  p: x.formattedPrice
                };
                if (app_monitor.hasOwnProperty(x.trackId)) {
                  if (
                    JSON.stringify(app_monitor[x.trackId]) !==
                    JSON.stringify(infos[x.trackId])
                  ) {
                    if (x.version !== app_monitor[x.trackId].v) {
                      notifys.push(
                        `${flag(k)}🧩${x.trackName}:升级【${x.version}】`
                      );
                    }
                    if (x.formattedPrice !== app_monitor[x.trackId].p) {
                      notifys.push(
                        `${flag(k)}💰${x.trackName}:价格【${x.formattedPrice}】`
                      );
                    }
                  }
                } else {
                  notifys.push(
                    `${flag(k)}🧩${x.trackName}:版本【${x.version}】`
                  );
                  notifys.push(
                    `${flag(k)}💰${x.trackName}:价格【${x.formattedPrice}】`
                  );
                }
              });
            }
            return Promise.resolve();
          })
          .catch(e => {
            console.log(e);
          });
      })
    );
    infos = JSON.stringify(infos);
    $.write(infos, "app_monitor");
    if (notifys.length > 0) {
      notify(notifys);
    } else {
      console.log("APP监控：版本及价格无变化");
      $.done;
    }
  } catch (e) {
    console.log(e);
  }
}
function notify(notifys) {
  notifys = notifys.join("\n");
  console.log(notifys);
  $.notify("APP监控", "", notifys);
  $.done;
}
function flag(x) {
  var flags = new Map([
    ["AC", "🇦🇨"],
    ["AF", "🇦🇫"],
    ["AI", "🇦🇮"],
    ["AL", "🇦🇱"],
    ["AM", "🇦🇲"],
    ["AQ", "🇦🇶"],
    ["AR", "🇦🇷"],
    ["AS", "🇦🇸"],
    ["AT", "🇦🇹"],
    ["AU", "🇦🇺"],
    ["AW", "🇦🇼"],
    ["AX", "🇦🇽"],
    ["AZ", "🇦🇿"],
    ["BB", "🇧🇧"],
    ["BD", "🇧🇩"],
    ["BE", "🇧🇪"],
    ["BF", "🇧🇫"],
    ["BG", "🇧🇬"],
    ["BH", "🇧🇭"],
    ["BI", "🇧🇮"],
    ["BJ", "🇧🇯"],
    ["BM", "🇧🇲"],
    ["BN", "🇧🇳"],
    ["BO", "🇧🇴"],
    ["BR", "🇧🇷"],
    ["BS", "🇧🇸"],
    ["BT", "🇧🇹"],
    ["BV", "🇧🇻"],
    ["BW", "🇧🇼"],
    ["BY", "🇧🇾"],
    ["BZ", "🇧🇿"],
    ["CA", "🇨🇦"],
    ["CF", "🇨🇫"],
    ["CH", "🇨🇭"],
    ["CK", "🇨🇰"],
    ["CL", "🇨🇱"],
    ["CM", "🇨🇲"],
    ["CN", "🇨🇳"],
    ["CO", "🇨🇴"],
    ["CP", "🇨🇵"],
    ["CR", "🇨🇷"],
    ["CU", "🇨🇺"],
    ["CV", "🇨🇻"],
    ["CW", "🇨🇼"],
    ["CX", "🇨🇽"],
    ["CY", "🇨🇾"],
    ["CZ", "🇨🇿"],
    ["DE", "🇩🇪"],
    ["DG", "🇩🇬"],
    ["DJ", "🇩🇯"],
    ["DK", "🇩🇰"],
    ["DM", "🇩🇲"],
    ["DO", "🇩🇴"],
    ["DZ", "🇩🇿"],
    ["EA", "🇪🇦"],
    ["EC", "🇪🇨"],
    ["EE", "🇪🇪"],
    ["EG", "🇪🇬"],
    ["EH", "🇪🇭"],
    ["ER", "🇪🇷"],
    ["ES", "🇪🇸"],
    ["ET", "🇪🇹"],
    ["EU", "🇪🇺"],
    ["FI", "🇫🇮"],
    ["FJ", "🇫🇯"],
    ["FK", "🇫🇰"],
    ["FM", "🇫🇲"],
    ["FO", "🇫🇴"],
    ["FR", "🇫🇷"],
    ["GA", "🇬🇦"],
    ["GB", "🇬🇧"],
    ["HK", "🇭🇰"],
    ["ID", "🇮🇩"],
    ["IE", "🇮🇪"],
    ["IL", "🇮🇱"],
    ["IM", "🇮🇲"],
    ["IN", "🇮🇳"],
    ["IS", "🇮🇸"],
    ["IT", "🇮🇹"],
    ["JP", "🇯🇵"],
    ["KR", "🇰🇷"],
    ["MO", "🇲🇴"],
    ["MX", "🇲🇽"],
    ["MY", "🇲🇾"],
    ["NL", "🇳🇱"],
    ["PH", "🇵🇭"],
    ["RO", "🇷🇴"],
    ["RS", "🇷🇸"],
    ["RU", "🇷🇺"],
    ["RW", "🇷🇼"],
    ["SA", "🇸🇦"],
    ["SB", "🇸🇧"],
    ["SC", "🇸🇨"],
    ["SD", "🇸🇩"],
    ["SE", "🇸🇪"],
    ["SG", "🇸🇬"],
    ["TH", "🇹🇭"],
    ["TN", "🇹🇳"],
    ["TO", "🇹🇴"],
    ["TR", "🇹🇷"],
    ["TV", "🇹🇻"],
    ["TW", "🇨🇳"],
    ["UK", "🇬🇧"],
    ["UM", "🇺🇲"],
    ["US", "🇺🇸"],
    ["UY", "🇺🇾"],
    ["UZ", "🇺🇿"],
    ["VA", "🇻🇦"],
    ["VE", "🇻🇪"],
    ["VG", "🇻🇬"],
    ["VI", "🇻🇮"],
    ["VN", "🇻🇳"]
  ]);
  return flags.get(x.toUpperCase());
}

//From Peng-YM's OpenAPI.js
function ENV() {
  const e = "undefined" != typeof $task,
    t = "undefined" != typeof $loon,
    s = "undefined" != typeof $httpClient && !this.isLoon,
    o = "function" == typeof require && "undefined" != typeof $jsbox;
  return {
    isQX: e,
    isLoon: t,
    isSurge: s,
    isNode: "function" == typeof require && !o,
    isJSBox: o
  };
}
function HTTP(e, t = {}) {
  const { isQX: s, isLoon: o, isSurge: n } = ENV();
  const i = {};
  return (
    ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(
      r =>
        (i[r.toLowerCase()] = i =>
          (function(i, r) {
            (r = "string" == typeof r ? { url: r } : r).url = e
              ? e + r.url
              : r.url;
            const h = (r = { ...t, ...r }).timeout,
              c = {
                onRequest: () => {},
                onResponse: e => e,
                onError: e => {
                  throw e;
                },
                ...r.event
              };
            let u = null;
            c.onRequest(r),
              (u = s
                ? $task.fetch({ method: i, ...r })
                : new Promise((e, t) => {
                    (n || o ? $httpClient : require("request"))[
                      i.toLowerCase()
                    ](r, (s, o, n) => {
                      s
                        ? t(s)
                        : e({
                            statusCode: o.status || o.statusCode,
                            headers: o.headers,
                            body: n
                          });
                    });
                  }));
            const l = new Promise((e, t) => {
              setTimeout(t, h, `${i} URL: ${r.url} exceeded timeout ${h} ms!`);
            });
            return (h ? Promise.race([u, l]) : u)
              .then(e => c.onResponse(e))
              .catch(e => {
                c.onError(e);
              });
          })(r, i))
    ),
    i
  );
}
function API(e = "untitled", t = !1) {
  const { isQX: s, isLoon: o, isSurge: n, isNode: i, isJSBox: r } = ENV();
  return new (class {
    constructor(e, t) {
      (this.name = e),
        (this.debug = t),
        (this.http = HTTP()),
        (this.env = ENV()),
        (this.node = (() => {
          if (i) {
            return { fs: require("fs") };
          }
          return null;
        })()),
        this.initCache();
      Promise.prototype.delay = function(e) {
        return this.then(function(t) {
          return ((e, t) =>
            new Promise(function(s) {
              setTimeout(s.bind(null, t), e);
            }))(e, t);
        });
      };
    }
    initCache() {
      if (
        (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")),
        (o || n) &&
          (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")),
        i)
      ) {
        let e = "root.json";
        this.node.fs.existsSync(e) ||
          this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e =>
            console.log(e)
          ),
          (this.root = {}),
          (e = `${this.name}.json`),
          this.node.fs.existsSync(e)
            ? (this.cache = JSON.parse(
                this.node.fs.readFileSync(`${this.name}.json`)
              ))
            : (this.node.fs.writeFileSync(
                e,
                JSON.stringify({}),
                { flag: "wx" },
                e => console.log(e)
              ),
              (this.cache = {}));
      }
    }
    persistCache() {
      const e = JSON.stringify(this.cache);
      s && $prefs.setValueForKey(e, this.name),
        (o || n) && $persistentStore.write(e, this.name),
        i &&
          (this.node.fs.writeFileSync(
            `${this.name}.json`,
            e,
            { flag: "w" },
            e => console.log(e)
          ),
          this.node.fs.writeFileSync(
            "root.json",
            JSON.stringify(this.root),
            { flag: "w" },
            e => console.log(e)
          ));
    }
    write(e, t) {
      this.log(`SET ${t}`),
        -1 !== t.indexOf("#")
          ? ((t = t.substr(1)),
            n & o && $persistentStore.write(e, t),
            s && $prefs.setValueForKey(e, t),
            i && (this.root[t] = e))
          : (this.cache[t] = e),
        this.persistCache();
    }
    read(e) {
      return (
        this.log(`READ ${e}`),
        -1 === e.indexOf("#")
          ? this.cache[e]
          : ((e = e.substr(1)),
            n & o
              ? $persistentStore.read(e)
              : s
              ? $prefs.valueForKey(e)
              : i
              ? this.root[e]
              : void 0)
      );
    }
    delete(e) {
      this.log(`DELETE ${e}`),
        delete this.cache[e],
        -1 !== e.indexOf("#")
          ? ((e = e.substr(1)),
            n & o && $persistentStore.write(null, e),
            s && $prefs.setValueForKey(null, e),
            i && delete this.root[e])
          : (this.cache[e] = data),
        this.persistCache();
    }
    notify(e, t = "", h = "", c = {}) {
      const u = c["open-url"],
        l = c["media-url"],
        a = h + (u ? `\n点击跳转: ${u}` : "") + (l ? `\n多媒体: ${l}` : "");
      if (
        (s && $notify(e, t, h, c),
        n && $notification.post(e, t, a),
        o && $notification.post(e, t, h, u),
        i)
      )
        if (r) {
          require("push").schedule({ title: e, body: (t ? t + "\n" : "") + a });
        } else console.log(`${e}\n${t}\n${a}\n\n`);
    }
    log(e) {
      this.debug && console.log(e);
    }
    info(e) {
      console.log(e);
    }
    error(e) {
      console.log("ERROR: " + e);
    }
    wait(e) {
      return new Promise(t => setTimeout(t, e));
    }
    done(e = {}) {
      s || o || n
        ? $done(e)
        : i &&
          !r &&
          "undefined" != typeof $context &&
          (($context.headers = e.headers),
          ($context.statusCode = e.statusCode),
          ($context.body = e.body));
    }
  })(e, t);
}
