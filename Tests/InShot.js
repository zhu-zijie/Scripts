/**********************************************
[rewrite_local]
# InShot
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/zhu-zijie/Scripts/main/Tests/InShot.js
[mitm]
hostname = buy.itunes.apple.com
**********************************************/

let body = JSON.parse($response.body);
let bundle_id = body.receipt.bundle_id;

if (bundle_id == "com.camerasideas.InstaShot") {
  body = {
    status: 0,
    environment: "Production",
    receipt: {
      receipt_type: "Production",
      adam_id: 1000000000,
      app_item_id: 1000000000,
      bundle_id: "com.camerasideas.InstaShot",
      application_version: "437",
      download_id: 99999999999999,
      version_external_identifier: 999999999,
      receipt_creation_date: "2111-11-11 11:11:11 Etc/GMT",
      receipt_creation_date_ms: "4476655324000",
      receipt_creation_date_pst: "2111-11-11 11:11:11 America/Los_Angeles",
      request_date: "2011-11-11 11:11:11 Etc/GMT",
      request_date_ms: "1555555555555",
      request_date_pst: "2011-11-11 11:11:11 America/Los_Angeles",
      original_purchase_date: "2011-11-11 11:11:11 Etc/GMT",
      original_purchase_date_ms: "1555555555555",
      original_purchase_date_pst: "2011-11-11 11:11:11 America/Los_Angeles",
      original_application_version: "433",
      in_app: [
        {
          quantity: "1",
          product_id: "com.camerasideas.InstaShot.InShotPro_yearly",
          transaction_id: "520000000000000",
          original_transaction_id: "520000000000000",
          purchase_date: "2011-11-11 11:11:11 Etc/GMT",
          purchase_date_ms: "1555555555555",
          purchase_date_pst: "2011-11-11 11:11:11 America/Los_Angeles",
          original_purchase_date: "2011-11-11 11:11:11 Etc/GMT",
          original_purchase_date_ms: "1555555555555",
          original_purchase_date_pst: "2011-11-11 11:11:11 America/Los_Angeles",
          expires_date: "2111-11-11 11:11:11 Etc/GMT",
          expires_date_ms: "4476655324000",
          expires_date_pst: "2111-11-11 11:11:11 America/Los_Angeles",
          web_order_line_item_id: "520000000000000",
          is_trial_period: "true",
          is_in_intro_offer_period: "false",
        },
      ],
    },
    latest_receipt_info: [
      {
        quantity: "1",
        product_id: "com.camerasideas.InstaShot.InShotPro_yearly",
        transaction_id: "520000000000000",
        original_transaction_id: "520000000000000",
        purchase_date: "2011-11-11 11:11:11 Etc/GMT",
        purchase_date_ms: "1555555555555",
        purchase_date_pst: "2011-11-11 11:11:11 America/Los_Angeles",
        original_purchase_date: "2011-11-11 11:11:11 Etc/GMT",
        original_purchase_date_ms: "1555555555555",
        original_purchase_date_pst: "2011-11-11 11:11:11 America/Los_Angeles",
        expires_date: "2111-11-11 11:11:11 Etc/GMT",
        expires_date_ms: "4476655324000",
        expires_date_pst: "2111-11-11 11:11:11 America/Los_Angeles",
        web_order_line_item_id: "520000000000000",
        is_trial_period: "true",
        is_in_intro_offer_period: "false",
        subscription_group_identifier: "99999999",
      },
    ],
    latest_receipt: "",
    pending_renewal_info: [
      {
        auto_renew_product_id: "com.camerasideas.InstaShot.InShotPro_yearly",
        original_transaction_id: "520000000000000",
        product_id: "com.camerasideas.InstaShot.InShotPro_yearly",
        auto_renew_status: "1",
      },
    ],
  };
}
$done({
  body: JSON.stringify(body),
});
