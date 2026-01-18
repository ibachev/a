"use client";

import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeFilled from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { useRouter, usePathname } from "next/navigation";

const routes = ["/home", "/favorites", "/nearby"];

export default function MyBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState(0);

  // 🔁 FOLLOW route changes
  useEffect(() => {
    const index = routes.findIndex((route) => pathname.startsWith(route));

    if (index !== -1 && index !== value) {
      setValue(index);
    }
  }, [pathname, value]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push(routes[newValue]);
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction label="Почетна" icon={<HomeFilled />} />
        <BottomNavigationAction label="Рецепти" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
