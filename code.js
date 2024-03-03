// Service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service worker registered.', reg))
      .catch((error) => console.error('Service worker registration failed.', error));
}
var deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Show your custom install banner
    document.getElementById('install-banner').style.display = 'block';
});
document.getElementById('install-banner').addEventListener('click', () => {
    console.log(deferredPrompt)
    // Trigger the install prompt
    if (deferredPrompt) {
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Reset the deferredPrompt variable
            deferredPrompt = null;
        });
    }
});

// Global Variables
var player1 = 600;
var player2 = 600;
var stats = "Stopped";
var turn = undefined;
var p1ms = 100;
var p2ms = 100;
var startTime = 600;
var add = 0;
var started = [];
var p1Moves = [];
var p2Moves = [];

function display() {
    let p1Min = Math.floor(player1 / 60);
    let p1Sec = ((player1 / 60 - p1Min) * 60).toFixed(0);
    if (p1Sec >= 60) {
        p1Sec = 0;
        p1Min += 1;
    }
    p1Min = p1Min.toString().padStart(2, '0');
    p1Sec = p1Sec.toString().padStart(2, '0');
    document.getElementById("player1").innerHTML = `${p1Min}:${p1Sec}`
    let p2Min = Math.floor(player2 / 60);
    let p2Sec = ((player2 / 60 - p2Min) * 60).toFixed(0);
    if (p2Sec >= 60) {
        p2Sec = 0;
        p2Min += 1;
    }
    p2Min = p2Min.toString().padStart(2, '0');
    p2Sec = p2Sec.toString().padStart(2, '0');
    document.getElementById("player2").innerHTML = `${p2Min}:${p2Sec}`
}

document.getElementById("p1Div").ontouchstart = function() {
    if (turn == "Player 1" || turn == undefined) {
        p1Moves.push(player1)
        if (player2 <= 0) {
            player2 = startTime;
        }
        turn = "Player 2";
        stats = "Running";
        document.getElementById("p2Div").style.backgroundColor = "green";
        document.getElementById("p1Div").style.backgroundColor = "grey";
        if (started.includes("Player 1") == true) {
            player1 += add;
        } else {
            started.push("Player 1")
        }
    }
}
document.getElementById("p2Div").ontouchstart = function() {
    if (turn == "Player 2" || turn == undefined) {
        p2Moves.push(player2)
        if (player1 <= 0) {
            player1 = startTime;
        }
        turn = "Player 1";
        stats = "Running";
        document.getElementById("p2Div").style.backgroundColor = "grey";
        document.getElementById("p1Div").style.backgroundColor = "green";
        if (started.includes("Player 2") == true) {
            player2 += add;
        } else {
            started.push("Player 2")
        }
    }
}

setInterval(function() {
    if (stats == "Running") {
        if (turn == "Player 1") {
            p1ms -= 10;
            if (p1ms <= 0) {
                player1 -= 1;
                if (player1 <= 0) {
                    alert("Player 2 Wins")
                }
                p1ms = 100;
            }
        } else if (turn == "Player 2") {
            p2ms -= 10;
            if (p2ms <= 0) {
                player2 -= 1;
                if (player2 <= 0) {
                    alert("Player 1 Wins")
                }
                p2ms = 100;
            }
        }
        display()
    }
}, 100)

document.getElementById("pause").onclick = function() {
    stats = "Paused";
    turn = undefined;
    document.getElementById("p1Div").style.backgroundColor = "grey";
    document.getElementById("p2Div").style.backgroundColor = "grey";
}

document.getElementById("reset").onclick = function() {
    stats = "Stopped";
    turn = undefined;
    document.getElementById("p1Div").style.backgroundColor = "grey";
    document.getElementById("p2Div").style.backgroundColor = "grey";
    player1 = player2 = startTime;
    display()
    started = []
}

document.getElementById("settings").onclick = function() {
    document.getElementById("reset").click()
    // document.getElementById("main").hidden = true;
    // document.getElementById("optionsScrn").hidden = false;
    let min = parseInt(prompt("Minutes"));
    min = min * 60;
    startTime = min;
    player1 = min;
    player2 = min;
    display();
    let addP = parseInt(prompt("Add (seconds)"))
    add = addP;
}