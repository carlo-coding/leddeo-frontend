export function isValidTimecode(timecode: string) {
  var timecodeRegex =
    /^(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d),(?:[012345]\d\d)$/;
  return timecodeRegex.test(timecode);
}
