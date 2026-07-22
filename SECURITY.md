# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 0.1.x (latest) | ✅ |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability in Vibe flow, please report it privately.

**Do not open a public GitHub issue.** Instead, send details to the repository owner via GitHub's private vulnerability reporting or contact the maintainers directly.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Affected version(s)
- Any potential impacts

We will acknowledge receipt within 48 hours and provide a timeline for a fix.

## Security Features

### Authentication
- OAuth 2.0 (GitHub, Google) via browser redirect
- Session tokens stored securely via localStorage (future: httpOnly cookies)
- Rate limiting on login attempts (planned)

### Data Protection
- Data at rest: SQLite database (file-level encryption planned)
- Data in transit: TLS 1.3 via Cloud Run / reverse proxy
- No telemetry or external data collection
- API keys stored via Gemini API Secrets (not in code)

### Agent Safety
- 3-layer semantic defense: deterministic rules, ML anomaly detection, semantic firewall
- Human-in-the-loop approval for critical actions (approval queue)
- Full audit trail for all agent actions

### Best Practices
- No secrets committed to git (`.env*` in `.gitignore`)
- TypeScript strict mode enabled
- CSP headers planned for production deployment
