import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// --- Mock Data Generators for Live Market Data ---

function getMockMarketData(crop: string) {
  const c = crop.toLowerCase();
  
  let msp = 0;
  let localModal = 0;
  let stateAvg = 0;
  let monthlyRate = 250; // default
  let degradationRate = 0.08;
  
  if (c.includes("potato")) {
    msp = 1200; // ₹/quintal
    localModal = 1350;
    stateAvg = 1300;
    monthlyRate = 250;
    degradationRate = 0.08;
  } else if (c.includes("onion")) {
    msp = 0; // No MSP
    localModal = 1800;
    stateAvg = 1750;
    monthlyRate = 200;
    degradationRate = 0.12;
  } else if (c.includes("apple")) {
    msp = 5000;
    localModal = 5500;
    stateAvg = 5200;
    monthlyRate = 400;
    degradationRate = 0.05;
  } else if (c.includes("grape")) {
    msp = 0;
    localModal = 4000;
    stateAvg = 4200;
    monthlyRate = 350;
    degradationRate = 0.04;
  } else {
    // Generic
    localModal = 2000;
    stateAvg = 2100;
    monthlyRate = 250;
  }

  return { msp, localModal, stateAvg, monthlyRate, degradationRate };
}

function getMockSupplyDemand(crop: string) {
  // Return random-ish but stable SD ratio between 4.0 and 7.0
  const base = crop.length % 3;
  const ratio = 4.5 + base; 
  return { sdRatio: ratio };
}

function getMockSentiment() {
  return {
    futuresPremium: 0.05, // 5% higher
    policyImpact: -0.02,
    weatherImpact: -0.05,
  };
}

function getSeasonalIndex(month: number) {
  // Peak during festival (Oct/Nov) = month 9,10
  if (month === 9 || month === 10) return 1.25;
  // Glut during harvest (March/April) = month 2,3
  if (month === 2 || month === 3) return 0.85;
  return 1.05; // Normal
}

export const calculateReferencePriceServer = createServerFn({ method: "GET" })
  .validator(
    z.object({
      crop: z.string(),
      tons: z.number(),
      days: z.number(),
      grade: z.enum(["A", "B", "C"]).default("A"),
      operatorBaseRate: z.number().optional(), // fallback
    })
  )
  .handler(async ({ data }) => {
    // 1. Fetch live market variables (mocked)
    const { msp, localModal, stateAvg, monthlyRate, degradationRate } = getMockMarketData(data.crop);
    
    // 2. Base Price
    let w1 = 0, w2 = 0, w3 = 0;
    if (msp > 0) {
      w1 = 0.30; w2 = 0.40; w3 = 0.30;
    } else {
      w1 = 0; w2 = 0.60; w3 = 0.40;
    }
    const basePrice = (w1 * msp) + (w2 * localModal) + (w3 * stateAvg);

    // 3. Supply-Demand Adjustment
    const { sdRatio } = getMockSupplyDemand(data.crop);
    let sdAdjustment = basePrice * ((sdRatio - 5.5) * -0.03);
    const maxSdAdj = basePrice * 0.30;
    sdAdjustment = Math.max(-maxSdAdj, Math.min(maxSdAdj, sdAdjustment));

    // 4. Storage Cost Recovery
    const storageDays = data.days;
    // Use operator base rate if provided, otherwise standard monthly rate converted to daily
    const ratePerQuintalDay = data.operatorBaseRate ? (data.operatorBaseRate / 10) : (monthlyRate / 30);
    const storageCostBasic = storageDays * ratePerQuintalDay * 1.15;
    const qualityLossCost = basePrice * degradationRate * (storageDays / 180);
    const storageCostRecovery = storageCostBasic + qualityLossCost;

    // 5. Seasonal Adjustment
    const currentMonth = new Date().getMonth();
    const seasonalIndex = getSeasonalIndex(currentMonth);
    const seasonalAdjustment = basePrice * (seasonalIndex - 1);

    // 6. Sentiment Adjustment
    const { futuresPremium, policyImpact, weatherImpact } = getMockSentiment();
    let futures = 1 + (futuresPremium * 0.5);
    futures = Math.max(0.90, Math.min(1.15, futures));
    const policy = 1 + policyImpact;
    const weather = 1 + weatherImpact;
    const sentimentIndex = (0.30 * futures) + (0.40 * policy) + (0.30 * weather);
    const sentimentAdjustment = basePrice * (sentimentIndex - 1);

    // Accumulated Price Before Quality
    const priceBeforeQuality = basePrice + sdAdjustment + storageCostRecovery + seasonalAdjustment + sentimentAdjustment;

    // 7. Quality Adjustment
    let gradeFactor = 1.0;
    const c = data.crop.toLowerCase();
    if (data.grade === "B") {
      gradeFactor = c.includes("onion") ? 0.80 : c.includes("apple") ? 0.75 : 0.85;
    } else if (data.grade === "C") {
      gradeFactor = c.includes("onion") ? 0.60 : c.includes("apple") ? 0.50 : 0.65;
    }
    const qualityAdjustment = priceBeforeQuality * (gradeFactor - 1);

    // 8. Final Reference Price (per quintal)
    const referencePriceQuintal = priceBeforeQuality + qualityAdjustment;

    // 9. Volatility Buffer
    // Mock CV around 0.15 for now (8% buffer)
    const cv = 0.15; 
    let bufferPct = 0.08;
    if (cv < 0.10) bufferPct = 0.05;
    else if (cv >= 0.20) bufferPct = 0.12;

    const volatilityBuffer = referencePriceQuintal * bufferPct;
    let minPrice = referencePriceQuintal - volatilityBuffer;
    let maxPrice = referencePriceQuintal + volatilityBuffer;

    if (msp > 0) {
      minPrice = Math.max(minPrice, msp);
    }

    // Convert everything to TON (1 Ton = 10 Quintals)
    const totalQuintals = data.tons * 10;
    
    return {
      perQuintal: {
        basePrice,
        sdAdjustment,
        storageCostRecovery,
        seasonalAdjustment,
        sentimentAdjustment,
        qualityAdjustment,
        referencePrice: referencePriceQuintal,
        minPrice,
        maxPrice,
      },
      totalTransactionValue: referencePriceQuintal * totalQuintals,
      totalMinLimit: minPrice * totalQuintals,
      totalMaxLimit: maxPrice * totalQuintals,
      storageFeeTotal: storageCostRecovery * totalQuintals, // The portion that goes to the operator
    };
  });
