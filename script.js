const grid = document.querySelector(".grid")

let color;
let mode = "mouseover";

function setup () {
    const modeBtn = document.querySelector(".mode");
    modeBtn.addEventListener("click", () => {
        mode = (mode == "mouseover") ? "click" : "mouseover";
        modeBtn.textContent = "Mode: " + mode.replace(mode[0], mode[0].toUpperCase());
    });
}

function populateGrid(side) {
    //Empty out the current grid
    grid.childNodes.forEach(cell => {
        grid.removeChild(cell);        
    });

    //Create the new grid
    const cell = document.createElement("div");
    cell.classList.add("cell");
    for(let i = 0; i < (side * side); i++) {
        grid.appendChild(cell.cloneNode(true));
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
    e.target.style.backgroundColor = "black";
}

setup();
populateGrid(4);