# Tech Hub トークカード - トラブルシューティング

## 🚨 よくある問題と解決方法

## インストール・起動に関する問題

### ❌ npm install でタイムアウトエラー
```
npm error code ETIMEDOUT
npm error syscall read
npm error errno -60
```

**原因**: ネットワーク接続の問題
**解決方法**:
```bash
# 1. ネットワーク確認後再実行
npm install

# 2. タイムアウト時間を延長
npm install --timeout=60000

# 3. レジストリを変更
npm install --registry=https://registry.npmjs.org/

# 4. キャッシュクリア
npm cache clean --force
npm install
```

### ❌ TypeScriptコンパイルエラー
```
error TS2307: Cannot find module '../shared/types'
```

**原因**: 共通型定義ファイルの参照エラー
**解決方法**:
```bash
# 1. sharedディレクトリの存在確認
ls -la shared/

# 2. 型定義ファイルの確認
cat shared/types.ts

# 3. パスの修正（必要に応じて）
# server/index.ts内の相対パスを確認
```

### ❌ ポートが既に使用されている
```
Error: listen EADDRINUSE: address already in use :::3001
```

**解決方法**:
```bash
# 1. 使用中のプロセス確認
lsof -i :3001

# 2. プロセス終了
kill -9 <PID>

# 3. または別ポート使用
PORT=3002 npm run dev
```

## WebSocket接続に関する問題

### ❌ リアルタイム同期が動作しない

**症状**: スマホでカードを引いてもPC画面に反映されない

**診断方法**:
```bash
# ブラウザのコンソール（F12）を開いて確認
# 以下のメッセージがあるかチェック
- "Connected to server" 
- "WebSocket connection failed"
- "socket.io エラー"
```

**解決方法**:
1. **ネットワーク確認**
   ```bash
   # サーバーが起動しているか確認
   curl http://localhost:3001/api/qr
   ```

2. **CORS設定確認**
   ```typescript
   // server/index.ts
   cors: {
     origin: ["http://localhost:5173", "http://localhost:3001"],
     methods: ["GET", "POST"]
   }
   ```

3. **ファイアウォール確認**
   - macOS: システム環境設定 → セキュリティとプライバシー → ファイアウォール
   - Windows: Windows Defender ファイアウォール設定

### ❌ 参加者数が正しく表示されない

**症状**: 接続しているのに参加者数が0のまま

**解決方法**:
```typescript
// useSocket.ts内で接続イベント確認
socket.on('connect', () => {
  console.log('✅ Connected to server')
  socket.emit('game:join')  // これが送信されているか確認
})

socket.on('participants:update', (count) => {
  console.log('👥 Participants:', count)  // ログ出力で確認
})
```

## QRコード・アクセスに関する問題

### ❌ QRコードが生成されない

**症状**: 管理画面で「QRコード生成エラー」表示

**解決方法**:
```bash
# 1. IPアドレス取得確認
ifconfig | grep inet

# 2. 手動でURLアクセス
curl http://localhost:3001/api/qr

# 3. qrcodeパッケージ確認
npm list qrcode
```

### ❌ スマホからアクセスできない

**症状**: QRコードを読み取ってもページが開かない

**チェックリスト**:
1. **同一ネットワーク確認**
   - PC・スマホが同じWiFiに接続されているか
   - 社内ネットワークの場合、セキュリティ制限がないか

2. **IPアドレス確認**
   ```bash
   # 正しいIPアドレスを確認
   ipconfig getifaddr en0  # macOS
   ipconfig               # Windows
   ```

3. **手動アクセステスト**
   - スマホブラウザで直接 `http://[IPアドレス]:3001` にアクセス

### ❌ 「該当カードなし」エラー

**症状**: フィルター適用時にカードが引けない

**解決方法**:
```typescript
// Controls.tsx内のフィルター確認
const getFilteredCount = () => {
  let filtered = gameState.availableCards
  
  console.log('Available cards:', filtered.length)
  console.log('Category filter:', categoryFilter)
  console.log('Difficulty filter:', difficultyFilter)
  
  // フィルター後の件数確認
  return filtered.length
}
```

**対処法**:
1. フィルターを「すべて」にリセット
2. ゲーム全体をリセット
3. カードデータの内容確認

## 画面表示に関する問題

### ❌ レスポンシブデザインが崩れる

**症状**: スマホで表示が崩れる・見切れる

**解決方法**:
1. **ビューポート確認**
   ```html
   <!-- index.html -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

2. **CSS Media Query確認**
   ```css
   /* 480px以下での表示確認 */
   @media (max-width: 480px) {
     .drawn-card { padding: 15px; }
     .card-title { font-size: 1.3em; }
   }
   ```

3. **ブラウザ開発者ツール**
   - F12 → デバイスモード で各画面サイズをテスト

### ❌ アニメーションが動作しない

**症状**: カード抽選時のスピンアニメーションが表示されない

**解決方法**:
```css
/* CSS Animation確認 */
@keyframes spin {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}

.spinning-card {
  animation: spin 2s linear infinite;
}
```

**ブラウザ対応確認**:
- Safari: `-webkit-transform` プレフィックス必要な場合
- IE11: 対応していない（モダンブラウザ推奨）

## パフォーマンスに関する問題

### ❌ 動作が重い・遅い

**症状**: カード表示やアニメーションが遅い

**診断方法**:
```bash
# Chrome DevTools
# Performance タブ でプロファイリング
# Network タブ でリクエスト確認
# Console タブ でエラー確認
```

**最適化方法**:
1. **不要なre-render防止**
   ```typescript
   // React.memo使用
   export const CardDisplay = React.memo(({ gameState }) => {
     // ...
   })
   ```

2. **WebSocket接続最適化**
   ```typescript
   // 不要なイベント送信を防ぐ
   if (socket && socket.connected && !gameState.isDrawing) {
     socket.emit('card:draw', filters)
   }
   ```

### ❌ メモリリークが発生

**症状**: 長時間使用すると動作が重くなる

**解決方法**:
```typescript
// useEffect内でのクリーンアップ
useEffect(() => {
  const timer = setInterval(() => {
    // 何らかの処理
  }, 1000)

  return () => {
    clearInterval(timer)  // クリーンアップ必須
  }
}, [])

// WebSocket接続のクリーンアップ
useEffect(() => {
  const socket = io()
  
  return () => {
    socket.disconnect()  // 切断処理
  }
}, [])
```

## デバッグ・ログ確認方法

### サーバーサイドログ
```bash
# サーバー起動時のログ確認
npm run dev

# 出力例:
# 🎯 Tech Hub カードシステム v2.0 起動中...
# 🔌 Client connected: abc123
# 🎯 Card drawn: "最近学んだ新しい技術" by abc123
```

### クライアントサイドログ
```javascript
// ブラウザコンソール（F12）で確認
// 接続ログ
console.log('✅ Connected to server')

// 状態変更ログ
console.log('Game state updated:', gameState)

// エラーログ
console.error('WebSocket error:', error)
```

### 詳細デバッグ
```typescript
// useSocket.ts内にデバッグコード追加
useEffect(() => {
  const socket = io(window.location.origin, {
    transports: ['websocket', 'polling']
  })

  socket.on('connect', () => {
    console.log('🔗 Connected:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason)
  })

  socket.on('connect_error', (error) => {
    console.error('🚫 Connection Error:', error)
  })

  return () => socket.close()
}, [])
```

## 緊急時の対処法

### 完全リセット手順
```bash
# 1. 全プロセス終了
pkill -f "node.*server"
pkill -f "vite"

# 2. 依存関係再インストール
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 3. 設定ファイル確認
cat package.json | grep scripts
cat tsconfig.json

# 4. 再起動
npm run dev
```

### バックアップ版への切り替え
```bash
# v1（従来版）への切り替え
cd v1-backup
open index.html
```

## サポート・問い合わせ

技術的な問題で解決できない場合:

1. **GitHub Issues**: プロジェクトのIssuesページで報告
2. **ログ収集**: エラーメッセージ・コンソールログを保存
3. **環境情報**: OS、Node.jsバージョン、ブラウザ情報を記載

```bash
# 環境情報収集
node --version
npm --version
cat package.json | head -10
```

この情報を添えて問い合わせすることで、迅速な解決が期待できます。