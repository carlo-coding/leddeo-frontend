import { TSubtitleItem } from "../models/responses";
import { formatSeconds } from "./formatSeconds";

export function jsonToSrt(data: TSubtitleItem[]) {
  let srt = "";
  data.forEach((item, i) => {
    let begin = formatSeconds(item.begin);
    let end = formatSeconds(item.end);
    srt += `${i + 1}\n${begin} --> ${end}\n${item.text}\n\n`;
  });
  return srt;
}
