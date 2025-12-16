/**
 * 酷狗概念版音乐签到脚本
 * 依赖: axios crypto-js
 * 环境变量: KUGOU_COOKIE KUGOU_QUERY (多账号用 @ 分隔)
 */

const axios = require("axios");
const CryptoJS = require("crypto-js");
const { URLSearchParams } = require("url");

const notify = require("../sendNotify.js");

const KUGOU_COOKIE_ENV = process.env.KUGOU_COOKIE || "";
const KUGOU_QUERY_ENV = process.env.KUGOU_QUERY || "";

const COOKIES = KUGOU_COOKIE_ENV
  ? KUGOU_COOKIE_ENV.split(/@\s*/).filter((c) => c.trim())
  : [];

const QUERY_ARRAY = KUGOU_QUERY_ENV
  ? KUGOU_QUERY_ENV.split(/@\s*/).filter((q) => q.trim())
  : [];

const LOG_PREFIX = "🎵 酷狗签到";
const H5_SECRET = "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt";

function log(...a) {
  console.log(...a);
}

/**
 * 构造查询字符串
 */
function buildQS(obj) {
  const sp = new URLSearchParams();
  Object.keys(obj || {}).forEach((k) => sp.append(k, obj[k]));
  return sp.toString();
}

function readStore() {
  if (!COOKIES?.length || !QUERY_ARRAY?.length) {
    log(`${LOG_PREFIX} ❌ 缺少环境变量: KUGOU_COOKIE, KUGOU_QUERY`);
    return [];
  }

  log(`${LOG_PREFIX} 📋 已读取 ${COOKIES.length} 个账号配置`);

  const records = [];
  for (let i = 0; i < COOKIES.length; i++) {
    const cookie = COOKIES[i];
    const queryStr =
      i < QUERY_ARRAY.length
        ? QUERY_ARRAY[i]
        : QUERY_ARRAY[QUERY_ARRAY.length - 1];
    const baseQuery = {};

    new URLSearchParams(queryStr).forEach((v, k) => {
      baseQuery[k] = v;
    });

    const must = [
      "appid",
      "clientver",
      "mid",
      "uuid",
      "dfid",
      "token",
      "userid",
    ];
    const missing = must.filter((k) => !baseQuery[k]);

    if (missing.length > 0) {
      log(`❌ 账号 ${i + 1}: 缺少参数 ${missing.join(", ")}`);
      continue;
    }

    records.push({
      userid: String(baseQuery.userid),
      query: { ...baseQuery },
      headers: { Cookie: cookie },
    });
  }

  return records;
}

/**
 * 发送网络请求
 */
async function fetchRemote(options) {
  try {
    const response = await axios({
      url: options.url,
      method: options.method || "GET",
      headers: options.headers,
      timeout: options.timeout || 10000,
      data: options.method === "POST" ? options.data : undefined,
    });
    return {
      response: { status: response.status, headers: response.headers },
      body: JSON.stringify(response.data),
    };
  } catch (err) {
    throw new Error(err.message || "网络请求失败");
  }
}

/**
 * 计算请求签名
 */
async function calcSignature(queryObj) {
  if (!CryptoJS?.MD5) {
    throw new Error("CryptoJS 模块未找到");
  }

  const p = { ...(queryObj || {}) };
  if (!("source_id" in p)) p.source_id = "";
  if ("signature" in p) delete p.signature;

  const useAppKey = !!p.appkey;
  const secret = useAppKey ? String(p.appkey) : H5_SECRET;
  if (useAppKey) delete p.srcappid;

  const keys = Object.keys(p).sort();
  const joined = keys.map((k) => `${k}=${p[k] ?? ""}`).join("");
  const raw = secret + joined + secret;

  return CryptoJS.MD5(raw).toString();
}

async function signOne(rec) {
  const base = "https://gateway.kugou.com";
  const path = "/youth/v1/recharge/receive_vip_listen_song";
  const q = { ...(rec.query || {}) };
  q.clienttime = String(Date.now());
  if (!("source_id" in q)) q.source_id = "";

  let signature;
  try {
    signature = await calcSignature(q);
  } catch (error) {
    return { ok: false, code: -1, msg: error.message };
  }

  q.signature = signature;
  const url = `${base}${path}?${buildQS(q)}`;
  const headers = rec.headers || {};

  try {
    const res = await fetchRemote({ url, method: "POST", headers });
    const ret = JSON.parse(res.body || "{}");

    if (ret?.status === 1 && ret?.error_code === 0) {
      return { ok: true, msg: "✅ 签到成功" };
    }
    if (ret?.status === 0 && ret?.error_code === 131001) {
      const d = new Date();
      const today = `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}月${String(d.getDate()).padStart(2, "0")}日`;
      return { ok: true, msg: `✅ 已签到（${today}）` };
    }
    if (ret?.error_code === 20006) {
      return { ok: false, msg: "❌ 签名错误" };
    }

    return { ok: false, msg: `❌ ${ret?.error_msg || "签到失败"}` };
  } catch (error) {
    return { ok: false, msg: `❌ 请求失败: ${error.message}` };
  }
}

async function runSignin() {
  const list = readStore();
  if (!list.length) return;

  const results = [];
  let success = 0,
    failed = 0;

  for (const rec of list) {
    try {
      const r = await signOne(rec);
      if (r.ok) {
        success++;
        results.push(`${rec.userid} ${r.msg}`);
      } else {
        failed++;
        results.push(`${rec.userid} ${r.msg}`);
      }
    } catch (e) {
      failed++;
      results.push(`${rec.userid} ❌ ${e.message}`);
    }
  }

  const summary = `执行完毕 | 成功 ${success}/${list.length}`;
  const notifyText = LOG_PREFIX;
  const notifyContent = `${summary}\n\n${results.join("\n")}`;

  log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  log(LOG_PREFIX);
  log(summary);
  results.forEach((r) => log(r));
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  return { notifyText, notifyContent };
}

(async () => {
  let notifyInfo;
  try {
    notifyInfo = await runSignin();
  } catch (e) {
    log(`${LOG_PREFIX} 执行异常: ${e.message}`);
  } finally {
    if (notifyInfo) {
      const { notifyText, notifyContent } = notifyInfo;
      try {
        log("📢 正在发送通知...");
        await notify.sendNotify(notifyText, notifyContent);
        log("✅ 通知发送成功");
      } catch (notifyErr) {
        log(`⚠️ 通知发送失败: ${notifyErr.message}`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
})();
