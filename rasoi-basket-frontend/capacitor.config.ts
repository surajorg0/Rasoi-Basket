import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rasoibasket.app',
  appName: 'Rasoi Basket',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: true, // Allow HTTP connections for development
    allowNavigation: ['rasoi-basket-api.onrender.com', '*.mongodb.net']
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
