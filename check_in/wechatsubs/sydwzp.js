/*
【事业单位招聘监控】@evilbutcher

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
脚本或BoxJs填入要监控的地区即可。

【Surge】
-----------------
[Script]
事业单位招聘监控 = type=cron,cronexp=5 * * * *,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/wechatsubs/sydwzp.js

【Loon】
-----------------
[Script]
cron "5 * * * *" script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/wechatsubs/sydwzp.js, tag=事业单位招聘监控

【Quantumult X】
-----------------
[task_local]
5 * * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/wechatsubs/sydwzp.js, tag=事业单位招聘监控

【Icon】
透明：https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/picture/sydw_tran.png
彩色：https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/picture/sydw.png
*/

const $ = new API("sydwzp", true);
const ERR = MYERR();

var area = "北京"; //👈本地关键词在这里设置。
$.refreshtime = 6; //重复内容默认在6小时内不再通知，之后清空，可自行修改
$.saveditem = [];
$.url = "";

!(async () => {
  init();
  await check($.area, $.saveditem);
  await getdetail($.url, $.saveditem);
})()
  .catch((err) => {
    if (err instanceof ERR.ParseError) {
      $.notify("事业单位招聘监控", "❌ 解析数据出现错误", err.message);
    } else {
      $.notify(
        "事业单位招聘监控",
        "❌ 出现错误",
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      );
    }
  })
  .finally(() => $.done());

function check(area, saveditem) {
  const url = `https://www.qgsydw.com/api/sys/stl/actions/search`;
  const headers = {
    "X-Requested-With": `XMLHttpRequest`,
    Connection: `keep-alive`,
    "Accept-Encoding": `gzip, deflate, br`,
    "Content-Type": `application/json`,
    Origin: `https://www.qgsydw.com`,
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1`,
    Host: `www.qgsydw.com`,
    Referer: `https://www.qgsydw.com/qgsydw/area.html?word=${encodeURI(
      area
    )}&channelID=32&type=GroupNameCollection&date=0`,
    "Accept-Language": `zh-cn`,
    Accept: `application/json, text/javascript, */*; q=0.01`,
  };
  const body = `{"isallsites":false,"sitename":"","sitedir":"","siteids":"","channelindex":"","channelname":"","channelids":"","type":"GroupNameCollection","word":"${area}","dateattribute":"AddDate","datefrom":"","dateto":"","since":"","pagenum":0,"ishighlight":false,"siteid":"1","ajaxdivid":"ajaxElement_1_259","template":"UGwmJ5V68BHefSYdezE0add0RBWCK0add0Nwtxi2g0add0aI0add0sirknrCZ5W4BIcglBqC0add0A9G7wnL28uewF6obmz7R0add0bcyH54EXzxyYQjFv6JU7EBzLYBV6uOGIBgN0add06ypzf8acobG5OoXe0add0mxJhyJx4R9NOr0add08Ysj1UKz0add0tOrAdGkEwN6ofoirk3XzVBILy4oH1cRqi0add063Z7CiFAiW4V0SnsPLAj99umvkN3tLeEcWrvVP0add0amM6DyuT0add0Y0add0Wrn66oSIu84hlueluJgCbnAv0J5EWZaWk7uot8DH1kCqCYtGRrvg0Zu9L7E0slash0F7BOwl4Ja7NVs67xt6n60add0H2zxiOl9bEXcC8OZlZ4o97j3WeMccRIXaBfW70add0dbuqtqogFFQ0slash0VE5B10add08wODk8A9QBS4R4Bw2WqKCC64HJ4RgR6qleK9bgeLZzsIB21pJFrVHFESHMk3XCy93j0add0BcOhnhJkYIapZF0slash0zwv6gYw0add0MVMAA62Pvp5jY3t0slash00QpPacUtFFhsyqm3y3Legoo3vLIbLz0SZ0DzRVTn1hGNLJkgGTtEZ0slash0S0add0VmBJ22FOa4e78CQ8CyoNvE3SZBj0Kzs3eubwkfGMptwYnlytkIcEYqSwqJIUs89Q7wYzBHHHtrusKtc41ZMVo1HmpFvCQLhb0slash0r8umMyy5Q6F8usY0add0SnLjT7cNNPzIzduLGG50hnW0HsEroc02ldgNTXkiSFWKBtDx7Au0slash0NRC3HbiV4mPQOrJGkq3sAMpPHC6gItWn0OBRRihoPK5zhM4qFCQwg1t0add0VBsDVqrpR5I0add0IaSWZ0eGH0slash0DrdNMGHgY4e4ftRo5IoWrKG0bbUu6RZiM3Y0slash0l8MZyrLH613POrr90add0NLmM0slash0QNFtPTNifU4QP3maCe0add0k8pdFIi6eBhmPYhW89zZEbPL50slash0MOVLrdI4h6uubTwBSfKS1RMl52pJtsRe0add0GmeFoCGOBMCggI6tDCeN0add0xo6UN3FlWyd91O5x0add04Owo4mOuA1gDpeBF0slash0yWLf3JCDE4mBLB3OH0slash01Koj0ThOt5nkFIoEwinkrR0c4TyFvKu23owQNJRkBMG0add0f0add0aoHYaMvRSjw1jF0add0BtlwMznBeo5f34Y0add0t8RDKIQ4q82pDnismPeC2feiRhNJV37wGeED036W6mdU38QI3eTredjwxhrzIJ67FByxvkdiAS5Xf8EbTQB8nUa6QbrWoZYAdQzbXPspVpi1CGcugD1Rpqfeces4tbQKh0slash0mSdjF0add0oDd1YzfJdM3c10add0vyYiQLYEZ3zGjp77XV6u7QHAMpOoMiqejLbGOXAC10add0BTGDZp0slash0h0slash0w0FWuogVS980add0zkjJI3ipZM0SkZQsmCVWtPMWDheBkWUbt5g2GrbLe61TL0add0y4CBNZ4vSlUFfIbORNP0slash0X5MWikADsROqwC6qZ8D2y4A0slash0reJ0g0slash0Gzq5hEdgoz1FZExhKN7SMIpnbA9AxLQ2GD7bG5NfB5Y8rhvY0add0PQaYlOWrjt461z6SUa5g0slash0PDwFvoMXYkg35g2T7WKODD8MpPGZMEpHJhk0AOUBNSCGXRY0arnsULjVhlkKhE7mtOc0add064MwFa0ziE00slash0esFTignYS2s0add0E7q5XmC4G09Zfq0slash00f72FZstIu9yJnMGXXgy8jYC3tDgx21nLIzFF1L0kU5ZScxaQWjf0slash0K0SPaZIgTRhrVecfrBpn0add0LchPEq0zzddUdYxJt7JtmuLLCGEZZk37pkgLTv5j4fy2gBaMswORE1OlB46KVEiYXHHokEzBSrBFt0add0SGgogtkNngvYQ7n17FXTPYjdRVMdxKLjfBnIZweVfzUp9RwmBFD7KvSYU526AhX2FCN0YQCpXZsIYQb3qXl3noe9R17zl0Ksomt0slash043BVWtKyO39Y8Gbt8qPvDKTS1Xpynvnw03s4FJVDjpuxLGUmTaKR8oA5b0add0xvaa0add00o0slash0p0urPoHPY0add0yAL3e1E5R5fdKiR1kUEZdNh5WdqkHABi0slash0r9hP47dqCxpmOYYQ24HT4KedTn0kHDEUSWwCXeMCxBRZ1TDn34N4Dt2mKQS4s13lai0add0HWguO9UvO3GUUFzxHPTVxrevLd6Gi7lijJXSSqVyw8qMKYQwamVxgtwDotb85ZSxWPhDYnGXJ0add0Skdh3AzQgXn0slash0u8h3KOvdkNSnxMHPF6AWCSjvvSN3zlFsHJoYlWEW1zK0add05x3kxAQRSq4B2MKJedX6dVW7tWIAXp2hbvJUHUEWtbiJlzpWnb0add0rVE0add0t3uw3e31wtmi8d5MMT6xyBvddqTb2Z1OW7gLYQC0Ua1fil3c1B60add00njr9pqAiAcFVf3VvbYaH1BpGT0slash0AQLtUIgLNPP1waowAeGSEyV0pSWcNsXwTNgByF0add0A7O9zG30slash0wGa4Nw9deyi1OGsWz6AwJ0add0WtwO599Re0add0dDTaGCvodE3QNgB0slash0sdqieoQbV92i1vER7EwnNPqjHBn0slash0Ai9SwYOd0slash0Kc0slash0FDFBzLGsxKPQ0slash05B8Ix3OacFWRA3JnsB0JxYihSP5Msc0add04Nx70add0QVEWocb0slash0gLMUaUEWtwAPQhpZZECc9Lff4dUl2wBK0slash0sTboCBG0slash0CgINIUvWDdNqy2CvXd30jdOkeF4z7p7QlNOKFctBM252MKZUReuZ1vS2PurU7yqcCw0add0LM0j7vUzwdlH08CpnUbxrA38m8tVel1Nv6SNIMdWd1knkAQ0MX4W906FDAQAD9z9IpAa0add0GBEnUC481y3TxxF3JWEvLRnLy8gxs2yU0dACA3xSvDBPFsjj7YWjOhXolzNf0cEmsrzRz2aZeX2KdpZOmdmrEaHZeBLvQxCYlzU0slash0ZfkPkOno7lQv2uwnY2w5epTlTnMNkT0qVqdrVBsQ4IXXKH21gRlxHKoOPsizvKB8WmHP5wMSCOb3nDiXyd64bqp0slash0Zmo21ynIy8m417i8l7mtVT8VNUBlgVyXr7ElRIM2yfdk5v5ehn6Z60Lo7OmE3Ki4MSmB1eiMC9VjStdxj0add0PuVQEkc2snRPzb0slash0s5WiEr7rgkKvXHwNZKdgMathkM00bZDR83JyVHpDY9o8eYUkFXddac0add0GOpCIuzw0slash0NxoseuqWdo0FqlnOUzlUkR0add0MzPsdvFjykK819KGB1LOIZgjo2mIItEuxr4LokHbaXqLzeE6xyWI3uYJbbQneO8ZhkFKEptHA9MFZxB26qULiG050CZRlr0add0XuBWdAwUKLY84VS7CBtVYa7l5CENLGBaUC40slash0M0add0QPDwQtp3dfAXrBptF5ebWleRH6xdFlS2I6rDYg4noeMxR8mCQvXtaqHy6zFzAaZvl0add0KMJ0add0ZWVwBmufrhGwRnec8kKCsuxK9p42tarqUEG6eadKrj0kr2LNGIa3EAVDX1IV5na8oihpkypW0bkhpfbafQP545dKvRuIhoYfU4bmvg0slash0SUAY4DkND0slash0MncPphoB7vRM0rugOF40add09CS8acMQ1nYuJWkcDLGb0add0zCz6XDek0add0Fx3aREyPM7oWJqfTQNwPFksFjVKEOBe4o0slash0HwqS7L34mb6kuy80DfdW60slash0GQmOFkaeu6Vchg0add0u0slash0vGNCTJ0slash0gLbePJj90add0UeCIb4N0slash0PC0slash01DgCjIBKkaliy0G5clh1nnjE0add0sM0NaKoDm24RiG1uKsFQ20slash0z9di10hsWyKvewaTcZAW38DQTGG0slash0dvukdiT8zMN5YMkWCUfuwuWYgOD0slash0kr6JdRZ0ovaADbn4MRuNAs9ISe6zxLIfqVeafhpoTqOhZiw0add0bK6PVCdZYJlsNwn20slash0zIwQr8ixmM9a8sezorvg3EY8IrwwtkMIgYa0slash0dCJZiFn9XZApnxt6FoPF8tJA6VC8EKZ0slash01187RnwqiJ1douOKejmfiPbPZNJ1Appb2XTD44qVn97yM7y54qfESnMn6QhWlpVah0add0KFEFqERcHEwiMc1kETVXCKJ8tIZJywvT94ZTUL30add0wP1JAdG69EHNs5sPB8B4sZyivH40slash0RoI0AKeoFmS0jMSsvcwlaNxNLtSXlJjAL0TOcQg0slash02NAdiCn1SSVD9TjE5k4LeS20slash0WsdahWwXdoJ2luR9TeNP8mFmG0add0yhAY0slash0yD50slash00UAgmpJ58e0sjQMO5kO4QoFolob0add09zi10slash0Wr5Sw54WY0slash0JkqlGxAOP4NR6tEF7Z1UP1zWnhTlJB3SKqL2joRl7M51FprAPDmdefeYW5MwF8YWV4UBiBDJEP8kMyy5uhHfHlS7x0Z3NT4bLEj5JZMkLnQ6CE0pFBsKzxtziN0add0qErGTzwT2FPcy6G4PDFITbK6VQ0add0NgqiaLbB0F0add08g1djPrg3soJrA9WXW9K4DgvWVMU3kBcAhmmsiPt5ttK2P7UKfwnen8ysPgj8nKC5iSJ0add0xO12BizfpBh8TyLJIkvjM5xNtVmq0846l5O2PVZTVTnAgCrbSE5wwCNLsAq9JpenUGHYP0vOgFIP4oMwAbbEfbDD22zj8tByHLsaGTKQVdMgR7xPMUbpWza2SzXS0add040add0FbUPIA1N0pwK7SAfdoBp2rJ0eOmGNUKuGlXLwO0add0NRIV0add0SiPJ0i81FLEIPVlffnza6FY1SI0add0uc38BTajuTSlX4H5rQfDRAwdUNCYbmhtV42BrPX1WaV5heZbvdHdEXTWIV20slash0EJvxK9VadKIBrOShkvawX8YcVdLglZtwWal4cnIfVEthu41Jo0HspdEvCmE0add0ekAZL40V0MS8VXd4olXUICf0X0add092ksmaAopMVmXaHgQaz1vE23Q4f2MouwieWwuXm50slash0GWZJ7txULe6cMwNiA4gV2Pim2F6tDIFXQSlGAtkn91kv5uqtKfC4asdDn0slash0bDBx38BpwvzyrbP0add0vnBFVgCFOyOgJgeIAVZih0slash0UMEfoFMF9reyJznrGT9lacJgtpza51kn7vZY4ejPNlSB5Iv1qNtx7dixyxXpRnmBUE0pAsypAk47gEeiMGR0add056Ok2c6G7uC74YEcRcgL5jooKnThvE13ii2eOIBD6by9ph70lj5ka5EN5u0slash0Z0slash0bdVGgnMIikDZVyUynCjV5WdS0add07FNAsLG6jmdmczgU0b9TdAHsSautyBXzTFseuCWrae9rvz2T52TOVW8Bl2rsI3zpGGI0add0IU8AYMm547iD19CzuHOPhw8MtG81eODIPMakpfa8Zf1Yb0YS2uRD0add0SzUUzbOqklp6OoLUn1eilWSTWELMFbpNY0add0tYNBh0add0lOiHTOkfp5Acpp7izwnKRe4E1WjG7c6DYzzzLZfeU4L0add0Ovha14VzNscxfQS93TptxwlO0uOXkED1DqAjrSg4btYEA7zGvWbt4QhLVX83V89p9ae0slash0wJFnFKcpwtdPKekorNiPGsGGgTwTgcrm1cD4pIRG9ZJ6eFn3jlJ0slash0fbn5nMrOw0add0IRmnREym20slash0SQ7SSoFQgZMfOfyYXCiZBYe4qTuWjBqF5JfdVheM6ysx4bQqEBBjOX4QjgbTRshscr3WazOFxPcCGF7MU4EVk62nM6D6o98Z6jzrhAaYB60slash0I60add0oDXG23mn0gINZHHaEv3Px5gNTiPXpM3pNxxevTVXt6xZuT6DkFRGCnKlhrtgu0zaHKqvtX5yXV1g9TnMEhr3TmwKnnYSHwF7PAp80add0MHYs1qfDBuRph4ND4KivuSnNX0slash0PEdLfAd4N9Y4QdmTEWET4Cj0add0Qbc2yAty1m0add0QBLijxd4bTDewqQhUYARMd4C7njduxKENTG3VeL9bEaz2UjUCUBNwtGHlLXZJLhuUDeS28GtX1mwEFMtnd0add0M0YCPe8yb1uDzJtsnQH38cCZQPTOnRAnqGhNx8F4HXQdfP4y90RWdEFxRxh37GPlLDjRrx0K5cPt0slash0jNS717ELGyZS73DESG8SMY79d0slash04zXklpLUeHp9o0add0U9dDKh85vNIZIM5dZbWSwS0IDasvoxXSv10CcLoXtvy4t0add0HZYLDnspLul5HM7ecvwM5wUTcgczt1sDi4HPh4rosR1y55Vh3m7IHfrWT6Wco5kINVoAoJTsP0V2HIW51IJB5fzDOHBnjBqpMjBlPLs5FkROp0W8SLdkrbneYvZfCaihOqUOWX0slash0V0add0LvONpIO0slash036KMWjhJ2BZ289PjKWu15BmGNq0add0pOj8x0slash0vBya17aYzC6iXCd9PxzYRyFxBsWTyoB3uavqpmGcVYxiVMTpWqwA58DZjZDZBZHp4tZnG8zEkHgwkv1yMfBfcvoCRuTf8RnKiS4Agj2MfYHX0add0URQUz70add0IFxtE5HnrXNHxo0AQhhuhPkzNh2Rz8F7Vhs4e2jur4qE9f0cYIF7A1lwHwPHtQjpeecQBgCVU8mONhZ2DMx0lSdVe1p3LtXXagN1PMBqwJ5Q1vafsndBi4UCLE0equals00secret0","channelid":"32","date":"0","page":1}`;
  const myRequest = {
    url: url,
    headers: headers,
    body: body,
  };

  return $.http.post(myRequest).then((response) => {
    if (response.statusCode == 200) {
      var geturl = /href\=\\\".*?\\\"/;
      var gettitle = /html\\\"\>.*?\</;
      $.data = response.body;
      var pretitle = $.data.match(gettitle);
      var preurl = $.data.match(geturl);
      var title = JSON.stringify(pretitle).slice(11, -3);
      var url =
        "https://www.qgsydw.com" +
        JSON.stringify(preurl)
          .slice(11, -6)
          .replace(new RegExp(/\s/, "gm"), "");
      $.info(title);
      $.log(url);
      $.url = url;
      if (saveditem.indexOf(title) == -1) {
        $.notify("事业单位招聘监控", title, "", { "open-url": url });
        saveditem.push(title);
      }
      $.write(JSON.stringify($.saveditem), "sydwsaveditem");
    } else {
      $.error(JSON.stringify(response));
      $.notify("事业单位招聘监控", "", "❌ 未知错误，请查看日志");
    }
  });
}

function getdetail(url, saveditem) {
  const headers2 = {
    "Accept-Encoding": `gzip, deflate, br`,
    Connection: `keep-alive`,
    Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
    Host: `www.qgsydw.com`,
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1`,
    "Accept-Language": `zh-cn`,
  };
  const myRequest = {
    url: url,
    headers: headers2,
  };

  return $.http.get(myRequest).then((response) => {
    if (response.statusCode == 200) {
      var getdurl = /qgsydw\/attachment.*?\"/g;
      var getdtitle = /title\=\".*?\"/g;
      $.data2 = response.body;
      var predtitle = $.data2.match(getdtitle);
      var predurl = $.data2.match(getdurl);
      for (var i = 0; i < predtitle.length; i++) {
        var title = predtitle[i].slice(7, -1);
        var url =
          "https://www.qgsydw.com/" +
          predurl[i].slice(0, -1).replace(new RegExp(/\s/, "gm"), "");
        if (saveditem.indexOf(url) == -1) {
          $.notify("招聘附件", "", "点击跳转", { "open-url": url });
          saveditem.push(url);
        }
        $.write(JSON.stringify($.saveditem), "sydwsaveditem");
        $.log(title);
        $.log(url);
      }
    } else {
      $.error(JSON.stringify(response));
      $.notify(
        "事业单位招聘监控",
        "获取详情链接失败",
        "❌ 未知错误，请查看日志"
      );
    }
  });
}

function init() {
  $.area = $.read("sydwarea") || area;
  $.nowtime = new Date().getTime();
  if ($.read("sydwsavedtime") != undefined && $.read("sydwsavedtime") != "") {
    $.savedtime = $.read("sydwsavedtime"); //读取保存时间
  } else {
    $.savedtime = new Date().getTime(); //保存时间为空时，保存时间=当前时间
    $.write(JSON.stringify($.nowtime), "sydwsavedtime"); //写入时间记录
    $.write("[]", "sydwsaveditem"); //写入本地记录
  }
  $.refreshtime = $.read("sydwrefreshtime") || $.refreshtime;
  var minus = $.nowtime - $.savedtime; //判断时间
  if (minus > $.refreshtime * 3600000) {
    $.info("达到设定时间清空本地记录并更新时间");
    $.write(JSON.stringify($.nowtime), "sydwsavedtime");
    $.write("[]", "sydwsaveditem");
  }
  if ($.read("sydwsaveditem") != undefined && $.read("sydwsaveditem") != "") {
    var storeitem = JSON.parse($.read("sydwsaveditem"));
  } else {
    storeitem = [];
  }
  for (var i = 0; i < storeitem.length; i++) {
    $.saveditem.push(storeitem[i]);
  }
  $.info(`地区：${area}`);
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
  const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

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

    return (timer
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
