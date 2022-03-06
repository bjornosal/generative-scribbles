import { getGlobalParameters } from "../parameters";

// These values needs to be changed.
const name = "Lines";
const parameters = {
    frameRate: 30,
    strokeWeight: 3,
    spacing: 5,
    randomLength: false,
    noise: 0.01,
};
const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "frameRate", 1, 200, 5).name("Frame rate");
    folder.add(parameters, "strokeWeight", 1, 200, 1).name("Stroke weight");
    folder.add(parameters, "spacing", 0, 200, 1).name("Spacing");
    folder.add(parameters, "randomLength").name("Random length");
    folder.add(parameters, "noise", 0, 0.4, 0.01).name("Noise");
    return folder;
};

const sketch = (p) => {
    let {
        printSize,
        scaleRatio,
        exportRatio,
        spacing,
        palette,
        strokeWeight,
        frameRate,
        randomLength,
        noise,
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

    let y = 0;

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
        buffer.strokeWeight(strokeWeight);
        
        for (let i = 0; i < p.height; i++) {
            let lineLength = p.width;
            if (randomLength) {
                lineLength = p.random(p.width / 2, p.width);
            }
            let noiseVal = buffer.noise(noise);
            buffer.stroke(p.random(colors));
            if (noise === 0.0) {
                buffer.line(0, y, lineLength, y);
            } else {
                buffer.line(0, noiseVal * y, lineLength, y);
            }
            y += strokeWeight;
            y += spacing;
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
