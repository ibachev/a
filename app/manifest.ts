import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cooking MK",
    short_name: "CookngMK",
    description: "A Progressive Web App built with Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/image.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/image.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
