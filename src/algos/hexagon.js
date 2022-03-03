import { getGlobalParameters } from "../parameters";

// These values needs to be changed.
const name = "Hexagon";
const parameters = { frameRate: 3 };
const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "frameRate", 1, 20, 1).name("Frame rate");
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
    let first = true;
    let vert = 1;
    let dot = 1;
    //No guarantee these values are set.
    //Background is a string with hex value
    //Colors is an array of strings with hex value
    //Stroke is a hex value
    //Size is an integer
    //https://kgolid.github.io/chromotome-site/
    let { background, colors, stroke, size } = palette;
    //Setting background to a default white if no background exists.
    background = background ? background : "#FFF";

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
        buffer.fill(p.random(colors));;
        if (first) {
            buffer.translate(350, 480);
            first = false;
        }else if (vert == 1 && dot == 1) {
            buffer.translate(150/1.5, 0);
            dot = 2;
        }else if (vert == 1 && dot == 2) {
            buffer.translate(150/1.5, 0);
            vert = 2;
            dot = 1;
        }else if (vert == 2 && dot == 1) {
            buffer.translate(75/1.5, -130/1.5);
            dot = 2;
        }else if (vert == 2 && dot == 2) {
            buffer.translate(75/1.5, -130/1.5);
            vert = 3;
            dot = 1;
        }else if (vert == 3 && dot == 1) {
            buffer.translate(-75/1.5, -130/1.5);
            dot = 2;
        }else if (vert == 3 && dot == 2) {
            buffer.translate(-75/1.5, -130/1.5);
            vert = 4;
            dot = 1;
        }else if (vert == 4 && dot == 1) {
            buffer.translate(-150/1.5, 0);
            dot = 2;
        }else if (vert == 4 && dot == 2) {
            buffer.translate(-150/1.5, 0);
            vert = 5;
            dot = 1;
        }else if (vert == 5 && dot == 1) {
            buffer.translate(-75/1.5, 130/1.5);
            dot = 2;
        }else if (vert == 5 && dot == 2) {
            buffer.translate(-75/1.5, 130/1.5);
            vert = 6;
            dot = 1;
        }else if (vert == 6 && dot == 1) {
            buffer.translate(75/1.5, 130/1.5);
            vert = 7;
            dot = 1;
        }else if (vert == 7 && dot == 1) {
            buffer.translate(0, 2*130/1.5);
            dot = 2;
        }else if (vert == 7 && dot == 2) {
            buffer.translate(2*75/1.5, -2*130/1.5);
            dot = 3;
        }else if (vert == 7 && dot == 3) {
            buffer.translate(75/1.5, -130/1.5);
            dot = 4;
        }else if (vert == 7 && dot == 4) {
            buffer.translate(75/1.5, -130/1.5);
            dot = 5;
        }else if (vert == 7 && dot == 5) {
            buffer.translate(2*75/1.5, -2*130/1.5);
            dot = 6;
        }else if (vert == 7 && dot == 6) {
            buffer.translate(-5*75/1.5, 5*130/1.5);
            vert = 1;
            dot = 1;
        }
        buffer.beginShape();
            buffer.vertex(-75/4, -130/4);
            buffer.vertex(75/4, -130/4);
            buffer.vertex(150/4, 0);
            buffer.vertex(75/4, 130/4);
            buffer.vertex(-75/4, 130/4);
            buffer.vertex(-150/4, 0);
        buffer.endShape("close");

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
