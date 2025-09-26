import type { Card, CategoryInfo, DifficultyInfo } from '../types'

// カードデータ - API側と同期
export const techHubCards: Card[] = [
  { id: 1, title: "最近ハマっていること", description: "今一番興味を持って取り組んでいることは何ですか？" },
  { id: 2, title: "大切にしている価値観", description: "人生で大切にしている考え方や価値観について話してください" },
  { id: 3, title: "理想の働き方", description: "どんな環境でどんな風に働きたいですか？" },
  { id: 4, title: "印象に残る体験談", description: "人生で印象に残っている出来事やエピソードはありますか？" },
  { id: 5, title: "チームワークの秘訣", description: "良いチームを作るために大切だと思うことは何ですか？" },
  { id: 6, title: "今後のキャリア", description: "将来やってみたいことや目指している方向性はありますか？" },
  { id: 7, title: "効率化の工夫", description: "日常生活や仕事で実践している効率化のコツはありますか？" },
  { id: 8, title: "学習の方法", description: "新しいことを学ぶ時に心がけていることはありますか？" },
  { id: 9, title: "お気に入りのもの", description: "愛用している道具やサービス、おすすめしたいものはありますか？" },
  { id: 10, title: "これからの挑戦", description: "今後挑戦してみたいことや興味があることは何ですか？" }
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