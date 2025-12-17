/**
 * 酷狗概念版音乐签到脚本
 * 依赖: axios crypto-js
 * 环境变量: KUGOU_COOKIE KUGOU_QUERY (多账号用 @ 分隔)
 */

const axios = require("axios");
const CryptoJS = require("crypto-js");
const { URLSearchParams } = require("url");

/**
 * sendNotify.js 在加载时会读取环境变量并可能请求“一言”。
 * 这里强制关闭一言：降低外部网络依赖，避免通知阶段偶发失败和日志穿插。
 * 注意：必须在 require("../sendNotify.js") 之前设置才生效。
 */
process.env.HITOKOTO = "false";
const notify = require("../sendNotify.js");

const KUGOU_COOKIE_ENV = process.env.KUGOU_COOKIE || "";
const KUGOU_QUERY_ENV = process.env.KUGOU_QUERY || "";

// 多账号分隔符：@（兼容 @ 后可带空格）
const MULTI_ACCOUNT_SPLIT = /@\s*/;

const COOKIES = KUGOU_COOKIE_ENV
  ? KUGOU_COOKIE_ENV.split(MULTI_ACCOUNT_SPLIT).filter((c) => c.trim())
  : [];

const QUERY_ARRAY = KUGOU_QUERY_ENV
  ? KUGOU_QUERY_ENV.split(MULTI_ACCOUNT_SPLIT).filter((q) => q.trim())
  : [];

const LOG_PREFIX = "🎵 酷狗签到";
const H5_SECRET = "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt";

function log(...a) {
  console.log(...a);
}

/**
 * 让 stdout 先把前面的日志刷出去，减少与 sendNotify 内部日志的穿插。
 */
function flushStdout() {
  return new Promise((resolve) => setImmediate(resolve));
}

/** 构造 query string（按原始顺序拼接） */
function buildQS(obj) {
  const sp = new URLSearchParams();
  Object.keys(obj || {}).forEach((k) => sp.append(k, obj[k]));
  return sp.toString();
}

/**
 * 读取并校验账号配置
 * - KUGOU_COOKIE: cookie 列表
 * - KUGOU_QUERY: URL 查询参数列表（appid/clientver/mid/uuid/dfid/token/userid...）
 */
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
 * 统一网络请求封装
 * - 默认超时 10s
 * - 返回响应 JSON（axios 会自动解析）
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
    return response.data;
  } catch (err) {
    throw new Error(err.message || "网络请求失败");
  }
}

/**
 * 计算酷狗接口签名
 * - 规则：按 key 排序后拼接为 k=v 串（无分隔符），前后加 secret 再做 MD5。
 */
function calcSignature(queryObj) {
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

/**
 * 单账号执行签到
 * @param {{ userid: string, query: Record<string,string>, headers: {Cookie: string} }} rec
 */
async function signOne(rec) {
  const base = "https://gateway.kugou.com";
  const path = "/youth/v1/recharge/receive_vip_listen_song";
  const q = { ...(rec.query || {}) };
  q.clienttime = String(Date.now());
  if (!("source_id" in q)) q.source_id = "";

  let signature;
  try {
    signature = calcSignature(q);
  } catch (error) {
    return { ok: false, code: -1, msg: error.message };
  }

  q.signature = signature;
  const url = `${base}${path}?${buildQS(q)}`;
  const headers = rec.headers || {};

  try {
    const ret = await fetchRemote({ url, method: "POST", headers });

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

/**
 * 主流程：读取账号 -> 循环签到 -> 打印汇总 -> 返回通知内容
 */
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

  const outputBlock = [
    "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    LOG_PREFIX,
    summary,
    ...results,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
  ].join("\n");
  log(outputBlock);

  await flushStdout();

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
        await flushStdout();
        await notify.sendNotify(notifyText, notifyContent);
        log("✅ 通知发送成功");
      } catch (notifyErr) {
        log(`⚠️ 通知发送失败: ${notifyErr.message}`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
})();
