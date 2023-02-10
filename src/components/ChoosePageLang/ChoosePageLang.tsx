import { Box, Popover } from "@mui/material";
import React from "react";

function ChoosePageLang() {
  const availableLangs = [
    {
      countryCode: "GB",
      languageCode: "en",
      description: "English",
    },
    {
      countryCode: "ES",
      languageCode: "es",
      description: "Español",
    },
    {
      countryCode: "PT",
      languageCode: "pt",
      description: "Português",
    },
    {
      countryCode: "FR",
      languageCode: "fr",
      description: "Français",
    },
  ];

  const [lang, setLang] = React.useState({
    countryCode: "ES",
    languageCode: "es",
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <React.Fragment>
      <Box
        component="button"
        onClick={handleClick}
        sx={{
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          display: "flex",
          padding: 0,
          overflow: "hidden",
          "& > img": {
            objectFit: "cover",
            width: "100%",
            height: "100%",
          },
        }}
      >
        <img
          loading="lazy"
          width="50"
          src={`https://flagcdn.com/w80/${lang.countryCode.toLowerCase()}.png`}
          alt={lang.countryCode.toLowerCase()}
        />
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {availableLangs.map((al) => (
          <Box
            sx={{
              cursor: "pointer",
              padding: "0.3em 0.5em",
            }}
            onClick={() => {
              setLang(al);
              handleClose();
            }}
            key={al.countryCode}
          >
            {al.description}
          </Box>
        ))}
      </Popover>
    </React.Fragment>
  );
}
export default ChoosePageLang;
