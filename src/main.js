import * as tome from "chromotome";
import { getGlobalParameters, setGlobalParameters } from "./parameters";
import p5 from "p5";
import algos from "./algos";
import { sketch as defaultSketch } from "./algos/particles";
import GUI from "lil-gui";

let drawing = new p5(defaultSketch);

const createGui = (params) => {
    const gui = new GUI();
    const algoSketches = Object.values(algos).reduce(
        (all, algo) => ({
            ...all,
            [algo?.name ?? "Ukjent"]: algo,
        }),
        {}
    );

    const palettes = tome.getAll().reduce((map, palette) => {
        map[palette.name] = palette;
        return map;
    }, {});

    gui.add({ info: "Save by pressing 'E'" }, "info").name("Save").disable();
    gui.add(params, "algo", algoSketches).name("Algorithm");
    //Assuming 300 PPI print size
    gui.add(params, "printSize", {
        A0: {
            width: 9920,
            height: 7016,
        },
        A1: {
            width: 7016,
            height: 4960,
        },
        A2: {
            width: 4960,
            height: 3508,
        },
        A3: {
            width: 3508,
            height: 2480,
        },
        A4: {
            width: 2480,
            height: 1754,
        },
        A5: {
            width: 1754,
            height: 1240,
        },
        A6: {
            width: 1240,
            height: 877,
        },
    }).name("Print size");
    gui.add(params, "scaleRatio", 1).name("Scale ratio").disable();
    gui.add(params, "exportRatio", 1, 10, 1).name("Export ratio");
    gui.add(params, "palette", palettes).name("Color palette");

    /*     freezeButton.on("click", () => {
        drawing.isLooping() ? drawing.noLoop() : drawing.loop();
    });
 */
    return gui;
};

const main = () => {
    let params = getGlobalParameters();
    let gui = createGui(params);
    gui.onFinishChange((event) => {
        document.body.style.backgroundColor =
            params?.palette?.background ?? "#FFF";
        if (params?.algo?.sketch) {
            if (event.property === "algo") {
                gui.folders.forEach((folder) => folder.destroy());
                params.algo.addFolder(gui);
            }
            //Adds parameters from the algorithm to the global parameters, making the changed values accesible.
            setGlobalParameters({ ...params, ...params?.algo?.parameters });

            drawing.remove();
            drawing = new p5(params?.algo?.sketch);
        }
    });
};

main();
