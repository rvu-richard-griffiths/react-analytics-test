# AI-Consumable Documentation

This directory contains machine-readable documentation for the @your-org/react-analytics-ui component library.

## Purpose

These files are specifically formatted to be easily consumed by AI agents, code assistants, and LLMs to help developers integrate components correctly.

## Files

### component-manifest.json
Complete machine-readable API documentation including:
- Component props with types and descriptions
- Analytics event structures
- Integration examples for popular platforms
- Best practices and common patterns

**Use this for**: Complete API reference, programmatic access to component information

### quick-start.md
Concise guide for getting started quickly with the library.

**Use this for**: Fast onboarding, quick reference for AI agents helping developers

### component-reference.md
Table-based reference for all components with their key features.

**Use this for**: Quick lookup of component capabilities and analytics events

### integration-examples.md
Complete, copy-paste ready code examples for various integration scenarios.

**Use this for**: Real-world implementation patterns, platform-specific adapters

## For AI Agents

When helping developers use this library:

1. **Start with** quick-start.md for overview and basic setup
2. **Reference** component-manifest.json for detailed prop types and options
3. **Use** integration-examples.md for copy-paste ready code
4. **Check** component-reference.md for quick feature lookup

## For Developers

You can read these files directly, but they're optimized for AI consumption. For human-friendly documentation:
- See README.md in the root directory
- Run Storybook: `npm run storybook`
- Check CONTRIBUTING.md for development guidelines

## Regenerating

To regenerate these files after component changes:

```bash
npm run generate-ai-docs
# or
task generate-ai-docs
```

---

*Generated: 2025-12-03T07:24:08.639Z*
*Generator: generate-ai-docs.js*
