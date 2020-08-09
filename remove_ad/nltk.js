/*
⚠️【免责声明】
------------------------------------------
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

能力天空去开屏、推荐广告Quantumult X配置
[mitm]
ai.ablesky.com, api.weibo.com, mobile.ablesky.com, www.ablesky.com

[rewrite_local](注意路径）
#微博广告
https:\/\/api\.weibo\.com\/oauth2\/getaid url reject
#开屏时间
https:\/\/ai\.ablesky\.com\/ajax\/ads\/appads url script-response-body local/Quantumult_X/remove_ad/nltk.js
#今日热学
https:\/\/www\.ablesky\.com\/s\/sr\.do\?action\=single\&appRandom url reject
#推荐页面
https:\/\/mobile\.ablesky\.com\/course\.do\?action\=recommended\&appRandom url reject
#首页推荐
https:\/\/www\.ablesky\.com\/ajax\/ableskytag\/account\/getTabMenuList url reject
#杂七杂八
https:\/\/www\.ablesky\.com\/ajax\/account\/history\/list\?\&appRandom url reject
https:\/\/www\.ablesky\.com\/taskTrigger\.do\?appRandom url reject
https:\/\/ai\.ablesky\.com\/ajax\/orgPublicImg\/show\?appRandom url reject

*/

let obj=JSON.parse($response.body);

obj={
  "success": true,
  "id": 0,
  "result": {
    "list": [{
      "startDate": 1585065600000,
      "duration": "0",
      "showLocation": null,
      "endDate": 1619366399000,
      "adType": "0",
      "courseId": null,
      "photoUrl": "",
      "showPage": null,
      "url": ""
    }]
  }
}

$done({body: JSON.stringify(obj)})
