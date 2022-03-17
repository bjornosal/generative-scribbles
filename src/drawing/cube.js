import { getGlobalParameters } from "../parameters";

const name = "Cube";

const parameters = {
    amount: 1,
    randomStartingPoint: false,
    spheres: 0,
    torusWidth: 100,
};

const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "torusWidth", 10, 300, 10).name("Size");
    folder.add(parameters, "amount", 1, 10, 1).name("Amount");
    folder.add(parameters, "randomStartingPoint").name("Random starting point");
    folder.add(parameters, "spheres", 0, 5, 1).name("Inner spheres");
    return folder;
};

const sketch = (p) => {
    //Add parameters that you have added to the algorithm here so you can see the changed values.
    let {
        printSize,
        scaleRatio,
        exportRatio,
        palette,
        amount,
        spheres,
        torusWidth,
        randomStartingPoint,
    } = getGlobalParameters();
    let printingSize = printSize ?? {
        width: 3508,
        height: 2480,
    };

    let canvas;
    let buffer;

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
        p.noLoop();
    };

    p.draw = () => {
        defaultDraw();
        //Draw here :) ⬇️
        //Add background color on drawing.
        buffer.background(background);
        //Add color to everything being drawn from here on out.

        buffer.fill(p.random(colors));
        buffer.stroke(stroke ? stroke : "#000");
        buffer.rotateX(-40);
        buffer.rotateY(-100);
        let startX = p.width / 2;
        let startY = p.height / 3;
        buffer.box(startX, startY, 50);
        buffer.fill(p.random(colors))
        buffer.box(startX-20, startY-20, 60);
        //Stop drawing here ⬆️
        p.image(buffer, -p.width / 2, -p.height / 2);
    };

    /*
    ##########################################
     Don't touch these functions unless you know what you're doing.:) ⬇️ 
    ##########################################
    */
    const exportHighResolution = () => {
        scaleRatio = exportRatio;
        // Re-create buffer with exportRatio and re-draw
        buffer = p.createGraphics(
            scaleRatio * p.width,
            scaleRatio * p.height,
            p.WEBGL
        );
        p.draw();
        // Get timestamp to name the ouput file
        let timestamp = new Date().getTime();
        // Save as PNG
        p.save(buffer, p.str(timestamp), "png");
        // Reset scaleRation back to original, re-create buffer, re-draw
        scaleRatio = 1;
        buffer = p.createGraphics(p.width, p.height, p.WEBGL);
        p.draw();
    };

    p.keyReleased = () => {
        if (p.key == "e" || p.key == "E") {
            exportHighResolution();
        }
    };

    const defaultSetup = () => {
        let w = printingSize.width / exportRatio;
        let h = printingSize.height / exportRatio;
        buffer = p.createGraphics(w, h, p.WEBGL);
        canvas = p.createCanvas(w, h, p.WEBGL);
        // Adjust according to screens pixel density.
        exportRatio /= p.pixelDensity();
    };

    const defaultDraw = () => {
        p.background(background);
        // Clear buffer each frame
        buffer.clear();
        // Transform (scale) all the drawings
        buffer.scale(scaleRatio);
    };
};

export { name, sketch, addFolder, parameters };
