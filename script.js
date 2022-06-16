const r = document.querySelector(":root");
const grid = document.querySelector(".grid");

let defaultColor = getComputedStyle(r).getPropertyValue("--default-color");

let color = getComputedStyle(r).getPropertyValue("--default-paint");
let ryb;
let opacityMode = false;
let opacity = 50;
let mode = "mouseover";
let notProMode = true;

let side = getComputedStyle(r).getPropertyValue("--grid-side");

//Keep track of the state of the mouse (Whether it's being clicked or not)
var mouseDown = 0;

document.body.onmousedown = () => {
    mouseDown = 1;
};
document.body.onmouseup = () => {
    mouseDown = 0;
};

//Sets up events and creates initial grid
function setup() {
    populateGrid();
    changeColor(color);

    //Update at every click
    const bod = document.querySelector("body");
    bod.addEventListener("click", update);

    //Opacity slider
    const opacitySld = document.querySelector("#opacity");
    const opacityOut = document.querySelector("#opacityOut")
    opacitySld.value = opacity;
    opacityOut.innerHTML = opacitySld.value;
    opacitySld.addEventListener("input", (e) => {
        opacity = opacitySld.value;
        opacityOut.innerHTML = opacity;
    });

    //Opacity toggle switch
    const opacityBtn = document.querySelector(".opacityMode")
    opacityBtn.addEventListener("click", (e) => {
        opacityBtn.classList.toggle("inactive");
        updateHidden(document.querySelector(".opacityInputs"), opacityMode);
        opacityMode = !opacityMode;
        opacityBtn.textContent = opacityMode ? "Opacity: On" : "Opacity: Off";
    });

    //Hide protools stuff 
    document.querySelectorAll(".pro_tools").forEach((elem) => {
        updateHidden(elem, notProMode);
    });

    //Color picker reader
    const colorSelector = document.querySelector(".color_selector");
    colorSelector.addEventListener("input", (e) => {
        color = e.target.value;
        changeColor(color)
    });

    //Pro utils mode button
    const proModeBtn = document.querySelector(".pro_button");
    proModeBtn.addEventListener("click", () => {
        notProMode = !notProMode;

        document.querySelectorAll(".pro_tools").forEach((elem) => {
            updateHidden(elem, notProMode);
        });

        updateHidden(document.querySelector(".opacityInputs"), !opacityMode);
    });

    //Color picker buttons
    const colorBtns = document.querySelectorAll(".color");
    colorBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            color = window.getComputedStyle(e.target).backgroundColor;
            changeColor(color)
        });
    });

    //Mode button, either mouseover or click
    const modeBtn = document.querySelector(".mode");
    modeBtn.addEventListener("click", () => {
        mode = mode == "mouseover" ? "click" : "mouseover";
        modeBtn.textContent =
            "Mode: " + mode.replace(mode[0], mode[0].toUpperCase());
    });

    //Reset button, paints all cells in the grid in the default color
    const resetBtn = document.querySelector(".reset");
    resetBtn.addEventListener("click", reset);

    //New grid button, generates a new grid of the desired size, from 2x2 to 100x100
    const newGridBtn = document.querySelector(".new");
    newGridBtn.addEventListener("click", () => {
        side = Number(prompt("What size should the new grid be?"));
        if (side > 100) {
            alert("That's too big :c");
            side = 100;
        } else if (side < 2) {
            alert("That's too smol :c");
            side = 2;
        }
        r.style.setProperty("--grid-side", String(side));
        populateGrid();
    });

    //Detect when the mouse leaves the screen
    document.addEventListener("mouseleave", function (event) {
        if (
            event.clientY <= 0 ||
            event.clientX <= 0 ||
            event.clientX >= window.innerWidth ||
            event.clientY >= window.innerHeight
        ) {
            mouseDown = 0;
        }
    });
}

//Hides or unhides all elements below the one you pass
function updateHidden(elem, condition) {
    elem.childNodes.forEach((child) => {
        if (child.firstChild) {
            updateHidden(child, condition);
        }
        child.hidden = condition;
    });
}

//Reset all cells to default color
function reset() {
    for (let i = 0; i < side * side; i++) {
        let children = grid.childNodes;
        children[i].style.backgroundColor = defaultColor;
    }
}

//Updates some visual stuff
function update() {
    const colorSelector = document.querySelector(".color_selector");
    const aux = strToRgb(color)
    colorSelector.value = rgbToStr(aux[0], aux[1], aux[2]);
}

//Sets everything up for mixing of colors
function changeColor(color) {
    const rgb = strToRgb(color);
    ryb = rgbToRyb(rgb[0], rgb[1], rgb[2]);
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
    for (let i = 0; i < side * side; i++) {
        const newCell = cell.cloneNode(true);
        // switch (i) {
        //     case 0:
        //         newCell.classList.add("top-left-corner");
        //         break;
        //     case side - 1:
        //         newCell.classList.add("top-right-corner");
        //         break;
        //     case side * (side - 1):
        //         newCell.classList.add("bot-left-corner");
        //         break;
        //     case side * side - 1:
        //         newCell.classList.add("bot-right-corner");
        //         break;
        // }
        newCell.addEventListener("mousedown", (e) => {
            if (mode == "click") {
                paint(e);
            }
        });
        newCell.addEventListener("mouseover", (e) => {
            if (mode != "click" || mouseDown) {
                paint(e);
            }
        });

        newCell.addEventListener("dragstart", (e) => {
            e.preventDefault();
        });

        newCell.addEventListener("drop", (e) => {
            e.preventDefault();
        });

        grid.appendChild(newCell);
    }
    reset();
}

//Paints element "e" (Changes background color)
function paint(e) {

    if (!opacityMode) {
        e.target.style.backgroundColor = color;
    } else {
        mix(e);
    }
}

// Convert red-green-blue to red-yellow-blue system.
function rgbToRyb(r, g, b) {

    // Remove the whiteness from the color.
    let w = Math.min(r, g, b);
    r = r - w;
    g = g - w;
    b = b - w;

    let mg = Math.max(r, g, b);
    // Get the yellow out of the red+green.
    let y = Math.min(r, g);
    r -= y;
    g -= y;

    // If this unfortunate conversion combines blue and green, then cut each in half to preserve the value's maximum range.
    if (b && g) {
        b /= 2.0;
        g /= 2.0;
    }

    // Redistribute the remaining green.
    y += g;
    b += g;

    // Normalize to values.
    let my = Math.max(r, y, b);
    if (my) {
        let n = mg / my;
        r *= n;
        y *= n;
        b *= n;
    }

    // Add the white back in.
    r += w;
    y += w;
    b += w;

    const ryb = [r.toFixed(0), y.toFixed(0), b.toFixed(0)];

    // And return back the ryb typed accordingly.
    return ryb;
}

// Convert red-yellow-blue to red-green-blue system.
function rybToRgb(r, y, b) {

    // Remove the whiteness from the color.
    let w = Math.min(r, y, b);
    r = r - w;
    y = y - w;
    b = b - w;

    let my = Math.max(r, y, b);

    // Get the green out of the yellow and blue
    let g = Math.min(y, b);
    y -= g;
    b -= g;

    if (b && g) {
        b *= 2.0;
        g *= 2.0;
    }

    // Redistribute the remaining yellow.
    r += y;
    g += y;

    // Normalize to values.
    let mg = Math.max(r, g, b);
    if (mg) {
        let n = my / mg;
        r *= n;
        g *= n;
        b *= n;
    }

    // Add the white back in.
    r += w;
    g += w;
    b += w;

    const rgb = [r.toFixed(0), g.toFixed(0), b.toFixed(0)];
    // And return back the ryb typed accordingly.
    return (rgb);
}

// Return the complementary color values for a given color.
function complimentary(r, g, b, limit) {
    if (!limit) limit = 255;
    const result = [limit - r, limit - g, limit - b]; 
    return result;
}

function strToRgb (str = "#ffffff") {
    let r;
    let g;
    let b;
    
    if (str.slice(0,1) == "#") {

        str = str.slice(1);

        r = parseInt(str.slice(0,2), 16);
        g = parseInt(str.slice(2,4), 16);
        b = parseInt(str.slice(4), 16);

    } else if (str.slice(0,3) == "rgb") {

        str = str.slice(4);
        str = str.replace(")", "")
        const strs = str.split(", ");

        r = Number(strs[0]);
        g = Number(strs[1]);
        b = Number(strs[2]);
    }
    
    const rgb = [r, g, b];
    return rgb;
}

function rgbToStr (r = 255, g = 255, b = 255) {
    let color = "#";

    r = Number(r);
    g = Number(g);
    b = Number(b);
    
    color += r.toString(16).padStart(2, "0");
    color += g.toString(16).padStart(2, "0");
    color += b.toString(16).padStart(2, "0");

    return color;
}

//Paints the cell that triggered e as the mix of paint color and current color of that element
function mix(e){

    let currColor = e.target.style.backgroundColor;
    let rgb2 = strToRgb(currColor);
    const ryb2 = rgbToRyb(rgb2[0], rgb2[1], rgb2[2]);
    const finalRyb = [];

    for (let i = 0; i < 3; i++) {
        let proportioned1 = Number(ryb[i]) * (opacity / 100);
        let proportioned2 = Number(ryb2[i]) * (1 - (opacity / 100));
        let aux = proportioned1 + proportioned2;
        finalRyb.push(aux.toFixed(0));    
    }

    const result = rybToRgb(finalRyb[0], finalRyb[1], finalRyb[2]);

    let resultStr = rgbToStr(result[0], result[1], result[2]);

    e.target.style.backgroundColor = resultStr;
}

setup();