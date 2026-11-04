# Live illustrations beside exact code

Outcome: explain Phase 4 with small pictures that respond to the existing source-pixel selection and controls, while preserving the synchronized code/editor lanes.

The learner's questions identified settings, function arguments, background layers and gray calculation as missing visual links. Extend the existing live example card; keep its real numbers and teaching-preview context. Add native HTML/CSS diagrams for amount, boundary, argument passing, layers, RGB-to-gray, blending and rectangle placement. Other phases reuse applicable diagrams. Keep copy short and the p5 example/source generator unchanged.

Native cards are chosen over an animation/UI framework: they fit the existing plain-JavaScript site, work with the current selected pixel and add no dependency. New diagram data is an optional `visual` field on lineExample's existing result; `control` optionally names an existing strength/focus/time input to bring into view. The guide renderer displays these data, never edits source code.

Acceptance: the illustrated row shows the actual selected lesson line and numbers; RGB bars equal the simple channel average; a region map shows the rule's fraction and selected sample; strength is distinguished from opacity; the argument diagram shows the number received by amount. Region boundary is a rule fraction, not a promise of a sub-tile image edge. Time diagrams describe the teaching preview, not the separate editable sketch clock. Live source and color controls refresh diagrams without losing code selection, notes or drafts.

Keep p5.js 2.3.4, dark theme, native editor, current recovery, storage and HTML export allowlist. Test numerical data, accessible DOM output, line transitions, responsive layout and running p5. Unknown/absent visuals clear safely. No fabricated observations or assignment completion.
