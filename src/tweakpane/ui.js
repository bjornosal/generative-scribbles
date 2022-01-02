import { Pane } from "tweakpane";

export default (params = {}) => {
	//TODO: Set params given query params
    const defaultParams = {
        canvasW: 123,
        title: "",
        color: "#0f0",
        theme: "",
    };

    const pane = new Pane({
        title: "Parameters",
        expanded: true,
    });

    Object.assign(params, defaultParams);
    let standardParamsPane = pane.addFolder({ title: "Standard" });

    standardParamsPane.addInput(params, "canvasW");
    standardParamsPane.addInput(params, "title");
    standardParamsPane.addInput(params, "color");
    pane.addInput(params, "theme", {
        options: { Dark: "dark", Light: "light" },
    });

    const btn = pane.addButton({ title: "Redraw" });
    btn.on("click", () => {
        const preset = pane.exportPreset();
        let urlWithParams =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname;

        let params = new URLSearchParams(preset).toString();
        urlWithParams += "?" + params;

        window.location.href = urlWithParams;
    });
};
