import { Pane } from "tweakpane";
import * as tome from "chromotome";
import {
    getDefaultParameters,
    getGlobalParameters,
    setGlobalParameters,
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

    gui.add(params, "algo", algoSketches);
    gui.add(params, "canvasW", 0, 18000);
    gui.add(params, "canvasH", 0, 18000);
    gui.add(params, "palette", palettes);

    return gui;
};

const createDefaultPane = (params) => {
    const defaultPane = new Pane({
        title: "Parameters",
        expanded: true,
    });

    const standardParamsPane = defaultPane.addFolder({ title: "Standard" });
    const palettes = tome.getAll().reduce((map, palette) => {
        map[palette.name] = palette;
        return map;
    }, {});

    //TODO: Oppdater Tweakpane-verdiene når de endres???
    const algoSketches = Object.values(algos).map((algo) => ({
        text: algo?.name ?? "Ukjent",
        value: { ...algo },
    }));

    standardParamsPane.addBlade({
        view: "list",
        label: "Drawing",
        options: algoSketches,
        value: "algo",
    });

    standardParamsPane.addInput(params, "canvasW", { label: "Canvas width" });
    standardParamsPane.addInput(params, "canvasH", { label: "Canvas height" });
    standardParamsPane.addInput(params, "palette", { options: palettes });

    const resetButton = defaultPane.addButton({ title: "Reload" });
    resetButton.on("click", () => {
        window.location.reload();
    });

    const savingFolder = defaultPane.addFolder({ title: "Saving shit" });
    const saveButton = savingFolder.addButton({ title: "Save" });
    saveButton.on("click", () => {
        drawing.saveCanvas("fagkveld", "jpg");
    });

    const freezeButton = savingFolder.addButton({
        title: "Freeze/Thaw",
    });

    freezeButton.on("click", () => {
        drawing.isLooping() ? drawing.noLoop() : drawing.loop();
    });

    return defaultPane;
};

export default () => {
    let params = getGlobalParameters();
    let gui = createGui(params);
    gui.onFinishChange((event) => {
        document.body.style.backgroundColor =
            params?.palette?.background ?? "#FFF";
        if (params?.algo?.sketch) {
            gui.folders.forEach((folder) => folder.destroy());
            const res = params.algo.parameters(gui);
            const controllerObjects = res.controllers.reduce(
                (objects, controller) => ({ ...objects, ...controller.object }),
                {}
            );
            setGlobalParameters({ ...params, ...controllerObjects });
            drawing.remove();
            drawing = new p5(params?.algo?.sketch);
        }
    });
};
