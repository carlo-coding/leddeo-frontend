import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  serviceGetVideoSubtitles,
  serviceSubtitleVideo,
  serviceTranslateSubtitles,
} from "../../services";
import { enqueueSnackbar } from "notistack";
import { TSubtitleState } from "./interfaces/SubtitleState";
import { TSubtitleItem } from "../../models/responses";

export const getVideoSubtitles = createAsyncThunk(
  "video/getVideoSubtitles",
  async (video: File, { rejectWithValue }) => {
    const [resp, error] = await serviceGetVideoSubtitles(video);
    if (error !== null) {
      error.message && enqueueSnackbar(error.message, { variant: "error" });
      return rejectWithValue(error);
    }
    return resp || [];
  }
);

export const downloadCaptionVideo = createAsyncThunk(
  "video/downloadCaptionVideo",
  async (payload: {
    file: File;
    srt: string;
    style: TSubtitleState["style"];
  }) => {
    const [, error] = await serviceSubtitleVideo(payload);
    if (error !== null) {
      enqueueSnackbar(error.message, { variant: "error" });
      return;
    }
  }
);

export const translateSubtitles = createAsyncThunk(
  "language/translateSubtitles",
  async (
    payload: { subtitles: TSubtitleItem[]; langCode: string },
    { rejectWithValue }
  ) => {
    const [resp, error] = await serviceTranslateSubtitles(payload);
    if (error !== null) {
      enqueueSnackbar(error.message, { variant: "error" });
      return rejectWithValue(error);
    }
    return resp;
  }
);
