import { TSubtitleItem } from "../../models/responses";
import { request } from "../../utils";
import { LanguageServiceEndpoints } from "./endpoints";

export async function serviceTranslateSubtitles(payload: {
  subtitles: TSubtitleItem[];
  langCode: string;
}) {
  const resp = await request<TSubtitleItem[]>({
    endpoint: `${LanguageServiceEndpoints.TRANSLATE}${payload.langCode}`,
    method: "POST",
    body: payload.subtitles,
    codeMessages: {
      500: "Error interno del servidor",
      401: "No tienes autorización",
      403: "Debes crear una cuenta para esta funcionalidad",
    },
    headers: {
      "Content-Type": "application/json",
    },
    isProtected: true,
  });
  return resp;
}
