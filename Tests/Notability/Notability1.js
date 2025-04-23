/******************************
[rewrite_local]
^https?:\/\/notability\.com\/global url script-response-body https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/Notability/Notability1.js
[mitm]
hostname = notability.com
*******************************/

let body = JSON.parse($response.body);

body = {
  data: {
    processAppleReceipt: {
      error: 0,
      subscription: {
        productId: "com.gingerlabs.Notability.premium_subscription",
        originalTransactionId: "570001184068302",
        tier: "premium",
        refundedDate: null,
        refundedReason: null,
        isInBillingRetryPeriod: false,
        expirationDate: "2099-09-09T09:09:09.000Z",
        gracePeriodExpiresAt: null,
        overDeviceLimit: false,
        expirationIntent: "CUSTOMER_CANCELLED",
        __typename: "AppStoreSubscription",
        user: null,
        status: "canceled",
        originalPurchaseDate: "2022-09-09T09:09:09.000Z",
      },
      __typename: "SubscriptionResult",
    },
  },
};

$done({ body: JSON.stringify(body) });
