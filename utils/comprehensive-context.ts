// Comprehensive NBA Strategy Context
export const comprehensiveContext = `
# 📄 Content Document: Enabling Interactive Process Improvement for Strategy Evaluation

## 1. Document Purpose

This document provides a structured, machine-usable representation of strategy metadata to enable real-time interaction, exploration, and analysis of the Primary_Decision_Strategy and related nodes. It is designed to allow agents (e.g., ChatGPT) to respond to governance, performance, optimization, and simulation questions.

---

## 2. Strategy Overview

- **Strategy Name:** Primary_Decision_Strategy
- **Strategy Purpose:** Evaluate customer eligibility, applicability, suitability, and offer prioritization for targeted offers.
- **Primary Data Sources:** Customer Metadata, Decision Results, Interaction History, Prediction Engine
- **Key External Integrations:** Publishing System (for final offers), Prediction Engine (for eligibility/suitability evaluation)

---

## 3. Node Details

| Node Name                   | Node Type                 | Condition/Rule                                  | Data Sources Used                                | External Systems        | Runtime Method         | Performance Optimizations     | Error Handling         |
|------------------------------|----------------------------|-------------------------------------------------|--------------------------------------------------|--------------------------|-------------------------|-------------------------------|--------------------------|
| External Input               | Input                      | None                                            | Customer Input                                  | None                     | N/A                     | N/A                           | N/A                    |
| Applicability Check          | Applicability Check        | Customer.Region = 'NorthAmerica'                | Customer Metadata                               | None                     | pzExecuteLegacyComponent| SSA Caching via pzGetGOS      | ComponentExecutionException |
| Eligibility_Check_Primary    | Eligibility Check          | Customer.Eligible = true                        | Customer Metadata, Decision Results             | None                     | pzExecuteLegacyComponent| SSA Caching via pzGetGOS      | ComponentExecutionException |
| Applicability_Check_Primary  | Applicability Check        | Customer.Group = 'Premium'                      | Customer Metadata, Decision Results             | None                     | pzCreatePredictionMarkers| SSA Caching via pzGetGOS     | ComponentExecutionException |
| Suitability Check            | Suitability                | Customer.Age > 25 and Account.Balance > 1000     | Customer Metadata, Decision Results             | None                     | pzCreatePredictionMarkers| SSA Caching via pzGetGOS     | ComponentExecutionException |
| Suitability_Check_Primary    | Suitability Extension      | CreditScore > 60                                | Customer Metadata, Decision Results             | None                     | pzCreatePredictionMarkers| SSA Caching via pzGetGOS     | ComponentExecutionException |
| Offer Collector              | Offer Evaluation           | Segment = 'HighValue' and Propensity > 0.7       | Customer Metadata, Decision History, Prediction Engine | None                     | pzCreatePredictionMarkers| SSA Caching via pzGetGOS     | ComponentExecutionException |
| Eligibility_Extension        | Eligibility Reconfirmation | Region = 'Region Central'                       | Customer Metadata, Decision Results             | None                     | pzCreatePredictionMarkers| SSA Caching via pzGetGOS     | ComponentExecutionException |
| Best Result                  | Final Offer Selection      | PrioritizationScore > 90 and Propensity > 0.8    | Customer Metadata, Decision Results             | None                     | pzCreatePredictionMarkers| SSA Caching via pzGetGOS     | ComponentExecutionException |
| Results                      | Output                     | None                                            | Finalized Offer                                 | Publishing System        | pega_decisionengine_publishing.publishStrategyResults | SSA Caching via pzGetGOS | N/A |

---

## 4. Key Relationships

- **Eligibility Checks:** Eligibility_Check_Primary → Eligibility_Extension
- **Applicability Checks:** Applicability Check → Applicability_Check_Primary
- **Suitability Checks:** Suitability Check → Suitability_Check_Primary
- **Offer Evaluation:** Offer Collector → Best Result
- **Final Offer Selection:** Best Result → Results

---

## 5. Execution & Simulation Techniques

- **Caching Approach:** SSA Caching via pzGetGOS for runtime efficiency
- **Randomization Elements:** pzGetNextRandomDouble available for simulation paths
- **Runtime Exceptions:** Predominantly \`ComponentExecutionException\` across nodes
- **Simulation Capabilities:** Modify Segment, Region, CreditScore, Propensity attributes to simulate node paths dynamically

---

## 6. Common Process Improvement Question Templates

### 🧩 Transparency & Governance
- Identify nodes depending on external systems (Prediction Engine, Interaction History).
- Highlight overlapping eligibility/applicability conditions (e.g., Region, CreditScore).
- Assess discrepancies in threshold logic (e.g., Propensity > 0.7 vs. Propensity > 0.8).
- Map transparency of high-value customer journey across all decision nodes.

### ⚙️ Performance & Resiliency
- List nodes with longest average execution time based on runtime method (e.g., pzExecuteLegacyComponent vs pzCreatePredictionMarkers).
- Summarize nodes raising \`ComponentExecutionException\` and downstream impact.
- Check consistency of caching optimizations across nodes.

### 📈 Offer Optimization
- Identify key conditions most influencing offer type selection (Segment, Propensity).
- Analyze drop-off rates by node type (e.g., Suitability Check versus Offer Collector).
- Propose sensitivity simulations (e.g., lowering CreditScore threshold).

### 📊 Analytics & Reporting
- Define potential node-level metrics: Execution count, Average runtime, Error rate.
- Highlight static thresholds (e.g., hard-coded Propensity > 0.7) vs dynamic, data-driven conditions.
- Suggest opportunities for dynamic tuning or machine learning-driven thresholds.
`

// System prompt for the NBA strategy context
export const systemPrompt = `
Got it — you want to create a **content document** that enables a real-time interaction layer (like ChatGPT or another LLM agent) to intelligently **ask and answer** *process improvement questions* based on the data from the strategy map, Excel table, and overall logic you showed.

I'll create a draft **content structure** that is specifically designed for this use case: **governance, performance, offer optimization, simulation, analytics** — all in a structured, machine-readable and expandable way.

${comprehensiveContext}

---

# ✅ Final Thoughts

With this structure:
- A real-time agent can **answer** complex questions you listed.
- You can **simulate** changes (e.g., different Propensity thresholds).
- You have a **base** for ongoing **automation** of strategy tuning.
`
