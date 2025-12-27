---
name: ui-review
description: Reviews UI components for code quality, accessibility, and performance. Also performs visual verification using Storybook with screenshots. Trigger with "ui review", "component review", or "review component".
---

# UI Component Review Skill

Performs code review and visual verification of UI components using Storybook.

## Review Process

### 1. Code Review

Read the target component code and check the following:

**Code Quality**
- TypeScript types are complete and accurate
- Functions follow single responsibility principle
- Error handling is implemented
- DRY principle is followed
- Edge cases are handled

**Accessibility (A11y)**
- Semantic HTML elements used appropriately
- ARIA attributes properly configured
- Keyboard navigation support (Tab, Enter, Esc)
- Focus management implemented
- Color contrast meets WCAG standards

**Performance**
- No unnecessary re-renders
- Event handlers are optimized
- CSS doesn't cause layout thrashing

**Styling**
- Dark mode support (`prefers-color-scheme`, `data-color-mode`)
- Responsive design
- Consistent CSS naming conventions

### 2. Visual Verification with Storybook

1. Start Storybook (`pnpm storybook`)
2. Open browser with Playwright and navigate to http://localhost:6006
3. Navigate to the target component's story
4. Take screenshots for visual verification
5. Check various states (normal, hover, focus, dark mode, etc.)

### 3. Review Report

Report findings in the following format:

```
## Review Results: [Component Name]

### Screenshots
[Screenshots from Storybook]

### Strengths
- ...

### Areas for Improvement
- ...

### Recommendations
- ...
```

## Usage Examples

```
/ui-review Review the ConfirmDialog component
```

```
/ui-review Check accessibility of components/ConfirmDialog.ts
```

## Project-Specific Notes

- Uses WXT framework
- Styles are centralized in `assets/styles.css`
- Storybook stories are in `stories/` directory
- Dark mode controlled via `data-color-mode` attribute and `prefers-color-scheme`
