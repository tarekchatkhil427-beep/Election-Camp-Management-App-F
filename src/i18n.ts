import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Academic and Business Standard Bangla Translations
const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Org Tree": "Org Tree",
      "Org Settings": "Org Settings",
      "Voter Database": "Voter Database",
      "Tasks & Events": "Tasks & Events",
      "Community Issues": "Community Issues",
      "Social Media": "Social Media",
      "Messages": "Messages",
      "Activity": "Activity",
      "Settings": "Settings",
      "Search Wards, Tasks, Issues...": "Search Wards, Tasks, Issues...",
      "Quick Create": "Quick Create",
      "Theme": "Theme",
      "Language": "Language",
      "English": "English",
      "Bangla": "Bangla",
      "Light": "Light",
      "Dark": "Dark",
      "Campaign Overview": "Campaign Overview",
      "High-level metrics and operational status.": "High-level metrics and operational status.",
      "Total Wards": "Total Wards",
      "Total Houses": "Total Houses",
      "Volunteers": "Volunteers",
      "vs last month": "vs last month",
      "Open Issues": "Open Issues",
      "Needs attention": "Needs attention",
      "Active Tasks": "Active Tasks",
      "Upcoming Events": "Upcoming Events",
      "Pending Approvals": "Pending Approvals",
      "Voters Reached": "Voters Reached",
      "This week": "This week"
    }
  },
  bn: {
    translation: {
      "Dashboard": "ড্যাশবোর্ড (Dashboard)",
      "Org Tree": "প্রাতিষ্ঠানিক কাঠামো (Org Structure)",
      "Org Settings": "প্রাতিষ্ঠানিক সেটিংস (Org Settings)",
      "Voter Database": "ভোটার ডেটাবেস (Voter Database)",
      "Tasks & Events": "কার্যক্রম ও ইভেন্ট (Tasks & Events)",
      "Community Issues": "জনসাধারণের অভিযোগ (Community Issues)",
      "Social Media": "সামাজিক যোগাযোগ মাধ্যম (Social Media)",
      "Messages": "বার্তা (Messages)",
      "Activity": "কার্যকলাপ (Activity)",
      "Settings": "সেটিংস (Settings)",
      "Search Wards, Tasks, Issues...": "ওয়ার্ড, কার্যক্রম, সমস্যা অনুসন্ধান করুন...",
      "Quick Create": "দ্রুত তৈরি করুন (Quick Create)",
      "Theme": "থিম (Theme)",
      "Language": "ভাষা (Language)",
      "English": "English",
      "Bangla": "বাংলা",
      "Light": "লাইট (Light)",
      "Dark": "ডার্ক (Dark)",
      "Campaign Overview": "ক্যাম্পেইন ওভারভিউ (Campaign Overview)",
      "High-level metrics and operational status.": "উচ্চ-স্তরের মেট্রিক্স এবং অপারেশনাল স্থিতি (High-level metrics and operational status.)",
      "Total Wards": "মোট ওয়ার্ড (Total Wards)",
      "Total Houses": "মোট ঘর (Total Houses)",
      "Volunteers": "স্বেচ্ছাসেবক (Volunteers)",
      "vs last month": "গত মাসের তুলনায় (vs last month)",
      "Open Issues": "উন্মুক্ত সমস্যা (Open Issues)",
      "Needs attention": "মনোযোগ প্রয়োজন (Needs attention)",
      "Active Tasks": "সক্রিয় কাজ (Active Tasks)",
      "Upcoming Events": "আসন্ন ইভেন্ট (Upcoming Events)",
      "Pending Approvals": "অপেক্ষমাণ অনুমোদন (Pending Approvals)",
      "Voters Reached": "পৌঁছানো ভোটার (Voters Reached)",
      "This week": "এই সপ্তাহে (This week)"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
