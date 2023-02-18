import {
  DownloadDurationPayload,
  DurationResponse,
  TranscriptionDurationPayload,
  TranslateDurationPayload,
} from "../../models";
import { request } from "../../utils";
import { DurationServiceEndpoints } from "./endpoints";

export async function servicePredictTranscription(
  payload: TranscriptionDurationPayload
) {
  const resp = await request<DurationResponse>({
    endpoint: DurationServiceEndpoints.PREDICT_TRANSCRIPTION,
    method: "POST",
    body: payload,
  });
  return resp;
}

export async function servicePredictTranslation(
  payload: TranslateDurationPayload
) {
  const resp = await request<DurationResponse>({
    endpoint: DurationServiceEndpoints.PREDICT_TRANSLATION,
    method: "POST",
    body: payload,
  });
  return resp;
}

export async function servicePredictDownload(payload: DownloadDurationPayload) {
  const resp = await request<DurationResponse>({
    endpoint: DurationServiceEndpoints.PREDICT_DOWNLOAD,
    method: "POST",
    body: payload,
  });
  return resp;
}
