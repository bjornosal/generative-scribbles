import { Pane } from "tweakpane";
import * as tome from "chromotome";
import { getGlobalParameters } from "./parameters";
import p5 from "p5";
import algos from "./algos";
import { sineWave } from "./algos/sineWave";
import { sketch } from "./algos/fagkveldSketch";

let drawing = new p5(sketch);

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
    const algoSketches = Object.values(algos).reduce(
        (all, algo) => ({
            ...all,
            [algo?.name ?? "Ukjent"]: algo,
        }),
        {}
    );
    standardParamsPane.addInput(params, "algo", {
        label: "Drawing",
        options: algoSketches,
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
}

export default () => {
    let params = getGlobalParameters();

    let pane = createDefaultPane(params)

    pane.on("change", (_) => {
        document.body.style.backgroundColor =
            params?.palette?.background ?? "#FFF";
        const currentPreset = pane.exportPreset();
        drawing.remove();
        pane = createDefaultPane(params)
        currentPreset.algo.addParametersToPane(pane, params) 
        drawing = new p5(currentPreset?.algo?.sketch);
    });
};
