export function downLoadFile(
  content: string | File,
  filename: string,
  fileType = "text/plain"
) {
  let file: File;
  if (typeof content === "string") {
    file = new File([content], filename, { type: fileType });
  } else {
    file = content;
  }
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
