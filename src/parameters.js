const defaultParameters = {
    canvasW: 620,
    canvasH: 400,
    palette: "none",
    algo: "Fagkveld",
};

const globalParameters = {
    canvasW: 620,
    canvasH: 400,
    palette: "none",
    algo: "Fagkveld",
};

export const getGlobalParameters = () => {
    return globalParameters;
};

export const getDefaultParameters = () => {
    return { ...defaultParameters };
};
