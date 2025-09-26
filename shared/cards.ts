import type { Card, CategoryInfo, DifficultyInfo } from './types.js'

export const techHubCards: Card[] = [
  { id: 1, title: "最近のAI事情・活用法", description: "AIの最新動向や実際の活用方法などAIについてざっくばらんに話しましょう" },
  { id: 2, title: "今の案件の不満", description: "現在携わっているプロジェクトで困っていることなどなど" },
  { id: 3, title: "おすすめのツール・ガジェット", description: "最近使っているおすすめのツールやガジェットはありますか？" },
  { id: 4, title: "現場の謎ルール", description: "職場にある理解しがたいルールや慣習はありますか？" },
  { id: 5, title: "最近ハマっていること", description: "今一番興味を持って取り組んでいることは何ですか？技術以外のことでもなんでもOK！" },
  { id: 6, title: "情報のキャッチアップの仕方", description: "技術情報をどのように収集していますか？" },
  { id: 7, title: "いま個人的に取り組んでいること", description: "プライベートで進めているプロジェクトや学習はありますか？" },
  { id: 8, title: "得意分野", description: "自分の強みや得意な技術領域について教えてください" },
  { id: 9, title: "最近の失敗談、やらかし", description: "最近経験した失敗やミスから学んだことはありますか？" },
  { id: 10, title: "興味を持っている分野、技術", description: "今後学んでみたい技術や分野はありますか？" },
  { id: 11, title: "キャリアについて", description: "将来のキャリアプランや目標について聞かせてください" }
]

export const categories: Record<string, CategoryInfo> = {
  "学習": { color: "#4CAF50", icon: "📚" },
  "技術": { color: "#2196F3", icon: "💻" },
  "環境": { color: "#FF9800", icon: "⚙️" },
  "経験": { color: "#9C27B0", icon: "🎯" },
  "チーム": { color: "#F44336", icon: "👥" },
  "設計": { color: "#3F51B5", icon: "🏗️" },
  "最適化": { color: "#E91E63", icon: "⚡" },
  "セキュリティ": { color: "#795548", icon: "🔐" },
  "品質": { color: "#607D8B", icon: "✅" },
  "改善": { color: "#8BC34A", icon: "🔧" },
  "データベース": { color: "#00BCD4", icon: "💾" },
  "インフラ": { color: "#FF5722", icon: "☁️" },
  "運用": { color: "#673AB7", icon: "📊" },
  "発信": { color: "#FFC107", icon: "📢" },
  "貢献": { color: "#4CAF50", icon: "🌟" },
  "個人": { color: "#9E9E9E", icon: "🚀" },
  "キャリア": { color: "#FF9800", icon: "💼" },
  "コミュニティ": { color: "#E91E63", icon: "🤝" },
  "指導": { color: "#3F51B5", icon: "👨‍🏫" },
  "PM": { color: "#9C27B0", icon: "📋" },
  "働き方": { color: "#00BCD4", icon: "🏠" }
}

export const difficulties: Record<string, DifficultyInfo> = {
  "initial": { color: "#4CAF50", level: 1 },
  "intermediate": { color: "#FF9800", level: 2 },
  "advanced": { color: "#F44336", level: 3 }
}