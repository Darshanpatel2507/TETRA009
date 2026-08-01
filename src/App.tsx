import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { MobileShell } from "./components/layout/MobileShell";
import { ClinicalDashboardPage } from "./pages/clinical/ClinicalDashboardPage";
import { PatientIntakePage } from "./pages/patient/PatientIntakePage";
import { RiskConstellationPage } from "./pages/patient/RiskConstellationPage";
import { RiskBreakdownPage } from "./pages/patient/RiskBreakdownPage";
import { LandingHomePage } from "./pages/home/LandingHomePage";
import { PatientPortalDashboard } from "./pages/patient/PatientPortalDashboard";
import { PersonalHealthDashboard } from "./pages/patient/PersonalHealthDashboard";

/**
 * Sahayak routes — tri-portal gateways & clinical registry.
 *  /                                   → LandingHomePage (Showcase & Tri-Portal Gateway)
 *  /personal-health                    → PersonalHealthDashboard (Individual Symptom & Health Hub)
 *  /family-health                      → PatientPortalDashboard (Family Group & Household Hub)
 *  /dashboard                          → ClinicalDashboardPage (Clinical Worker Registry)
 *  /patient/intake                     → New health checkup wizard
 *  /patient/:id/constellation          → Risk constellation view
 *  /patient/:id/breakdown              → Factor breakdown + referral letter
 */
export default function App() {
  return (
    <>
      {/* Desktop / tablet shell */}
      <div className="hidden md:block h-full">
        <AppShell>
          <Routes>
            <Route path="/" element={<LandingHomePage />} />
            <Route path="/personal-health" element={<PersonalHealthDashboard />} />
            <Route path="/family-health" element={<PatientPortalDashboard />} />
            <Route path="/my-health" element={<PatientPortalDashboard />} />
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
            <Route path="/" element={<LandingHomePage />} />
            <Route path="/personal-health" element={<PersonalHealthDashboard />} />
            <Route path="/family-health" element={<PatientPortalDashboard />} />
            <Route path="/my-health" element={<PatientPortalDashboard />} />
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