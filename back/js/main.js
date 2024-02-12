// Const and DOM elements
const BASE_URL = 'https://pokeapi.co/api/v2/';
const pokeName = document.querySelector('.pokemon__name');
const pokeNumber = document.querySelector('.pokemon__number');
const pokeSprite = document.querySelector('.pokemon__sprite');

const form = document.querySelector('.form');
const inputSearch = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchedPokemon = 1;

// fetch the pokemon
const fetchPokemon = async (pokemonId) => {
    try {
        const response = await axios.get(`${BASE_URL}pokemon/${pokemonId}`);

        if (response.status === 200) {
            const data = response.data;
            return data;
        }

    } catch (errors) {
        console.log(errors)
    }
}

const fetchTextEntries = async (pokemonId) => {
    try {
        const response = await axios.get(`${BASE_URL}pokemon-species/${pokemonId}`);

        if (response.status === 200) {
            const data = response.data;
            return data;
        }

    } catch (errors) {
        console.log(errors)
    }
}

const pokemonRender = async (pokemonId) => {
    pokeName.innerHTML = 'Loading...';
    pokeNumber.innerHTML = '';

    const data = await fetchPokemon(pokemonId);

    if (data) {
        pokemonRandomDescription(pokemonId); 
        const spriteAnimated = data.sprites.versions['generation-v']['black-white'].animated?.front_default;
        const spriteShowdown = data.sprites.other.showdown?.front_default;
        const spriteStatic = data.sprites.front_default;

        pokeSprite.style.display = 'block';
        pokeName.innerHTML =  data.id >= 600 ? data.name : data.name.split('-')[0] 
        pokeNumber.innerHTML = data.id;
        pokeSprite.src =  spriteAnimated || spriteShowdown || spriteStatic;

        // resize sprites onload
        pokeSprite.onload = () => {
            pokeSprite.style.height = `${pokeSprite.naturalHeight * 1.6}px`;
            pokeSprite.style.width = `${pokeSprite.naturalWidth * 1.55}px`;
        };

        inputSearch.value = '';
        searchedPokemon = data.id;

    } else {
        pokeSprite.style.display = 'none';
        pokeName.innerHTML = 'Not Found!';
        pokeNumber.innerHTML = '';
        inputSearch.value = '';
    }
}

const pokemonRandomDescription = async (pokemonId) => {
    // console.log('random', pokemonId);
    const data = await fetchTextEntries(pokemonId);

    // filtering the english entries only
    const flavorTextEntries = data.flavor_text_entries.filter(text => text.language.name === 'en');
    const pokemonName = data.name;
    console.log(flavorTextEntries.length);

    // selecting a random Flavor Text Entries
    const randomIndex = Math.floor(Math.random() * flavorTextEntries.length);
    const randomText = flavorTextEntries[randomIndex].flavor_text;
    
    let finalFlavorText = `${pokemonName}... ${randomText}`;

    // calling textToSpeechFunction
    textToSpeech(finalFlavorText);
    //console.log('descripcion: ', randomText.replace(/[\n\f]/g, ' ') )
}

const textToSpeech = (text) => {
    // cancel any speech to start a new one
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    } 

    let msg = new SpeechSynthesisUtterance(text.replace(/[\n\f]/g, ' '));
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google US English'; })[0];
    msg.pitch = 1.1;
    msg.rate = 1.1;

    setTimeout(() => {
        window.speechSynthesis.speak(msg);
    }, 200);
}

// event listener form, buttons
form.addEventListener('submit', (event) => {
    event.preventDefault();
    pokemonRender(inputSearch.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchedPokemon > 1) {
        searchedPokemon -= 1;
        pokemonRender(searchedPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchedPokemon += 1;
    pokemonRender(searchedPokemon);
});

// initialize the pokedex with #1 pokemon
pokemonRender(searchedPokemon);