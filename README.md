# Risk Insights Engine

Create a modern, sleek enterprise KRI (Key Risk Indicator) Monitoring & Processing Platform with a 4-screen workflow. Use Tailwind CSS, Lucide React icons, and smooth animations (e.g., Framer Motion style transitions).

### Application Architecture & Workflow

#### Screen 1: Scope Areas Grid

- Display a header: "Enterprise Scope Areas" with a subtitle "Select a domain to review and execute Key Risk Indicators".

- Grid of 5 enterprise cards:

  1. Order to Cash (O2C)

  2. Source to Pay (S2P) - Highlight this card with a subtle active glow or badge "Active Scope".

  3. Record to Report (R2R)

  4. Privacy

  5. Master Data

- Each card should show: Icon, Title, Description, Active KRIs count (e.g., "12 KRIs"), and a Risk Health Status Badge (Green/Yellow/Red).

- Clicking the "Source to Pay (S2P)" card navigates to Screen 2.

#### Screen 2: S2P KRI Dashboard

- Header: "Source to Pay (S2P) - KRI Management".

- Include a back button to return to Screen 1.

- Top Action Bar:

  - Search bar & Risk Level Filter dropdown.

  - "+ Add KRI" button (Navigates to Screen 3).

  - "Execute All KRIs" primary action button with a play icon (Triggers Screen 4 batch execution).

- Data Table of S2P KRIs:

  - Sample KRIs: "PO Creation without PR Approval", "Duplicate Vendor Payments", "Contract Price Variance Threshold", "Late Payment Interest Exposure".

  - Columns: KRI ID, Name, Category, Risk Threshold, Last Executed, Actions ("Execute", "View Details").

  - Clicking "Execute" on any single KRI or clicking "Execute All KRIs" transitions to Screen 4 with that execution context.

#### Screen 3: KRI Intake Screen

- Modern multi-step form to create a new KRI.

- Fields:

  - KRI Name, Scope Area Selection (Dropdown pre-selected to S2P), Risk Category (High/Medium/Low).

  - Data Source Selection (Dropdown: SAP S/4HANA, Ariba, Oracle, Document Upload).

  - Threshold Settings (Min/Max numeric rules).

  - Description & Mitigation Plan.

- Buttons: "Cancel" (returns to Screen 2) and "Save & Add KRI" (adds KRI to state and navigates back to Screen 2 with a toast notification).

#### Screen 4: Data Ingestion, Extraction & Real-Time Processing Workbench

- Reusable across all scope areas.

- Header showing current context (e.g., "S2P Execution Engine - PO Creation without PR Approval").

- Include a Back button to return to Screen 2.

- Split View Layout:

  - Left Column (Data Ingestion & Extraction):

    - Document & API Source Connection status cards (e.g., "SAP ERP API: Connected", "Invoices_Q3.pdf: Uploaded").

    - Extracted Data Preview table displaying fields like Entity Name, Amount, Date, Extracted Confidence Score (e.g., 98%).

  - Right Column (Live Execution Status Feed):

    - Display an animated progress stepper showing real-time execution states:

      Step 1: "Fetching Document..." (Show pulsing loader)

      Step 2: "Gathering Info..." (Show animated extraction indicator)

      Step 3: "Analyzing Risk Rules & Thresholds..."

      Step 4: "Execution Complete" (Show final output, risk verdict badge, and summary logs).

- Add a trigger button "Re-run Execution" to re-trigger the step-by-step animation sequence smoothly.

Ensure the UI uses a modern dark or light neutral enterprise theme, rounded cards, high contrast, crisp typography, and responsive layouts.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a5950f0c-8ba9-4c50-bf44-ec10e549650f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
