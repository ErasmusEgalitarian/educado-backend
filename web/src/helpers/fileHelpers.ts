export const convertSrcToFile = async (src: string, fileName: string): Promise<File> => {
    const response = await fetch(src);
    const data = await response.blob();
    const file = new File([data], fileName, { type: data.type });
    return file;
};