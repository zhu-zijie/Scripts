/******************************
修复 VVebo 用户时间线和粉丝列表
参考：https://raw.githubusercontent.com/suiyuran/stash/main/scripts/fix-vvebo-user-timeline.js
     https://raw.githubusercontent.com/suiyuran/stash/main/scripts/fix-vvebo-fans.js
2026-05-16：更新为新版逻辑，修复用户时间线和粉丝列表。

[mitm]
hostname = api.weibo.cn

[rewrite_local]
^https:\/\/api\.weibo\.cn\/2\/users\/show\? url script-request-header https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/vvebo.js
^https:\/\/api\.weibo\.cn\/2\/remind\/unread_count\? url script-request-header https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/vvebo.js
^https:\/\/api\.weibo\.cn\/2\/statuses\/user_timeline\? url script-request-header https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/vvebo.js
^https:\/\/api\.weibo\.cn\/2\/profile\/statuses\/tab\? url script-response-body https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/vvebo.js
^https:\/\/api\.weibo\.cn\/2\/cardlist\? url script-response-body https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/vvebo.js

*****************************************/

let url = $request.url;
let hasUid = (url) => url.includes("uid");
let getUid = (url) => (hasUid(url) ? url.match(/uid=(\d+)/)[1] : undefined);
const uidKey = "weibouid";

if (url.includes("remind/unread_count") || url.includes("users/show")) {
  let uid = getUid(url);
  if (uid) {
    $prefs.setValueForKey(uid, uidKey);
  }
  $done({});
} else if (url.includes("statuses/user_timeline")) {
  let uid = getUid(url) || $prefs.valueForKey(uidKey);
  url = url
    .replace("statuses/user_timeline", "profile/statuses/tab")
    .replace("max_id", "since_id");
  url = url + `&containerid=230413${uid}_-_WEIBO_SECOND_PROFILE_WEIBO`;
  $done({ url });
} else if (url.includes("profile/statuses/tab")) {
  try {
    let data = JSON.parse($response.body);
    let statuses = data.cards
      .map((card) => (card.card_group ? card.card_group : card))
      .flat()
      .filter((card) => card.card_type === 9)
      .map((card) => card.mblog)
      .map((status) => (status.isTop ? { ...status, label: "置顶" } : status));
    let sinceId = data.cardlistInfo.since_id;
    let body = JSON.stringify({
      statuses,
      since_id: sinceId,
      total_number: 100,
    });
    $done({ body });
  } catch (e) {
    console.log("解析出错：" + e);
    $done({});
  }
} else if (url.includes("cardlist") && url.includes("selffans")) {
  try {
    let data = JSON.parse($response.body);
    let cards = data.cards.filter((card) => card.itemid !== "INTEREST_PEOPLE2");
    let body = JSON.stringify({ ...data, cards });
    $done({ body });
  } catch (e) {
    console.log("解析出错：" + e);
    $done({});
  }
} else {
  $done({});
}
