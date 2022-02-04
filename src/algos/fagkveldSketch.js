import { getGlobalParameters } from "../parameters";

const addParametersToPane = (pane, params) => {
    const torusFolder = pane.addFolder({ title: "Torus" });
    torusFolder.addInput(params, "torusAmount", {
        label: "Torus torus torus",
        step: 1,
        min: 1,
        max: 25,
    });
    torusFolder.addInput(params, "randomStartingPoint", {
        label: "Torus random",
    });
};
const name = "Fagkveld"

const sketch = (p) => {
    let {
        canvasW,
        canvasH,
        palette,
        torusAmount,
        randomStartingPoint,
    } = getGlobalParameters();

    let width = canvasW ?? 640;
    let height = canvasH ?? 400;
    const startingPoints = generateRandomStartingPoints(
        torusAmount,
        width,
        height,
        p
    );
    p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
    };

    p.draw = () => {
        p.background("" + palette.background ?? "#FFF");
        p.stroke("purple");
        p.strokeWeight(4);
        p.noFill();
        p.rect(-width / 2, -height / 2, width, height);
        p.strokeWeight(1);

        for (let i = 0; i < torusAmount; i++) {
            if (randomStartingPoint) {
                let startingPoint = startingPoints[i];
                drawTorus(startingPoint.x, startingPoint.y);
            } else {
                drawTorus(0, 0);
            }
        }
    };

    p.windowResized = () => {
        p.clear();
        p.resizeCanvas(width, height);
        p.draw();
    };

    const drawTorus = (x, y) => {
        p.push();
        p.translate(x, y);
        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);
        const torusWidth = canvasH / 8;
        p.torus(torusWidth, torusWidth / 2);
        p.pop();
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

export { name, sketch, addParametersToPane };
