let hint;
let valid;
let letters;
let length;
let lastClickedTile = null;
let current = [];
let clicked = [];
let rowWidth;

window.onload = () => {
    loadSolution();
};

function getDate() {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    let currentDate = new Date(`${month}/${day}/${year}`);
    let compareDate = new Date("5/14/2024");
    let diffInTime = currentDate.getTime() - compareDate.getTime();
    let diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
    return diffInDays;
}

function loadSolution() {
    fetch('sols.json')
    .then(response => response.json())
    .then(data => {
        let index = getDate();
        hint = data[index]["hint"];
        document.querySelector(".hint").innerText = hint;
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
}

function activateLetter(tile) {
    if (tile.getAttribute("data-active") == "true") {
        if(tile == lastClickedTile){
            current.pop();
            document.querySelector(".letter-display").innerText = current.join('');
            tile.classList.remove("tile-active");
            tile.setAttribute("data-active", "false");
            clicked.pop();
            lastClickedTile = clicked.length > 0 ? clicked[clicked.length - 1] : null
        }
        return;
    }
    if (lastClickedTile == null || isNeighbor(lastClickedTile.id, tile.id)) {
        console.log("click");
        tile.setAttribute("data-active", "true"); 
        tile.classList.add("tile-active");
        clicked.push(tile);
        current.push(tile.innerText);
        lastClickedTile = clicked[clicked.length -1];
        document.querySelector(".letter-display").innerText = current.join('');
        console.log(current);
    }
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
    return (rowDiff <= 1 && colDiff <= 1);
}
