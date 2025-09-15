import type { Card, CategoryInfo, DifficultyInfo } from '../types'

// カードデータ - API側と同期
export const techHubCards: Card[] = [
  { id: 1, title: "最近学んだ新しい技術", description: "最近挑戦した技術や言語について話そう", category: "学習", difficulty: "initial" },
  { id: 2, title: "好きなプログラミング言語", description: "なぜその言語が好きなのか、魅力を語ろう", category: "技術", difficulty: "initial" },
  { id: 3, title: "開発環境のこだわり", description: "エディタ、ターミナル、ツールなどの個人的なこだわり", category: "環境", difficulty: "initial" },
  { id: 4, title: "最大の失敗談", description: "プロジェクトやコーディングでの痛い失敗体験", category: "経験", difficulty: "intermediate" },
  { id: 5, title: "チーム開発の工夫", description: "チームワークを良くするために実践していること", category: "チーム", difficulty: "intermediate" },
  { id: 6, title: "技術選定の基準", description: "新しいプロジェクトで技術を選ぶ時の判断基準", category: "設計", difficulty: "intermediate" },
  { id: 7, title: "コードレビューの哲学", description: "良いコードレビューとは何か、自分なりの考え", category: "チーム", difficulty: "intermediate" },
  { id: 8, title: "パフォーマンス改善体験", description: "アプリやシステムの速度を改善した経験", category: "最適化", difficulty: "advanced" },
  { id: 9, title: "設計パターンの活用", description: "実際に使って効果があったデザインパターン", category: "設計", difficulty: "advanced" },
  { id: 10, title: "セキュリティ対策", description: "開発で意識しているセキュリティのポイント", category: "セキュリティ", difficulty: "intermediate" },
  { id: 11, title: "テスト戦略", description: "効果的なテストコードの書き方や考え方", category: "品質", difficulty: "intermediate" },
  { id: 12, title: "リファクタリング経験", description: "レガシーコードをどう改善したか", category: "改善", difficulty: "advanced" },
  { id: 13, title: "API設計の思想", description: "使いやすいAPIを作るための考え方", category: "設計", difficulty: "advanced" },
  { id: 14, title: "データベース設計", description: "効率的なDB設計で気をつけていること", category: "データベース", difficulty: "intermediate" },
  { id: 15, title: "印象的だったバグ", description: "忘れられないバグとその解決方法", category: "トラブル", difficulty: "intermediate" },
  { id: 16, title: "お気に入りのライブラリ", description: "開発効率を上げてくれるお気に入りツール", category: "技術", difficulty: "initial" },
  { id: 17, title: "コードの美学", description: "美しいコードとは何か、自分なりの美意識", category: "哲学", difficulty: "intermediate" },
  { id: 18, title: "スケールする設計", description: "将来の拡張を考慮した設計のコツ", category: "設計", difficulty: "advanced" },
  { id: 19, title: "開発者としての成長", description: "エンジニアとして成長した瞬間の体験談", category: "キャリア", difficulty: "initial" },
  { id: 20, title: "技術の学習方法", description: "新しい技術を効率的に習得する自分なりの方法", category: "学習", difficulty: "initial" },
  { id: 21, title: "プロダクトマネジメント", description: "技術とビジネスの橋渡しで心がけていること", category: "マネジメント", difficulty: "advanced" },
  { id: 22, title: "CI/CDパイプライン", description: "開発フローを改善した自動化の取り組み", category: "DevOps", difficulty: "intermediate" },
  { id: 23, title: "クラウド活用", description: "AWS/Azure/GCPでの実践的な活用例", category: "インフラ", difficulty: "intermediate" },
  { id: 24, title: "マイクロサービス設計", description: "サービス分割の判断基準と実装のコツ", category: "アーキテクチャ", difficulty: "advanced" },
  { id: 25, title: "モニタリング戦略", description: "システム監視とアラートの効果的な運用", category: "運用", difficulty: "intermediate" },
  { id: 26, title: "技術的負債との向き合い方", description: "レガシーシステムの改善アプローチ", category: "改善", difficulty: "intermediate" },
  { id: 27, title: "新人育成の工夫", description: "後輩エンジニアのメンタリング経験", category: "教育", difficulty: "intermediate" },
  { id: 28, title: "OSS貢献体験", description: "オープンソースプロジェクトへの関わり方", category: "コミュニティ", difficulty: "intermediate" },
  { id: 29, title: "技術選定の失敗談", description: "選択した技術で後悔した経験とその学び", category: "失敗", difficulty: "advanced" },
  { id: 30, title: "理想の開発チーム", description: "最高のパフォーマンスを発揮するチームの条件", category: "チーム", difficulty: "advanced" }
]

export const categories: Record<string, CategoryInfo> = {
  '学習': { name: '学習', color: '#3b82f6', icon: '📚' },
  '技術': { name: '技術', color: '#8b5cf6', icon: '⚡' },
  '環境': { name: '環境', color: '#06b6d4', icon: '🛠️' },
  '経験': { name: '経験', color: '#f59e0b', icon: '💡' },
  'チーム': { name: 'チーム', color: '#10b981', icon: '👥' },
  '設計': { name: '設計', color: '#ef4444', icon: '🎨' },
  '最適化': { name: '最適化', color: '#ec4899', icon: '⚡' },
  'セキュリティ': { name: 'セキュリティ', color: '#dc2626', icon: '🔒' },
  '品質': { name: '品質', color: '#059669', icon: '✅' },
  '改善': { name: '改善', color: '#7c3aed', icon: '🔧' },
  'データベース': { name: 'データベース', color: '#0891b2', icon: '🗄️' },
  'トラブル': { name: 'トラブル', color: '#ea580c', icon: '🚨' },
  '哲学': { name: '哲学', color: '#6366f1', icon: '💭' },
  'キャリア': { name: 'キャリア', color: '#10b981', icon: '📈' },
  'マネジメント': { name: 'マネジメント', color: '#0d9488', icon: '👨‍💼' },
  'DevOps': { name: 'DevOps', color: '#7c2d12', icon: '⚙️' },
  'インフラ': { name: 'インフラ', color: '#1e40af', icon: '🏗️' },
  'アーキテクチャ': { name: 'アーキテクチャ', color: '#7e22ce', icon: '🏛️' },
  '運用': { name: '運用', color: '#059669', icon: '🔄' },
  '教育': { name: '教育', color: '#0369a1', icon: '🎓' },
  'コミュニティ': { name: 'コミュニティ', color: '#16a34a', icon: '🤝' },
  '失敗': { name: '失敗', color: '#dc2626', icon: '💥' }
}

export const difficulties: Record<string, DifficultyInfo> = {
  'initial': { name: '初級', color: '#22c55e', description: '誰でも気軽に話せる' },
  'intermediate': { name: '中級', color: '#f59e0b', description: '少し専門的な内容' },
  'advanced': { name: '上級', color: '#ef4444', description: '深い技術的な議論' }
}