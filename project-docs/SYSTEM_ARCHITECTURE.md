# SYSTEM ARCHITECTURE: AI-DRIVEN SMART WELFARE RESOURCE MANAGEMENT SYSTEM

**Document Purpose:** Detailed technical architecture specification, component interaction flows, and system topologies.  
**Version:** 1.0.0  

---

## 1. High-Level Architectural Topology

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Presentation Tier (Browser)"]
        UI["Next.js 16 Web Application"]
        State["DataStore Context + Role Context"]
        Theme["Tailwind CSS v4 + Theme Engine"]
    end

    subgraph AppServer ["Application Server Tier (Next.js App Router)"]
        Routes["Server & Client Page Routes"]
        AdapterFactory["AI Adapter Factory (getAIAdapter)"]
        SSRSession["Supabase SSR Session Handler"]
    end

    subgraph ExternalAI ["AI/ML Microservice Tier (Python 3.10+)"]
        FastAPI["FastAPI ASGI Server (Uvicorn)"]
        DemandModel["RandomForest / XGBoost Regressor"]
        HealthModel["MLPClassifier + SHAP Explainer"]
    end

    subgraph DataTier ["Cloud Persistence Tier (Supabase)"]
        AuthService["Supabase Auth (JWT & GoTrue)"]
        PG["PostgreSQL 15 Relational Database"]
        RLS["Row Level Security Engine"]
        Storage["Supabase Storage (Receipts & Reports)"]
    end

    UI -->|Interacts| State
    State -->|Calls| AppServer
    AdapterFactory -->|HTTP Mode: remote| FastAPI
    FastAPI -->|Runs Inference| DemandModel
    FastAPI -->|Runs Inference| HealthModel
    SSRSession -->|Verifies JWT| AuthService
    State -->|Queries / Mutations| PG
    PG -->|Enforces Policies| RLS
```

---

## 2. Key Data Workflows

### 2.1 AI Resource Demand Forecasting Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Superintendent as Institution Staff
    participant UI as Next.js Forecasting UI (/resources)
    participant Factory as AI Adapter Factory
    participant Microservice as Python FastAPI (/predict/resource-demand)
    participant DB as PostgreSQL (predictions table)

    Superintendent->>UI: Selects Institution, Resident Count, Season & Festival Toggle
    UI->>Factory: Requests forecast via getAIAdapter()
    alt Mode == 'remote' & Service Online
        Factory->>Microservice: POST JSON payload
        Microservice-->>Factory: Returns Predicted Values + Contributing Factors
    else Mode == 'demo' or Service Unreachable
        Factory-->>UI: Generates Deterministic Demo Forecast with is_synthetic=true
    end
    UI->>DB: Stores prediction snapshot in `predictions` audit log
    UI-->>Superintendent: Displays forecasted kg / kits / budget with confidence interval
```

### 2.2 Deep Learning Health-Risk Triage Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Doctor as Licensed Physician
    participant UI as Health Vault UI (/health)
    participant AI as Health Classification Pipeline
    participant DB as PostgreSQL (alerts & medical_records)

    Doctor->>UI: Enters / Reviews Beneficiary Vitals (BP, Glucose, BMI, Meds)
    UI->>AI: Executes classifyHealthRisk(vitals, weights)
    AI-->>UI: Returns Risk Class, Priority Score (0-100), SHAP Factors & Disclaimer
    opt Priority Score >= 70 (Critical Threshold)
        UI->>DB: Automatically inserts Alert record with severity='high'
        DB-->>UI: Dispatches in-app notification to Doctor Queue
    end
    UI-->>Doctor: Renders clinical decision-support card with SHAP contribution breakdown
```

### 2.3 Transparent Donation Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pledged: Donor pledges monetary or in-kind contribution
    Pledged --> Received: Care home confirms receipt of funds/goods
    Received --> Allocated: Superintendent allocates funds to specific inventory need
    Allocated --> Utilized: Goods distributed to residents with audit receipt
    Utilized --> [*]
```

---

## 3. Resilience, Fault Tolerance & Offline Mode

1. **Dual-Mode Adapter Fallback:** The web app never crashes if the Python AI microservice is offline or experiencing network latency. `RemoteAIAdapter` wraps all HTTP calls in a `try...catch` block with a 5000ms timeout, automatically delegating to `DemoAIAdapter` upon network failure.
2. **Local Client Fallback for Development:** When Supabase environment variables are missing or unconfigured, the application runs cleanly using synthetic in-memory demo datasets, allowing developers to review every UI screen and workflow without blocking on cloud credentials.
3. **Zero External Font / Asset Hard-Dependencies:** System fonts (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`) are utilized natively in CSS to ensure offline compiling and sandboxed security compliance.
