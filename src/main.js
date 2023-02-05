import * as tome from "chromotome";
import { getGlobalParameters, setGlobalParameters } from "./parameters";
import p5 from "p5";
import drawings from "./drawing";
import GUI from "lil-gui";

let drawing;

const createGui = (params) => {
    const gui = new GUI();
    const sketches = Object.values(drawings)
        .sort((a, b) => (a?.name > b?.name ? 1 : -1))
        .reduce(
            (all, drawing) => ({
                ...all,
                [drawing?.name ?? "Ukjent"]: drawing,
            }),
            {}
        );

   const palettes = {}
    /*  tome.getAll().reduce((map, palette) => {
      map[palette.name] = palette;
        return map;
    }, {});*/

    palettes["Lene1"] = { background: "#FFF", colors: ["#4C6037", "#527D91", "#C0B297", "#C89D9F", "#97939A", "#A5734C"] };
    palettes["Lene2"] = { background: "#FFF", colors: ["#DCD391", "#98B0B8", "#C0B297", "#C89D9F", "#97939A", "#A5734C"] };
    palettes["Lene3"] = { background: "#FFF", colors: ["#62b6cb", "#8db859", "#FFBE54"] };
    palettes["Beiglene"] = { background: "#FFF", colors: ["#EEE4B5", "#ABA680", "#A6c186", "#19535F"] };

    gui.add({ info: "Save by pressing 'E'" }, "info").name("Save").disable();
    gui.add(
        {
            openColorPalette: () => {
                window
                    .open("https://kgolid.github.io/chromotome-site/", "_blank")
                    .focus();
            },
        },
        "openColorPalette"
    ).name("Open color palettes");
    gui.add(params, "algo", sketches).name("Drawing");
    //Assuming 300 PPI print size
    gui.add(params, "direction", ["Landscape", "Portrait"]).name("Direction");
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
    gui.add(params, "palette", palettes).name("Color palette").listen();

    /*     freezeButton.on("click", () => {
        drawing.isLooping() ? drawing.noLoop() : drawing.loop();
    });
 */
    return gui;
};

const main = () => {
    let params = getGlobalParameters();
    let gui = createGui(params);
    const chosenAlgo = JSON.parse(localStorage.getItem("algo"));
    gui.onFinishChange((event) => {
        document.body.style.backgroundColor =
            params?.palette?.background ?? "#FFF";
        if (params?.algo?.sketch) {
            if (event.property === "algo") {
                gui.folders.forEach((folder) => folder.destroy());
                params.algo.addFolder(gui);
                localStorage.setItem(
                    "algo",
                    JSON.stringify(params?.algo?.name)
                );
            }
            let printSize = params.printSize;
            if (
                (event.property === "direction" &&
                    event.value === "Portrait") ||
                (event.property !== "direction" &&
                    params.direction === "Portrait")
            ) {
                printSize = {
                    height: printSize.width,
                    width: printSize.height,
                };
            }
            //Adds parameters from the algorithm to the global parameters, making the changed values accesible.
            setGlobalParameters({
                ...params,
                ...params?.algo?.parameters,
                printSize,
            });

            drawing?.remove();
            drawing = new p5(params?.algo?.sketch);
        }
    });

    if (!params?.algo?.sketch) {
        const printSize = gui.children.find(
            (child) => child.property === "printSize"
        );

        printSize.setValue({
            width: 2480,
            height: 1754,
        });

        const drawingOption = gui.children.find(
            (child) => child.property === "algo"
        );
        let defaultAlgo = Object.values(drawings).find(
            (drawing) => drawing.name === chosenAlgo
        );
        defaultAlgo = defaultAlgo || Object.values(drawings)[0];
        drawingOption.setValue(defaultAlgo);
        const palette = gui.children.find(
            (child) => child.property === "palette"
        );
        const defaultColor = tome.getRandom();
        palette.setValue(defaultColor);

        document.body.style.backgroundColor = defaultColor.background ?? "#FFF";
        gui.folders.forEach((folder) => folder.destroy());
        defaultAlgo?.addFolder(gui);
        //Adds parameters from the algorithm to the global parameters, making the changed values accesible.
        setGlobalParameters({ ...params, ...params?.algo?.parameters });

        drawing?.remove();
        drawing = new p5(defaultAlgo?.sketch);
    }
};

main();
