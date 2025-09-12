# Tech Hub トークカード v2.0

Tech Hubエンジニア交流イベント用のトークテーマ抽選システム（TypeScript + React + WebSocket版）

## 🚀 新機能 v2.0

- ⚡ **リアルタイム同期** - スマホで引いたカードが瞬時にPC画面に反映
- 💻 **TypeScript + React** - 型安全でモダンな実装
- 🌐 **WebSocket通信** - 低遅延のリアルタイム通信
- 👥 **参加者数表示** - 接続中の参加者数をリアルタイム表示

## 機能

- 🎯 **30種類のエンジニア向けトークテーマ**
- 🎨 **カテゴリ・難易度別フィルタリング**  
- ✨ **カード抽選アニメーション**
- 📱 **レスポンシブデザイン（PC・スマホ対応）**
- 🔄 **使用済みカード管理（重複防止）**
- 📲 **QRコード対応（参加者各自のスマホでアクセス）**
- 🌐 **WebSocketサーバー（同時多人数対応）**

## セットアップ

### 必要な環境
- Node.js (v18以上推奨)
- npm

### インストール手順

```bash
# 1. プロジェクトディレクトリに移動
cd techhub-cards

# 2. 依存関係をインストール
npm install

# 3. 開発サーバーを起動（推奨）
npm run dev

# または本番用ビルド＆起動
npm run build
npm start
```

### 開発モード
```bash
npm run dev
# サーバー: http://localhost:3001
# クライアント: http://localhost:5173
```

## 使い方

### イベント主催者向け

1. `npm run dev` で開発サーバーを起動
2. 管理者画面 `http://localhost:3001/admin` にアクセス
3. QRコードをプロジェクターやスクリーンに投影
4. 参加者にQRコードをスキャンしてもらう
5. **リアルタイムでスマホの操作結果がPC画面に反映されます！**

### 参加者向け

1. QRコードをスマホでスキャン
2. 「カードを引く」ボタンをタップ
3. 引いたカードが全員の画面に即座に表示される
4. 表示されたトークテーマで5〜10分話す

## アーキテクチャ

```
┌─────────────────┐    WebSocket    ┌──────────────────┐
│   React Client  │ ◄──────────────► │  Node.js Server  │
│   (Frontend)    │                  │   (Backend)      │
└─────────────────┘                  └──────────────────┘
        │                                      │
        │ HTTP                                 │ Static Files
        ▼                                      ▼
┌─────────────────┐                  ┌──────────────────┐
│   Vite Dev      │                  │  Express.js      │
│   (Development) │                  │  (Production)    │
└─────────────────┘                  └──────────────────┘
```

## ファイル構成

```
techhub-cards/
├── package.json           # プロジェクト設定
├── vite.config.ts        # Vite設定
├── tsconfig.json         # TypeScript設定
├── server/               # バックエンド
│   ├── index.ts         # WebSocketサーバー
│   └── tsconfig.json    # サーバー用TS設定
├── src/                 # フロントエンド
│   ├── App.tsx          # メインアプリ
│   ├── App.css          # スタイル
│   ├── main.tsx         # エントリーポイント
│   ├── types.ts         # 型定義
│   ├── hooks/           # Reactフック
│   │   └── useSocket.ts # WebSocket管理
│   ├── components/      # Reactコンポーネント
│   │   ├── CardDisplay.tsx
│   │   ├── Controls.tsx
│   │   ├── Stats.tsx
│   │   ├── Message.tsx
│   │   └── AdminPanel.tsx
│   └── data/
│       └── cards.ts     # カードデータ
├── v1-backup/           # v1バックアップ
└── README.md
```

## 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール
- **Socket.IO Client** - WebSocket通信

### バックエンド  
- **Node.js** - サーバーランタイム
- **Express.js** - Webフレームワーク
- **Socket.IO** - WebSocketサーバー
- **TypeScript** - 型安全性

## リアルタイム機能

### WebSocket Events
```typescript
// クライアント → サーバー
'card:draw'    // カード抽選
'game:reset'   // ゲームリセット
'game:join'    // ゲーム参加

// サーバー → クライアント  
'card:drawn'   // カード抽選結果
'game:state'   // ゲーム状態更新
'participants:update' // 参加者数更新
```

## カスタマイズ

### トークテーマの追加・編集

`src/data/cards.ts`を編集:

```typescript
export const techHubCards: Card[] = [
  {
    id: 31,
    title: "新しいトークテーマ",
    description: "説明文", 
    category: "カテゴリ名",
    difficulty: "initial" | "intermediate" | "advanced"
  }
]
```

### スタイルのカスタマイズ

`src/App.css`でデザインを変更可能

## 📚 ドキュメント

詳細な情報は以下のドキュメントを参照してください：

- **[使用ガイド](docs/USER_GUIDE.md)** - イベント運営者向け詳細マニュアル
- **[技術学習ガイド](docs/TECH_GUIDE.md)** - 実装技術の学習リソース
- **[トラブルシューティング](docs/TROUBLESHOOTING.md)** - よくある問題と解決方法

## 旧バージョン

v1（Vanilla JS版）は `v1-backup/` に保存されています。

## ライセンス

MIT License - Tech Hubイベントでの使用に最適化されています。