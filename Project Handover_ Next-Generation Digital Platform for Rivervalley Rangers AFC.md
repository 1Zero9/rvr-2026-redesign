# **Project Handover: Next-Generation Digital Platform for Rivervalley Rangers AFC**

This is the master handover document designed to transition the design, backend, and frontend development of the next-generation digital ecosystem for Rivervalley Rangers AFC (RVR) into a fresh development session.

## **1\. Project Background & Core Objectives**

Rivervalley Rangers AFC (founded in 1981 in Swords, Dublin) 1 is executing a comprehensive digital transition to consolidate its online presence. Currently, the club operates with a fragmented online footprint across two primary web properties:

\+-----------------------------------------------------------------------------------+  
|                                  DUAL-DOMAIN CRISIS                               |  
\+-----------------------------------------------------------------------------------+  
|  LIVE DOMAIN (rvrafc.ie)                          BETA DOMAIN (rivervalleyrangers.ie) |  
|  \- Powered by rigid, generic ClubZap template.   \- Custom, high-end Next.js build.  |  
|  \- Handles operational registrations & payments.  \- Modern, clean layout & visuals.  |  
|  \- Outdated fixtures & lacks parent welfare hub.  \- Contaminated with placeholder data|  
\+-----------------------------------------------------------------------------------+

### **The Cleanup & Redirection Path**

To deliver a modern, high-performance, and secure platform, the final implementation must execute a clean domain consolidation strategy:

1. **Purge the Next.js Codebase:** Systematically scrub the custom Next.js beta code of all placeholder assets, emojis in the navigation, and fictional data (such as the unverified "Sarah Mitchell" listed as the U16 Boys manager 2 or rounded stats that contradict official records).  
2. **Data Reconciliation:** Replace all template values with verified, live club metrics. Reconcile the exact team count (aligning the 22 teams active on the live registrar with the beta site's layout).  
3. **Consolidation and Redirection:** Perform a seamless domain transfer, routing all traffic from rvrafc.ie to the high-performance Next.js custom platform hosted at rivervalleyrangers.ie. Maintain the ClubZap engine on the backend as a headless payment/member database while serving the custom Next.js build as the polished public frontend.

## **2\. Industry-Standard Information Architecture & Navigation**

To accommodate the club's extensive team structure without cluttering the screen on mobile devices, RVR's Next.js platform must implement a combined structural framework modeled after the best-in-class features of elite European grassroots platforms:

                                  \[HOME PAGE\]  
                                       |  
    \+-----------------+----------------+-----------------+-----------------+  
    |                 |                |                 |                 |  
         
\- Girls & Women     \- Junior Academy   \- Real-time Fee  \- Stripe-paid   \- Welfare Contact  
\- Boys & Men        \- Youth Comp.      \- Live Calendar  \- Kit & Gear    \- FAI Policies  
\- Inclusive         \- Adult & Senior   \- Rules & Hours  \- Order Alerts  \- Garda Vetting

### **Key Structural Inspiration**

* **Lewes FC (Equality-Led Layout):** To demonstrate true community inclusion, the primary navigation and mega-menus must place girls' and women's squads *before* boys' and men's squads. The hierarchy of team links should dynamically prioritize the female development cohorts.  
* **Bloomsbury Football (Format-Based Grouping):** Instead of listing a massive, unmanageable dropdown menu of 22 individual teams, squads are grouped logically by play-style formats:  
  * **Junior Academy (Ages U7 \- U12):** Small-sided games (SSG) focusing on technical basics, inclusive play, and movement mechanics.  
  * **Youth Competitive (Ages U13 \- U18):** Larger pitch formats focusing on tactical understanding, structured leagues, and competitive performance.  
  * **Senior Divisions:** Adult squads competing in the Dublin Amateur and Leinster Senior Leagues.  
  * **Inclusive Programs:** Dedicated pathways for "Football For All" adaptive and mixed-ability play.

## **3\. Strict Compliance with the Dec 2025 FAI Mandate**

The Football Association of Ireland (FAI) has made the **FAI Club Mark (Entry Level) a mandatory requirement for all grassroots football clubs in Ireland by December 2025**. To satisfy these strict regulatory standards and secure the club's active charter status, the redesigned platform must serve as RVR's official compliance hub.

### **Core Compliance Features to Implement**

\+---------------------------------------------------------------------------------+  
|                              FAI COMPLIANCE ENGINE                              |  
\+---------------------------------------------------------------------------------+  
|                  |  
|  Direct links to MyComet for   Child Safeguarding Statement Clear contact info for |  
|  Garda Vetting. Explicitly     aligned with Children First  Club Children's Officer|  
|  mandate online process.       Act 2015 & FAI Policy 2025\.  & DLP with credentials.|  
\+---------------------------------------------------------------------------------+

1. **COMET-Linked Garda Vetting Portal:**  
   * The platform must feature a clear, dedicated guide instructing all coaches, volunteers, and committee members on how to complete their Garda Vetting.  
   * It must explicitly state that under FAI rules, all vetting must be processed online through the FAI Connect COMET portal (faiconnect.ie/mycomet), noting that paper-based or non-FAI submissions are legally invalid.  
   * The system must display a compliance reminder that Garda Vetting is valid for a maximum of 3 years under FAI policy.  
2. **Dedicated Safeguarding & Child Welfare Page:**  
   * This directory must be permanently visible and accessible from the primary navigation.3  
   * It must publish RVR’s official *Child Safeguarding Statement* complying with the *Children First Act 2015* and adhering to the *FAI Child Welfare & Safeguarding Policy (3rd edition, March 2025\)*.  
   * The page must feature highly visible contact cards showing the names, photos, and direct email contacts for the **Club Children’s Officer** and the **Designated Liaison Person (DLP)**.  
   * Quick download links must be provided for the FAI Respect Code of Conduct, RVR Social Media Guidelines, and club safety handbooks.

## **4\. Real-Time DDSL & SportLoMo Integration**

Managing schedules, kickoff times, and league tables manually for 22 active squads is a massive burden for club volunteers. RVR's competitive youth teams play in the Dublin & District Schoolboys/girls League (DDSL)—the largest schoolboys/girls league in Europe, managing over 2,000 matches every weekend.

### **Automated Data Feeds**

To eliminate manual overhead, RVR’s Next.js platform must directly integrate with the DDSL's database via the **SportLoMo API**. SportLoMo widgets must be embedded natively on each team page to pull and display real-time fixtures, pitch assignments (such as Ridgewood Park, Rathingle, or the Ward All-Weather Astro), results, and division standings.

### **The "Mercy Rule" API Filter**

To promote a positive, supportive, and respectful environment in youth sports, the SportLoMo integration must support the **"Mercy Rule" display filter**. In youth divisions (U7 to U12), the visual standings and match score widgets must automatically mask excessive winning margins on the public-facing pages. The scoring difference displayed on the website must be capped programmatically using the following logic:  
![][image1]  
This ensures that while the official result is recorded correctly in the league database, public-facing scorelines do not show demoralizing goal differences.

### **DDSL Scoreboard App Quick-Links**

To enhance the matchday experience, the "Matchday Hub" section of the site should feature highly visible links for parents, players, and supporters to download the official **DDSL Scoreboard App** to track away matches and receive live score notifications on their mobile devices.

## **5\. Privacy-First Player Profiles & Onboarding**

A primary goal of the new website is to recruit local players and make onboarding simple for new families moving into the Swords and Rivervalley areas.1 However, when creating engaging player profiles, RVR must follow strict, privacy-first youth data protocols.

Prospective Parent \---\> \[Multi-step Onboarding Form\] \---\> Admin Panel Review  
                                                               |  
                                                               v  
Player Profile Created (is\_private: true) \<--- \[Consent Verification Guard\]  
                                                               |  
(Parent signs GDPR Consent via magic link) \--------------------+  
                               |  
                               v  
Profile Set to Public (is\_private: false)

1. **Multi-Step Mobile-First Onboarding Form:** Replace static paper and PDF forms with an interactive, multi-step recruitment funnel. The form captures basic player details (name, year of birth), and automatically route the inquiry to the coordinator of the correct age group.  
2. **Private-by-Default Player Profiles:** Every youth player (U7 to U12) can have an engaging personal profile card detailing their position, bio, and season stats.3 However, **all player profiles must be set to private by default** (is\_private: true) in the database.3  
3. **GDPR Consent Gates:** The platform will feature a built-in "Consent Verification Guard." No player card, team photo, or match statistic can be published publicly until the parent or guardian logs in via a secure magic link and signs a GDPR-compliant digital media consent form.3

## **6\. Interactive Community Campaigns & Revenue Modules**

To engage local families and secure consistent revenue, RVR should replace static informational pages with interactive community campaigns:

### **A. 40th Anniversary Kit Design Competition**

Commemorating RVR’s rich history since its founding in 1981, the website will host a dedicated landing page for a community design contest.

* **The Interaction:** Members can download a standard PDF kit template, draw their designs (hand-drawn or digital), and upload their files directly through a web form.5  
* **The Voting Gallery:** Submissions are populated in an interactive, dynamic grid where supporters can vote on their favorite design.  
* **The Commerce Loop:** The winning design will be manufactured professionally in partnership with Capelli Sports and sold directly through RVR's Stripe-integrated online store.

### **B. Colour Fun Run Campaign Page**

The platform will launch a high-impact, temporary campaign page to coordinate an annual family-friendly Colour Fun Run fundraiser.

* **The Onboarding Flow:** Participants can register, pay their entry fees, and select their t-shirt sizes through a clean, mobile-first form.  
* **Sponsorship Collections:** Integrates a personal fundraising meter (utilizing a Spotfund or PitchIn API model) allowing participants to easily share their personal fundraising pages with family and friends to collect online sponsorships.  
* **Integrated Stripe Checkout:** Supports quick purchases of campaign accessories (such as branded sunglasses, powder packets, and visors) processed directly via Stripe at checkout.

### **C. Headless Club Lotto Widget**

Grassroots sports clubs rely heavily on consistent fundraising revenue. RVR will integrate a headless fundraising widget on its homepage. This widget links directly to Clubforce or locallotto.ie, displaying the current weekly jackpot, highlighting recent winners (like successful models from Dublin GAA clubs like Ballyboden St Endas), and allowing users to purchase lotto tickets in seconds.

## **7\. Operational Platform Comparison & Hybrid Infrastructure**

To help the club board evaluate its hosting and backend strategy, the following matrix compares the modern no-code grassroots engines against a custom Next.js development approach:

| Platform Option | Setup Time | Volunteer Maintenance Overhead | Advanced Core Strengths | Operational Costs |
| :---- | :---- | :---- | :---- | :---- |
| **ClubZap Headless** | Instant setup 3 | Very Low 3 | Deep integration with FAI registrations; secure member database and team-comm apps. | Low monthly subscription models. |
| **GrassrootsFC** 3 | Under 5 minutes via auto-badge color extraction 3 | Low 3 | GDPR-compliant player profiles with built-in parental consent gates; ad-free.3 | Free tier (£0), Club (£8/mo), Pro (£15/mo).3 |
| **MyClubPro** | 24 to 48 hours setup and domain transfer.6 | Low.6 | Automatic FA Full-Time data feeds; customizable registration forms.6 | Starter (£12/mo) up to Pro (£29/mo).6 |
| **Custom Next.js & Webflow Hybrid** | Custom design and engineering required. | Moderate to High (requires developer updates). | Complete visual and layout control; animated custom assets; fully ad-free. | Custom hosting and developer fees. |

### **The Proposed Hybrid Web Engine**

To achieve the best possible performance, Rivervalley Rangers AFC should implement a **Headless Hybrid Architecture**:

\+---------------------------------------------------------------------------------+  
|                                HYBRID WEB ENGINE                                |  
\+---------------------------------------------------------------------------------+  
|  \[Frontend Presentation Layer: Next.js\]                                         |  
|  \- Fast LCP (Largest Contentful Paint \< 2.5s) using WebP/AVIF imagery.   |  
|  \- Modern styling: Cute-alism raw spacing, frosted glass filters.  |  
|                                                                                 |  
|                                       |  
|  \- SportLoMo JSON API: Fixtures, tables, and Mercy-ruled standings.|  
|  \- SportsKey Widget: Real-time 3G Astro pitch reservations.     |  
|  \- Headless ClubZap / Stripe API: Member payments and online shop.  |  
\+---------------------------------------------------------------------------------+

This hybrid approach allows the club to maintain complete creative control over its public brand and mobile onboarding experience while leveraging robust, automated sports administration platforms behind the scenes to minimize volunteer workload.

## **8\. Multi-Agent AI Worker Strategy & Prompts**

To construct this platform efficiently, we leverage three specialized AI developer agents as virtual workers. Paste the respective prompts below into your AI models to begin execution.

                  \+----------------------------------------------+  
                  |            RVR AFC AI AGENT ORCHESTRATION    |  
                  \+----------------------------------------------+  
                                         |  
         \+-------------------------------+-------------------------------+  
         |                               |                               |  
         v                               v                               v  
                                  
Visual Assets & UI Vibe            Backend refactoring,            Autocompleting UI,  
Framer/Figma design specs          JSON API pipelines &            Forms, dynamic components  
Tailwind configurations            database security models        & database schemas

### **Agent 1: Gemini (AntiGravity) / UI-UX Design Agent**

**Focus:** Generates visual tokens, Tailwind configurations, design mockups, and creative marketing campaigns.

#### **Copy-Paste Prompt:**

You are the Lead UI/UX Designer for Rivervalley Rangers AFC (founded 1981 in Dublin). We are building a custom, mobile-first sports platform using Next.js and Tailwind CSS.  
Your task is to generate the complete design tokens, Tailwind configuration, and layout specifications for our primary web workspace, following the 2026 'Bold & Energetic' Cute-alism design trend.  
Please produce the following:

1. Tailwind CSS Theme Configuration:  
   * Primary Brand Colors: Deep Athletic Green (extracted from our crest), Stark Black/Charcoal, and Clean Accent White.  
   * Variable-weight Sans-serif typography rules optimized for high-energy sports headlines.  
   * Glassmorphism utility classes ('Frosted Touch' or 'Liquid Glass') using dynamic backdrop-filters.  
2. Design Specifications for the Home Page Header and Navigation:  
   * Provide a design spec for an 'Equality-First' mega-menu modeled on Lewes FC (listing Girls and Women's team paths before Boys' and Men's).  
   * Layout rules for a simplified 'Format & Level' mega-menu inspired by Bloomsbury Football (grouping squads into 'Junior Academy \[U7-U12\]', 'Youth Competitive \[U13-U18\]', 'Seniors', and 'Inclusive Football For All').  
3. Front-End Layout Components:  
   * A hero header component spec displaying background video and a prominent double call-to-action (CTA): 'Join RVR Academy' and 'Book Ward Rivervalley All-Weather Astro'.  
   * A 'Cute-alism' raw-bordered card layout to showcase our club statistics (44 Years Strong, 18+ Teams, 350+ Players, 25+ Qualified Coaches, 100% Garda Vetted).

Provide clear HTML/Tailwind wireframes or clean component specifications representing this active, modern, and accessible sports platform.

### **Agent 2: Claude Code / Full-Stack & Integration Agent**

**Focus:** Scripting, purging placeholder data, API integrations (SportLoMo), GDPR security layers, and domain configuration.

#### **Copy-Paste Prompt:**

You are the Lead Full-Stack Software Engineer executing a refactor of the Next.js custom platform code (located in the directory at rivervalleyrangers.ie).  
Our goal is to sanitize the Next.js codebase, implement real-time SportLoMo integrations, enforce strict FAI and GDPR safety compliance, and prepare the site for domain consolidation.  
Analyze the repository structure and execute the following tasks:

1. Database & Asset Cleansing:  
   * Find and purge all fabricated placeholder names in the team lists and coaching rosters (e.g., remove references to manager "Sarah Mitchell", "Emma Walsh", "David Thompson", and any unverified statistics).  
   * Remove any generic, unpolished emojis used as icons in our navigation and replace them with imports of lightweight, accessible Lucide-react SVG icons.  
2. FAI Regulatory Compliance Page:  
   * Scaffold a database schema and associated route /club/safeguarding containing:  
     * An upload handler for our FAI-compliant Child Safeguarding Statement (Children First Act 2015).  
     * Welfare Officer contact cards with names, photos, and direct communications.  
     * Integration parameters verifying that all coaches are Garda Vetted online via the FAI Connect COMET portal ('faiconnect.ie/mycomet') with a strict 3-year validation check.  
3. Real-Time DDSL SportLoMo API Controller:  
   * Write a Next.js API route (/api/fixtures) that fetches match data from the DDSL SportLoMo server.  
   * Implement the "Mercy Rule" display filter in the controller: For youth divisions (under 12), the score diff must be masked programmatically on public views: Margin\_display \= min(Score\_winning \- Score\_losing, 5).  
4. GDPR Consent Guard for Player Profiles:  
   * Establish an authorization middleware for player profiles (U7-U12) ensuring that is\_private: true is hard-coded in the DB by default.  
   * Generate a security verification workflow: Profiles can only be changed to is\_private: false once a parent or guardian securely verifies their identity and digitally signs a GDPR media release consent form.

Run a audit of our code to ensure that all Next.js API routes are secure, performant, and completely free of hard-coded placeholder data before we redirect 'rvrafc.ie' here.

### **Agent 3: Codex / Front-End Component Coding Agent**

**Focus:** Coding individual components, forms, and database schemas (Prisma/TypeScript).

#### **Copy-Paste Prompt:**

TypeScript  
// Context: Next.js \+ Tailwind CSS \+ Prisma ORM \+ TypeScript  
// Task: Code the frontend components and schema for the Rivervalley Rangers AFC interactive campaigns:  
// 1\. 40th Anniversary Kit Design Competition Landing Page:  
//    \- Needs a beautiful "Cute-alism" layout with a form to download the template PDF.  
//    \- File upload input for user submissions (images or PDFs of designs).  
//    \- Dynamic grid listing submitted designs with a voting button (preventing double votes via localStorage or user session).  
//  
// 2\. Colour Fun Run Camp Campaign Page:  
//    \- A multi-step registration wizard (Step 1: Participant Info, Step 2: Merch Select \[branded sunglasses, powder packets\], Step 3: Secure Stripe checkout integration).  
//    \- A Spotfund/PitchIn campaign donation meter widget that dynamically loads raised progress toward our target.  
//  
// 3\. Headless Lotto Widget:  
//    \- A clean homepage widget displaying current weekly lotto jackpot, recent draw results, and a CTA linking directly to our Clubforce or locallotto.ie account.

// Implement the Prisma Schema, TypeScript Interfaces, and the React UI components for these interactive elements below. Use clean Tailwind classes.

## **9\. Guidelines for the Next Session**

When starting your next session, initialize the workspace by declaring your developer role and setting these immediate targets:  
*"I am loading the Rivervalley Rangers AFC Next-Generation Digital Platform handover file. Please review the completed features, the staging roadmap, and the multi-agent AI worker strategy. Let me know when you are ready to receive instructions to begin coding the selected component or backend controller."*

#### **Works cited**

1. About Our Club \- Rivervalley Rangers AFC, accessed June 14, 2026, [https://rivervalleyrangers.ie/about](https://rivervalleyrangers.ie/about)  
2. Our Teams \- Rivervalley Rangers AFC, accessed June 14, 2026, [https://rivervalleyrangers.ie/teams](https://rivervalleyrangers.ie/teams)  
3. GrassrootsFC — Free Football Club Website Builder, accessed June 14, 2026, [https://grassrootsfc.co.uk/](https://grassrootsfc.co.uk/)  
4. Rivervalley Rangers AFC, accessed June 14, 2026, [https://rivervalleyrangers.ie/](https://rivervalleyrangers.ie/)  
5. 40th Anniversary Kit Design Competition \- Bollington United Football Club, accessed June 14, 2026, [https://bollingtonunited.co.uk/40th-anniversary-kit-design-competition/](https://bollingtonunited.co.uk/40th-anniversary-kit-design-competition/)  
6. MyClubPro: Create a Football Club Website built to a charter standard, accessed June 14, 2026, [https://myclubpro.co.uk/](https://myclubpro.co.uk/)

[image1]: <data:image/png;base64,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>