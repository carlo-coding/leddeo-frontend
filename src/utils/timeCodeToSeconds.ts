export function timecodeToSeconds(timecode: string): number {
  let parts = timecode.split(":");
  let secondsString = parts[2]?.split(",")?.[0] || "0";
  let milisecondsString = parts[2]?.split(",")?.[1] || "0";
  let hours = parseInt(parts[0] || "0");
  let minutes = parseInt(parts[1] || "0");
  let seconds = parseFloat(secondsString);
  let miliseconds = parseFloat(milisecondsString);
  return hours * 3600 + minutes * 60 + seconds + miliseconds / 1000;
}
