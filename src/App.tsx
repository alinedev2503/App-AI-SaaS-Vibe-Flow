import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { PageLoader } from "./components/PageLoader";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AiKeysProvider } from "./contexts/AiKeysContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CommandCenter = lazy(() => import("./pages/CommandCenter"));
const AgentHub = lazy(() => import("./pages/AgentHub"));
const MCPGateway = lazy(() => import("./pages/MCPGateway"));
const ApprovalQueue = lazy(() => import("./pages/ApprovalQueue"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const Settings = lazy(() => import("./pages/Settings"));
const Branding = lazy(() => import("./pages/Branding"));
const Admin = lazy(() => import("./pages/Admin"));
const Checkout = lazy(() => import("./pages/Checkout"));

function PrefetchLinks() {
  return (
    <div className="hidden">
      <Link to="/dashboard" />
      <Link to="/command" />
      <Link to="/agents" />
      <Link to="/mcp" />
      <Link to="/approvals" />
      <Link to="/audit" />
      <Link to="/settings" />
      <Link to="/branding" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AiKeysProvider>
            <Router>
              <PrefetchLinks />
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    <Route element={<Layout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/command" element={<CommandCenter />} />
                      <Route path="/agents" element={<AgentHub />} />
                      <Route path="/mcp" element={<MCPGateway />} />
                      <Route path="/approvals" element={<ApprovalQueue />} />
                      <Route path="/audit" element={<AuditLogs />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/branding" element={<Branding />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/checkout" element={<Checkout />} />
                    </Route>
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </Router>
          </AiKeysProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
