import React, { useRef } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
interface FileUploadProps {
  onFilesAdded: (files: (File | null)[]) => void;
  title?: string;
  subtitle?: string;
  subbutton?: string;
  children?: React.ReactNode;
  backwards?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesAdded,
  children,
  subbutton,
  subtitle,
  title,
  backwards,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFilesAddedToQueue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesAdded(Array.from(event.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      const files = Array.from(event.dataTransfer.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile());
      onFilesAdded(files);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="upload-area" onDrop={onDrop} onDragOver={onDragOver}>
      {backwards && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "12px",
            color: "#0F62FE",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/${backwards}`)}
        >
          <ArrowBackIosIcon sx={{ fontSize: "15px" }} />
          <span>Regresar</span>
        </Box>
      )}

      {title && <p className="upload-title">{title}</p>}
      {subtitle && <p className="upload-subtitle">{subtitle}</p>}

      <button onClick={openFileDialog} className="upload-button">
        {children}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={onFilesAddedToQueue}
        style={{ display: "none" }}
      />
      {subbutton && <p className="upload-subbutton">{subbutton}</p>}
    </div>
  );
};

export default FileUpload;
