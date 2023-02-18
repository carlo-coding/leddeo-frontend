import { createAsyncThunk } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import {
  DownloadDurationPayload,
  DurationResponse,
  TranscriptionDurationPayload,
  TranslateDurationPayload,
} from "../../models";
import {
  servicePredictDownload,
  servicePredictTranscription,
  servicePredictTranslation,
} from "../../services";

export const getTranscripDuration = createAsyncThunk<
  DurationResponse | null,
  TranscriptionDurationPayload
>("duration/getTranscripDuration", async (payload) => {
  const [response, error] = await servicePredictTranscription(payload);
  if (error !== null) {
    enqueueSnackbar(error.message, { variant: "error" });
  }
  return response;
});

export const getTranslateDuration = createAsyncThunk<
  DurationResponse | null,
  TranslateDurationPayload
>("duration/getTranslationDuration", async (payload) => {
  const [response, error] = await servicePredictTranslation(payload);
  if (error !== null) {
    enqueueSnackbar(error.message, { variant: "error" });
  }
  return response;
});

export const getDownloadDuration = createAsyncThunk<
  DurationResponse | null,
  DownloadDurationPayload
>("duration/getDownloadDuration", async (payload) => {
  const [response, error] = await servicePredictDownload(payload);
  if (error !== null) {
    enqueueSnackbar(error.message, { variant: "error" });
  }
  return response;
});
