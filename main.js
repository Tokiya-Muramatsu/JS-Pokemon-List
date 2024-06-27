// DOM
const button = document.getElementById("addBtn");
const lists = document.getElementById("lists");

// 1から呼び出す && ローカルストレージに保存
let currentPokemonId = 1;

// 関数
function addList(pokemonData, speciesData) {
    const japaneseName = speciesData.names.find(nameInfo => nameInfo.language.name === 'ja').name;
    const pokemonImage = pokemonData.sprites.front_default;
    // タイプを英語から日本語に変更
    const pokemonTypes = pokemonData.types.map(typeInfo => {
        switch (typeInfo.type.name) {
            case 'normal': return 'ノーマル';
            case 'fighting': return 'かくとう';
            case 'flying': return 'ひこう';
            case 'poison': return 'どく';
            case 'ground': return 'じめん';
            case 'rock': return 'いわ';
            case 'bug': return 'むし';
            case 'ghost': return 'ゴースト';
            case 'steel': return 'はがね';
            case 'fire': return 'ほのお';
            case 'water': return 'みず';
            case 'grass': return 'くさ';
            case 'electric': return 'でんき';
            case 'psychic': return 'エスパー';
            case 'ice': return 'こおり';
            case 'dragon': return 'ドラゴン';
            case 'dark': return 'あく';
            case 'fairy': return 'フェアリー';
            default: return typeInfo.type.name;
        }
    }).join(", ");

    const listItem = document.createElement('div');
    
    // ポケモンの画像を追加
    if (pokemonImage) {
        const imgElement = document.createElement('img');
        imgElement.src = pokemonImage;
        imgElement.alt = japaneseName;
        listItem.appendChild(imgElement);
    }
    
    // ポケモンの名前を追加
    const nameElement = document.createElement('h3');
    nameElement.textContent = japaneseName;
    listItem.appendChild(nameElement);

    // タイプ
    const typeElement = document.createElement('span');
    typeElement.textContent = `タイプ：${pokemonTypes}`;
    listItem.appendChild(typeElement);


    lists.appendChild(listItem);

    return pokemonData;
}

async function getPokemon() {

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemonId}/`);
        if (!res.ok) {
            throw new Error('ネットワークの応答が正常ではありません。');
        }
        const pokemonData = await res.json();
        return pokemonData;
    } catch (error) {
        console.error('ポケモンの取得中にエラーが発生しました。', error);
        throw error; // エラーを再スローして呼び出しもとに伝える
    }
}

async function getSpeciesData(pokemonData) {
    try {
        const res = await fetch(pokemonData.species.url);
        if (!res.ok) {
            throw new Error('ネットワークの応答が正常ではありません。');
        }
        const speciesData = await res.json();
        return speciesData;
    } catch (error) {
        console.error('ポケモンの種類データの取得中にエラーが発生しました。', error);
        throw error;
    }
}

async function listPokemon() {
    
    try {
        const pokemonData = await getPokemon();
        const speciesData = await getSpeciesData(pokemonData);
        addList(pokemonData, speciesData); // addList関数にpokemonDataとspeciesDataを渡す

        // ポケモンの順番
        currentPokemonId++;
    } catch (error) {
        console.error('ポケモンリストの作成中にエラーが発生しました。', error);
    }

}

// イベント
window.addEventListener("load", listPokemon);
button.addEventListener('click', listPokemon);

