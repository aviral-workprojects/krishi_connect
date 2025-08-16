import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Kisan Bazaar",
      login: "Login",
      register: "Register",
      crops: "Crops",
      marketplace: "Marketplace",
      dashboard: "Dashboard",
      checkout: "Checkout",
      leaderboard: "Leaderboard"
    }
  },
  hi: {
    translation: {
      welcome: "किसान बाज़ार में आपका स्वागत है",
      login: "लॉगिन",
      register: "रजिस्टर",
      crops: "फ़सलें",
      marketplace: "बाज़ार",
      dashboard: "डैशबोर्ड",
      checkout: "चेकआउट",
      leaderboard: "सर्वश्रेष्ठ किसान"
    }
  },
  gu: {
    translation: {
      welcome: "કિસાન બજારમાં આપનું સ્વાગત છે",
      login: "પ્રવેશ કરો",
      register: "રજીસ્ટર",
      crops: "પાકો",
      marketplace: "બજાર",
      dashboard: "ડેશબોર્ડ",
      checkout: "ચેકઆઉટ",
      leaderboard: "શ્રેષ્ઠ ખેડૂત"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
