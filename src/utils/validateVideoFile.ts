import videoExtensions from "../data/videoExtensions.json";

export function validateVideoFile(file: File | null): Promise<File | false> {
  return new Promise((r) => {
    if (!file) return r(false);
    let fileName = file.name;
    let fileExtension = fileName
      .substr(fileName.lastIndexOf("."))
      .toLowerCase();
    fileExtension = fileExtension.replaceAll(".", "");
    let isValid = videoExtensions.includes(fileExtension);
    if (isValid) {
      return r(file);
    }
    return r(false);
  });
}
