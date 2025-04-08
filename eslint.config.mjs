import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

// 自定义全局变量，用于代理工具脚本
const proxyScriptGlobals = {
  $: "readonly",
  $persistentStore: "readonly",
  $prefs: "readonly",
  $httpClient: "readonly",
  $task: "readonly",
  $done: "readonly",
  $response: "readonly",
  $argument: "readonly",
  $notification: "readonly",
  $notify: "readonly",
  $environment: "readonly",
  $rocket: "readonly",
};

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...proxyScriptGlobals,
      },
      ecmaVersion: 2020,
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
]);
