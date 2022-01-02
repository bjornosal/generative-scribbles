const width = 600;
const height = 450;
let y0, x1, y1, x2, y2;

const drawSineWave = (p, modifier) => {
    for (let i = 0; i <= width; i++) {
        y0[i] = height / 2;

        if (i === 0) {
            y1[i] = y0;
            x1[i] = 0 + modifier;
        } else {
            y1[i] = y1[i - 1];
            x1[i] = x1[i - 1];
        }

        p.stroke(`rgba(0, 0, 0, ${((1 / width) * (width - x1[i] / 2)) / 5})`);
        const amplitude = (i / 10) * (modifier / 20);

        x2[i] = x1[i] + 1;
        y2[i] = amplitude * p.sin(i / 10) + y0[i];

        p.line(x1[i], y1[i], x2[i], y2[i]);

        x1[i] = x2[i];
        y1[i] = y2[i];
    }
};

export const sineWave = (p) => {
    p.setup = () => {
        p.createCanvas(720, 600);

        p.angleMode(p.RADIANS);
        p.noLoop();

        y0 = [];
        x1 = [];
        y1 = [];
        x2 = [];
        y2 = [];
    };

    p.draw = () => {
        // draw 50 sinusoidal waves
        for (let i = 1; i < 50; i++) {
            drawSineWave(p, i);
        }
    };
};
