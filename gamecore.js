
// Game Objects and core logic

let flipDuration = 0.5;
class Card {

    matched = false;
    image = null;
    name = null;
    domElement = null;
    constructor(index) {
        this.index = index;
    }

    async initialize() {
        try {
            const pokemon = await getPokemon(this.index);
            this.name = pokemon.name;
            this.image = pokemon.sprites.front_default;
            return this;
        } catch (error) {
            console.error("Error initializing card:", error);
            return this;
        }
    }

    checkMatch(otherCard) {
        if(otherCard.name === this.name) {
            this.matched = true;
            otherCard.matched = true;
            return true;
        } else {
            return false;
        }
    }
}

class Game {
    cards = [];
    currentCard = null;
    gameSize = 8;
    numMatches = 0;
    gameWon =  false;
    gameStarted = false;
    subheader = document.getElementById("subheader");

    async startGame(size = 8) {
        this.cards = [];

        size = Math.min(Math.max(size, 1), 151);
        this.gameSize = size;

        const pokemonIndices = new Set();

        while(pokemonIndices.size < this.gameSize) {
            const randomIndex = Math.floor(Math.random() * 151) + 1;
            pokemonIndices.add(randomIndex);
        }

        for(const index of pokemonIndices) {
            this.cards.push(new Card(index));
            this.cards.push(new Card(index));
        }

        for(const card of this.cards) {
            await card.initialize();
        }

        this.cards = shuffleArray(this.cards);

        this.subheader.innerText = "Flip a card to start the game!";
    }

    async flipCard(card) {
        if(!this.gameStarted) {
            this.gameStarted = true;
            this.subheader.innerText = "Time: ";
            startTimer();
        }

        if(this.currentCard === card || card.matched) return false;

        if(this.currentCard) {
            card.domElement.classList.add('flipped');
            if(this.currentCard.checkMatch(card)) {
                this.currentCard.domElement.classList.add('flipped');
                this.currentCard.domElement.classList.add('matched');
                card.domElement.classList.add('matched');
                this.currentCard = null;
                this.updateGameState();
                return true;
            }
            else {
                const temp = this.currentCard;
                this.currentCard = null;
                await wait(flipDuration);
                if(!card.matched)
                    card.domElement.classList.remove('flipped');
                if(!temp.matched)
                    temp.domElement.classList.remove('flipped');
                return false;
            }
        }
        else {
            card.domElement.classList.add('flipped');
            this.currentCard = card;
            return true;
        }
    }

    updateGameState() {
        this.numMatches++;
        if(this.numMatches === this.gameSize) {
            this.gameWon = true;
            stopTimer();
        }
    }
    async getGameState() {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (this.gameWon) {
                    clearInterval(checkInterval);
                    resolve(true);
                }
            }, 100);
        });
    }

}



