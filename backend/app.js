// Plesk Phusion Passenger uyumluluk köprüsü
(async () => {
  try {
    await import("./dist/server.js");
  } catch (err) {
    console.error("[Passenger Startup Error]:", err);
    process.exit(1);
  }
})();
