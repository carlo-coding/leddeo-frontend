import { TSubtitleItem } from "../models/responses";
import { timecodeToSeconds } from "./timeCodeToSeconds";

export function srtToArray(srtText: string) {
  if (srtText === "") return [];
  var srtArray = srtText.split("\n");
  var result = [];
  for (var i = 0; i < srtArray.length; i++) {
    if (!srtArray[i]) continue;
    var subtitle: TSubtitleItem = {
      id: Math.random().toString().slice(2),
      begin: 0,
      end: 0,
      text: "",
    };
    subtitle.text = srtArray[i + 2];
    var time = srtArray[i + 1].split(" --> ");
    subtitle.begin = timecodeToSeconds(time[0]);
    subtitle.end = timecodeToSeconds(time[1]);
    result.push(subtitle);
    i += 2;
  }
  return result;
}
