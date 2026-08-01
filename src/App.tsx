import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { MobileShell } from "./components/layout/MobileShell";
import { ClinicalDashboardPage } from "./pages/clinical/ClinicalDashboardPage";
import { PatientIntakePage } from "./pages/patient/PatientIntakePage";
import { RiskConstellationPage } from "./pages/patient/RiskConstellationPage";
import { RiskBreakdownPage } from "./pages/patient/RiskBreakdownPage";

/**
 * Nirog routes (no auth this pass — direct, all realtime-driven).
 *  /                                   → ClinicalDashboardPage
 *  /dashboard                          → ClinicalDashboardPage (alias)
 *  /patient/intake                     → new assessment wizard
 *  /patient/:id/constellation          → risk constellation view
 *  /patient/:id/breakdown              → factor breakdown + referral
 *
 * Note: <ToastProvider /> is mounted in main.tsx so the toast context
 * covers every route. This component only paints the two shells.
 */
export default function App() {
  return (
    <>
      {/* Desktop / tablet shell */}
      <div className="hidden md:block h-full">
        <AppShell>
          <Routes>
            <Route path="/" element={<ClinicalDashboardPage />} />
            <Route path="/dashboard" element={<ClinicalDashboardPage />} />
            <Route path="/patient/intake" element={<PatientIntakePage />} />
            <Route
              path="/patient/:id/constellation"
              element={<RiskConstellationPage />}
            />
            <Route
              path="/patient/:id/breakdown"
              element={<RiskBreakdownPage />}
            />
          </Routes>
        </AppShell>
      </div>

      {/* Mobile shell — purpose-built, not shrunk */}
      <div className="block md:hidden h-full">
        <MobileShell>
          <Routes>
            <Route path="/" element={<ClinicalDashboardPage />} />
            <Route path="/dashboard" element={<ClinicalDashboardPage />} />
            <Route path="/patient/intake" element={<PatientIntakePage />} />
            <Route
              path="/patient/:id/constellation"
              element={<RiskConstellationPage />}
            />
            <Route
              path="/patient/:id/breakdown"
              element={<RiskBreakdownPage />}
            />
          </Routes>
        </MobileShell>
      </div>
    </>
  );
}