import { SurveyProvider } from "@/providers/SurveyProvider";
import { LandingPage } from "@/pages/LandingPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { ResearchPurposePage } from "@/pages/ResearchPurposePage";
import { SurveyPage } from "@/pages/SurveyPage";
import { ThankYouPage } from "@/pages/ThankYouPage";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AdminShell = lazy(() =>
  import("@/providers/AdminShell").then((module) => ({ default: module.AdminShell })),
);
const AdminLayout = lazy(() =>
  import("@/components/admin/AdminLayout").then((module) => ({ default: module.AdminLayout })),
);
const AdminLoginPage = lazy(() =>
  import("@/pages/AdminLoginPage").then((module) => ({ default: module.AdminLoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import("@/pages/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage })),
);
const AdminResponsesPage = lazy(() =>
  import("@/pages/AdminResponsesPage").then((module) => ({ default: module.AdminResponsesPage })),
);
const AdminOtherPage = lazy(() =>
  import("@/pages/AdminOtherPage").then((module) => ({ default: module.AdminOtherPage })),
);
const AdminCategoriesPage = lazy(() =>
  import("@/pages/AdminAnalyticsPage").then((module) => ({ default: module.AdminCategoriesPage })),
);
const AdminBehaviorPage = lazy(() =>
  import("@/pages/AdminAnalyticsPage").then((module) => ({ default: module.AdminBehaviorPage })),
);
const AdminDiscoveryPage = lazy(() =>
  import("@/pages/AdminAnalyticsPage").then((module) => ({ default: module.AdminDiscoveryPage })),
);
const AdminTrustPage = lazy(() =>
  import("@/pages/AdminAnalyticsPage").then((module) => ({ default: module.AdminTrustPage })),
);
const AdminBarriersPage = lazy(() =>
  import("@/pages/AdminAnalyticsPage").then((module) => ({ default: module.AdminBarriersPage })),
);

export default function App() {
  return (
    <SurveyProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="flex min-h-svh items-center justify-center text-sm">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/research-purpose" element={<ResearchPurposePage />} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route element={<AdminShell />}>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="responses" element={<AdminResponsesPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="behavior" element={<AdminBehaviorPage />} />
                <Route path="discovery" element={<AdminDiscoveryPage />} />
                <Route path="trust" element={<AdminTrustPage />} />
                <Route path="barriers" element={<AdminBarriersPage />} />
                <Route path="other" element={<AdminOtherPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SurveyProvider>
  );
}
