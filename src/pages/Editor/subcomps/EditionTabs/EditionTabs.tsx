import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { SubtitleEditor } from "../../../../components";
import { StylesEditor } from "../../../../components/StylesEditor";
import { styled } from "@mui/material/styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{
        maxHeight: "100%",
        height: "100%",
        overflowY: "auto",
      }}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: "0.35em",
  padding: "0.9em 0.3em",
  backgroundColor: theme.palette.layout.darkGray,
  flex: 1,
  color: theme.palette.layout.white,
  "&.Mui-selected": {
    color: theme.palette.layout.white,
    background: theme.palette.layout.mediumGray,
  },
  /* "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  }, */
}));

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  padding: "10px 0",
  "& .MuiTabs-flexContainer": {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    gap: "10px",
  },
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#635ee7",
  },
});
export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        maxHeight: "76vh",
        display: "grid",
        gridTemplateRows: "1fr 6fr",
        "& .MuiTabs-indicator": {
          display: "none",
        },
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <StyledTab label="Subtítulos" {...a11yProps(0)} />
          <StyledTab label="Estilos" {...a11yProps(1)} />
        </StyledTabs>
      </Box>
      <TabPanel value={value} index={0}>
        <SubtitleEditor />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StylesEditor />
      </TabPanel>
    </Box>
  );
}
