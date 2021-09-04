//const activateModal = document.querySelectorAll("[data-modal-target]");

const deactivateModal = document.querySelectorAll("[modal-close]");

const overlay = document.getElementById("overlay");

/*activateModal.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal);
    })
})*/

deactivateModal.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal);
        interval = setInterval(GameRunning, GameSpeed);

    })
})

overlay.addEventListener("click", () => {
    const modal = document.querySelectorAll('.modal.activate')
    modal.forEach( modal => {
        closeModal(modal);
        interval = setInterval(GameRunning, GameSpeed);
    })
})

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('activate');
    overlay.classList.add('activate');
}
var GameStarted = false;
console.log("GameStarted status: " + GameStarted);

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('activate');
    overlay.classList.remove('activate');
    GameStarted = true;
    console.log('Did something?');
}

window.onload =  openModal(modal);


/*Modal
    Intro
        Popup on load
        Intro and shits
            Display pages and the number of them
            Buttons to go back and forth
            Button to End(on the last page)
                Start the game after click
        Turn off button
            Start the game after click
        Click on overlay to turn off
            Start the game after click

    EXTRA: 3 seconds count for user to ready

    Pause Menu
        Popup when user press P
        Buttons
            Resume
                Press to resume
            Restart
                Press to restart(whole page)
            Option
                Later
        Press P again to resume
            Press to resume
    
    EXTRA: 3 seconds count for user to ready 

    Score Menu
        Popup after the player
            Lose
                Display
                    Score
                    Comforting Message
                    Retry Button
            Win
                Display
                    Score
                    Compliment
                    ScoreBoard
                        Ranking
                    Retry Button
*/
