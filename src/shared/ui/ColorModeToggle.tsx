"use client";

import * as React from "react";
import { useColorScheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

type Mode = "system" | "light" | "dark";

export default function ColorModeToggle() {
  const { mode, setMode } = useColorScheme();

  // 첫 렌더에서 mode가 undefined일 수 있어 가드
  const value = (mode ?? "system") as Mode;

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    next: Mode | null
  ) => {
    if (!next) return;
    setMode(next);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={value}
        onChange={handleChange}
        aria-label="color mode"
      >
        <ToggleButton value="system">System</ToggleButton>
        <ToggleButton value="light">Light</ToggleButton>
        <ToggleButton value="dark">Dark</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
