import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuempresa.appscan',
  appName: 'AppScan',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    icon: "src/assets/icon",
    iconForegroundSource: "src/assets/icon",
    iconBackgroundColor: "#FFFFFF"
  }
};

export default config;