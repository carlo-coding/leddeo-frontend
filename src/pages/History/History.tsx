import { Box, Typography } from "@mui/material";
import { Layout } from "../../components";
import { useEffect } from "react";
import { getHistory } from "../../features";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { HistoryActions } from "../../models";

function History() {
  const history = useAppSelector((state) => state.history.data);
  const dispatch = useAppDispatch();
  const historyPage = useAppSelector(
    (state) => state.lang.pageLanguage.pages.history
  );

  function convertDate(dateString: string) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  useEffect(() => {
    dispatch(getHistory());
  }, []);

  const actions = {
    [HistoryActions.SUBTITLE_TRANSLATE]: historyPage.subtitleTranslate,
    [HistoryActions.VIDEO_CAPTION]: historyPage.videoCaption,
  };

  return (
    <Layout>
      <Box
        sx={{
          background: "white",
          flexGrow: 1,
          display: "flex",
          placeItems: "center",
          justifyContent: "center",
          padding: "25px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "layout.lightGray",
            flexGrow: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",

            alignItems: "center",
            gap: "25px",
            padding: "25px",
          }}
        >
          {history.map((h) => (
            <Box
              key={`user-history-${h.id}`}
              sx={{
                padding: "15px",
                border: "1px solid",
                borderColor: "layout.darkGray",
                borderRadius: "3px",
                width: "100%",
              }}
            >
              <Typography>{convertDate(h.created_at)}</Typography>
              <Typography>{actions[h.action]}</Typography>
              <Typography>{h.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
}
export default History;
