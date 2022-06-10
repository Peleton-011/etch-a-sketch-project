const grid = document.querySelector(".grid");
const r = document.querySelector(":root");

let defaultColor = getComputedStyle(r).getPropertyValue("--default-color");

let color = "black";
let mode = "mouseover";

let side = getComputedStyle(r).getPropertyValue("--grid-side");

function setup () {
    const modeBtn = document.querySelector(".mode");
    modeBtn.addEventListener("click", () => {
        mode = (mode == "mouseover") ? "click" : "mouseover";
        modeBtn.textContent = "Mode: " + mode.replace(mode[0], mode[0].toUpperCase());
    });
    
    const resetBtn = document.querySelector(".reset");
    resetBtn.addEventListener("click", () => {
        for(let i = 0; i < side * side; i++) {
           let children = grid.childNodes;
           children[i].style.backgroundColor = defaultColor;
        }        
    });
}

function populateGrid() {
    //Empty out the current grid
    grid.childNodes.forEach(cell => {
        grid.removeChild(cell);        
    });

    //Create the new grid
    const cell = document.createElement("div");
    cell.classList.add("cell");
    for(let i = 0; i < (side * side); i++) {
        const newCell = cell.cloneNode(true);
        switch (i) {
            case 0:
                newCell.classList.add("top-left-corner");
                break;
            case (side - 1):
                newCell.classList.add("top-right-corner");
                break;
            case (side * (side - 1)):
                newCell.classList.add("bot-left-corner");
                break;
            case (side * side -1):
                newCell.classList.add("bot-right-corner");
                break;
        }
        grid.appendChild(newCell);
        grid.lastChild.addEventListener("click", (e) => {
            if (mode == "click") {
                paint(e);
            }
        });
        grid.lastChild.addEventListener("mouseover", (e) => {
            if (mode != "click") {
                paint(e);
            }
        });
    }

}

function paint(e) {
    e.target.style.backgroundColor = color;
}

setup();
populateGrid();