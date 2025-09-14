// Constants
const CARD_STYLES = {
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
};

// Helper functions for building elements
function calculateGridLayout(totalCards) {
    const gridSize = Math.sqrt(totalCards);
    let columnsCount = Math.ceil(gridSize);

    if (columnsCount * (Math.ceil(totalCards / columnsCount) - 1) >= totalCards) {
        columnsCount = Math.floor(gridSize);
    }

    columnsCount = Math.max(1, columnsCount);
    const rowsCount = Math.ceil(totalCards / columnsCount);

    return { columns: columnsCount, rows: rowsCount };
}

function setupGridLayout(containerElement, cards) {
    const { columns, rows } = calculateGridLayout(cards.length);
    containerElement.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    containerElement.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}

function createCardSide(className, backgroundImageUrl = null) {
    const element = document.createElement('div');
    element.className = className;

    if (backgroundImageUrl) {
        element.style.backgroundImage = `url('${backgroundImageUrl}')`;
    }

    Object.assign(element.style, CARD_STYLES);

    if (className === 'card-back') {
        element.style.imageRendering = "pixelated";
    }

    return element;
}

function createCardElement(card, game, containerElement, hardModeOn) {
    if (!card.image) {
        throw new Error("Card image not found");
    }

    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.style.transition = `transform ${flipDuration}s ease-in-out`;

    const cardFront = createCardSide('card-front', 'card.jpg');
    const cardBack = createCardSide('card-back', card.image);

    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    containerElement.appendChild(cardElement);

    cardElement.addEventListener('click', () => {
        game.flipCard(card);
    });

    card.domElement = cardElement;
}

// Endgame screen
function endGame(){
    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay';
    const content = document.createElement('div');
    content.className = 'game-over-content';
    const message = document.createElement('h1');
    message.textContent = 'YOU WON!';
    const messageTime = document.createElement('h2');
    messageTime.textContent = 'Your time was: ' + document.getElementById("time").textContent + '!';

    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'PLAY AGAIN';
    playAgainButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        location.reload();
    });

    content.appendChild(message);
    content.appendChild(messageTime);
    content.appendChild(playAgainButton);
    overlay.appendChild(content);

    document.body.appendChild(overlay);
}

// Entrypoint of the game using async await (instead of game loop)
async function main() {
    const hardMode = document.getElementById("hard-mode");
    hardMode.addEventListener('change', () => {
        setTimeout(() => {window.location.reload();}, 100);
    })
    let hardModeOn = hardMode.checked;

    const containerElement = document.getElementById("flip-card-container");
    containerElement.innerHTML = '';
    containerElement.style.gap = hardModeOn ? '5px' : '20px';

    const game = new Game();
    await (hardModeOn ? game.startGame(72) : game.startGame());
    console.log("Game started, cards:", game.cards);

    setupGridLayout(containerElement, game.cards);
    const handleResize = () => setupGridLayout(containerElement, game.cards);
    window.addEventListener('resize', handleResize);

    game.cards.forEach(card => createCardElement(card, game, containerElement, hardModeOn));

    await game.getGameState()

    endGame();
    await wait(6000);
}

