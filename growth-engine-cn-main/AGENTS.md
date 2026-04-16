[AGENTS.md](https://github.com/user-attachments/files/26500610/AGENTS.md)
# AGENTS.md

## Project Identity
This repository builds the official Chinese website for:

《品牌出海加速器｜增长引擎验证舱（90天）》

The website must feel like:
- premium consulting firm
- growth command center
- SaaS-style dashboard experience
- strategic, clinical, restrained, high-trust

## Language Requirement
- All user-facing UI must be in Simplified Chinese from the start
- No English UI copy should remain
- Tone must be premium, strategic, system-oriented, consulting-grade
- Avoid literal translation and generic wording
- Prefer productized Chinese expressions such as:
  - 增长系统
  - 增长指挥舱
  - 增长诊断
  - 执行路径
  - 系统重构

## Primary Knowledge Sources
Prioritize these files when writing copy and structure:
1. /knowledge/operating-system/growth_OS_blueprint.md
2. /knowledge/consulting/client_diagnosis_framework.md
3. /knowledge/operating-system/BI_dashboard_framework.md
4. /knowledge/ads_strategy_library.md
5. /knowledge/customer_profiles.md
6. /knowledge/operating-system/growth_SOP_library.md

## Hard Constraints
- Deployable on Netlify
- Frontend only
- React + Vite + TypeScript
- Responsive, desktop-first
- Include onboarding form
- Keep package.json valid
- Ensure project can build successfully
- Include public/_redirects for SPA routing on Netlify

## Copy Principles
- Sell certainty, not agency labor
- Sell system reconstruction, not ad buying services
- Emphasize diagnosis, attribution, testing, SOP handoff
- Use consulting-grade language, not generic marketing buzzwords
## Auth & Deployment Operational Rules

- Production domain: https://beautiful-horse-283acd.netlify.app
- Required Feishu redirect URI: https://beautiful-horse-283acd.netlify.app/.netlify/functions/feishu-callback

- Do not rewrite homepage copy unless explicitly asked.
- Before touching auth, always search for old domains and hardcoded redirect URIs.
- After auth or env changes, always run local validation first, then production verification.
- Verify production using only:
  https://beautiful-horse-283acd.netlify.app

### Verification checklist
1. Search for old domain remnants
2. Verify auth-start live 302 redirect_uri
3. Verify callback behavior
4. Verify growth-forms page loads
5. Verify feishu-session output
6. Pause only when human Feishu login is required
7. Verify A1 really writes into Feishu if submission is tested

## Company Design Direction

### Design Inputs
Use the reference brands only as hidden inputs.
Do not name them, mimic them literally, or let the UI read like a derivative of any one source.

### Synthesis Goal
- The resulting UI must feel like `峥锐 ZAPEX`, a premium cross-border growth consulting system.
- It should express strategic judgment, operational clarity, and trustworthy execution.
- It should not look like a generic SaaS landing page or a pure dashboard UI.

### Implementation Priorities
- Build pages as modular decision surfaces, not decorative sections.
- Keep typography sharp, modern, and highly readable in Simplified Chinese.
- Use restrained color and controlled emphasis.
- Make forms and onboarding feel like guided client intake into a real system.
- Preserve consistency between homepage, onboarding, and future work-surface pages.
- Keep one clear primary CTA per page and reduce repeated CTA competition.
- Make section order answer executive questions in sequence rather than stack generic marketing blocks.

### Avoid
- Over-rounding
- Gradient-heavy startup styling
- Loud AI visuals
- Consumer-app playfulness
- Heavy enterprise admin density
- Copying any one reference brand too literally
