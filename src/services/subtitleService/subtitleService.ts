import { TSubtitleState } from "../../features";
import { TSubtitleItem } from "../../models/responses";
import { buildQuery, request } from "../../utils";
import { SubtitleServiceEndpoints } from "./endpoints";

export async function serviceGetVideoSubtitles(video: File) {
  const resp = await request<TSubtitleItem[]>({
    endpoint: SubtitleServiceEndpoints.UPLOAD,
    method: "POST",
    body: video,
    mapper: (r) => r.data,
    preSend: async (video) => {
      const formData = new FormData();
      formData.append("file", video);
      return formData;
    },
    codeMessages: {
      401: "No tienes autorización",
      400: "No se mandó ningún archivo",
      415: "El archivo debe ser un video",
      500: "Error interno del servidor",
      403: "Debes crear una cuenta para esta funcionalidad",
    },
    isProtected: true,
  });
  return resp;
}

export async function serviceSubtitleVideo(payload: {
  file: File;
  srt: string;
  style: TSubtitleState["style"];
}) {
  const srtFile = new File([payload.srt], "subtitles.srt", {
    type: "text/plain",
  });
  const formData = new FormData();
  formData.append("video", payload.file);
  formData.append("srt", srtFile);

  const params = buildQuery(payload.style);

  const resp = request<TSubtitleItem[]>({
    endpoint: `${SubtitleServiceEndpoints.CAPTION}${params}`,
    method: "POST",
    body: formData,
    mapper: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download =
        payload.file.name ??
        `${Math.random().toString(16).slice(10)}-video.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return blob;
    },
    isBlob: true,
    codeMessages: {
      400: "Uno o más parametros no son válidos",
      401: "No tienes autorización",
      415: "Tipo de archivo no válido, debe ser un video",
      500: "Error interno del servidor",
      403: "Debes crear una cuenta para esta funcionalidad",
    },
    isProtected: true,
  });
  return resp;
}
