# Phase Context: Academic Years UI Implementation

## Overview
This phase deals with implementing the "Academic Years - No Navigation" screen into the `tenant` app module, closely following the specifications provided natively via the Stitch MCP (Project ID: 10769162820746570196, Screen ID: 0ce6c8b6f4c1429c9c07bd8b62f5e801).

## Decisions & Requirements

### 1. Visual Accuracy
- **Theme**: We will adhere strictly to the `DESIGN.md` "Obsidian Professionalism" premium dark mode rules (Background: `#0A0514`, accents `#22d3ee` cyan, glassmorphism `rgba(20, 20, 35, 0.4)` panels).
- **Typography**: Primary font `Manrope`, weights scaling from 300-800.
- **Reference**: The implementation will meticulously match the provided Stitch UI representation, mirroring spacing, layout, and component aesthetics without compromising pre-existing variables.

### 2. Data Handling
- **Placeholder Rule**: No empty states.
- **Mock Data Theme**: Real-world dummy data catering to the "Coaching/Tax SaaS" context (e.g., "Active Cohort 2024-2025", "Tax Enrollment Session 2", "Total Clients Managed").

### 3. Responsiveness
- **Desktop-First Approach**: The UI will anchor on a highly stable desktop grid / flexbox layout initially, ensuring it gracefully downscales and stacks efficiently into tablets and mobiles using Tailwind utility classes (`md:`, `lg:`).
- **Graceful Degradation**: Desktop structural integrity should not be sacrificed for mobile.

### 4. Technical Constraints
- **Stack**: Next.js (App Router), Tailwind CSS, Lucide React icons.
- **Placement**: Under the `tenant` app module. We will likely create `apps/tenant/src/app/(dashboard)/academic-years/page.tsx` (or a similar valid structure).
- **Safety**: Do not break or overwrite existing `layout.css`, `global.css`, or global providers. Use Unsplash high-quality image placeholders or Lucide icons for missing complex graphical assets. All buttons and interactive fields must include `hover:` and `focus-ring:` states.

### 5. Next Steps
1. Scaffold the `academic-years` Next.js page within the `tenant` directory.
2. Build local utility components for "Metric Cards" (`backdrop-blur-md` and `linear-gradient` implementations as stated in DESIGN.md).
3. Apply responsive Tailwind structure.
4. Populate with localized SaaS dummy data.
