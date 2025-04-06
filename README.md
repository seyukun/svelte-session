# Svelte Session Login

このリポジトリは、SvelteKit を用いてセッションを使ったログイン機能を実装したプロジェクトです。ユーザー登録、ログイン、セッション管理（作成、更新、破棄）を含む基本的な認証フローがデモされています。

## 使っているスタック

- **フロントエンド**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5)
- **データベース**: [SQLite](https://www.sqlite.org/index.html) と [Prisma](https://www.prisma.io/)
- **認証セッション**: 独自のセッション管理（[Keyv](https://github.com/lukechilds/keyv) を利用）
- **言語**: TypeScript

## session.ts の使い方

`src/lib/server/session.ts` に実装している Session クラスは、以下のようにセッションの開始、更新、破棄が可能です。

```ts
import Session from '$lib/server/session';

// セッションの開始（セッションIDがクッキーに存在する場合はそれを利用、存在しない場合は新規作成）
const session = new Session(cookies);
const sessval = await session.start();

// ユーザー情報をセッションに保存（ログイン時などに使用）
sessval['userid'] = user.id.toString();

// セッションIDの再生成（セキュリティ向上のためログイン後などに推奨）
await session.regenerate();

// セッションの破棄（ログアウト時などに使用）
await session.destroy();
```

## Developing

依存パッケージのインストール後、以下のコマンドで開発用サーバーを起動できます。

```bash
npm install
npm run dev
# またはブラウザで自動的に開く場合:
npm run dev -- --open
```

## Building

本番環境向けビルドの作成は以下のコマンドで行います：

```bash
npm run build
npm run preview
```

> ※ デプロイ先によっては、適宜 [SvelteKit Adapter](https://kit.svelte.dev/docs/adapters) の導入が必要となります。