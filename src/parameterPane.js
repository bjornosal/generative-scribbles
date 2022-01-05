import { Pane } from "tweakpane";
import * as tome from "chromotome";
import { getGlobalParameters } from "./parameters";
import { sineWave } from "./algos/sineWave.js";
import p5 from "p5";

let drawing = new p5(sineWave);

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

    standardParamsPane.addInput(params, "canvasW", { label: "Canvas width" });
    standardParamsPane.addInput(params, "canvasH", { label: "Canvas height" });
    standardParamsPane.addInput(params, "palette", {
        options: palettes,
        format: (v) => new URLSearchParams(v),
    });

    const resetButton = pane.addButton({ title: "Reload" });
    resetButton.on("click", () => {
        window.location.reload();
    });

    pane.on("change", (_) => {
        document.body.style.backgroundColor =
            params?.palette?.background ?? "#FFF";
        drawing.remove();
        drawing = new p5(sineWave);
    });
};
