# Cold Storage Reference Price Framework

## Purpose

This framework defines a **fair-price band** for cold-storage commodity transactions (e.g., potato, onion, apple). It combines a market-anchored base price with adjustments for supply/demand, storage costs, seasonality, market sentiment, and quality — then wraps the result in a volatility buffer to produce an enforceable price corridor.

---

## 1. Reference Price — Overall Formula

```
REFERENCE_PRICE = BASE_PRICE
                 + SUPPLY_DEMAND_ADJUSTMENT
                 + STORAGE_COST_RECOVERY
                 + SEASONAL_ADJUSTMENT
                 + SENTIMENT_ADJUSTMENT
                 + QUALITY_ADJUSTMENT
```

Each term is calculated below.

---

## 2. Base Price

Blends three market signals: the government support floor, recent local trading, and the broader state market.

```
BASE_PRICE = (W₁ × MSP) + (W₂ × LOCAL_MODAL_7DAY) + (W₃ × STATE_AVG)
```

| Component | Definition |
|---|---|
| **MSP** | Minimum Support Price (govt. floor, if one exists for the commodity) |
| **LOCAL_MODAL_7DAY** | 7-day average of daily modal (most common) local price |
| **STATE_AVG** | Average modal price across all districts in the state |

**Weights (W₁+W₂+W₃ = 1):**

| Scenario | W₁ (MSP) | W₂ (Local) | W₃ (State) |
|---|---|---|---|
| MSP exists | 0.30 | 0.40 | 0.30 |
| No MSP | 0 | 0.60 | 0.40 |

---

## 3. Supply–Demand Adjustment

Adjusts price based on how stock compares to expected demand — more stock relative to demand pulls price down, and vice versa.

```
SUPPLY_DEMAND_ADJUSTMENT = BASE_PRICE × [(SD_RATIO − 5.5) × (−0.03)]

SD_RATIO = TOTAL_STOCK_QUINTAL / WEEKLY_DEMAND_QUINTAL
```

- **TOTAL_STOCK_QUINTAL** = sum of stock across all cold storages
- **WEEKLY_DEMAND_QUINTAL** = `[(URBAN_POP × 0.180) + (RURAL_POP × 0.153)] / 100` (potato-specific coefficients; adjust per commodity)
- **Cap:** adjustment is capped at **±30% of BASE_PRICE**

---

## 4. Storage Cost Recovery

Compensates the storage operator for holding costs and expected spoilage/quality loss over time.

```
STORAGE_COST_RECOVERY = STORAGE_COST_BASIC + QUALITY_LOSS_COST
```

**a) Basic storage cost:**
```
STORAGE_COST_BASIC = (STORAGE_DAYS / 30) × MONTHLY_RATE × 1.15
```
| Commodity | Monthly Rate (₹/quintal) |
|---|---|
| Potato | 250 |
| Onion | 200 |
| Apple | 400 |

**b) Quality/degradation loss cost:**
```
QUALITY_LOSS_COST = BASE_PRICE × DEGRADATION_RATE × (STORAGE_DAYS / 180)
```
| Commodity | Degradation Rate |
|---|---|
| Potato | 0.08 |
| Onion | 0.12 |
| Apple | 0.05 |
| Grapes | 0.04 |

---

## 5. Seasonal Adjustment

Reflects predictable seasonal demand swings (harvest gluts, festival demand, etc.).

```
SEASONAL_ADJUSTMENT = BASE_PRICE × (SEASONAL_INDEX_month − 1)
```
- SEASONAL_INDEX is looked up per month × commodity (typical range **0.85–1.30**), derived from historical consumption and the festival calendar.

---

## 6. Sentiment Adjustment

Captures forward-looking market sentiment from futures pricing, policy actions, and weather events.

```
SENTIMENT_ADJUSTMENT = BASE_PRICE × (SENTIMENT_INDEX − 1)

SENTIMENT_INDEX = (0.30 × FUTURES) + (0.40 × POLICY) + (0.30 × WEATHER)
```

**Futures component:**
```
FUTURES = 1 + [(FUTURES_PRICE − SPOT_PRICE) / SPOT_PRICE] × 0.5   (bounded 0.90–1.15)
```

**Policy component:** `POLICY = 1 + Σ(Policy_Impact)`
| Event | Impact |
|---|---|
| Export Ban | −0.05 |
| Import Allowed | −0.10 |
| Stock Limit | −0.08 |
| MSP Rise | +0.03 |

**Weather component:** `WEATHER = 1 + Σ(Weather_Event_Impact)`
| Event | Impact |
|---|---|
| Excess Rain | −0.15 |
| Drought | −0.20 |
| Heat Wave | −0.10 |
| Hail | −0.25 |

---

## 7. Quality Adjustment

Applied last, scaling the accumulated price by produce grade.

```
QUALITY_ADJUSTMENT = PRICE_BEFORE_QUALITY × (GRADE_FACTOR − 1)
```
| Commodity | Grade A | Grade B | Grade C |
|---|---|---|---|
| Potato | 1.00 | 0.85 | 0.65 |
| Onion | 1.00 | 0.80 | 0.60 |
| Apple | 1.00 | 0.75 | 0.50 |

---

## 8. Volatility Buffer & Price Range

A buffer — sized by recent price volatility — is applied around the reference price to set a compliant trading band.

```
VOLATILITY_BUFFER = REFERENCE_PRICE × BUFFER_PCT

CV = STD_DEV(30-day prices) / MEAN(30-day prices)
```
| Coefficient of Variation (CV) | Buffer |
|---|---|
| < 0.10 | 5% |
| 0.10 – 0.20 | 8% |
| ≥ 0.20 | 12% |

**Resulting price range:**
```
MINIMUM_PRICE = REFERENCE_PRICE − VOLATILITY_BUFFER
MAXIMUM_PRICE = REFERENCE_PRICE + VOLATILITY_BUFFER

If MSP exists: MINIMUM_PRICE = MAX(MINIMUM_PRICE, MSP)   ← MSP is an absolute floor
```

---

## 9. Compliance & Enforcement

Every cold storage transaction must fall within the band:

```
MINIMUM_PRICE ≤ TRANSACTION_PRICE ≤ MAXIMUM_PRICE
```

| Violation | Penalty |
|---|---|
| Price **below** minimum (farmer exploitation) | ₹50,000 + (Quantity × ₹10/quintal) |
| Price **above** maximum (consumer exploitation) | ₹100,000 + (Quantity × ₹20/quintal) + mandatory stock release |

---

## Calculation Order (Summary Flow)

1. Compute **Base Price** from MSP / local / state prices
2. Apply **Supply-Demand**, **Storage Cost**, **Seasonal**, **Sentiment**, and **Quality** adjustments in sequence to arrive at **Reference Price**
3. Compute **Volatility Buffer** from 30-day price CV
4. Derive **Min/Max Price** band (respecting MSP floor)
5. Validate transaction price against the band; apply penalties if breached
