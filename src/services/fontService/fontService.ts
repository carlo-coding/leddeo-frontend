import { apiPrefix, apiUrl, request } from "../../utils";
import { FontServiceEndpoints } from "./endpoints";

export async function loadAllFonts(fontsList: string[]) {
  const fontBasePath = `${apiUrl}${apiPrefix}${FontServiceEndpoints.GET_FONT}`;
  for (let fontString of fontsList) {
    const font = new FontFace(
      fontString.slice(0, -4),
      `url(${fontBasePath}${fontString})`
    );
    document.fonts.add(font);
    font.load().catch(() => console.log(`Err loading ${fontString}`));
  }
}

export async function serviceGetFontsList() {
  const resp = await request<string[]>({
    endpoint: FontServiceEndpoints.LIST_FONTS,
  });
  return resp;
}
