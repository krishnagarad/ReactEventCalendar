import React from "react";
import { Tab, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TabItem = ({ label, icon, onClose, isActive, onClick }) => {
  return (
    <Tab
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          {icon}
          <span style={{ marginLeft: 4 }}>{label}</span>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            sx={{ ml: 1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      }
      onClick={onClick}
      value={label}
      selected={isActive}
    />
  );
};

export default TabItem;