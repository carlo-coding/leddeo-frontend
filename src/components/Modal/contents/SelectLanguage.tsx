import Box from "@mui/material/Box";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import languages from "../../../data/availableLanguages.json";
import { translateSubtitles } from "../../../features";
import { CButton } from "../../CButton";

function SelectLanguage() {
  const [selectedLang, setSelectedLang] = useState("es");
  const dispatch = useAppDispatch();
  const subtitles = useAppSelector((state) => state.subtitle.list);

  const handleTranslate = () => {
    dispatch(
      translateSubtitles({
        subtitles: subtitles,
        langCode: selectedLang,
      })
    );
  };

  const handleSelectLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLang(e.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        width: "200px",
      }}
    >
      <Box
        component="select"
        onChange={handleSelectLanguage}
        value={selectedLang}
        sx={{
          padding: "10px",
          backgroundColor: "layout.lightGray",
          color: "layout.veryDarkGray",
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </Box>

      <CButton onClick={handleTranslate}>Traducir</CButton>
    </Box>
  );
}
export default SelectLanguage;
