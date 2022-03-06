import { getGlobalParameters } from "../parameters";

const name = "Sphere";

const parameters = { amount: 1, randomStartingPoint: false };

const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "amount", 1, 10, 1).name("Amount");
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
        amount,
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
            amount,
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

        for (let i = 0; i < parameters.amount; i++) {
            if (randomStartingPoint) {
                let startingPoint = startingPoints[i];
                drawSphere(startingPoint.x, startingPoint.y);
            } else {
                drawSphere(0, 0);
            }
        }

        //Stop drawing here ⬆️
        p.image(buffer, -p.width / 2, -p.height / 2);
    };

    const drawSphere = (x, y) => {
        let locX = p.mouseX - p.height / 2;
        let locY = p.mouseY - p.width / 2;

        buffer.ambientLight(50);
        buffer.directionalLight(255, 0, 0, 0.25, 0.25, 0);
        buffer.pointLight(0, 0, 255, locX, locY, 250);
        buffer.push();
        buffer.translate(x, y);
        buffer.rotateX(p.frameCount * 0.01);
        buffer.rotateY(p.frameCount * 0.01);
        const torusWidth = p.height / 4;
        // buffer.ambientLight("green");
        //  buffer.ambientMaterial(250);
        buffer.sphere(torusWidth);
        buffer.stroke(colors[0]);
        buffer.sphere(torusWidth / 2);
        buffer.stroke(colors[1]);
        buffer.sphere(torusWidth / 6);
        buffer.pop();
        buffer.stroke(randomColor);
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
