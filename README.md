# md_memo

github repository を保存先とする markdown メモ帳 [WIP]

# 実装メモ

## 認証、認可

github oauth を用いる。`client_id` `client_secret` は入力できるようにする。 `request_token` とともに全て Cookie 保持。サーバーは使わない。
