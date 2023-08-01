let actualWordArray;
let gotWord = false;
let words = [];
let iImage = 0;
let resultado;
let usedLetters = [];

let images = [
    {
        image: "/images/1.png"
    },
    {
        image: "/images/2.png"
    },
    {
        image: "/images/3.png"
    },
    {
        image: "/images/4.png"
    },
    {
        image: "/images/5.png"
    },
    {
        image: "/images/6.png"
    },
    {
        image: "/images/lose.png"
    }
];

const showLetter = (letter, wordArray) => {
    words.push(letter);
    let hiddenWord = wordArray.map((char) => (words.includes(char) ? char : '_')).join(",");
    let word = document.querySelector(".word");
    word.innerHTML = hiddenWord;
};

const restartGame = () => {
    let word = document.querySelector(".word");
    let startGameButton = document.querySelector(".start");
    let answer = document.querySelector(".answer");
    let usedLetterss = document.querySelector(".usedLetters");
    startGameButton.classList.remove("off");
    usedLetterss.innerHTML = "";
    let imagen = document.querySelector(".imagen");
    imagen.innerHTML = '<img src="/images/0.png">';
    usedLetterss.textContent = "";
    iImage = 0;
    word.innerHTML = "";
    words = [];
    resultado = "";
    usedLetters = [];
    actualWordArray = [];
    gotWord = false;
    answer.value = "";
    imagen.classList.remove("on");
};

const verifyWin = () => {
    let image = document.querySelector(".imagen");
    let usedLetterss = document.querySelector(".usedLetters");
    let array = resultado.split('');
    let includes = array.every(char => usedLetters.includes(char));

    if (iImage < 7 && includes) {
      
        usedLetterss.innerHTML = "Winner winner chicken dinner";
        let restartGameButton = document.createElement("button");
        image.innerHTML = ' <img src="/images/win.png">';
        restartGameButton.textContent = "Restart Game";
        restartGameButton.classList.add("button");
        usedLetterss.appendChild(restartGameButton);
       
        restartGameButton.addEventListener("click", () => {
            restartGame();
        });
        return true;
    }
    return false;
};

const checkGameOver = () => {
  
    let usedLetterss = document.querySelector(".usedLetters");
    if (iImage === 7) {
        usedLetterss.innerHTML = "Game over";
        let restartGameButton = document.createElement("button");
        restartGameButton.textContent = "Restart Game";
        restartGameButton.classList.add("button");
        usedLetterss.appendChild(restartGameButton);
       
        restartGameButton.addEventListener("click", () => {
            restartGame();
        });
        return true;
    }
    return false;
};

const startGame = (submittedLetter, wordArray) => {
    console.log(resultado);
    console.log(submittedLetter, wordArray);
    if (verifyWin() || checkGameOver()) return;

    let image = document.querySelector(".imagen");
    let usedLetterss = document.querySelector(".usedLetters");
    let found = false;

    for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] === submittedLetter) {
            let l = wordArray[i];
            showLetter(l, wordArray);
            if (!usedLetters.includes(submittedLetter)) {
                usedLetters.push(submittedLetter);
                let letters = usedLetters.join('');
                usedLetterss.innerHTML = `Used Letters: ${letters}`;
            } else {
                usedLetterss.innerHTML = "Try again";
            }
            found = true;
        }
    }

    if (!found) {
        if (!usedLetters.includes(submittedLetter)) {
            usedLetters.push(submittedLetter);
            let letters = usedLetters.join('');
            usedLetterss.innerHTML = `Used Letters: ${letters}`;
            iImage = iImage + 1;
            let currentImage = images[iImage];
            image.innerHTML = `<img src="${currentImage.image}">`;
        } else {
            usedLetterss.innerHTML = "Try again, already used letter";
        }

        if (checkGameOver()) {
            verifyWin();
        }
    }
};
const getWord = (result) => {
    let word = result.word;
    let wordArray = word.split('');
    return wordArray;
};

async function startApi(submittedLetter) {
    try {
        let result = await $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/randomword',
            headers: { 'X-Api-Key': 'wafvhhILGJaX4gHXFwuiFjKru3Jqm6iutmuZUXai' },
            contentType: 'application/json',
        });
        resultado = result.word;
        actualWordArray = getWord(result);
        startGame(submittedLetter, actualWordArray);
    } catch (error) {
        console.error('Error: ', error);
    }
}

const start = () => {
    let button = document.querySelector("#play");
    let wordForm = document.querySelector(".wordForm");

    button.addEventListener("click", () => {
        let startGameButton = document.querySelector(".start");
        let imagen = document.querySelector(".imagen");
        imagen.classList.add("on");
        startGameButton.classList.add("off");

        // Asociar el evento de envío al formulario
        wordForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevenir el envío del formulario
            if (!gotWord) {
                let submittedLetter = document.querySelector(".answer").value;
                startApi(submittedLetter);
                gotWord = true;
            } else {
                let submittedLetter = document.querySelector(".answer").value;
                startGame(submittedLetter, actualWordArray);
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', start);
