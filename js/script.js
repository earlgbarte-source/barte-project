// =============================
// NOVASPIN GAME SYSTEM
// =============================

let coins = 2500;


// Update balance on screen
function updateBalance() {
    document.getElementById("coinBalance").textContent = coins;
}


// Display game message
function showMessage(message) {
    document.getElementById("gameMessage").textContent = message;
}


// =============================
// LUCKY WHEEL
// =============================

function playWheel() {

    const rewards = [100, 200, 300, 500, 750];

    const randomIndex =
        Math.floor(Math.random() * rewards.length);

    const reward = rewards[randomIndex];

    coins += reward;

    updateBalance();

    showMessage(
        "🎡 Lucky Wheel: You received " +
        reward +
        " Nova Coins!"
    );
}


// =============================
// TREASURE CARDS
// =============================

function playCards() {

    const rewards = [50, 100, 250, 400, 600];

    const randomIndex =
        Math.floor(Math.random() * rewards.length);

    const reward = rewards[randomIndex];

    coins += reward;

    updateBalance();

    showMessage(
        "🃏 Treasure Card: You found " +
        reward +
        " Nova Coins!"
    );
}


// =============================
// NUMBER CHALLENGE
// =============================

function guessNumber(playerGuess) {

    const secretNumber =
        Math.floor(Math.random() * 5) + 1;

    if (playerGuess === secretNumber) {

        coins += 300;

        showMessage(
            "🎉 Correct! You earned 300 Nova Coins!"
        );

    } else {

        showMessage(
            "❌ Not this time! The number was " +
            secretNumber +
            "."
        );
    }

    updateBalance();
}


// =============================
// DAILY REWARD
// =============================

function claimReward() {

    const button =
        document.getElementById("rewardButton");

    const today =
        new Date().toDateString();

    const lastClaim =
        localStorage.getItem("novaSpinReward");

    if (lastClaim === today) {

        showMessage(
            "🎁 You already claimed today's reward!"
        );

        return;
    }

    coins += 500;

    localStorage.setItem(
        "novaSpinReward",
        today
    );

    updateBalance();

    button.textContent = "REWARD CLAIMED";

    showMessage(
        "🎁 You received 500 free Nova Coins!"
    );
}


// =============================
// SCROLL TO GAMES
// =============================

function scrollToGames() {

    document
        .getElementById("games")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// Initial balance
updateBalance();