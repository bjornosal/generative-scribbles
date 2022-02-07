import { Pane } from "tweakpane";
import * as tome from "chromotome";
import {
    getGlobalParameters,
    getPGraphics,
    setGlobalParameters,
    setPGraphics,
} from "./parameters";
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
    gui.add(params, "canvasW", 0, 18000).name("Canvas width");
    gui.add(params, "canvasH", 0, 18000).name("Canvas height");
    gui.add(params, "printScale", 1, 50, 1).name("Print scale");
    gui.add(params, "palette", palettes).name("Color palette");
    gui.add(params, "imageName").name("Image name");
    gui.add(params, "saveImage").name("Save image");

    /*     freezeButton.on("click", () => {
        drawing.isLooping() ? drawing.noLoop() : drawing.loop();
    });
 */
    console.log(drawing);
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
