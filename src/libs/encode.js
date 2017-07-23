export default function base64 (object) {
  // 日本語の base64 化に難があるのでひと手間必要
  // refs: https://developer.mozilla.org/ja/docs/Web/API/WindowBase64/btoa
  return btoa(unescape(encodeURIComponent(object)))
}
