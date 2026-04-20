# Create Academic Year — Implementation Context

## Stitch Design Reference
- **Project ID:** `10769162820746570196`
- **Screen ID:** `d5b533cd8a914dc4977d7d8a57c143a3`
- **Screen Title:** Create Academic Year - No Navigation
- **Resolution:** 2560 × 2048 (Desktop)

## Design Spec Analysis

### Content Hierarchy (from Stitch HTML)
1. **Page Header**
   - Back button (ghost, ChevronLeft icon + "Back" text)
   - Icon badge: CalendarDays in primary/10 background, rounded-2xl
   - Title: "Create Academic Year" — text-3xl, font-black, tracking-tight
   - Subtitle: "Add a new academic year session to define the organizational timeline." — text-muted-foreground, font-medium

2. **Card Container**
   - bg-card/30, backdrop-blur-xl, border-border/50, rounded-[2rem], shadow-medium
   - Decorative Sparkles icon (opacity-5, top-right corner)
   - Card Header: "Year Details" (text-xl font-bold) + "Core information for the academic session" (text-muted-foreground font-medium)

3. **Form Fields**
   - Year Name (full-width, text input, placeholder: "e.g., 2024 - 2025")
   - Separator
   - Start Date + End Date (2-column grid, date inputs)
   - All inputs: h-12, bg-background/50, border-border/50, rounded-xl, shadow-soft, font-semibold
   - Labels: text-sm, font-bold, uppercase, tracking-wider, text-muted-foreground

4. **Toggle Section**
   - "Set as Current Year" label → mapped to "Current Year" with Badge("Default") when active
   - Description: "This will become the default session across the institution"
   - Switch: data-[state=checked]:bg-primary
   - Container: rounded-[1.5rem], border, bg-primary/5, p-6, shadow-soft, hover:bg-primary/[0.07]

5. **Actions**
   - Reset button (outline, h-12, rounded-xl)
   - "Create Year" button (primary, h-12, shadow-glow, with Plus icon / Loader2 spinner)
   - Separator: border-t border-border/30

## Architecture — View + Form Split

| File | Responsibility |
|------|----------------|
| `views/academic-year-create-view.tsx` | Header, Card shell, layout, Sparkles decoration. Imports `<CreateAcademicYearForm />`. |
| `form/create-academic-year-form.tsx` | Pure form: fields, validation (zod), submit handler, status toggle, action buttons. |
| `app/(root)/academic-years/new/page.tsx` | Route page. Renders `<AcademicYearCreateView />`. |

## Admin Pattern Reference
- Mirrors `apps/admin/modules/academic-topic/ui/form/topic-form.tsx` (lines 133–481)
- Same token vocabulary: shadow-soft, shadow-medium, shadow-glow, primary/10, border/50
- Same component set: Card, Form, Input, Switch, Badge, Separator, Button from @workspace/ui

## Gaps Identified (Current vs. Stitch)
1. ✅ Layout structure — matches
2. ✅ Typography tokens — matches admin pattern
3. ✅ Form field styling — matches (h-12, rounded-xl, shadow-soft)
4. ✅ Toggle section — matches admin pattern
5. ✅ Action buttons — matches admin pattern
6. ⚠️ View wrapper label says "Current Year" but Stitch says "Set as Current Year" — needs label alignment
7. ⚠️ Form label style uses `text-sm` but admin parent-selection uses `text-[10px]` for grouped fields — keep text-sm for standalone fields (consistent with admin's standalone fields)

## Status: READY FOR REFINEMENT
The implementation is 95% aligned. Minor label text refinement needed.
