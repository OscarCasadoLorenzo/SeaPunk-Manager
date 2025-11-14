# GitHub Copilot Instructions for SeaPunk Manager

## AI Agent Configuration Reference

**All AI coding assistance for this project must follow the guidelines defined in [`AGENTS.md`](../AGENTS.md).**

The `AGENTS.md` file provides a centralized reference to:

- **Context Files** (`.ai/context/`) - Project background and domain knowledge
- **Prompt Files** (`.ai/prompts/`) - Automated workflows like commit generation
- **Rules Files** (`.ai/rules/`) - Coding standards for architecture, security, style, and testing

---

## Quick Reference

### 📁 Key Configuration Files

| File                            | Purpose                                              |
| ------------------------------- | ---------------------------------------------------- |
| `.ai/context/project.md`        | Project overview and architecture summary            |
| `.ai/prompts/commit-changes.md` | Conventional Commits workflow with GitFlow           |
| `.ai/rules/architecture.md`     | Monorepo structure and module organization           |
| `.ai/rules/security.md`         | Security best practices and vulnerability prevention |
| `.ai/rules/style.md`            | TypeScript, React, and NestJS code style conventions |
| `.ai/rules/testing.md`          | Testing requirements and coverage expectations       |

### 🚨 Important Rules

1. **Always follow** the rules defined in `.ai/rules/`
2. **Ask the user** when conflicts arise between rules
3. **Never compromise** on security guidelines
4. **Use Conventional Commits** format with GitFlow branch prefixes (e.g., 
5. **Maintain monorepo structure** as defined in architecture rules

---

## For GitHub Copilot

When providing code suggestions:

- ✅ Follow TypeScript strict mode requirements
- ✅ Use established patterns from `architecture.md`
- ✅ Apply security practices from `security.md`
- ✅ Match code style conventions from `style.md`
- ✅ Include test cases as specified in `testing.md`

---

## Conflict Resolution

If you encounter conflicting requirements:

1. **Stop and ask the user** which approach to take
2. **Reference the specific rules** that are in conflict
3. **Propose solutions** based on the priority order in `AGENTS.md`

---

**For complete details, see [`AGENTS.md`](../AGENTS.md)**
