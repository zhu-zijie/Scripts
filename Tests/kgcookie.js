/**********************
酷狗参数获取
[rewrite_local]
^https:\/\/gateway\.kugou\.com\/youth\/v1\/activity\/get_listen_song_task\?appid=.*$ url script-request-header https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/kgcookie.js

[mitm]
hostname = gateway.kugou.com
**********************/

const url = $request.url;

const match = url.match(/[?&](appid=[^#]+)/);

if (match) {
  const KUGOU_QUERY = match[1];

  $prefs.setValueForKey(KUGOU_QUERY, "KUGOU_QUERY");

  console.log("KUGOU_QUERY 已更新");
  console.log(KUGOU_QUERY);

  $notify("哈哈，获取成功！", "KUGOU_QUERY 已更新", KUGOU_QUERY);
}

$done({});
