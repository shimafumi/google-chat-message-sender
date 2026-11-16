# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

Google Chat の Incoming Webhook へメッセージを送るための Google Apps Script（GAS）プロジェクト。`src/Code.js` の関数群を、他の GAS プロジェクトからライブラリとして呼び出す前提で作られている（トリガーやエントリポイントは持たない）。

- ランタイム: V8（`src/appsscript.json`）、タイムゾーン Asia/Tokyo
- ビルド・lint・テストの仕組みはない（package.json なし）。

## デプロイ（clasp）

`.clasp.json` の `rootDir` は `src`。`src/` 以下のファイルだけが Apps Script に反映される。

```
clasp push    # ローカルの src/ を Apps Script に反映
clasp pull    # Apps Script 側の変更を src/ に取り込む
```

`.clasprc.json`（clasp の認証情報）は gitignore 済み。読まない・コミットしないこと。

## コード構成（src/Code.js）

- 送信系: `send(webhookUrl, payload)`（任意の JSON）、`sendText(webhookUrl, text)`、`sendTextToThread(webhookUrl, threadName, text)`。いずれも `UrlFetchApp.fetch` の戻り値（HTTPResponse）をそのまま返す。
- 変換系: Chat のメッセージ URL `https://chat.google.com/room/{spaceId}/{threadId}/...` と API 形式の名前を相互変換する。
  - `buildThreadName(url)` → `spaces/{spaceId}/threads/{threadId}`
  - `buildSpaceName(url)` → `spaces/{spaceId}`
  - `buildThreadUrl(response)` → 送信レスポンスの `thread.name` からスレッド URL を組み立てる

典型的な使い方: 最初のメッセージを `sendText` で送り、`buildThreadUrl` でスレッド URL を保存しておき、後で `buildThreadName` で threadName に戻して `sendTextToThread` で同じスレッドに返信する。

## 注意点（既存コードの癖）

- 公開関数名・引数はライブラリ利用側から呼ばれているため、変更すると呼び出し側が壊れる。
- `sendTextToThread` は webhook URL に `&messageReplyOption=REPLY_MESSAGE_OR_FAIL` を付け足す。Webhook URL が既にクエリ（`?key=...&token=...`）を含んでいる前提。
