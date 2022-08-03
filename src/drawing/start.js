import { getGlobalParameters } from "../parameters";

// These values needs to be changed.
const name = "Start";
const parameters = { paddingX: 0, paddingY: 0, itemsPerRow: 10, spacing: 0 };
const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "paddingX", 0, 200, 5).name("Padding X"); //percentage?
    folder.add(parameters, "paddingY", 0, 200, 5).name("Padding Y");
    folder.add(parameters, "spacing", 0, 200, 5).name("Spacing");
    folder
        .add(parameters, "itemsPerRow", 1, 100, 1)
        .name("Number of items per row");
    return folder;
};

const sketch = (p) => {
    let {
        printSize,
        scaleRatio,
        exportRatio,
        palette,
        paddingX,
        paddingY,
        spacing,
        itemsPerRow,
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

    let startX = paddingX;
    let startY = paddingY;
    let currentX = startX;
    let currentY = startY;
    let itemSize;
    p.setup = () => {
        defaultSetup();
        //Do your setup here ⬇️
        canvas.background(background);
        buffer.background(background);
        buffer.noLoop();
        startX = paddingX;
        startY = paddingY;
        itemSize = p.width / itemsPerRow;
    };

    p.draw = () => {
        // Clear buffer each frame
        defaultDraw();
        //Draw here :) ⬇️
        buffer.noLoop();
        buffer.noStroke();
        while (currentY < p.height - paddingY) {
            while (currentX < p.width - paddingX) {
                let drawing = p.random(1, 3);
                drawing = Number(drawing.toFixed(0));
                buffer.fill(p.random(colors));
                switch (drawing) {
                    case 1:
                        buffer.square(currentX, currentY, itemSize);
                        break;
                    case 2:
                        buffer.circle(
                            currentX + itemSize / 2,
                            currentY + itemSize / 2,
                            itemSize
                        );
                        break;
                    case 3:
                        buffer.triangle(
                            currentX,
                            currentY,
                            currentX + itemSize,
                            currentY,
                            currentX,
                            currentY + itemSize
                        );
                        buffer.fill(p.random(colors));
                        buffer.triangle(
                            currentX + itemSize,
                            currentY,
                            currentX + itemSize,
                            currentY + itemSize,
                            currentX,
                            currentY + itemSize
                        );
                        break;

                    case 4:
                        buffer.square(currentX, currentY, itemSize);
                        buffer.circle(
                            currentX + itemSize / 2,
                            currentY + itemSize / 2,
                            itemSize
                        );
                    default:
                        console.log("default: " + drawing);
                        break;
                }
                currentX = currentX + itemSize + spacing;
            }
            currentX = startX;
            currentY = currentY + itemSize + spacing;
        }

        if (currentY > p.height) {
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
