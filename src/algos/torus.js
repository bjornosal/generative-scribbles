import { getGlobalParameters } from "../parameters";

const name = "Torus";

const parameters = { torusAmount: 1, randomStartingPoint: false };

const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "torusAmount", 1, 10, 1).name("Amount of torus");
    folder.add(parameters, "randomStartingPoint").name("Random starting point");
    return folder;
};

const sketch = (p) => {
    //Add parameters that you have added to the algorithm here so you can see the changed values.
    let {
        printSize,
        scaleRatio,
        exportRatio,
        palette,
        torusAmount,
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

    let startingPoints;
    let randomColor;

    p.setup = () => {
        defaultSetup();
        //Do your setup here ⬇️
        randomColor = colors ? p.random(colors) : "red";
        startingPoints = generateRandomStartingPoints(
            torusAmount,
            p.width,
            p.height,
            p
        );
    };

    p.draw = () => {
        defaultDraw();
        //Draw here :) ⬇️
        //Add background color on drawing.
        buffer.background(background);
        //Add color to everything being drawn from here on out.
        buffer.stroke(randomColor);
        buffer.noFill();
        //Draw torus', tori?
        for (let i = 0; i < parameters.torusAmount; i++) {
            if (randomStartingPoint) {
                let startingPoint = startingPoints[i];
                drawTorus(startingPoint.x, startingPoint.y);
            } else {
                drawTorus(0, 0);
            }
        }

        //Stop drawing here ⬆️
        p.image(buffer, -p.width / 2, -p.height / 2);
    };

    const drawTorus = (x, y) => {
        buffer.push();
        buffer.translate(x, y);
        buffer.rotateX(p.frameCount * 0.01);
        buffer.rotateY(p.frameCount * 0.01);
        const torusWidth = p.height / 8;
        buffer.torus(torusWidth, torusWidth / 2);
        buffer.pop();
    };

    const generateRandomStartingPoints = (amount, width, height, p) => {
        const startingPoints = [];

        for (let i = 0; i < amount; i++) {
            let randomX = p.random(-width / 3, width / 3);
            let randomY = p.random(-height / 3, height / 3);

            let x = parseInt(randomX);
            let y = parseInt(randomY);

            startingPoints.push({ x, y });
        }

        return startingPoints;
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
