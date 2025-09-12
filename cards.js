const techHubCards = [
    {
        id: 1,
        title: "最近学んだ新しい技術",
        description: "最近挑戦した技術や言語について話そう",
        category: "学習",
        difficulty: "初級"
    },
    {
        id: 2,
        title: "好きなプログラミング言語",
        description: "なぜその言語が好きなのか、魅力を語ろう",
        category: "技術",
        difficulty: "初級"
    },
    {
        id: 3,
        title: "開発環境のこだわり",
        description: "エディタ、ターミナル、ツールなどの個人的なこだわり",
        category: "環境",
        difficulty: "初級"
    },
    {
        id: 4,
        title: "最大の失敗談",
        description: "プロジェクトやコーディングでの痛い失敗体験",
        category: "経験",
        difficulty: "中級"
    },
    {
        id: 5,
        title: "チーム開発の工夫",
        description: "チームワークを良くするために実践していること",
        category: "チーム",
        difficulty: "中級"
    },
    {
        id: 6,
        title: "技術選定の基準",
        description: "新しいプロジェクトで技術を選ぶ時の判断基準",
        category: "設計",
        difficulty: "中級"
    },
    {
        id: 7,
        title: "コードレビューの哲学",
        description: "良いコードレビューとは何か、自分なりの考え",
        category: "チーム",
        difficulty: "中級"
    },
    {
        id: 8,
        title: "パフォーマンス改善体験",
        description: "アプリやシステムの速度を改善した経験",
        category: "最適化",
        difficulty: "上級"
    },
    {
        id: 9,
        title: "設計パターンの活用",
        description: "実際に使って効果があったデザインパターン",
        category: "設計",
        difficulty: "上級"
    },
    {
        id: 10,
        title: "セキュリティ対策",
        description: "開発で意識しているセキュリティのポイント",
        category: "セキュリティ",
        difficulty: "中級"
    },
    {
        id: 11,
        title: "テスト戦略",
        description: "効果的なテストコードの書き方や考え方",
        category: "品質",
        difficulty: "中級"
    },
    {
        id: 12,
        title: "リファクタリング経験",
        description: "レガシーコードをどう改善したか",
        category: "改善",
        difficulty: "上級"
    },
    {
        id: 13,
        title: "API設計の思想",
        description: "使いやすいAPIを作るための考え方",
        category: "設計",
        difficulty: "上級"
    },
    {
        id: 14,
        title: "データベース設計",
        description: "効率的なDB設計で気をつけていること",
        category: "データベース",
        difficulty: "中級"
    },
    {
        id: 15,
        title: "CI/CDの導入",
        description: "継続的インテグレーション・デプロイの取り組み",
        category: "インフラ",
        difficulty: "中級"
    },
    {
        id: 16,
        title: "モニタリング・ログ戦略",
        description: "システムの監視や問題の早期発見方法",
        category: "運用",
        difficulty: "上級"
    },
    {
        id: 17,
        title: "技術ブログ・発信活動",
        description: "知識共有や情報発信についての取り組み",
        category: "発信",
        difficulty: "初級"
    },
    {
        id: 18,
        title: "オープンソース貢献",
        description: "OSSへの貢献体験や、自分のプロジェクト",
        category: "貢献",
        difficulty: "中級"
    },
    {
        id: 19,
        title: "技術トレンドの追い方",
        description: "新しい技術情報をどうやって収集しているか",
        category: "学習",
        difficulty: "初級"
    },
    {
        id: 20,
        title: "副業・個人開発",
        description: "個人プロジェクトや副業での技術活用",
        category: "個人",
        difficulty: "初級"
    },
    {
        id: 21,
        title: "転職・キャリア",
        description: "エンジニアとしてのキャリア選択について",
        category: "キャリア",
        difficulty: "初級"
    },
    {
        id: 22,
        title: "技術面接の体験",
        description: "面接官・応募者としての技術面接エピソード",
        category: "キャリア",
        difficulty: "中級"
    },
    {
        id: 23,
        title: "コミュニティ活動",
        description: "勉強会や技術コミュニティでの経験",
        category: "コミュニティ",
        difficulty: "初級"
    },
    {
        id: 24,
        title: "メンタリング経験",
        description: "後輩指導や技術指導での気づき",
        category: "指導",
        difficulty: "中級"
    },
    {
        id: 25,
        title: "プロダクトマネジメント",
        description: "エンジニア視点でのプロダクト開発論",
        category: "PM",
        difficulty: "上級"
    },
    {
        id: 26,
        title: "スタートアップ vs 大企業",
        description: "異なる環境での開発体験の違い",
        category: "環境",
        difficulty: "中級"
    },
    {
        id: 27,
        title: "リモートワーク術",
        description: "リモート開発での効率化やコミュニケーション",
        category: "働き方",
        difficulty: "初級"
    },
    {
        id: 28,
        title: "障害対応・トラブルシューティング",
        description: "本番障害での対応経験と学び",
        category: "運用",
        difficulty: "上級"
    },
    {
        id: 29,
        title: "アーキテクチャ設計",
        description: "システム全体の設計で重視していること",
        category: "設計",
        difficulty: "上級"
    },
    {
        id: 30,
        title: "技術的負債との付き合い方",
        description: "技術的負債をどう管理・解消するか",
        category: "改善",
        difficulty: "上級"
    }
];

const categories = {
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
};

const difficulties = {
    "初級": { color: "#4CAF50", level: 1 },
    "中級": { color: "#FF9800", level: 2 },
    "上級": { color: "#F44336", level: 3 }
};