import { getGlobalParameters } from "../parameters";

export const fagkveldSketch = (p) => {
    let { canvasW, canvasH, palette, ...params } = getGlobalParameters();
    let width = canvasW ?? 640;
    let height = canvasH ?? 400;

    p.setup = () => {
        p.createCanvas(width, height);
        p.background("" + palette.background ?? "#FFF");
        p.noLoop();
    };

    p.draw = () => {
        p.line(width, 0, 0, height);
        p.rect(30, 20, 55, 55);
    };

    p.windowResized = () => {
        p.clear();
        p.resizeCanvas(width, height);
        p.draw();
    };
};
