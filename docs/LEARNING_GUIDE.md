# Tech Hub トークカード - 学習ガイド & 問題集

## 📚 目次

1. [基礎知識編](#基礎知識編)
2. [実装理解編](#実装理解編)
3. [応用問題編](#応用問題編)
4. [実践演習編](#実践演習編)
5. [参考資料](#参考資料)

---

## 基礎知識編

### 🎯 **TypeScript基礎**

#### **問題 1-1: 型定義**
以下のコードの`???`部分を埋めなさい。

```typescript
interface Card {
  id: ???
  title: ???
  description: ???
  category: ???
  difficulty: ??? | ??? | ???
}
```

<details>
<summary>解答</summary>

```typescript
interface Card {
  id: number
  title: string
  description: string
  category: string
  difficulty: 'initial' | 'intermediate' | 'advanced'
}
```

**解説**: 
- `id`: 数値型 (`number`)
- `title`, `description`, `category`: 文字列型 (`string`)
- `difficulty`: Union Types で3つの文字列リテラル型
</details>

#### **問題 1-2: 配列とオブジェクト型**
以下のGameState型の定義を完成させなさい。

```typescript
interface GameState {
  availableCards: ???
  usedCards: ???
  currentCard: ???
  isDrawing: ???
  participants: ???
}
```

<details>
<summary>解答</summary>

```typescript
interface GameState {
  availableCards: Card[]
  usedCards: Card[]
  currentCard: Card | null
  isDrawing: boolean
  participants: number
}
```

**解説**:
- `Card[]`: Card型の配列
- `Card | null`: Card型またはnull (Union Types)
- `boolean`: 真偽値型
</details>

#### **問題 1-3: ジェネリクス**
Socket.IOのイベント型定義を完成させなさい。

```typescript
export interface SocketEvents {
  'card:draw': (filters?: { category?: ???; difficulty?: ??? }) => void
  'card:drawn': (data: { card: ???; gameState: ??? }) => void
  'participants:update': (count: ???) => void
}
```

<details>
<summary>解答</summary>

```typescript
export interface SocketEvents {
  'card:draw': (filters?: { category?: string; difficulty?: string }) => void
  'card:drawn': (data: { card: Card; gameState: GameState }) => void
  'participants:update': (count: number) => void
}
```

**解説**:
- `?`: オプショナルプロパティ
- `void`: 戻り値なしの関数型
</details>

---

### ⚛️ **React基礎**

#### **問題 2-1: useState**
以下のuseStateの使い方で正しいものを選びなさい。

A. `const [gameState, setGameState] = useState({})`
B. `const [gameState, setGameState] = useState<GameState>({...})`
C. `const gameState = useState<GameState>({...})`

<details>
<summary>解答</summary>

**正解: B**

```typescript
const [gameState, setGameState] = useState<GameState>({
  availableCards: [],
  usedCards: [],
  currentCard: null,
  isDrawing: false,
  participants: 0
})
```

**解説**:
- ジェネリクス `<GameState>` で型を指定
- 分割代入で `[state, setState]` を取得
- 初期値は型に合致するオブジェクトを渡す
</details>

#### **問題 2-2: useEffect**
WebSocket接続のuseEffectを完成させなさい。

```typescript
useEffect(() => {
  const socket = io(window.location.origin)
  
  socket.on('connect', () => {
    // ???
  })
  
  return () => {
    // ???
  }
}, [])
```

<details>
<summary>解答</summary>

```typescript
useEffect(() => {
  const socket = io(window.location.origin)
  
  socket.on('connect', () => {
    console.log('Connected to server')
    socket.emit('game:join')
  })
  
  return () => {
    socket.close() // クリーンアップ
  }
}, []) // 依存配列は空配列
```

**解説**:
- クリーンアップ関数でメモリリークを防止
- 依存配列が空 `[]` なのでマウント時のみ実行
</details>

#### **問題 2-3: 条件付きレンダリング**
以下のコンポーネントを完成させなさい。

```typescript
export const CardDisplay = ({ gameState }) => {
  if (???) {
    return <div className="card-animation">引いています...</div>
  }

  if (???) {
    return <div className="drawn-card">{/* カード表示 */}</div>
  }

  return <div className="no-card">カードを引いてください</div>
}
```

<details>
<summary>解答</summary>

```typescript
export const CardDisplay = ({ gameState }) => {
  if (gameState.isDrawing) {
    return <div className="card-animation">引いています...</div>
  }

  if (gameState.currentCard) {
    return <div className="drawn-card">{/* カード表示 */}</div>
  }

  return <div className="no-card">カードを引いてください</div>
}
```

**解説**:
- 状態に応じた条件分岐でUIを切り替え
- Early Return パターンを使用
</details>

---

### 🌐 **WebSocket基礎**

#### **問題 3-1: サーバーサイド**
Socket.IOサーバーのイベントハンドラを完成させなさい。

```typescript
io.on('connection', (socket) => {
  socket.on('card:draw', (filters) => {
    // カード抽選ロジック
    const drawnCard = /* 抽選処理 */
    
    // 全クライアントに送信: ???
    // 個別クライアントに送信: ???
  })
})
```

<details>
<summary>解答</summary>

```typescript
io.on('connection', (socket) => {
  socket.on('card:draw', (filters) => {
    // カード抽選ロジック
    const drawnCard = /* 抽選処理 */
    
    // 全クライアントに送信
    io.emit('card:drawn', { card: drawnCard, gameState })
    
    // 個別クライアントに送信 (エラー時など)
    socket.emit('error', 'エラーメッセージ')
  })
})
```

**解説**:
- `io.emit()`: 全接続クライアントに配信
- `socket.emit()`: 個別クライアントに送信
</details>

#### **問題 3-2: クライアントサイド**
WebSocketクライアントのイベントハンドラを完成させなさい。

```typescript
const socket = io(window.location.origin)

socket.on('???', (data) => {
  setGameState(data.gameState)
})

socket.on('???', (message) => {
  setError(message)
})
```

<details>
<summary>解答</summary>

```typescript
const socket = io(window.location.origin)

socket.on('card:drawn', (data) => {
  setGameState(data.gameState)
})

socket.on('error', (message) => {
  setError(message)
})
```

**解説**:
- サーバーから送信されるイベント名と一致させる
- 受信データでReactの状態を更新
</details>

---

## 実装理解編

### 🏗️ **アーキテクチャ問題**

#### **問題 4-1: ファイル構造**
以下のファイル構造で、各ファイルの役割を説明しなさい。

```
techhub-cards/
├── shared/
│   ├── types.ts
│   └── cards.ts
├── server/
│   └── index.ts
├── src/
│   ├── hooks/useSocket.ts
│   └── components/CardDisplay.tsx
```

<details>
<summary>解答</summary>

- `shared/types.ts`: **サーバー・クライアント共通の型定義**
  - 型の一貫性を保つために共有
- `shared/cards.ts`: **カードデータとカテゴリ情報**
  - サーバー・クライアント両方で使用
- `server/index.ts`: **WebSocketサーバーとAPI**
  - Express + Socket.IO サーバー
- `src/hooks/useSocket.ts`: **WebSocket接続管理**
  - カスタムフックでロジック分離
- `src/components/CardDisplay.tsx`: **カード表示UI**
  - プレゼンテーション層
</details>

#### **問題 4-2: 状態管理**
なぜサーバーとクライアントで別々に状態管理をしているのか説明しなさい。

<details>
<summary>解答</summary>

**サーバーサイド状態管理**:
- **権威性**: ゲームの真の状態を保持
- **整合性**: 複数クライアント間でデータの整合性を保証
- **永続性**: クライアント接続/切断に関わらず状態を維持

**クライアントサイド状態管理**:
- **レスポンシブ性**: UIの即座な更新
- **ユーザビリティ**: ネットワーク遅延に影響されない操作感
- **オフライン対応**: 一時的なネットワーク切断でも動作継続

**同期メカニズム**:
- WebSocketでリアルタイム同期
- サーバー状態が常に権威
</details>

#### **問題 4-3: Vercel対応**
なぜ`server/index.ts`と`api/index.ts`の2つのファイルが必要なのか説明しなさい。

<details>
<summary>解答</summary>

**server/index.ts (開発用)**:
- ローカル開発環境用
- 永続的なWebSocketサーバー
- `server.listen()` で継続実行

**api/index.ts (本番用)**:
- Vercel Functions用
- サーバーレス関数として実行
- リクエスト毎にインスタンス化
- `export default app` でExpressアプリを公開

**デプロイメント戦略**:
- 開発環境: 従来のNode.jsサーバー
- 本番環境: Serverless Functions
- 同一のビジネスロジックを共有
</details>

---

### 🎨 **UI/UX問題**

#### **問題 5-1: レスポンシブデザイン**
以下のCSSメディアクエリの意味を説明しなさい。

```css
@media (max-width: 768px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .filters {
    flex-direction: column;
  }
}
```

<details>
<summary>解答</summary>

**768px以下 (タブレット)**:
- `grid-template-columns: 1fr`: 2列→1列レイアウト
- 管理画面のQRコードと状態表示を縦並びに

**480px以下 (スマートフォン)**:
- `flex-direction: column`: 横並び→縦並び
- フィルター選択ボタンを縦配置に変更

**モバイルファースト設計**:
- 小さい画面から設計
- 段階的に大きい画面に最適化
</details>

#### **問題 5-2: アニメーション**
カード抽選アニメーションのCSS Keyframeを完成させなさい。

```css
@keyframes spin {
  from { transform: ???; }
  to { transform: ???; }
}

.spinning-card {
  animation: spin ??? linear infinite;
}
```

<details>
<summary>解答</summary>

```css
@keyframes spin {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}

.spinning-card {
  animation: spin 2s linear infinite;
}
```

**解説**:
- `rotateY`: Y軸回転でカードをひっくり返す効果
- `2s`: 2秒間のアニメーション
- `linear`: 等速アニメーション
- `infinite`: 無限ループ
</details>

---

## 応用問題編

### 🚀 **機能拡張**

#### **問題 6-1: 新機能実装**
「投票機能」を追加する場合、どのような型定義と実装が必要か設計しなさい。

<details>
<summary>解答</summary>

**型定義拡張**:
```typescript
interface Vote {
  cardId: number
  userId: string
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
}

interface GameState {
  // 既存のプロパティ...
  votes: Vote[]
  votingEnabled: boolean
  currentVoting: number | null
}

interface SocketEvents {
  // 既存のイベント...
  'vote:submit': (vote: Omit<Vote, 'userId'>) => void
  'vote:result': (results: VoteResult) => void
  'voting:start': (cardId: number) => void
  'voting:end': () => void
}
```

**実装ポイント**:
1. **サーバーサイド**: 投票データの管理と集計
2. **クライアントサイド**: 投票UIコンポーネント
3. **リアルタイム同期**: 投票結果の即座な反映
</details>

#### **問題 6-2: データ永続化**
ゲーム状態をデータベースに保存する場合の設計を考えなさい。

<details>
<summary>解答</summary>

**データベーススキーマ**:
```sql
-- ゲームセッション
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP,
  status ENUM('active', 'completed'),
  participants_count INTEGER
);

-- 使用済みカード
CREATE TABLE used_cards (
  id UUID PRIMARY KEY,
  game_session_id UUID REFERENCES game_sessions(id),
  card_id INTEGER,
  drawn_at TIMESTAMP,
  drawn_by VARCHAR(255)
);

-- 参加者
CREATE TABLE participants (
  id UUID PRIMARY KEY,
  game_session_id UUID REFERENCES game_sessions(id),
  socket_id VARCHAR(255),
  joined_at TIMESTAMP
);
```

**実装アプローチ**:
1. **Repository Pattern**: データアクセス層の分離
2. **Event Sourcing**: イベント履歴の記録
3. **CQRS**: 読み込みと書き込みの分離
</details>

#### **問題 6-3: 国際化対応**
多言語対応を実装する場合の設計を説明しなさい。

<details>
<summary>解答</summary>

**i18n設計**:
```typescript
// 言語リソース
interface Translations {
  'card.draw': string
  'card.reset': string
  'category.technology': string
  'difficulty.initial': string
}

const translations: Record<string, Translations> = {
  ja: {
    'card.draw': 'カードを引く',
    'card.reset': 'リセット',
    'category.technology': '技術',
    'difficulty.initial': '初級'
  },
  en: {
    'card.draw': 'Draw Card',
    'card.reset': 'Reset',
    'category.technology': 'Technology',
    'difficulty.initial': 'Beginner'
  }
}

// カスタムフック
const useTranslation = (locale: string) => {
  const t = useCallback((key: keyof Translations) => {
    return translations[locale][key] || key
  }, [locale])
  
  return { t }
}
```

**多言語カードデータ**:
```typescript
interface MultilingualCard extends Card {
  title_ja: string
  title_en: string
  description_ja: string
  description_en: string
}
```
</details>

---

## 実践演習編

### 🛠️ **デバッグ問題**

#### **問題 7-1: WebSocket接続エラー**
以下のエラーが発生した場合の原因と対処法を説明しなさい。

```
WebSocket connection to 'ws://localhost:3001/socket.io/' failed
```

<details>
<summary>解答</summary>

**考えられる原因**:

1. **サーバー未起動**
   ```bash
   # 確認方法
   netstat -an | grep :3001
   
   # 対処法
   npm run server:dev
   ```

2. **CORS設定問題**
   ```typescript
   // server/index.ts
   const io = new Server(server, {
     cors: {
       origin: ["http://localhost:5173"], // クライアントURLを追加
       methods: ["GET", "POST"]
     }
   })
   ```

3. **ポート競合**
   ```bash
   # 確認方法
   lsof -i :3001
   
   # 対処法
   kill -9 <PID>
   ```

**デバッグ手順**:
1. ネットワークタブでWebSocket接続状態確認
2. サーバーログでエラー出力確認
3. クライアント側のSocket.IOイベント確認
</details>

#### **問題 7-2: TypeScriptコンパイルエラー**
以下のエラーの修正方法を説明しなさい。

```
server/index.ts(8,46): error TS6059: File '/shared/types.ts' is not under 'rootDir'
```

<details>
<summary>解答</summary>

**原因**: TypeScriptのrootDir設定問題

**解決方法1: tsconfig.json修正**
```json
{
  "compilerOptions": {
    "rootDir": ".",  // プロジェクトルートに変更
    "outDir": "./dist"
  },
  "include": [
    "server/**/*",
    "shared/**/*"  // sharedフォルダを含める
  ]
}
```

**解決方法2: パス設定**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["shared/*"]
    }
  }
}
```

**解決方法3: ファイル移動**
```bash
# sharedファイルをserverディレクトリ内に移動
mv shared server/shared
```
</details>

#### **問題 7-3: 本番環境でのWebSocket問題**
Vercelデプロイ後にWebSocketが動作しない場合の対処法を説明しなさい。

<details>
<summary>解答</summary>

**Vercelの制限**:
- Serverless Functions は永続的なWebSocket接続をサポートしない
- リクエスト単位で実行が完了する

**代替ソリューション**:

1. **Pusher使用**
   ```typescript
   import Pusher from 'pusher'
   import PusherClient from 'pusher-js'
   
   // サーバーサイド
   const pusher = new Pusher({
     appId: process.env.PUSHER_APP_ID,
     key: process.env.PUSHER_KEY,
     secret: process.env.PUSHER_SECRET,
     cluster: process.env.PUSHER_CLUSTER
   })
   
   // イベント送信
   pusher.trigger('game-channel', 'card-drawn', data)
   ```

2. **Ably使用**
   ```typescript
   import Ably from 'ably'
   
   const client = new Ably.Realtime(process.env.ABLY_API_KEY)
   const channel = client.channels.get('game-updates')
   
   channel.publish('card-drawn', data)
   ```

3. **Socket.IO + Railway**
   ```bash
   # WebSocket専用サーバーを別デプロイ
   railway deploy
   ```
</details>

---

### 🎯 **パフォーマンス最適化**

#### **問題 8-1: React最適化**
以下のコンポーネントでパフォーマンス問題がある箇所を指摘し、修正しなさい。

```typescript
const CardList = ({ gameState, categories }) => {
  const filteredCards = gameState.availableCards.filter(card => 
    categories[card.category].color !== '#000000'
  )
  
  const sortedCards = filteredCards.sort((a, b) => 
    a.difficulty.localeCompare(b.difficulty)
  )
  
  return (
    <div>
      {sortedCards.map(card => (
        <div key={card.id} style={{borderColor: categories[card.category].color}}>
          {card.title}
        </div>
      ))}
    </div>
  )
}
```

<details>
<summary>解答</summary>

**問題点**:
1. 毎レンダリングでfilter/sort処理実行
2. インライン関数でkey生成
3. インラインスタイルオブジェクト

**最適化版**:
```typescript
const CardList = React.memo(({ gameState, categories }) => {
  // useMemoで計算結果をキャッシュ
  const sortedCards = useMemo(() => {
    return gameState.availableCards
      .filter(card => categories[card.category].color !== '#000000')
      .sort((a, b) => a.difficulty.localeCompare(b.difficulty))
  }, [gameState.availableCards, categories])
  
  return (
    <div>
      {sortedCards.map(card => (
        <CardItem 
          key={card.id} 
          card={card} 
          borderColor={categories[card.category].color}
        />
      ))}
    </div>
  )
})

// 子コンポーネントも分離してメモ化
const CardItem = React.memo(({ card, borderColor }) => (
  <div style={{borderColor}}>
    {card.title}
  </div>
))
```

**最適化ポイント**:
- `React.memo`: 不要な再レンダリングを防止
- `useMemo`: 重い計算処理をキャッシュ
- コンポーネント分割: 影響範囲を限定
</details>

---

## 参考資料

### 📖 **公式ドキュメント**

#### **TypeScript**
- [Handbook](https://www.typescriptlang.org/docs/)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

#### **React**
- [公式チュートリアル](https://react.dev/learn)
- [Hooks API Reference](https://react.dev/reference/react)
- [Performance Optimization](https://react.dev/learn/render-and-commit)

#### **Socket.IO**
- [Getting Started](https://socket.io/get-started/)
- [Client API](https://socket.io/docs/v4/client-api/)
- [Server API](https://socket.io/docs/v4/server-api/)

#### **Vercel**
- [Functions](https://vercel.com/docs/functions)
- [Build Configuration](https://vercel.com/docs/projects/project-configuration)

### 🛠️ **開発ツール**

#### **必須ツール**
- **VS Code**: コードエディター
- **Node.js**: ランタイム環境
- **Git**: バージョン管理
- **Chrome DevTools**: デバッグツール

#### **推奨拡張機能**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json"
  ]
}
```

### 📚 **学習順序**

#### **初級者向け (1-2週間)**
1. TypeScript基本文法
2. React Hooks基礎
3. CSS基礎
4. Git基本操作

#### **中級者向け (2-4週間)**
1. WebSocket通信
2. カスタムHooks
3. パフォーマンス最適化
4. デプロイメント

#### **上級者向け (1-2ヶ月)**
1. アーキテクチャ設計
2. テスト駆動開発
3. CI/CDパイプライン
4. スケーラビリティ対応

---

### 💡 **学習のコツ**

1. **手を動かす**: 必ずコードを書いて実行
2. **エラーを恐れない**: エラーメッセージから学ぶ
3. **小さく作る**: 機能を段階的に実装
4. **質問する**: コミュニティやAIを活用
5. **継続する**: 毎日少しずつでも続ける

**Happy Coding! 🚀**