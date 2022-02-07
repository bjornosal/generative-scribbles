let globalParameters = {
    canvasW: 620,
    canvasH: 400,
    printScale: 10,
    palette: "Velg én",
    algo: "Velg én",
    imageName: "Bildet mitt",
    async saveImage() {
        pg.save("123.jpg")
    }
};

let pg;

export const getGlobalParameters = () => globalParameters;

export const setGlobalParameters = (newParams) => {
    globalParameters = newParams;
};

export const getPGraphics = () => pg;
export const setPGraphics = (newGraphic) => {
    pg = newGraphic;
};
