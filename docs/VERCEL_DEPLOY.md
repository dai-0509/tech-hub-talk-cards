# Vercel デプロイ完全ガイド

## 🚀 概要

Tech Hub トークカードをVercelにデプロイして、世界中どこからでもアクセス可能にする手順を詳しく説明します。

## 📋 事前準備

### 必要なアカウント
- ✅ **GitHubアカウント** (無料)
- ✅ **Vercelアカウント** (無料)

### 必要な環境
- ✅ **Node.js 18+** インストール済み
- ✅ **Git** インストール済み
- ✅ **コードの準備** 完了

---

## STEP 1: GitHubリポジトリの作成

### 1-1. GitHub上でリポジトリ作成

1. **GitHub.com**にアクセスしてログイン
2. 右上の **「+」→「New repository」** をクリック
3. リポジトリ情報を入力:
   ```
   Repository name: techhub-cards
   Description: Tech Hub エンジニア交流イベント用トークカード抽選システム
   Public/Private: お好みで選択
   □ Add a README file (チェックしない)
   □ Add .gitignore (チェックしない)
   □ Choose a license (チェックしない)
   ```
4. **「Create repository」**をクリック

### 1-2. ローカルからプッシュ

ターミナルで以下を実行:

```bash
# プロジェクトディレクトリに移動
cd techhub-cards

# リモートリポジトリを追加
git remote add origin https://github.com/[あなたのユーザー名]/techhub-cards.git

# ブランチ名をmainに変更
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

### ✅ 確認事項
- GitHubでファイルが正しく表示されるか確認
- `vercel.json`、`api/index.ts`が含まれているか確認

---

## STEP 2: Vercelアカウント作成・設定

### 2-1. Vercelアカウント作成

1. **vercel.com**にアクセス
2. **「Sign Up」**をクリック
3. **「Continue with GitHub」**を選択
4. GitHubアカウントでログイン
5. 権限を許可

### 2-2. Vercel CLI インストール (オプション)

```bash
npm install -g vercel
```

---

## STEP 3: プロジェクトデプロイ

### 3-1. Webダッシュボードからデプロイ

1. **Vercel Dashboard**で **「New Project」**をクリック
2. **「Import Git Repository」**で先ほど作成したリポジトリを選択
3. **「Import」**をクリック

### 3-2. プロジェクト設定

**Configure Project画面で以下を設定:**

```yaml
Project Name: techhub-cards
Framework Preset: Other
Root Directory: ./
Build and Output Settings:
  Build Command: npm run vercel-build
  Output Directory: dist/client
  Install Command: npm install
```

### 3-3. 環境変数設定 (オプション)

**Environment Variables (必要に応じて):**
```
NODE_ENV=production
```

### 3-4. デプロイ実行

**「Deploy」**ボタンをクリック

---

## STEP 4: デプロイ状況の確認

### 4-1. ビルドログの確認

デプロイ中の画面で以下を確認:

```
✓ Installing dependencies
✓ Building application  
✓ Uploading build outputs
✓ Deployment ready
```

### 4-2. エラーが発生した場合

よくあるエラーと対処法:

#### **Error: Cannot find module**
```bash
# package.jsonの依存関係を確認
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

#### **Build failed**
```bash
# ローカルでビルドテスト
npm run vercel-build

# エラーがある場合は修正後
git add .
git commit -m "Fix build errors"
git push
```

---

## STEP 5: デプロイ完了・動作確認

### 5-1. デプロイURL取得

デプロイ完了後、以下のようなURLが発行されます:
```
https://techhub-cards-xyz123.vercel.app
```

### 5-2. 動作確認チェックリスト

#### ✅ **基本動作確認**
- [ ] トップページが表示される
- [ ] 管理者画面 (`/admin`) にアクセスできる
- [ ] QRコードが生成される
- [ ] カード抽選機能が動作する

#### ✅ **モバイル確認**
- [ ] スマホでQRコードをスキャンできる
- [ ] スマホでカードを引ける
- [ ] レスポンシブデザインが正常

#### ✅ **リアルタイム同期確認**
- [ ] 複数のタブで開いて同期をテスト
- [ ] スマホ→PC画面への反映をテスト

---

## STEP 6: カスタムドメイン設定 (オプション)

### 6-1. 独自ドメインの設定

1. Vercel Project画面で **「Settings」**
2. **「Domains」**タブを選択
3. **「Add Domain」**で独自ドメインを追加
4. DNS設定を更新 (Aレコード、CNAMEレコード)

### 6-2. SSL証明書

Vercelが自動的にHTTPS証明書を発行・更新します。

---

## STEP 7: 継続的デプロイ設定

### 7-1. 自動デプロイ

GitHubリポジトリにプッシュすると自動的に再デプロイされます:

```bash
# ファイル修正後
git add .
git commit -m "Update feature"
git push

# → 自動的にVercelでビルド・デプロイ開始
```

### 7-2. ブランチデプロイ

```bash
# 開発ブランチ作成
git checkout -b develop
git push -u origin develop

# → Preview URLが自動生成
# https://techhub-cards-git-develop-username.vercel.app
```

---

## 🛠️ トラブルシューティング

### よくある問題と解決方法

#### **問題1: 404 Not Found**
```yaml
原因: ルーティング設定問題
解決: vercel.json の routes設定を確認
```

**vercel.json 修正例:**
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
```

#### **問題2: WebSocket接続エラー**
```yaml
原因: Vercel Functions は永続的なWebSocket接続を提供しない
解決: Pusher, Ably などのサービス使用を検討
```

**代替案 - Server-Sent Events使用:**
```typescript
// api/events.ts
export default function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  
  res.write(`data: ${JSON.stringify({type: 'connected'})}\n\n`)
}
```

#### **問題3: ビルドタイムアウト**
```yaml
原因: ビルドプロセスが長すぎる
解決: 不要な依存関係を削除、ビルドプロセス最適化
```

```bash
# 不要パッケージ削除
npm uninstall [不要なパッケージ]

# 軽量な代替パッケージに変更
npm install [軽量パッケージ]
```

---

## 📊 パフォーマンス最適化

### Vercel Analytics設定

1. **Vercel Dashboard → Analytics**
2. **「Enable Analytics」**をクリック
3. パフォーマンスメトリクスの確認

### Core Web Vitals最適化

```typescript
// 画像最適化
import Image from 'next/image'

// 動的インポート
const AdminPanel = lazy(() => import('./components/AdminPanel'))

// メモ化
const MemoizedCardDisplay = React.memo(CardDisplay)
```

---

## 🚀 本番運用のベストプラクティス

### セキュリティ

```json
// vercel.json セキュリティヘッダー
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 監視とログ

```typescript
// エラー追跡
console.error('Error:', error)

// パフォーマンス計測
console.time('card-draw-process')
// 処理
console.timeEnd('card-draw-process')
```

### バックアップ戦略

```bash
# 定期的なコード保存
git tag v1.0.0
git push origin v1.0.0

# データベースバックアップ (将来的に)
pg_dump database_name > backup.sql
```

---

## 📱 Tech Hub イベント当日の使用方法

### イベント前準備

1. **URL確認**: `https://your-app.vercel.app/admin`
2. **QRコード取得**: 管理画面でQRコード表示
3. **ネットワーク確認**: 会場のWiFi・4G/5G接続確認

### イベント進行

```markdown
## 進行手順

1. **PC画面を大画面に投影**
   - 管理画面 (/admin) を表示
   - QRコードを参加者に見えるように投影

2. **参加者案内**
   「スマホでQRコードをスキャンしてアクセスしてください」

3. **動作確認**
   - 数名にテスト操作してもらう
   - リアルタイム同期を確認

4. **トークセッション開始**
   - 参加者順番にカードを引いてもらう
   - 5〜10分のトークタイム
```

---

## 🎉 完成！

**これでTech Hub トークカードが世界中からアクセス可能になりました！**

### 🌟 完成したシステムの特徴

- ✅ **グローバルアクセス**: 世界中どこからでも利用可能
- ✅ **リアルタイム同期**: スマホ→PC画面即座反映
- ✅ **自動HTTPS**: セキュアな接続
- ✅ **高速配信**: Vercel CDNで高速表示
- ✅ **自動デプロイ**: Git push で自動更新
- ✅ **無料運用**: 個人・小規模利用は完全無料

### 📈 今後の拡張可能性

- 🗳️ **投票機能**: トーク後の評価システム
- 👥 **チーム戦**: グループ対抗戦モード  
- 📊 **分析機能**: 利用統計レポート
- 🌍 **多言語対応**: 国際イベント対応
- 💾 **データ永続化**: 履歴保存機能

**素晴らしいTech Hubイベントをお楽しみください！** 🚀✨