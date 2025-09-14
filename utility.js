
// Returns a pokemon object from the pokeapi
async function getPokemon(index) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
}

// Just a wait function that returns a promise and takes seconds as input
function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// Shuffles an array: Fisher-Yates (Knuth) shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
