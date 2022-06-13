const r = document.querySelector(":root");
const grid = document.querySelector(".grid");

let defaultColor = getComputedStyle(r).getPropertyValue("--default-color");

let color = getComputedStyle(r).getPropertyValue("--default-paint");
let mode = "mouseover";

let side = getComputedStyle(r).getPropertyValue("--grid-side");

//Keep track of the state of the mouse (Whether it's being clicked or not)
var mouseDown = 0;

document.body.onmousedown = () => { 
  mouseDown = 1;
}
document.body.onmouseup = () => {
  mouseDown = 0;
}

//Sets up events and creates initial grid
function setup () {
    populateGrid();

    //Color picker buttons
    const colorBtns = document.querySelectorAll(".color");
    colorBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            console.log(window.getComputedStyle(e.target).backgroundColor);
            color = window.getComputedStyle(e.target).backgroundColor;
        });
    });

    //Mode button, either mouseover or click
    const modeBtn = document.querySelector(".mode");
    modeBtn.addEventListener("click", () => {
        mode = (mode == "mouseover") ? "click" : "mouseover";
        modeBtn.textContent = "Mode: " + mode.replace(mode[0], mode[0].toUpperCase());
    });
    
    //Reset button, paints all cells in the grid in the default color
    const resetBtn = document.querySelector(".reset");
    resetBtn.addEventListener("click", () => {
        for(let i = 0; i < side * side; i++) {
           let children = grid.childNodes;
           children[i].style.backgroundColor = defaultColor;
        }        
    });

    //New grid button, generates a new grid of the desired size, from 2x2 to 100x100
    const newGridBtn = document.querySelector(".new");
    newGridBtn.addEventListener("click", () => {
        side = Number(prompt("What size should the new grid be?"));
        if (side > 100) {
            alert("That's too big :c");
            side = 100;
        } else if (side < 2) {
            alert("That's too smol :c")
            side = 2;
        } 
        r.style.setProperty("--grid-side", String(side));
        populateGrid();
    });

    //Detect when the mouse leaves the screen
    document.addEventListener("mouseleave", function(event){
        if(event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight))
        {
           mouseDown = 0;
        }
      });
}

//Creates a grid of any size
function populateGrid() {
    //Remove old grid
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }

    //Create new grid
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
        grid.lastChild.addEventListener("mousedown", (e) => {
            if (mode == "click") {
                paint(e);
            }
        });
        grid.lastChild.addEventListener("mouseover", (e) => {
            if ((mode != "click")||(mouseDown)) {
                paint(e);
            }
        });
    }

}

//Paints element "e" (Changes background color)
function paint(e) {
    e.target.style.backgroundColor = color;
}

setup();