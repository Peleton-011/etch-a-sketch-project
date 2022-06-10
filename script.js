const grid = document.querySelector(".grid")

let color;

function populateGrid(side) {
    //Empty out the current grid
    grid.childNodes.forEach(cell => {
        grid.removeChild(cell);        
    });

    //Create the new grid
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("onmouseover", paint);
    for(let i = 0; i < (side * side); i++) {
        grid.appendChild(cell.cloneNode(true));
    }

}

//Hover event handler
function paint(e) {

}

populateGrid(4);