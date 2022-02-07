import { getGlobalParameters, getPGraphics, setPGraphics } from "../parameters";

const sketch = (p) => {
    let {
        canvasW,
        canvasH,
        printScale,
        palette,
        torusAmount,
        randomStartingPoint,
    } = getGlobalParameters();
    let width = canvasW ?? 640;
    let height = canvasH ?? 400;

    let printWidth = width*printScale
    let printHeight = height*printScale

    let pg = null;

    const startingPoints = generateRandomStartingPoints(
        torusAmount,
        printWidth,
        printHeight,
        p
    );
    p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
        setPGraphics(
            p.createGraphics(printWidth, printHeight, p.WEBGL)
        );
        pg = getPGraphics();
    };

    p.draw = () => {
        p.background("" + palette.background ?? "#FFF");
        pg.background("" + palette.background ?? "#FFF");
        pg.stroke("purple");
        pg.strokeWeight(4);
        pg.noFill();
        pg.rect(-printWidth / 2, -printHeight / 2, printWidth, printHeight);
        pg.strokeWeight(1);

        for (let i = 0; i < torusAmount; i++) {
            if (randomStartingPoint) {
                let startingPoint = startingPoints[i];
                drawTorus(startingPoint.x, startingPoint.y);
            } else {
                drawTorus(0, 0);
            }
        }

        p.image(pg, 0, 0, width, height);
    };
    /* 
TODO: Trengs dette?

    p.windowResized = () => {
        p.clear();
        p.resizeCanvas(width, height);
        p.draw();
    }; */

    const drawTorus = (x, y) => {
        pg.push();
        pg.translate(x, y);
        pg.rotateX(p.frameCount * 0.01);
        pg.rotateY(p.frameCount * 0.01);
        const torusWidth = (printHeight) / 8;
        pg.torus(torusWidth, torusWidth / 2);
        pg.pop();
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

const parameters = { torusAmount: 1, randomStartingPoint: false };

const addFolder = (gui) => {
    const folder = gui.addFolder("Torus");
    folder.add(parameters, "torusAmount", 1, 10, 1);
    folder.add(parameters, "randomStartingPoint");
    return folder;
};

const name = "Fagkveld";

export { name, sketch, addFolder, parameters };
