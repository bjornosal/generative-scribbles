import { getGlobalParameters } from "../parameters";

// These values needs to be changed.
const name = "Square";
const parameters = {
    frameRate: 10,
    randomDraw: false,
    perRow: 50,
    strokeWeight: 0,
    spacing: 0,
};
const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "frameRate", 1, 1000, 10).name("Frame rate");
    folder.add(parameters, "perRow", 1, 200, 1).name("Per row");
    folder.add(parameters, "spacing", 0, 30, 1).name("Spacing");
    folder.add(parameters, "randomDraw", false).name("Draw randomly");
    folder.add(parameters, "strokeWeight", 0, 50, 1).name("Stroke weight");
    return folder;
};

const sketch = (p) => {
    let {
        printSize,
        scaleRatio,
        exportRatio,
        palette,
        frameRate,
        perRow,
        randomDraw,
        strokeWeight,
        spacing,
    } = getGlobalParameters();
    let buffer;
    let canvas;
    let printingSize = printSize ?? {
        width: 3508,
        height: 2480,
    };
    //No guarantee these values are set.
    //Background is a string with hex value
    //Colors is an array of strings with hex value
    //Stroke is a hex value
    //Size is an integer
    //https://kgolid.github.io/chromotome-site/
    let { background, colors, stroke, size } = palette;
    //Setting background to a default white if no background exists.
    background = background ? background : "#FFF";

    let moveToX = 0;
    let moveToY = 0;
    let squareSize;
    p.setup = () => {
        defaultSetup();
        //Do your setup here ⬇️
        p.frameRate(frameRate);
        canvas.background(background);
        buffer.background(background);
        moveToX = 0;
        squareSize = (p.width/perRow)-spacing
    };

    p.draw = () => {
        // Clear buffer each frame
        while (moveToY < p.height) {
            defaultDraw();
            //Draw here :) ⬇️
            buffer.noStroke();
            if (strokeWeight !== 0) {
                buffer.strokeWeight(strokeWeight);
                buffer.stroke(p.random(colors));
            }
            buffer.push();
            buffer.fill(p.random(colors));
            buffer.translate(moveToX, moveToY);

            if (randomDraw) {
                Number(p.random(0, 1).toFixed(0)) == 1 &&
                    buffer.square(0, 0, squareSize);
            } else {
                buffer.square(0, 0, squareSize);
            }
            moveToX += squareSize;
            moveToX += strokeWeight;
            moveToX += spacing;

            if (moveToX > p.width) {
                moveToX = 0;
                moveToY += squareSize;
                moveToY += strokeWeight;
                moveToY += spacing;
            }
            if (moveToY > p.height) {
                p.noLoop();
            }
            buffer.pop();
        
            //Stop drawing here ⬆️
            // Draw buffer to canvas
            p.image(buffer, 0, 0);
        }
        p.image(buffer, 0, 0);
    };

    /*
    ##########################################
     Don't touch these functions unless you know what you're doing.:) ⬇️ 
    ##########################################
    */

    const defaultSetup = () => {
        let w = printingSize.width / exportRatio;
        let h = printingSize.height / exportRatio;
        buffer = p.createGraphics(w, h);
        canvas = p.createCanvas(w, h);
        // Adjust according to screens pixel density.
        exportRatio /= p.pixelDensity();
    };

    const defaultDraw = () => {
        buffer.clear();
        // Transform (scale) all the drawings
        buffer.scale(scaleRatio);
    };

    const exportHighResolution = () => {
        scaleRatio = exportRatio;
        // Re-create buffer with exportRatio and re-draw
        // Get timestamp to name the ouput file
        let timestamp = new Date().getTime();
        // Save as PNG
        p.save(canvas, p.str(`${name}-${timestamp}`), "png");
        // Reset scaleRation back to original, re-create buffer, re-draw
    };

    p.keyReleased = () => {
        if (p.key == "e" || p.key == "E") {
            exportHighResolution();
        }
    };
};

export { name, sketch, addFolder, parameters };
