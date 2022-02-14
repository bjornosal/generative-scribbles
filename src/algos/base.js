import { getGlobalParameters } from "../parameters";

const sketch = (p) => {
    let { printSize, scaleRatio, exportRatio, palette } = getGlobalParameters();
    let buffer;
    let canvas;
    //TODO:
    let printingSize = printSize ?? {
        width: 3508,
        height: 2480,
    };

    p.setup = () => {
        let w = printingSize.width / exportRatio;
        let h = printingSize.height / exportRatio;
        buffer = p.createGraphics(w, h);
        canvas = p.createCanvas(w, h);
        // Adjust according to screens pixel density.
        exportRatio /= p.pixelDensity();
        //Do your setup here ⬇️


    };

    p.draw = () => {
        p.background(220);
        // Clear buffer each frame
        buffer.clear();
        // Transform (scale) all the drawings
        buffer.scale(scaleRatio);
        // Make all the drawing to the buffer instead of canvas
        buffer.circle(p.width / 2, p.height / 2, p.width / 4);
        //Draw here :) ⬇️

        //Stop drawing here ⬆️
        // Draw buffer to canvas
        p.image(buffer, 0, 0);   
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

const name = "Base";
const parameters = {};
const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    return folder;
};

export { name, sketch, addFolder, parameters };
