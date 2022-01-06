import { Pane } from "tweakpane";
import * as tome from "chromotome";
import { getGlobalParameters } from "./parameters";
import { sineWave } from "./algos/sineWave.js";
import { fagkveldSketch } from "./algos/fagkveldSketch.js";
import p5 from "p5";
import algos from "./algos";

let drawing = new p5(fagkveldSketch);

export default () => {
    let params = getGlobalParameters();

    const pane = new Pane({
        title: "Parameters",
        expanded: true,
    });

    const standardParamsPane = pane.addFolder({ title: "Standard" });
    const palettes = tome.getAll().reduce((map, palette) => {
        map[palette.name] = palette;
        return map;
    }, {});

    //TODO: Hent ut ekstra parametre per algoritme.
    //TODO: Oppdater Tweakpane-verdiene når de endres???
    standardParamsPane.addInput(params, "algo", {
        label: "Drawing",
        options: algos,
    });
    standardParamsPane.addInput(params, "canvasW", { label: "Canvas width" });
    standardParamsPane.addInput(params, "canvasH", { label: "Canvas height" });
    standardParamsPane.addInput(params, "palette", { options: palettes });

    const torusFolder = pane.addFolder({ title: "Torus" });
    torusFolder.addInput(params, "torusAmount", {
        label: "Torus torus torus",
        step: 1,
        min: 1,
        max: 25,
    });
    torusFolder.addInput(params, "randomStartingPoint", {
        label: "Torus random",
    });

    const resetButton = pane.addButton({ title: "Reload" });
    resetButton.on("click", () => {
        window.location.reload();
    });

    const savingFolder = pane.addFolder({ title: "Saving shit" });
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

    pane.on("change", (_) => {
        document.body.style.backgroundColor =
            params?.palette?.background ?? "#FFF";
        const currentPreset = pane.exportPreset();
        drawing.remove();
        drawing = new p5(currentPreset.algo);
    });
};
