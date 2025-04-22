/* 
芒果TV 2024.7.29
适配了Mac版本iPad版本 
脚本仅供学习和个人使用，不得用于商业目的或其他非法用途
可以直接使用Walala的净化广告以及包含会员数据的脚本
感谢@RuCu6
[rewrite_local]
#播放页开通提示移除
http://vip.bz.mgtv.com/client/dynamic_entry url reject

#ios
^http[s]?:\/\/mobile\.api\.mgtv\.com\/v[0-9]\/(playlist|video\/album|video\/relative|video\/list).*$ url script-request-header https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/MGTV/mgtv1.js
https://mobile-stream.api.mgtv.com/v1/video/source? url script-request-header https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/MGTV/MGTV.js
https://nuc.api.mgtv.com/GetUserInfo url script-response-body https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/MGTV/mgtv3.js
https://mobile-stream.api.mgtv.com/v1/video/source url script-response-body https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/MGTV/mgtv3.js

#港区
^https://mobile.api.mgtv.com/v8/video/getSource url script-request-header https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/MGTV/MGTV.js

#mac
https://pcc.api.mgtv.com/video/getSource url script-request-header https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/MGTV/MGTV.js

#ipad
https://pad.api.mgtv.com/v8/video/getSource url script-request-header https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/MGTV/MGTV.js

[mitm] 
hostname = *.mgtv.com, pad.api.mgtv.com, pcc.api.mgtv.com

*/

let url = $request.url;
let updatedUrl = url;
if (url.includes("video/getSource"))
  updatedUrl = url.replace(
    /([?&]ticket=)\w{32}/,
    "$1" + "4F0342C744893BC5BE2EE7BEFFB0DAFD"
  );
else
  url.includes("video/source") &&
    (updatedUrl = url.replace(
      /([?&]ticket=)\w{32}/,
      "$1" + "4F0342C744893BC5BE2EE7BEFFB0DAFD"
    ));
$done({
  url: updatedUrl,
});
