import * as tome from "chromotome";
import { getGlobalParameters, setGlobalParameters } from "./parameters";
import p5 from "p5";
import algos from "./algos";
import { sketch } from "./algos/fagkveldSketch";
import GUI from "lil-gui";

let drawing = new p5(sketch);

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
        }
    }).name("Print size");
    gui.add(params, "canvasW", 0, 18000).name("Canvas width");
    gui.add(params, "canvasH", 0, 18000).name("Canvas height");
    gui.add(params, "scaleRatio", 1).name("Scale ratio").disable();
    gui.add(params, "exportRatio", 1, 10, 1).name("Export ratio");
    gui.add(params, "palette", palettes).name("Color palette");
    
    /*     freezeButton.on("click", () => {
        drawing.isLooping() ? drawing.noLoop() : drawing.loop();
    });
 */
    return gui;
};

export default () => {
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
            setGlobalParameters({ ...params, ...params?.algo?.parameters });

            drawing.remove();
            drawing = new p5(params?.algo?.sketch);
        }
    });
};
