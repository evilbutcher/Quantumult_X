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

bbdc解锁Quantumult X配置
[mitm]
121.43.19.216, sapi.beingfine.cn

[rewrite_local](注意路径）
^https:\/\/sapi\.beingfine\.cn\/v3\/report\/launch\/ url script-response-body bbdc.js

*/

let obj=JSON.parse($response.body);

var text = obj.data_body
var atext = text.replace(new RegExp(/(expire_date\":)\d+/,"gm"),"expire_date\":4586691111000")
var btext = atext.replace(new RegExp(/granted\":\d+/,"gm"),"granted\":1")
var ctext = btext.replace(new RegExp(/user_type\\\"\:\d+/,"gm"),"user_type\":3")
var dtext = ctext.replace(new RegExp(/collins_user_type\\\"\:\d+/,"gm"),"collins_user_type\":3")
obj.data_body = dtext

//obj.data_body="{\"user_info\":{\"Email\":\"\",\"is_new_user\":1,\"nickname\":\"30602963\",\"avatar_image\":\"/AvatarImage/wechat/253310946.jpg\",\"id\":30602963},\"bindings\":{\"sns_bindings\":{\"huawei\":0,\"xiaomi\":0,\"oppo\":0,\"wechat\":1,\"sina\":0,\"qzone\":0},\"primary_binding\":\"wechat\"},\"privileges\":{\"wordroot\":{\"expire_date\":4586691111000,\"user_type\":3,\"granted\":1},\"collins\":{\"expire_date\":4586691121000,\"granted\":1,\"collins_user_type\":3}},\"user_status\":{\"total_coin\":10,\"task_status\":{\"finish_study\":0,\"share_to_sns\":0,\"finish_spell\":0,\"finish_review\":0},\"sign_in_continuous_days\":1,\"logged_off\":0,\"login_prompt\":\"你上次使用 微信 登录过\"},\"actions\":{\"card_action\":{\"enable\":0},\"web_page\":{\"enable\":0,\"url\":\"\"},\"float_button_action\":{\"enable\":0},\"bind_phone_action\":0},\"base_info\":{\"coin_reward\":{\"finish_study\":20,\"share_to_sns\":5,\"finish_spell\":20,\"signin\":10,\"finish_review\":10},\"config\":{\"upload_user_action\":0}},\"dashboard_calendar\":[{\"study\":0,\"timestamp\":1586016060000,\"sign_in\":1}],\"dashboard_sign_in\":{\"continuous_days\":1,\"total_days\":1}}"

$done({body: JSON.stringify(obj)})
