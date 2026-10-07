export const settings = {
  appStore:
    "https://apps.apple.com/ru/app/bukago-%D1%80%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9-%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C/id6793059749",
  googlePlay:
    "https://play.google.com/store/apps/details?id=com.baysic&pcampaignid=web_share",
  telegram: "https://t.me/basic_edtech",
  metrikaId: Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || 110909899),
  analyticsHosts: (
    process.env.NEXT_PUBLIC_ANALYTICS_HOSTS || "bukago.app,www.bukago.app"
  )
    .split(",")
    .map((s) => s.trim()),
  newsletterEndpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || "",
};
