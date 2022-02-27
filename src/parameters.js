let globalParameters = {
    printSize: null,
    scaleRatio: 1,
    exportRatio: 4,
    palette: "Velg én",
    algo: "Velg én",
};

export const getGlobalParameters = () => globalParameters;

export const setGlobalParameters = (newParams) => {
    globalParameters = newParams;
};
 