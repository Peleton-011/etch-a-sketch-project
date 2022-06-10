const grid = document.querySelector(".grid")

let color;
let mode = "mouseover";

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
        grid.lastChild.addEventListener(mode, paint);
    }

}

function paint(e) {
    e.target.style.backgroundColor = "black";
}

populateGrid(4);