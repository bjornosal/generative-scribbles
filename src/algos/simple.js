import { getGlobalParameters, setPGraphics } from "../parameters";

const sketch = (p) => {
    let {
        canvasW,
        canvasH,
        palette,
        printScale
    } = getGlobalParameters();

    let width = canvasW ?? 640;
    let height = canvasH ?? 400;
    let pg; 

    p.setup = () => {
        p.createCanvas(width, height);
        pg = p.createGraphics(width*printScale, height*printScale);
        pg.background("" + palette.background ?? "#FFF");
    };

    p.draw = () => {
        pg.strokeWeight(5)
        pg.fill(255, 204, 0)
        pg.ellipse(p.random(pg.width), p.random(pg.height), 300, 100);
        p.image(pg, 0, 0, width, height);
        setPGraphics(pg)
    };

    p.windowResized = () => {
        p.clear();
        p.resizeCanvas(width, height);
        p.draw();
    };
};

const name = "Simple";
const parameters = {};
const addFolder = (gui) => {
    const folder = gui.addFolder("Simple");
    return folder;
};

export { name, sketch, addFolder, parameters };
