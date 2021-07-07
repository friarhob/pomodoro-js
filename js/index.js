let endTime;
let cron;

function reset() {
    document.getElementById("hour").innerHTML = "00";
    document.getElementById("minute").innerHTML = "00";
    document.getElementById("second").innerHTML = "00";
}

function start() {
    endTime = Date.now();
    endTime += parseInt(document.getElementById("pomodoro-minutes").value)*60*1000;
    cron = setInterval(() => {
        update();
    }, 100);
}

function update()
{
    let milisseconds = endTime - Date.now();

    if(milisseconds <= 0)
    {
        clearInterval(cron); //to be updated - now it works just as a simple timer
    } else {
        let seconds = Math.floor(milisseconds/1000);
        document.getElementById("second").innerHTML = format(seconds%60);
    
        let minutes = Math.floor(seconds/60);
        document.getElementById("minute").innerHTML = format(minutes%60);
    
        let hours = Math.floor(minutes/60);
        document.getElementById("hour").innerHTML = format(hours);
    
    }

}

function format(number)
{
    if(number >= 10) return ""+number;
    return "0"+number;
}