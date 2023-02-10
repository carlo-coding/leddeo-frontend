import { TSubtitleItem } from "../models";
import { srtToArray } from "./srtToArray";

export function validateSrtFile(
  file: File | null
): Promise<TSubtitleItem[] | false> {
  return new Promise((r) => {
    if (!file) return r(false);
    try {
      const reader = new FileReader();
      let srtText = "";
      reader.onload = (e) => {
        try {
          let result = e.target?.result;
          srtText = typeof result === "string" ? result : "";
          let array = srtToArray(srtText);
          return r(array);
        } catch (e) {
          console.error(e);
          return r(false);
        }
      };
      reader.readAsText(file);
    } catch (e) {
      console.error(e);
      return r(false);
    }
  });
}
