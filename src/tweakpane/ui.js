import { Pane } from "tweakpane";


export default (params = {}) => {
    const defaultParams = {
        algos: 123,
        title: "hello",
        color: "#0f0",
        theme: "dark",
    };

    const pane = new Pane({
        title: "Parameters",
        expanded: true,
    });
	
	Object.assign(params, defaultParams);
 
    pane.addInput(params, "factor");
    pane.addInput(params, "title");
    pane.addInput(params, "color");
    // `options`: list
    pane.addInput(params, "theme", {
        options: { Dark: "dark", Light: "light" },
    });

	const btn = pane.addButton({ title: 'Redraw' });
};
