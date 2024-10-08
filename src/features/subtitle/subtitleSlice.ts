import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TSubtitleItem } from "../../models/responses";
import { IAsyncStatus } from "../common";
import { TSubtitleState } from "./interfaces/SubtitleState";
import {
  downloadCaptionVideo,
  getVideoSubtitles,
  translateSubtitles,
} from "./subtitleActions";

const initialState: TSubtitleState = {
  list: [
    {
      begin: 0,
      end: 5,
      id: "1",
      text: "Escribe aquí",
    },
  ],
  broken: [],
  currentId: undefined,
  status: IAsyncStatus.FULFILLED,
  style: {
    vAlign: "bottom",
    hAlign: "center",
    font: "roboto-medium",
    color: "rgb(255,255,255)",
    size: 20,
    bgcolor: "rgb(102,102,102)",
  },
};

const subtitleSlice = createSlice({
  name: "subtitle",
  initialState: initialState,
  reducers: {
    setSubtitleList(state, action: PayloadAction<TSubtitleItem[]>) {
      state.list = action.payload;
    },
    setCurrentSubtitleId(state, action: PayloadAction<string | undefined>) {
      state.currentId = action.payload;
    },
    updateSubtitleItem(state, action: PayloadAction<TSubtitleItem>) {
      state.list = state.list.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    updateBrokenSubtitleList(state, action: PayloadAction<TSubtitleItem>) {
      const foundSubtitle = state.broken.find(
        (b) => b.id === action.payload.id
      );
      if (foundSubtitle) {
        state.broken = state.broken.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      } else {
        state.broken = [...state.broken, action.payload];
      }
    },
    updateSubtitleList(state, action: PayloadAction<TSubtitleItem[]>) {
      state.list = state.list.map((item) => {
        const foundSub = action.payload.find((p) => p.id === item.id);
        if (foundSub) return foundSub;
        return item;
      });
      state.broken = [];
    },
    removeSubtitleItem(state, action: PayloadAction<string>) {
      const newList = state.list.filter((item) => item.id !== action.payload);
      if (newList.length === 0) return;
      state.list = newList;
      state.broken = [];
    },
    addSubtitleItemAfterAnother(state, action: PayloadAction<string>) {
      const item = state.list.find((i) => i.id === action.payload);
      if (!item) return;
      const index = state.list.findIndex((i) => i.id === item.id);
      const subtitlesPart1 = state.list.slice(0, index); // this will cut "item"
      const subtitlesPart2 = state.list.slice(index + 1, state.list.length);
      const end = item.end;
      item.end = end / 2;
      const newSubtitle = {
        id: Math.random().toString().slice(2),
        begin: item.end,
        end: end,
        text: "",
      };
      state.list = [...subtitlesPart1, item, newSubtitle, ...subtitlesPart2];
    },
    addEmptySubtitleItem(state) {
      const end = state.list[state.list.length - 1]?.end ?? 0;
      state.list.push({
        id: Math.random().toString().slice(2),
        begin: end,
        end: end + 5,
        text: "",
      });
    },
    setSubtitleStyle(state, action: PayloadAction<TSubtitleState["style"]>) {
      state.style = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getVideoSubtitles.fulfilled,
      (state, action: PayloadAction<TSubtitleItem[] | undefined>) => {
        if (action.payload) {
          state.list = action.payload;
        }
        state.status = IAsyncStatus.FULFILLED;
      }
    );
    builder.addCase(getVideoSubtitles.pending, (state) => {
      state.status = IAsyncStatus.PENDING;
    });
    builder.addCase(getVideoSubtitles.rejected, (state) => {
      state.status = IAsyncStatus.FAILED;
    });
    builder.addCase(downloadCaptionVideo.fulfilled, (state) => {
      state.status = IAsyncStatus.FULFILLED;
    });
    builder.addCase(downloadCaptionVideo.pending, (state) => {
      state.status = IAsyncStatus.PENDING;
    });
    builder.addCase(translateSubtitles.pending, (state) => {
      state.status = IAsyncStatus.PENDING;
    });
    builder.addCase(translateSubtitles.rejected, (state) => {
      state.status = IAsyncStatus.FAILED;
    });
    builder.addCase(translateSubtitles.fulfilled, (state, action) => {
      state.status = IAsyncStatus.FULFILLED;
      if (!action.payload) return;
      state.list = action.payload;
    });
  },
});

export const {
  removeSubtitleItem,
  setSubtitleList,
  updateSubtitleItem,
  updateSubtitleList,
  addEmptySubtitleItem,
  setSubtitleStyle,
  addSubtitleItemAfterAnother,
  updateBrokenSubtitleList,
  setCurrentSubtitleId,
} = subtitleSlice.actions;

export default subtitleSlice.reducer;
