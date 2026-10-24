import { Router } from "express";
import { getExchangeRates } from "../services/tcmb.js";

export const exchangeRatesRouter = Router();

exchangeRatesRouter.get("/", async (_req, res) => {
  try {
    const data = await getExchangeRates();
    res.setHeader("Cache-Control", "public, max-age=300"); // 5 dakika HTTP cache
    return res.json(data);
  } catch (error) {
    console.error("[Exchange Rates Error]:", error);
    return res.status(500).json({ error: "Kur bilgileri alınamadı." });
  }
});
