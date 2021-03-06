const width = 600; 
const height = 450;

export const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(width, height);
        p.stroke("#000");
    };

    p.draw = () => {
        p.line(width, 0, 0, height);
    };

    p.windowResized = () => {
        p.clear();
        p.resizeCanvas(width, height);
        p.draw();
    };
};
