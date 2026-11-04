# Clear instructions and numerical illustration

The learner approved the five findings from the live-screen review: connect a selected line with actual sample numbers; replace obsolete installation wording; name the separate teaching/practice outputs; enlarge selected code and simplify secondary actions; use one set of experiment values. These changes use the existing native UI and pixel model. No framework or asset dependency was added.

The [W3C cognitive usability guidance](https://www.w3.org/TR/coga-usable/), checked during the preceding review, supports clear steps, understandable words, relationships between controls and their effects, and reducing competing content. This is usability guidance, not a claim of WCAG conformance or proof of learning outcomes. The final teaching pattern is choose a sample → locate its channel address → read an amount → choose a drawing color → draw a block.

lineExample derives all displayed numbers from pixelFlowCore.sample. It uses the real selected coordinate, valid source width, stage/rule, teaching time and output geometry. Stage2 shows its actual four-argument RGBA fill; Stage3 shows RGB fill; later transformed outputs are labeled rounded RGB instead of pretending generated lerp arguments are exact integers. Teaching-clock calculations are explicitly scoped to the teaching preview. Changing a selected line or sample never rewrites a practice draft or restarts its clock.

The current-line explanation wraps the complete code and uses14px text. Gutter and editable source use matched24px rows. Run remains visible; Tools contains reset, undo, actual draft copy and download. Focus consistently uses40%→70% at strength100%. Separate account save instructions and actual class observations remain the learner's work.

Dependency hold: bundled p5.js2.3.4 remains unchanged, verified separately from primary documentation at the existing same-day checkpoint. This pass adds no p5 API. Recheck when the pin, runtime or asset loading route changes. Native checks, browser observations and successful hosted release are separate evidence records.
