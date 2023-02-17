export function linesFromTextNode(textNode: any) {
  if (textNode.nodeType !== 3) {
    throw new Error("Lines can only be extracted from text nodes.");
  }
  textNode.textContent =
    textNode.textContent?.trim().replace(/\s+/g, " ") ?? "";
  var textContent = textNode.textContent;
  var range = document.createRange();
  var lines = [];
  var lineCharacters = [];
  for (var i = 0; i < textContent.length; i++) {
    range.setStart(textNode, 0);
    range.setEnd(textNode, i + 1);
    var lineIndex = range.getClientRects().length - 1;
    if (!lines[lineIndex]) {
      lines.push((lineCharacters = []));
    }
    lineCharacters.push(textContent.charAt(i));
  }
  lines = lines.map(function operator(characters) {
    return characters.join("").trim().replace(/\s+/g, " ");
  });
  return lines;
}
