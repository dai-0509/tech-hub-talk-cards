class TechHubCardGame {
    constructor() {
        this.availableCards = [...techHubCards];
        this.usedCards = [];
        this.currentCard = null;
        this.isDrawing = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        const drawBtn = document.getElementById('drawCard');
        const resetBtn = document.getElementById('resetGame');
        const filterCategory = document.getElementById('filterCategory');
        const filterDifficulty = document.getElementById('filterDifficulty');

        drawBtn?.addEventListener('click', () => this.drawCard());
        resetBtn?.addEventListener('click', () => this.resetGame());
        filterCategory?.addEventListener('change', () => this.updateUI());
        filterDifficulty?.addEventListener('change', () => this.updateUI());
    }

    getFilteredCards() {
        const categoryFilter = document.getElementById('filterCategory')?.value;
        const difficultyFilter = document.getElementById('filterDifficulty')?.value;

        let filtered = this.availableCards;

        if (categoryFilter && categoryFilter !== 'all') {
            filtered = filtered.filter(card => card.category === categoryFilter);
        }

        if (difficultyFilter && difficultyFilter !== 'all') {
            filtered = filtered.filter(card => card.difficulty === difficultyFilter);
        }

        return filtered;
    }

    async drawCard() {
        if (this.isDrawing) return;

        const filteredCards = this.getFilteredCards();
        if (filteredCards.length === 0) {
            this.showMessage('該当するカードがありません！フィルターを変更してください。', 'warning');
            return;
        }

        this.isDrawing = true;
        this.showDrawAnimation();

        await this.sleep(2000);

        const randomIndex = Math.floor(Math.random() * filteredCards.length);
        const drawnCard = filteredCards[randomIndex];

        this.currentCard = drawnCard;
        this.availableCards = this.availableCards.filter(card => card.id !== drawnCard.id);
        this.usedCards.push(drawnCard);

        this.displayCard(drawnCard);
        this.isDrawing = false;
        this.updateUI();
    }

    showDrawAnimation() {
        const cardDisplay = document.getElementById('cardDisplay');
        cardDisplay.innerHTML = `
            <div class="card-animation">
                <div class="spinning-card">
                    <div class="card-back">
                        <div class="card-pattern"></div>
                        <h3>Tech Hub</h3>
                        <p>トークカード</p>
                    </div>
                </div>
                <p class="draw-text">カードを引いています...</p>
            </div>
        `;
    }

    displayCard(card) {
        const categoryInfo = categories[card.category];
        const difficultyInfo = difficulties[card.difficulty];

        const cardDisplay = document.getElementById('cardDisplay');
        cardDisplay.innerHTML = `
            <div class="drawn-card" style="border-color: ${categoryInfo.color}">
                <div class="card-header">
                    <span class="category-badge" style="background-color: ${categoryInfo.color}">
                        ${categoryInfo.icon} ${card.category}
                    </span>
                    <span class="difficulty-badge" style="background-color: ${difficultyInfo.color}">
                        ${card.difficulty}
                    </span>
                </div>
                <h2 class="card-title">${card.title}</h2>
                <p class="card-description">${card.description}</p>
                <div class="card-footer">
                    <small>トークタイム: 5〜10分</small>
                </div>
            </div>
        `;

        this.showMessage(`「${card.title}」のカードを引きました！`, 'success');
    }

    resetGame() {
        if (confirm('ゲームをリセットしますか？使用したカードもリセットされます。')) {
            this.availableCards = [...techHubCards];
            this.usedCards = [];
            this.currentCard = null;
            
            const cardDisplay = document.getElementById('cardDisplay');
            cardDisplay.innerHTML = `
                <div class="no-card">
                    <h3>💻 Tech Hub トークカード 💻</h3>
                    <p>「カードを引く」ボタンを押してトークテーマを選ぼう！</p>
                    <div class="stats">
                        <span>全30種類のトークテーマ</span>
                    </div>
                </div>
            `;

            this.updateUI();
            this.showMessage('ゲームをリセットしました！', 'info');
        }
    }

    updateUI() {
        const filteredCards = this.getFilteredCards();
        const remainingCount = filteredCards.length;
        
        document.getElementById('remainingCount').textContent = remainingCount;
        document.getElementById('usedCount').textContent = this.usedCards.length;

        const drawBtn = document.getElementById('drawCard');
        if (remainingCount === 0) {
            drawBtn.disabled = true;
            drawBtn.textContent = '利用可能なカードがありません';
        } else {
            drawBtn.disabled = this.isDrawing;
            drawBtn.textContent = this.isDrawing ? '引いています...' : 'カードを引く';
        }
    }

    showMessage(text, type = 'info') {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    populateFilters() {
        const categorySelect = document.getElementById('filterCategory');
        const difficultySelect = document.getElementById('filterDifficulty');

        const uniqueCategories = [...new Set(techHubCards.map(card => card.category))];
        const uniqueDifficulties = [...new Set(techHubCards.map(card => card.difficulty))];

        categorySelect.innerHTML = '<option value="all">すべてのカテゴリ</option>';
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = `${categories[category].icon} ${category}`;
            categorySelect.appendChild(option);
        });

        difficultySelect.innerHTML = '<option value="all">すべての難易度</option>';
        uniqueDifficulties.forEach(difficulty => {
            const option = document.createElement('option');
            option.value = difficulty;
            option.textContent = difficulty;
            difficultySelect.appendChild(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new TechHubCardGame();
    game.populateFilters();
});