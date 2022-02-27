import { getGlobalParameters } from "../parameters";


const sketch = (p) => {
    let { printSize, scaleRatio, exportRatio, palette, torusAmount, randomStartingPoint } = getGlobalParameters();
    let printingSize = printSize ?? {
        width: 3508,
        height: 2480,
    };

    let canvas;
    let buffer;
    let {background, colors, stroke, size} = palette;

    const startingPoints = generateRandomStartingPoints(
        torusAmount,
        printingSize.width,
        printingSize.height,
        p
    );

    p.setup = () => {
        let w = printingSize.width / exportRatio;
        let h = printingSize.height / exportRatio;
        buffer = p.createGraphics(w, h, p.WEBGL);
        canvas = p.createCanvas(w, h, p.WEBGL);
        // Adjust according to screens pixel density.
        exportRatio /= p.pixelDensity();
        //Do your setup here ⬇️


    };

    p.draw = () => {
        p.background("" + palette.background ?? "#FFF");
        // Clear buffer each frame
        buffer.clear();
        // Transform (scale) all the drawings
        buffer.scale(scaleRatio);
        //Draw here :) ⬇️

        p.pixelDensity(20)
        p.stroke("purple");
        p.noFill();

        for (let i = 0; i < parameters.torusAmount; i++) {
            if (randomStartingPoint) {
                let startingPoint = startingPoints[i];
                drawTorus(startingPoint.x, startingPoint.y);
            } else {
                drawTorus(0, 0);
            }
        }

        //Stop drawing here ⬆️
        // Draw buffer to canvas
        p.image(buffer, 0, 0);   
    };


    const drawTorus = (x, y) => {
        p.push();
        p.translate(x, y);
        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);
        const torusWidth = p.height / 8;
        p.torus(torusWidth, torusWidth / 2);
        p.pop();
    };

    const exportHighResolution = () => {
        scaleRatio = exportRatio;
        // Re-create buffer with exportRatio and re-draw
        buffer = p.createGraphics(scaleRatio * p.width, scaleRatio * p.height);
        p.draw();
        // Get timestamp to name the ouput file
        let timestamp = new Date().getTime();
        // Save as PNG
        p.save(buffer, p.str(timestamp), "png");
        // Reset scaleRation back to original, re-create buffer, re-draw
        scaleRatio = 1;
        buffer = p.createGraphics(p.width, p.height);
        p.draw();
    };

    p.keyReleased = () => {
        if (p.key == "e" || p.key == "E") {
            exportHighResolution();
        }
    };
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

const name = "Torus";

const parameters = { torusAmount: 1, randomStartingPoint: false };

const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "torusAmount", 1, 10, 1);
    folder.add(parameters, "randomStartingPoint");
    return folder;
};

export { name, sketch, addFolder, parameters };
