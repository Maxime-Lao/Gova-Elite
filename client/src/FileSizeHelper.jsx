
export const convertBytesToMegaBytes = (bytes) => {
    const megaBytes = bytes / (1024 * 1024);
    return megaBytes.toFixed(2); // Arrondir à deux décimales
};
