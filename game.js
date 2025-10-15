// country list
const countries = [
    {rank: 1, country: "China"},
    {rank: 2, country: "India"},
    {rank: 3, country: "United States"},
    {rank: 4, country: "Indonesia"},
    {rank: 5, country: "Pakistan"},
    {rank: 6, country: "Nigeria"},
    {rank: 7, country: "Brazil"},
    {rank: 8, country: "Bangladesh"},
    {rank: 9, country: "Russia"},
    {rank: 10, country: "Ethiopia"},
    {rank: 11, country: "Mexico"},
    {rank: 12, country: "Japan"},
    {rank: 13, country: "Egypt"},
    {rank: 14, country: "Philippines"},
    {rank: 15, country: "DR Congo"},
    {rank: 16, country: "Vietnam"},
    {rank: 17, country: "Iran"},
    {rank: 18, country: "Turkey"},
    {rank: 19, country: "Germany"},
    {rank: 20, country: "Thailand"},
    {rank: 21, country: "Tanzania"},
    {rank: 22, country: "United Kingdom"},
    {rank: 23, country: "France"},
    {rank: 24, country: "South Africa"},
    {rank: 25, country: "Italy"}
];

const gameArea = document.getElementById("gameArea");
const answerBar = document.getElementById("answerBar");
const gameOverScreen = document.getElementById("gameOverScreen");
const gameOverText = document.getElementById("gameOverText");
const playAgainButton = document.getElementById("playAgainButton");
const score = document.getElementById("score");
const finalScore = document.getElementById("finalScore");

let currIndex = 0;
let currBubbles = [];
let gameState = true; // playing
let spawnInterval = null;
let currScore = 0;
let missedAns = null;

// function to shuffle countries
function shuffle(array) {
    // fischer-yates shuffle o-O
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// prepare a game list for each round
let gamelist = shuffle([...countries]).map(item => {
    // decide between rank or country name
    const showCountry = Math.random() < 0.5; // 50-50 chance of country or rank
    return {
        q: showCountry ? item.country : item.rank.toString(),
        a: showCountry ? item.rank.toString() : item.country
    };
});

// update score
function updateScore() {
    score.textContent = `Score: ${currScore}`;
}


// bubble spawner
function spawnBubble(q, a) {
    if (!gameState) return;

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.textContent = q; 
    bubble.dataset.ans = a; 

    // random horizontal pos
    const gameAreaWidth = gameArea.offsetWidth;
    const bubbleWidth = 120;
    const randomXPos = Math.random() * (gameAreaWidth - bubbleWidth);
    bubble.style.left = `${randomXPos}px`;

    gameArea.appendChild(bubble);
    currBubbles.push(bubble);

    // remove bubble after it falls
    bubble.addEventListener("animationend", () => {
        if (!bubble.dataset.cleared) {
            console.log("Game Over!");
            missedAns = bubble.dataset.ans;
            endGame(false);
        }
    });
}

// game loop
function startGame() {
    spawnInterval = setInterval(() => {
        if (currIndex >= gamelist.length) {
            clearInterval(spawnInterval);
            
            const checkWin = setInterval(() => {
                if (currBubbles.length === 0) {
                    console.log("Win!");
                    clearInterval(checkWin);
                    endGame(true);
                }
            }, 500);
            return;
        }

        const currBubble = gamelist[currIndex];
        spawnBubble(currBubble.q, currBubble.a);
        currIndex++;
    }, 3000);
}

// answer bar input
answerBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const userAns = answerBar.value.trim();
        const currBubble = currBubbles.find(b => b.dataset.ans === userAns);
        if (currBubble) {
            currBubble.dataset.cleared = true;
            currBubble.remove();
            answerBar.value = "";
            currScore++;
            updateScore();
            if (currScore === countries.length) {
                endGame(true);
            }
        }
    }
});

function endGame(result) {
    if(!gameState) return;

    gameState = false;
    clearInterval(spawnInterval);

    currBubbles.forEach(bubble => {
        bubble.classList.add("paused");
    });

    gameOverText.textContent = result ? "Congratulations!" : "Game Over!";
    finalScore.textContent = `Final Score: ${currScore}`;
    if(!result) {
        document.getElementById("correctAns").textContent = `The correct answer was: ${missedAns}`;
    }
    else {
        document.getElementById("correctAns").textContent = "";
    }
    gameOverScreen.style.display = "flex";
}

playAgainButton.addEventListener("click", () => {
    window.location.reload();
});

startGame();