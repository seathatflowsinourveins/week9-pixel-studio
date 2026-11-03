# p5 account handoff implementation

Goal: provide an understandable, reliable native p5 saving route while retaining the side-by-side guide.
Spec: ../specs/2026-11-03-p5-account-handoff-design.md
Stack: existing native HTML/CSS/JavaScript and pinned p5.js; no added dependencies.

- [x] Test and implement the host's full-tab/save help controls, dynamic guide copying and saved project callbacks. Worker owns editor-frame.js, editor-frame.test.cjs and editor-view.css.
- [x] Test a small assignment-code-link storage adapter. Root owns account-project.js/test and explicit public asset routes.
- [x] Wire dynamic lesson/loop code and the saved link adapter. Update misleading sign-in instructions and documentation.
- [x] Verify native p5 account behavior without copying credentials or changing privacy settings. Preserve current edits before any navigation.
- [ ] Run native tests/static build, review the focused changes, check desktop/mobile behavior, publish and verify the existing Pages site.

Key failure cases: stale suggested examples must not replace an own saved link; invalid URL or unreadable/full storage must not erase notes; clipboard failure must not be called success; no action silently transfers unsaved iframe code; no iframe reload during guide/save-help/progress interactions.

Before publication: 91 native tests pass; static build contains86 public files. Reviewer finding on the Finish change event is fixed. Browser tests verified copy, invalid/kept/cleared links, saved-project startup, stage persistence and phone-width fit. Native p5 account save was independently reloaded and rendered. Publication and final live verification follow these checks.
