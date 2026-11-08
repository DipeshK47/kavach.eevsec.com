# OpenUI Design Plan

## Variant 1

### Resolved inputs

- Topic: KAVACH, EEVSEC's offline cyber-awareness training platform.
- Offer: The current offline training and readiness offering as already described on the site.
- Audience: Defence personnel, service families, and secure organisations.
- Primary user action: The existing Request a demo form and its current navigation links.
- Deliverable: A theme-only change to the existing static HTML, CSS, and vanilla JavaScript site.
- Style direction: EEVSEC Serif, a light editorial paper ground, Pearl Silver silk, navy accents, and a charcoal footer.
- Tonal key: Paper #F6F4EF, navy #1B3557, ink #000000, white #FFFFFF, muted #515B67, cool #F1F4F7, and footer charcoal #1F2022 with cream #F2F1ED.
- Icon policy: Existing product and crest imagery and icons in their original positions.
- Proof assets: The current Indian Army crest, photographs, social-post illustration, and interactive scenario exactly where they are.
- Motion intensity: Existing interactions and entrance motion, plus the kit's ambient silk background in the existing canvas. Honor reduced motion and retain a CSS gradient fallback.

### Composition contract

- Hero archetype: Centered, with the existing Indian Army crest, KAVACH eyebrow, two headline lines, claim, lede, demo and learn-more actions, and bottom ticker.
- First-viewport structure: Preserve the existing nav position, one-viewport hero, typography hierarchy, centered content flow, and ticker band. Replace the green hero surface and canvas with the kit's Pearl Silver silk and 192px fade into the paper ground.
- Primary visual/proof artifact: Keep the original Indian Army crest and current lower product imagery. Silk is decorative.
- Interaction behavior: Preserve anchor navigation, mobile menu, clue tabs and autoplay, decision feedback and reset, demo form, and cookie controls.
- Reuse boundary: Map the kit palette onto existing tokens, self-host the supplied WOFF2, and adapt the exact shader and configuration to the existing canvas. Preserve EEVSEC and KAVACH images. Keep the explanatory social post's existing visual language and use the charcoal and cream palette for the footer and scene overlays.

### Filled generation prompt

Retheme the existing KAVACH homepage and privacy page to match the attached October 23, 2026 EEVSEC Brand Kit.

## Inputs
- Topic: KAVACH, EEVSEC's offline cyber-awareness training platform.
- Offer: The current offline training and readiness offering as already described on the site.
- Audience: Defence personnel, service families, and secure organisations.
- Primary user action: The existing Request a demo form and its current navigation links.
- Deliverable: A theme-only change to the existing static HTML, CSS, and vanilla JavaScript site.
- Style direction: EEVSEC Serif, a light editorial paper ground, Pearl Silver silk, navy accents, and a charcoal footer.
- Tonal key: Paper #F6F4EF, navy #1B3557, ink #000000, white #FFFFFF, muted #515B67, cool #F1F4F7, and footer charcoal #1F2022 with cream #F2F1ED.
- Icon policy: Existing product and crest imagery and icons in their original positions.
- Proof assets: The current Indian Army crest, photographs, social-post illustration, and interactive scenario exactly where they are.
- Motion intensity: Existing interactions and entrance motion, plus the kit's ambient silk background in the existing canvas. Honor reduced motion and retain a CSS gradient fallback.

The user's preservation requirement controls this brief. All instructions below concern the theme layer only. Existing headlines, words, actions, proof, components, support clusters, element order, image assets and crops, layout, breakpoints, and interactions must be preserved. The attached guide provides visual assets and reference values. Port its silk shader to the site's existing runtime and do not add a React dependency.

## Objective
Design one premium, memorable page with a dominant hero and one coherent visual world derived from the topic itself.
The result should feel specific, intentional, and action-oriented when the concept calls for action, not like a generic startup or SaaS template.

Choose the strongest clear solution.
Do not collapse the concept into a simpler generic pattern just to make execution easier.

- Treat single-file execution as a packaging constraint, not a creative constraint.
Do not reduce conceptual ambition, visual specificity, interaction richness, or production quality merely because the deliverable is concise.

## Internal concept choice
Before composing, decide internally:
- one dominant hero archetype: centered / asymmetrical / immersive
- one dominant proof mode: none / embedded gesture / single artifact
- one palette driver derived from the topic
- one tonal key: light / mid / dark / topic-derived
- one motion role: none / minimal / ambient / interactive
- one icon approach: none / minimal / expressive / topic-native
- optionally one secondary accent only if it strengthens the main direction without creating a second visual world
Do not output this planning.

## Non-negotiables
- Use a strong hero-first composition.
- Headline: 3-12 words, max 3 lines.
- Supporting copy: 1-2 short sentences, concise and specific.
- CTAs are optional. If used, include at most 1 primary and 1 secondary CTA.
- If a clear next step is central to the offer or concept, include a CTA; otherwise CTA omission is allowed.
- CTA labels must be specific to the offer and action, not generic.
- Supporting highlights are optional. If used, show them only once in a single lower support cluster beneath the hero.
- Keep the hero dominant, focused, readable, and uncluttered.
- Proof is optional. Use it only if it clearly strengthens the concept.
- If no real proof assets are provided, do not invent metrics, testimonials, customer logos, screenshots, or fake UI proof.
- Prefer depth inside the hero, proof gesture, CTA behavior, support copy, or background logic rather than adding extra sections by default.

## Composition
- Choose the clearest structure for the topic; do not default to generic two-column marketing layouts.
- A top navigation bar is optional. When used, make it native to the chosen style direction and subordinate to the hero rather than a generic boxed header.
- The hero may be fully integrated rather than framed.
- The hero does not need to become a panel, dashboard, device mockup, rounded card, or floating showcase unless the topic genuinely demands that artifact.
- Build hierarchy through scale, contrast, spacing, alignment, depth, rhythm, and composition before using frames, dividers, or containers.
- Keep supporting content clearly subordinate to the hero.
- Do not interpret structural restraint as permission to flatten the concept into a generic minimal layout.
- Do not use text-on-text layering, typographic collisions, or overlapping live text as a compositional device.

## Visual system
- Build one coherent visual world derived from the topic itself.
- Let the topic drive palette, contrast, typography, spacing, geometry, motifs, materials, and motion.
- Even restrained palettes must feel intentional and specific, not generic premium-neutral.
- The background must actively contribute mood, depth, and topic logic.
- If the topic suggests a real system language, physical behavior, or interface grammar, show that directly instead of generic abstract-tech decoration.
- Treat headline typography as part of the concept, not neutral text.
- The headline may use topic-derived color, selective emphasis, multi-tone treatment, or gradient accents when they strengthen the concept and remain readable.
- Do not default the headline to neutral black, white, or near-white unless that is clearly the strongest topic-native choice.

## Background and tonal diversity
- Premium and atmospheric design may be light, mid-tone, or dark; do not default to dark.
- Choose the tonal key from the topic, offer, audience, and style direction rather than from generic cinematic or tech aesthetics.
- Contrast may come from hue, saturation, temperature, texture, density, or scale, not only darkness.

## Proof and concept expression
- Prefer the minimum visual evidence needed to make the idea feel specific, credible, and native to the topic.
- If the concept is strongest with typography, atmosphere, and one precise gesture, do that.
- If a stronger proof artifact is justified, use one legible, unified artifact rather than multiple fragmented panels.
- Proof may take the form of a signal, trace, contour, command line, path, specimen, structural mark, scene fragment, or other topic-native evidence.
- Typography itself may carry part of the concept or proof.
- When appropriate, use one precise typographic gesture—such as selective word emphasis, chromatic offset, gradient emphasis, distortion, signal breakup, or structural interruption—to make the concept feel more specific and alive.
- Prefer one strong typographic intervention over many scattered decorative effects.
- Avoid decorative pseudo-proof.
- Avoid turning simple ideas into framed showcases, dashboard fragments, floating panels, softened slabs, or generic marketing geometry.

## Icons and symbolic language
- Icons are optional.
- Use icons only when they improve scanability, recognition, navigation, proof clarity, or support-cluster legibility.
- Prefer topic-native icon logic over generic startup glyphs.
- Keep icon style consistent in stroke weight, geometry, corner logic, and detail level.
- Use icons primarily in clearly secondary roles unless a single topic-native symbol is central to the concept.
- Do not let icons compete with the hero headline, proof artifact, or CTA hierarchy.

## Support cluster
- If used, show supporting highlights only once, in a single lower cluster beneath the hero.
- Each highlight should be short, fast to scan, and clearly secondary.
- Supporting highlights may use concise icons or symbolic marks when helpful.
- Support-cluster elements may use subtle motion when it improves scanability, continuity, or atmosphere and remains clearly secondary.
- Card-like grouping is allowed only inside this lower support cluster.
- These modules may use at most one light surface treatment, such as a subtle stroke, tonal fill, or very soft shadow.
- Keep support modules uniform, non-nested, and visually subordinate.
- Do not use card-like structures in the hero, proof, CTA area, or elsewhere on the page.

## Motion
- Motion is optional.
- Use motion only when it supports hierarchy, continuity, feedback, atmosphere, or topic logic.
- Default to none, minimal, or ambient motion depending on what the concept actually needs.
- Motion may live in typography, background behavior, proof logic, support-cluster behavior, or interaction feedback.
- A single key word or short phrase may use subtle text-based motion such as glitch, flicker, jitter, scanline shift, chromatic split, text scramble, pulse, or reveal if it strengthens the concept.
- Keep motion controlled, readable, non-blocking, and subordinate to clarity.
- Avoid scrolljacking, attention-hijacking loops, and ornamental animation.
- Respect reduced-motion preferences.

## Accessibility and readability
- Preserve strong readability and clear hierarchy at all viewport sizes.
- Maintain sufficient contrast between text and background.
- Do not place essential text over busy imagery unless readability remains strong.
- Avoid cramped spacing, visual collisions, and weak focal hierarchy.
- Do not place badges, pills, annotations, stickers, or floating interface fragments over essential text.
- If the deliverable is code, use semantic HTML structure, visible focus states, keyboard-friendly interactions, and reduced-motion handling.
- When in doubt, preserve legibility over expressive overlap.

## Anti-drift rules
- Do not drift into bland corporate SaaS styling.
- Do not default to dashboard aesthetics, feature-grid thinking, boxed-section composition, or template-like modularity.
- Do not use disconnected motifs, random color choices, or interchangeable abstract-tech shapes.
- Do not use card-within-card composition, nested surfaces, floating panels, fake proof, or stock-looking UI.
- Keep one visual world, one dominant hero, and one clear structural logic.
- Do not allow text, labels, or interface elements to overlap, collide, or sit on top of one another.

## Output
Update the existing static Kavach site and keep its production build self-contained.

## Final self-check
- Check that the palette and typography match the October 23 kit.
- Compare the original and revised body markup, permitting only decorative theme attributes and script references.
- Inspect desktop and mobile captures for both routes and check focus, navigation, clue tabs, the mission reset, form validation, consent, and reduced motion.

### Output target

- Paths: index.html and privacy.html, existing CSS under css/, the hero shader under js/, and the supplied font under media/fonts/.
