import { getGlobalParameters } from "../parameters";

export const fagkveldSketch = (p) => {
    let { canvasW, canvasH, palette, ...params } = getGlobalParameters();
    let width = canvasW ?? 640;
    let height = canvasH ?? 400;

    p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
    };

    p.draw = () => {
        p.background("" + palette.background ?? "#FFF");
        p.stroke("purple");
        p.strokeWeight(4);
        p.noFill();
        p.rect(-width / 2, -height / 2, width, height);
        // p.fill("purple");
        p.strokeWeight(1);

        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);
        const torusWidth = canvasH / 8;
        p.torus(torusWidth, torusWidth / 2);
    };

    p.windowResized = () => {
        p.clear();
        p.resizeCanvas(width, height);
        p.draw();
    };
};
