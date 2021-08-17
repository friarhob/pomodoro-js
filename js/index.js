let endTime;
let cron;
let running = true;
let remainingTime;
let pomodoro = false;
let alertSound = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg");
let firstStart = false;

function reset() {
    document.getElementById("start").innerHTML = "<span class='material-icons'>play_circle_filled</span>";
    document.getElementById("pause").innerHTML = "<span class='material-icons'>pause_circle_filled</span>";
    firstStart = false;

    document.getElementById("hour").innerHTML = "00";
    document.getElementById("minute").innerHTML = "00";
    document.getElementById("second").innerHTML = "00";
    clearInterval(cron);
}

function start() {
    pomodoro = true;
    running = true;
    firstStart = true;
    endTime = Date.now() + parseInt(document.getElementById("pomodoro-minutes").value) * 60 * 1000;

    document.getElementById("start").innerHTML = "<span class='material-icons'>next_plan</span>";
    document.getElementById("pause").innerHTML = "<span class='material-icons'>pause_circle_filled</span>";

    clearInterval(cron);
    cron = setInterval(() => {
        update();
    }, 100);
}

function togglePause() {
    if (firstStart) { //prevents pause to be pressed before pressing start after a reset
        if (running) {
            remainingTime = endTime - Date.now();
            clearInterval(cron);
            running = false;
            document.getElementById("pause").innerHTML = "<span class='material-icons'>not_started</span>";
        } else {
            endTime = Date.now() + remainingTime;
            clearInterval(cron);
            cron = setInterval(() => {
                update();
            }, 100);
            running = true;
            document.getElementById("pause").innerHTML = "<span class='material-icons'>pause_circle_filled</span>";
        }
    }
}

function update() {
    let milisseconds = endTime - Date.now();

    if (milisseconds <= 0) {
        if (pomodoro) {
            pomodoro = false;
            endTime = Date.now() + 5 * 60 * 1000; //5 minutes max for pausing
        } else {
            start();
        }
        alertSound.play();
    } else {
        let seconds = Math.floor((milisseconds + 800) / 1000);
        document.getElementById("second").innerHTML = format(seconds % 60);

        let minutes = Math.floor(seconds / 60);
        document.getElementById("minute").innerHTML = format(minutes % 60);

        let hours = Math.floor(minutes / 60);
        document.getElementById("hour").innerHTML = format(hours);
    }
}

function format(number) {
    if (number >= 10) return "" + number;
    return "0" + number;
}

var app = {};

app.start = start;
app.togglePause = togglePause;
app.reset = reset;