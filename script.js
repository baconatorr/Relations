 let hint;
let valid;
let letters;
let length;
let lastClickedTile = null;
let current = ["Enter a word"];
let currentIds = [];
let clicked = [];
let rowWidth;
let wordCount = 0;
let word0Id;
let word1Id;
let word2Id;
let word3Id;
let wordsCorrect = [];
let currentActive = 0;
let wins = parseInt(localStorage.getItem('wins')) || 0; 
let matches = parseInt(localStorage.getItem('matches')) || 0; 


window.onload = () => {
    currentActive = 0;
    document.querySelector(".letter-display").innerText = current.join('');
    loadSolution();
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    let currentDate = new Date(`${month}/${day}/${year}`);
    let storedDate = localStorage.getItem('storedDate');
    if(currentDate == storedDate){
        loadStoredData();
    } else {
        localStorage.setItem('storedDate', currentDate);
        word0Id = [];
        word1Id = [];
        word2Id = [];
        word3Id = [];
        wordCount = [];
        wordsCorrect = [];
        localStorage.setItem('word0', word0Id);
        localStorage.setItem('word1', word1Id);
        localStorage.setItem('word2', word2Id);
        localStorage.setItem('word3', word3Id);
        localStorage.setItem('wordCount', wordCount);
        localStorage.setItem('wordsCorrect', JSON.stringify(wordsCorrect));
    }
    if (!localStorage.getItem('visited')) {
   
     openModal('modal')
     localStorage.setItem('wins', 0);
     localStorage.setItem('matches', 0);
     localStorage.setItem('visited', 'true');
   }

   wins = parseInt(localStorage.getItem('wins')) || 0; 
   matches = parseInt(localStorage.getItem('matches')) || 0; 
};

function getDate() {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    let currentDate = new Date(`${month}/${day}/${year}`);
    let dateDisplay = document.getElementById('date');
    dateDisplay.innerText = `${month}/${day}`;
    let compareDate = new Date("5/20/2024");
    let diffInTime = currentDate.getTime() - compareDate.getTime();
    if(diffInTime == 0){localStorage.clear};
    let diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
    return diffInDays;
}

function loadSolution() {
    fetch('sols.json')
    .then(response => response.json())
    .then(data => {
        let index = getDate();
        hint = data[index]["hint"];
        document.querySelector(".hint").innerText = "Hint:" + hint;
        valid = data[index]["valid"];
        letters = data[index]["letters"];
        length = data[index]["length"];
        loadGrid();
    });
}

function loadGrid() {
    const gridContainer = document.querySelector(".grid");
    gridContainer.innerHTML = ''; 
    rowWidth = Math.sqrt(length);
    let r = document.querySelector(':root');
    r.style.setProperty('--row-width', rowWidth);

    for (let i = 0; i < length; i++) {
        let div = document.createElement("div");
        div.className = "tile";
        div.id = i;
        div.setAttribute("data-active", "false");
        gridContainer.appendChild(div);
    }

    let grids = document.querySelectorAll(".tile");
    let i = 0;
    let j = 0;
    grids.forEach(function(grid) {
        if (j == rowWidth) {
            i++;
            j = 0;
        }
        grid.innerText = letters[i][j];
        j++;

        grid.addEventListener("click", function() {
            activateLetter(grid);
        });
    });
    loadSave();
}

function activateLetter(tile) {
    if (tile.getAttribute("data-active") == "correct") {
        return;
    }
    if (tile.getAttribute("data-active") == "true") {
        if (tile == lastClickedTile) {
            currentActive--;
            localStorage.setItem("currentActive", currentActive);
            if (currentActive == 0) {
                reset();
            } else {
                current.pop();  // Remove the last letter
                document.querySelector(".letter-display").innerText = current.join('');
                clicked.pop();
                lastClickedTile = clicked[clicked.length - 1];
                currentIds.pop();
                tile.classList.remove("tile-active");
                tile.setAttribute("data-active", "false");
            }
            return;
        } else {
            return;
        }
    }
    if (lastClickedTile == null || isNeighbor(lastClickedTile.id, tile.id)) {
        currentActive++;
        localStorage.setItem("currentActive", currentActive);
        tile.setAttribute("data-active", "true");
        tile.classList.add("tile-active");
        if (current.includes("Enter a word")) {
            current = [];  // Reset to an empty array if it was initially the placeholder
        }
        clicked.push(tile);
        current.push(tile.innerText);
        currentIds.push(tile.id);
        lastClickedTile = tile;
        document.querySelector(".letter-display").innerText = current.join('');
    }
}


function reset(){
    for(let i = 0; i < currentIds.length; i++){
        let id = document.getElementById(currentIds[i]);
        id.classList.remove("tile-active");
        id.setAttribute("data-active", "false"); 
    }
    currentActive = 0;
    localStorage.setItem("currentActive", currentActive);
    lastClickedTile = null;
    current = ["Enter a word"];
    currentIds = [];
    document.querySelector(".letter-display").innerText = current.join('');
}



function isNeighbor(lastId, currentId) {
    lastId = parseInt(lastId);
    currentId = parseInt(currentId);
    const lastRow = Math.floor(lastId / rowWidth);
    const lastCol = lastId % rowWidth;
    const currentRow = Math.floor(currentId / rowWidth);
    const currentCol = currentId % rowWidth;

    const rowDiff = Math.abs(lastRow - currentRow);
    const colDiff = Math.abs(lastCol - currentCol);
    let william = rowDiff <= 1 && colDiff <= 1 && (lastId != currentId);
    if(!william){
        alert('Out of range');
    }
    return william;
}

function submit() {
    let word = current.join('');
    word = word.toLowerCase();
    console.log(word);
    for (let i = 0; i < valid.length; i++) {
        if (word == valid[i]) {
            for (let j = 0; j < currentIds.length; j++) {
                let id = document.getElementById(currentIds[j]);
                id.classList.add("tile-correct" + i);
                id.setAttribute("data-active", "correct"); 
            }
            currentActive = 0;
            console.log(currentActive);
            localStorage.setItem("currentActive", currentActive);
            wordCount++;
            wordsCorrect.push(i);
            celebrateVictory();
            addAnswer(i);
            setSave(i);
            lastClickedTile = null;
            current = ["Enter a word"];
            currentIds = [];
            document.querySelector(".letter-display").innerText = current.join(''); 
            return;
        }
    }
    alert('Invalid Word');
    console.log('Invalid word');
}

function celebrateVictory() {
    if (wordCount === 4) {
        alert("Congrats!")
        const canvas = document.querySelector("body");
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
    }
}

function addAnswer(number){
    let top = document.querySelector('.answers')
    let div = document.createElement('div');
    div.className = "answer-display";
    div.id = "ans" + number;
    top.append(div);
    let text = valid[number].toUpperCase() + " ✅";
    let display = document.getElementById("ans" + number);
    display.innerText = text;
    display.classList.add("answer-correct" + number);
}

function setSave(num){
    console.log("saved");
    switch(num){
        case 0:
            word0Id = currentIds;
            word0Id = JSON.stringify(word0Id);
            localStorage.setItem('word0', word0Id);
            break;
        case 1:
            word1Id = currentIds;
            word1Id = JSON.stringify(word1Id);
            localStorage.setItem('word1', word1Id);
            break;
        case 2:
            word2Id = currentIds;
            word2Id = JSON.stringify(word2Id);
            localStorage.setItem('word2', word2Id);
            break;
        case 3:
            word3Id = currentIds;
            word3Id = JSON.stringify(word3Id);
            localStorage.setItem('word3', word3Id);
            break;
    }
    localStorage.setItem('wordCount', wordCount);
    localStorage.setItem('wordsCorrect', JSON.stringify(wordsCorrect));
}

function loadSave(){
    wordsCorrect = JSON.parse(localStorage.getItem('wordsCorrect')) || [];
    if (wordsCorrect) {
        for (let i = 0; i < wordsCorrect.length; i++) {
            addAnswer(wordsCorrect[i]);
        }
    }
    console.log(word0Id);
    if(word0Id != null){
        for (let j = 0; j < word0Id.length; j++) {
            let id = document.getElementById(word0Id[j]);
            id.classList.add("tile-correct" + 0);
            id.setAttribute("data-active", "correct"); 
        }
    }
    if(word1Id != null){
        for (let j = 0; j < word1Id.length; j++) {
            let id = document.getElementById(word1Id[j]);
            id.classList.add("tile-correct" + 1);
            id.setAttribute("data-active", "correct"); 
        }
    }
    if(word2Id != null){
        for (let j = 0; j < word2Id.length; j++) {
            let id = document.getElementById(word2Id[j]);
            id.classList.add("tile-correct" + 2);
            id.setAttribute("data-active", "correct"); 
        }
    }
    if(word3Id != null){
        for (let j = 0; j < word3Id.length; j++) {
            let id = document.getElementById(word3Id[j]);
            id.classList.add("tile-correct" + 3);
            id.setAttribute("data-active", "correct"); 
        }
    }
}

   function loadStoredData() {
    try {
        wordsCorrect = JSON.parse(localStorage.getItem("wordsCorrect")) || [];
    } catch (e) {
        wordsCorrect = [];
    }
    try {
        word0Id = JSON.parse(localStorage.getItem('word0')) || [];
    } catch (e) {
        word0Id = [];
    }
    try {
        word1Id = JSON.parse(localStorage.getItem('word1')) || [];
    } catch (e) {
        word1Id = [];
    }
    try {
        word2Id = JSON.parse(localStorage.getItem('word2')) || [];
    } catch (e) {
        word2Id = [];
    }
    try {
        word3Id = JSON.parse(localStorage.getItem('word3')) || [];
    } catch (e) {
        word3Id = [];
    }
    try {
        wordCount = parseInt(localStorage.getItem('wordCount'), 10) || 0;
    } catch (e) {
        wordCount = 0;
    }
    try {
        currentActive = parseInt(localStorage.getItem('currentActive'), 10) || 0;
    } catch (e) {
        currentActive = 0;
    }
}

function alert(text){
    const alert = document.querySelector(".alert");
    alert.innerText = text;
    alert.style.animation = 'none';
    void alert.offsetWidth; 
    alert.style.animation = 'fadeInDown 1s ease'; 
    alert.style.opacity = 100;
    alert.style.transform = 'translateY(0)';
    void alert.offsetWidth; 
    setTimeout(() => { alert.style.animation = 'fadeInUp 1s ease'; }, 1000);
    alert.style.opacity = 0;
}

function openModal(id){
    let modal = document.getElementById(id);
    modal.showModal();
}

function closeModal(id){
    let modal = document.getElementById(id);
    modal.close();
}

