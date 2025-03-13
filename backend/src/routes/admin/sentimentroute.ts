// src/routes/sentiment.route.ts

import express, { Request, Response } from "express";
import axios from "axios";

const sentimentrouter = express.Router();

sentimentrouter.post("/", async (req: Request, res: Response) => {
  try {
    const { comment } = req.body;

    const response = await axios.post("https://sentiment-analysis-main.onrender.com/analysis", {
      comment,
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Sentiment analysis error:", error.message);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});

export default sentimentrouter ;
