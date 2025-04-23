/******************************
[rewrite_local]
^https?:\/\/notability\.com\/subscriptions url script-response-body https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/Notability/Notability2.js
[mitm] 
hostname = notability.com
*******************************/

let obj = JSON.parse($response.body);
let modifiedStatus = "HTTP/1.1 200 OK";

obj = {
  data: {
    processAppleReceipt: {
      __typename: "SubscriptionResult",
      error: 0,
      subscription: {
        __typename: "AppStoreSubscription",
        status: "active",
        originalPurchaseDate: "2020-09-28T09:09:09.000Z",
        originalTransactionId: "100109876543210",
        expirationDate: "2999-09-28T09:09:09.000Z",
        productId: "com.gingerlabs.Notability.premium_subscription",
        tier: "premium",
        refundedDate: null,
        refundedReason: null,
        user: null,
      },
    },
  },
};
$done({
  status: modifiedStatus,
  body: JSON.stringify(obj),
});
