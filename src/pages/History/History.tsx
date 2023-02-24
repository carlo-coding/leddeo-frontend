import { Box, Typography } from "@mui/material";
import { Layout } from "../../components";
import { useEffect, useState } from "react";
import { apiPrefix, apiUrl, formatDate, getCookie } from "../../utils";
import { IHistory } from "../../models";

function History() {
  const [history, setHistory] = useState<IHistory[]>([]);

  useEffect(() => {
    (async () => {
      const resp = await fetch(`${apiUrl}${apiPrefix}/plans/invoices`, {
        headers: {
          authorization: `Bearer ${getCookie("access")}`,
        },
      });
      const data = await resp.json();
      setHistory(data.data);
    })();
  }, []);

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
                "& span": {
                  padding: "0 0.5em",
                },
              }}
            >
              <Typography>
                Fecha de creación <span>{formatDate(h.created)}</span>
              </Typography>
              <Typography>
                Balance final <span>{h.ending_balance / 100}</span>
              </Typography>
              <Typography>
                Moneda <span>{h.currency}</span>
              </Typography>
              <Typography>
                Estado <span>{h.status}</span>
              </Typography>
              <div>
                <a target="_blank" href={h.hosted_invoice_url}>
                  Ver más
                </a>
              </div>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
}
export default History;
