import { TextField } from "@mui/material";
import React from "react";

const InputField = ({ label, value, onValueChange,type="text" }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      type={type}
      value={value}
      onChange={(e) => onValueChange(e)}
    />
  );
};

export default InputField;