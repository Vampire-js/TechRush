import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'

const manifest = {
  registerType: "prompt",
  includeAssets: ['favicon.ico', "apple-touc-icon.png", "masked-icon.png" ],
  manifest: {
    name: "SoundSpace",
    short_name: "SoundSpace",
    icons: [
      
      {
        src: "./android-chrome-512x512.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "./android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose:'favicon'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes:'180x180',
        type:'image/png',
        purpose:'apple touch icon',
      },
      {
        src: "./android-chrome-512x512.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "./android-chrome-512x512.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "icon"
      },
      {
        src: "./android-chrome-512x512.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    theme_color: "#181818",
    background_color: "#242424ff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "landscape",
  },
};

export default defineConfig({
  
  plugins: [VitePWA(manifest)],
});