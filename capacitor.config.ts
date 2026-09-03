import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.granary.app",
  appName: "Granary",
  webDir: "dist",
  server: {
    androidScheme: "https",
    // In development, load from the local Vite dev server
    url: "http://10.0.2.2:8080",
    cleartext: true,
    allowNavigation: ["*"],
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
