// ----------------- Variables -----------------
let level = 1; 
let trashCount = 6;
let recycled = 0;
let trashItems = [];
let timeLimit = 30; 
let timer;

// ----------------- DOM Elements -----------------
const bin = document.getElementById("bin");
const levelDisplay = document.getElementById("level");
const recycledDisplay = document.getElementById("recycled");
const message = document.getElementById("message");

// ----------------- Sounds -----------------
const catchSound = new Audio("cartoon-jump.mp3");
const bgMusic = new Audio("piano-background.mp3");
const gameOverSound = new Audio("over.mp3");
bgMusic.loop = true;

// ----------------- Trash Emojis -----------------
const trashTypes = ["🍌","🎃", "🥾", "🍕", "🎭", "🍔"];

// ----------------- Create Trash -----------------
function createTrash(){
    trashItems = [];
    for(let i=0; i<trashCount; i++){
        const trash = document.createElement("div");
        trash.classList.add("trash");
        trash.innerText = trashTypes[Math.floor(Math.random()*trashTypes.length)];

        const positions = [
            {x:50, y:50}, {x:window.innerWidth-100, y:50},
            {x:50, y:window.innerHeight-150}, {x:window.innerWidth-100, y:window.innerHeight-150},
            {x:window.innerWidth/2-25, y:50}, {x:window.innerWidth/2-25, y:window.innerHeight-150}
        ];

        trash.style.left = positions[i % positions.length].x + "px";
        trash.style.top = positions[i % positions.length].y + "px";

        // Draggable
        trash.draggable = true;
        trash.addEventListener("dragstart", e=>{
            e.dataTransfer.setData("text/plain", "trash");
            trash.classList.add("dragging");
        });
        trash.addEventListener("dragend", e=>{
            trash.classList.remove("dragging");
        });

        document.body.appendChild(trash);
        trashItems.push(trash);
    }

    startTimer();
}

// ----------------- Level Up -----------------
function nextLevel(){
    level++;
    trashCount += 2;
    levelDisplay.innerText = "Level " + level;
    message.innerText = "🎉 Level up! New trash incoming...";

    // Show confetti
    confetti({
        spread: 180,
        particleCount: 150,
        origin: { y: 0.6 }
    });

    setTimeout(()=>{
        message.innerText = "";
        createTrash();
    }, 1500);
}

// ----------------- Drag & Drop -----------------
bin.addEventListener("dragover", e => e.preventDefault());
bin.addEventListener("drop", e => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    if(dragging){
        dragging.remove();
        catchSound.play();
        recycled++;
        recycledDisplay.innerText = "Recycled: " + recycled;
        bin.style.transform = "scale(1.3)";
        setTimeout(()=>{bin.style.transform="scale(1)";},200);

        if(document.querySelectorAll(".trash").length === 0){
            clearInterval(timer);
            nextLevel();
        }
    }
});

// ----------------- Escape Logic -----------------
document.addEventListener("mousemove", e=>{
    trashItems.forEach(trash=>{
        const rect = trash.getBoundingClientRect();
        const dx = e.clientX - rect.left;
        const dy = e.clientY - rect.top;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist<80){
            trash.style.left = Math.min(window.innerWidth-50, Math.max(0, rect.left - 30)) + "px";
            trash.style.top = Math.min(window.innerHeight-50, Math.max(0, rect.top - 20)) + "px";
        }
    });
});

// ----------------- Timer -----------------
function startTimer(){
    let timeLeft = timeLimit;
    message.innerText = "Time: " + timeLeft + "s";
    
    timer = setInterval(()=>{
        timeLeft--;
        message.innerText = "Time: " + timeLeft + "s";

        if(timeLeft <= 0){
            clearInterval(timer);
            gameOver();
        }
    },1000);
}

// ----------------- Game Over -----------------
function gameOver(){
    trashItems.forEach(trash => trash.remove());
    trashItems = [];
    message.innerText = "⛔ Game Over! Try Again!";
    gameOverSound.play(); 
}

// ----------------- Start Game on first click -----------------
document.body.addEventListener("click", ()=>{
    bgMusic.play();
    createTrash();
}, {once:true});
