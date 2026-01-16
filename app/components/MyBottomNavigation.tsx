"use client"; // if using Next.js 13+ app directory

import { useState } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeFilled from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRouter } from "next/navigation"; // for client-side navigation

export default function MyBottomNav() {
  const [value, setValue] = useState(0);
  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    // Navigate based on selected tab
    switch (newValue) {
      case 0:
        router.push("/home");
        break;
      case 1:
        router.push("/favorites");
        break;
      case 2:
        router.push("/nearby");
        break;
    }
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction label="Home" icon={<HomeFilled />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
