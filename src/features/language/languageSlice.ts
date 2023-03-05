import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import english from "../../data/langs/english.json";
import spanish from "../../data/langs/spanish.json";
import { Languages } from "./interfaces";

const pageLanguages = {
  [Languages.EN]: english,
  [Languages.ES]: spanish,
};

export const langDetails = {
  [Languages.EN]: {
    countryCode: "GB",
    description: "English",
  },
  [Languages.ES]: {
    countryCode: "ES",
    description: "Español",
  },
};

function getPreferredLanguage(): Languages {
  return (localStorage.getItem("preferredLanguage") || "en") as any;
}

interface ILanguageState {
  preferredLanguage: Languages;
  pageLanguage: typeof pageLanguages[Languages.EN];
  details: typeof langDetails[Languages.EN];
}

const initialState: ILanguageState = {
  preferredLanguage: getPreferredLanguage(),
  pageLanguage: pageLanguages[getPreferredLanguage()],
  details: langDetails[getPreferredLanguage()],
};

const languageSlice = createSlice({
  name: "language",
  initialState: initialState,
  reducers: {
    setPreferredLanguage(state, action: PayloadAction<Languages>) {
      state.preferredLanguage = action.payload;
      state.pageLanguage = pageLanguages[action.payload];
      state.details = langDetails[action.payload];
      localStorage.setItem("preferredLanguage", action.payload);
    },
  },
});

export const { setPreferredLanguage } = languageSlice.actions;

export default languageSlice.reducer;
