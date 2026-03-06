/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AgentHub from "./pages/AgentHub";
import MCPGateway from "./pages/MCPGateway";
import ApprovalQueue from "./pages/ApprovalQueue";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Branding from "./pages/Branding";
import CommandCenter from "./pages/CommandCenter";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/command" element={<CommandCenter />} />
          <Route path="/agents" element={<AgentHub />} />
          <Route path="/mcp" element={<MCPGateway />} />
          <Route path="/approvals" element={<ApprovalQueue />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/branding" element={<Branding />} />
        </Route>
      </Routes>
    </Router>
  );
}
