import { getGlobalParameters } from "../parameters";

// These values needs to be changed.
const name = "Flight";
const parameters = { frameRate: 10 };
const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "frameRate", 1, 200, 5).name("Frame rate");
    return folder;
};

const sketch = (p) => {
    let {
        printSize,
        scaleRatio,
        exportRatio,
        palette,
        frameRate,
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

    let startX = p.random(p.width / 3, p.width / 15);
    let startY = p.random(p.width / 3, p.height / 15);

    p.setup = () => {
        defaultSetup();
        //Do your setup here ⬇️
        p.frameRate(frameRate);
        canvas.background(background);
        buffer.background(background);
    };

    p.draw = () => {
        // Clear buffer each frame
        defaultDraw();
        //Draw here :) ⬇️
        buffer.strokeWeight(3);
        buffer.stroke(p.random(colors));

        let lines = p.random(1, 5);

        let newX;
        let newY;
        for (let i = 0; i < lines; i++) {
            newX = p.random(startX, p.width / 4);
            newY = p.random(startY, startY + p.height / 4);
            buffer.line(startX, startY, newX, newY);
        }

        let newShortX = p.random(startX, startY - p.width / 10);
        let newShortY = p.random(startY, startY + p.height / 10);
        buffer.line(startX, startY, newShortX, newShortY);

        startX = newShortX;
        startY = newShortY;

        if (startX > p.width && startY > p.height) {
            p.noLoop();
        }
        //Stop drawing here ⬆️
        // Draw buffer to canvas
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
