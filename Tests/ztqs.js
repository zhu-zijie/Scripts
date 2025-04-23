/**********************************************
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body hhttps://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/ztqs.js
[mitm] 
hostname = buy.itunes.apple.com
**********************************************/

var body = JSON.parse($response.body);

body = {
  environment: "Production",
  receipt: {
    receipt_type: "Production",
    app_item_id: 6446446808,
    receipt_creation_date: "2023-09-16 17:14:12 Etc/GMT",
    bundle_id: "com.SuperThesis.Thesis",
    in_app: [
      {
        quantity: "1",
        purchase_date_ms: "1694884348000",
        expires_date: "2093-09-19 17:12:28 Etc/GMT",
        expires_date_pst: "2093-09-19 10:12:28 America/Los_Angeles",
        is_in_intro_offer_period: "false",
        transaction_id: "190001723691281",
        is_trial_period: "true",
        original_transaction_id: "190001723691281",
        purchase_date: "2023-09-16 17:12:28 Etc/GMT",
        product_id: "qtzs_vip_year",
        original_purchase_date_pst: "2023-09-16 10:12:29 America/Los_Angeles",
        in_app_ownership_type: "PURCHASED",
        original_purchase_date_ms: "1694884349000",
        web_order_line_item_id: "190000777886674",
        expires_date_ms: "1695143548000",
        purchase_date_pst: "2023-09-16 10:12:28 America/Los_Angeles",
        original_purchase_date: "2023-09-16 17:12:29 Etc/GMT",
      },
    ],
    download_id: 502787298214239200,
    adam_id: 6446446808,
    receipt_creation_date_pst: "2023-09-16 10:14:12 America/Los_Angeles",
    request_date: "2023-09-16 17:14:14 Etc/GMT",
    request_date_pst: "2023-09-16 10:14:14 America/Los_Angeles",
    version_external_identifier: 859917331,
    request_date_ms: "1694884454500",
    original_purchase_date_pst: "2023-09-16 10:13:56 America/Los_Angeles",
    application_version: "1",
    original_purchase_date_ms: "1694884436000",
    receipt_creation_date_ms: "1694884452000",
    original_application_version: "1",
    original_purchase_date: "2023-09-16 17:13:56 Etc/GMT",
  },
  status: 0,
  latest_receipt:
    "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",
  latest_receipt_info: [
    {
      quantity: "1",
      purchase_date_ms: "1694884348000",
      expires_date: "2099-09-19 17:12:28 Etc/GMT",
      expires_date_pst: "2099-09-19 10:12:28 America/Los_Angeles",
      is_in_intro_offer_period: "false",
      transaction_id: "190001723691281",
      is_trial_period: "true",
      original_transaction_id: "190001723691281",
      purchase_date: "2023-09-16 17:12:28 Etc/GMT",
      product_id: "qtzs_vip_year",
      original_purchase_date_pst: "2023-09-16 10:12:29 America/Los_Angeles",
      in_app_ownership_type: "PURCHASED",
      subscription_group_identifier: "21355328",
      original_purchase_date_ms: "1694884349000",
      web_order_line_item_id: "190000777886674",
      expires_date_ms: "1695143548000",
      purchase_date_pst: "2023-09-16 10:12:28 America/Los_Angeles",
      original_purchase_date: "2023-09-16 17:12:29 Etc/GMT",
    },
  ],
  pending_renewal_info: [
    {
      product_id: "qtzs_vip_year",
      original_transaction_id: "190001723691281",
      auto_renew_product_id: "pth_vip_year",
      auto_renew_status: "1",
    },
  ],
};

$done({ body: JSON.stringify(body) });
