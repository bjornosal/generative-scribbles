const defaultParameters = {
    canvasW: 620,
    canvasH: 400,
    palette: "none",
    algo: "Fagkveld",
};

let globalParameters = {
    canvasW: 620,
    canvasH: 400,
    palette: "none",
    algo: "Fagkveld"
};

export const getGlobalParameters = () => {
    return globalParameters;
};

export const setGlobalParameters = (newParams) => {
    globalParameters = newParams;
};

export const getDefaultParameters = () => {
    return { ...defaultParameters };
};
