import { getGlobalParameters } from "../parameters";

const name = "Particles";
const parameters = {
    zoom: 1,
    band_width: 0.06,
    band_dist: 0.068,
    number_of_sets: 10,
    red: 255,
    green: 0,
    blue: 0,
    particle_set_size: 3000,
};
const addFolder = (gui) => {
    const folder = gui.addFolder(name);
    folder.add(parameters, "particle_set_size", 200, 10000, 100);
    folder.add(parameters, "zoom", 1, 10, 1);
    folder.add(parameters, "band_width", 0.01, 1, 0.01);
    folder.add(parameters, "band_dist", 0.01, 0.5, 0.01);
    folder.add(parameters, "number_of_sets", 1, 50, 1);
    folder.add(parameters, "red", 0, 255, 1);
    folder.add(parameters, "green", 0, 255, 1);
    folder.add(parameters, "blue", 0, 255, 1);
    return folder;
};

const sketch = (p) => {
    let {
        printSize,
        scaleRatio,
        exportRatio,
        palette,
        zoom,
        band_width,
        band_dist,
        number_of_sets,
        red,
        green,
        blue,
        particle_set_size,
    } = getGlobalParameters();
    let buffer;
    let canvas;
    let printingSize = printSize ?? {
        width: 3508,
        height: 2480,
    };
    const THE_SEED = p.floor(p.random(9999999));
    let particle_sets = [];
    //No guarantee these values are set.
    //Background is a string with hex value
    //Colors is an array of strings with hex value
    //Stroke is a hex value
    //Size is an integer
    //https://kgolid.github.io/chromotome-site/
    let { background, colors, stroke, size } = palette;
    //Setting background to a default white if no background exists.
    background = background ? background : "#FFF";

    p.setup = () => {
        defaultSetup();
        //Do your setup here ⬇️
        buffer.randomSeed(THE_SEED);
        buffer.stroke(red, green, blue, 20);
        buffer.strokeWeight(3);
        buffer.smooth();
        for (var j = 0; j < number_of_sets; j++) {
            let set = [];
            for (var i = 0; i < particle_set_size; i++) {
                set.push(
                    new Particle(
                        buffer.randomGaussian(0, 200),
                        buffer.randomGaussian(p.height / 4, 200),
                        buffer.random(p.TWO_PI)
                    )
                );
            }
            particle_sets.push(set);
        }
    };

    p.draw = () => {
        // Clear buffer each frame
        defaultDraw();

        //Draw here :) ⬇️

        particle_sets.forEach(function (particles, index) {
            particles.forEach(function (particle) {
                particle.update(index);
                particle.display(index);
            });
        });

        //Stop drawing here ⬆️
        // Draw buffer to canvas
        p.image(buffer, -p.width / 2, -p.height / 2);
    };

    class Particle {
        constructor(x, y, angle) {
            this.pos = buffer.createVector(x, y);
            this.angle = angle;
        }

        update(index) {
            this.pos.x += buffer.cos(this.angle);
            this.pos.y += buffer.sin(this.angle);

            let nx = zoom * buffer.map(this.pos.x, 0, p.width, -1, 1);
            let ny = zoom * buffer.map(this.pos.y, 0, p.height, -1, 1);

            this.altitude =
                buffer.noise(nx + 423.2, ny - 231.1) +
                0.1 * buffer.noise(nx * 15 + 113.3, ny * 15 + 221.1);

            this.val =
                (this.altitude + band_dist * (index - number_of_sets / 2)) % 1;
            this.angle += 3 * buffer.map(this.val, 0, 1, -1, 1);
        }

        display() {
            if (
                this.val > 0.5 - band_width / 2 &&
                this.val < 0.5 + band_width / 2
            ) {
                buffer.point(this.pos.x, this.pos.y);
            }
        }
    }

    /*
    ##########################################
     Don't touch these functions unless you know what you're doing.:) ⬇️ 
    ##########################################
    */

    const defaultDraw = () => {
        buffer.clear();
        // Transform (scale) all the drawings
        buffer.scale(scaleRatio);
        buffer.background(background);
    };

    const defaultSetup = () => {
        let w = printingSize.width / exportRatio;
        let h = printingSize.height / exportRatio;
        buffer = p.createGraphics(w, h, p.WEBGL);
        canvas = p.createCanvas(w, h, p.WEBGL);
        // Adjust according to screens pixel density.
        exportRatio /= p.pixelDensity();
    };

    const exportHighResolution = () => {
        scaleRatio = exportRatio;
        // Re-create buffer with exportRatio and re-draw
        buffer = p.createGraphics(
            scaleRatio * p.width,
            scaleRatio * p.height,
            p.WEBGL
        );
        p.draw();
        // Get timestamp to name the ouput file
        let timestamp = new Date().getTime();
        // Save as PNG
        p.save(buffer, p.str(`${name}-${timestamp}`), "png");
        // Reset scaleRation back to original, re-create buffer, re-draw
        scaleRatio = 1;
        buffer = p.createGraphics(p.width, p.height, p.WEBGL);
        p.draw();
    };

    p.keyReleased = () => {
        if (p.key == "e" || p.key == "E") {
            exportHighResolution();
        }
    };
};

export { name, sketch, addFolder, parameters };
