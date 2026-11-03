# Account saving checkpoint

Outcome: the learner can keep working beside the guide and use the original p5 website to sign in and save. This dashboard cannot establish a p5 account session inside an embedded page.

Observed on 2026-11-03: the embedded editor displayed Log in, while opening the same prepared sketch as a top-level Chrome tab displayed the learner's existing signed-in account. Through native p5 File → Duplicate, the preserved Stage 3 code was saved into a separate sketch. Reloading that sketch retained the name and exact code; a native Play click painted the window-and-plant mosaic. The original prepared mosaic was preserved. These observations establish that the full-tab account route works; the exact cookie or identity-provider restriction inside the frame was not inspected.

The [official p5 setup guide](https://p5js.org/tutorials/setting-up-your-environment/) documents account saving and the editor's native controls. [MDN's third-party-cookie guide](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Third-party_cookies) explains why cross-site embedded sign-in can behave differently from a top-level page. This is supporting context, not proof of a specific browser setting in this session.

Alternatives: retrying iframe login would keep the same account boundary; changing browser cookie settings would alter the learner's privacy configuration; a custom sign-in/editor service would change the existing native account route. Retain the original p5 service and provide an explicit full-tab handoff. No credential, cookie, permission or privacy setting is copied or changed.

The header now distinguishes prepared guide code from unsaved pane edits. Save help includes Copy p5 link for opening the current saved destination in Chrome or Edge when an in-app browser blocks sign-in. An optional validated saved-sketch URL reuses Finish.links.code and its existing Progress export. Initial mounting can display that public saved sketch; later stage, help, copy, import and link changes never navigate the open practice pane. Explicit Load example here remains available and says it replaces pane edits.

Local regression checks cover invalid URLs, unreadable/future-version/full storage, field-preserving saves, existing Progress round trips, dynamic guide copying, clipboard failure, same-page Finish events and iframe persistence. Browser checks cover kept/cleared links, current-stage copy, fresh saved-sketch loading, stage switching and a 390-pixel layout. The same-page Finish event mismatch was found in review and fixed with an observed RED → GREEN test.

Dependencies are unchanged: bundled p5.js remains 2.3.4; no runtime library was added. Hold the accepted pins because this change uses existing native links, Clipboard and storage, not new p5 APIs. Recheck documentation and upstream implementation/tests when changing those APIs or pins. Hosted publication is verified separately after pushing the change.
