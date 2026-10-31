# CareFlow Studio — Verification notes

**Recorded:** 2026-10-31

This file distinguishes checks actually performed on the static code from testing that remains to be done. It is a lightweight engineering log, not a claim of a long development timeline.

## Verified in script-driven interaction checks

- Both inline JavaScript and the operations-studio JavaScript parse without syntax errors.
- Overview, Operations studio, Patient journeys, Patients, Appointments, and Reports render in a simulated browser environment.
- Operations studio includes a weekly appointment planner and a what-if simulation section.
- Patient journey view renders a linked patient history.
- Attempting to add a Scheduled appointment at an already-used doctor start time is rejected, leaving the appointment count unchanged.
- The browser application does not need an API call during the tested demo flows.

## Known limits of these checks

The checks use a lightweight simulated DOM. They **do not replace** testing in a real desktop/mobile browser, accessibility evaluation, or a complete end-to-end test suite. They do not certify medical-data security (and this prototype is not safe for clinical use).

## Manual browser review checklist

- [ ] On GitHub Pages, load the website and verify new Studio CSS is displayed.
- [ ] Resize browser to 375px and 1280px widths: verify the weekly grid and menu remain usable.
- [ ] Click Operations studio, then previous/next week.
- [ ] Drag the what-if slider: projected count changes without adding an appointment.
- [ ] Book a non-conflicting fictional visit. Reopen Operations studio and confirm counts update.
- [ ] Book an exact-time conflict: the form shows a warning and refuses the booking.
- [ ] Open Patient journeys, select another fictional profile, and inspect its history.
- [ ] Refresh: edits remain in the same browser.
- [ ] Reset demo: sample data returns.
- [ ] Navigate everything using keyboard only, including form dialogs and the appointment-date input.

## Next engineering work

The repository Issues track independently testable future tasks: duration-aware conflict detection, automated UI regression tests/accessibility work, and a visual entity-relationship explorer.

**Progress should be represented honestly.** Commits record code changes; they cannot establish hours worked or prove that a change was written manually.
