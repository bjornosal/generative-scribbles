import { getGlobalParameters } from "../parameters";

// These values needs to be changed.
const name = "Shapes";
const parameters = { frameRate: 30 };
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
        buffer.noStroke();

        buffer.fill(p.random(colors));

        let randomX = p.random(-p.width / 4, p.width);
        let randomY = p.random(-p.height / 4, p.height);

        let drawing = p.random(1, 2);
        drawing = Number(drawing.toFixed(0));
        switch (drawing) {
            case 1:
                buffer.square(
                    randomX,
                    randomY,
                    p.random(p.width / 20, p.width / 8)
                );
                break;
            case 2:
                buffer.push();
                buffer.translate(randomX, randomY);
                buffer.scale(p.random(0.2, 1.5));
                buffer.rotate(p.random([45, 90, 135, 180]));
                buffer.triangle(
                    0,
                    100,
                    75, 
                    100, 
                    75, 
                    25 
                );

                buffer.pop();
                break;
            default:
                break;
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
