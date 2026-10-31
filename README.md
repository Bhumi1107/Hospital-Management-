# CareFlow Studio — Hospital Operations Sandbox

An interactive **browser-only hospital operations demonstration** built with HTML, CSS, and JavaScript.

**Live website:** https://bhumi1107.github.io/Hospital-Management-/

> **Educational portfolio simulation.** Every included patient and doctor is fictional. Do not enter real medical or personal information. There is no login, server, shared database, or clinical security layer.

## Why this project?

Hospital dashboards often show tables without explaining how patients, doctors, appointments and departments connect. CareFlow Studio makes those relationships interactive. Visitors can add fictional appointments, examine changes in workload, explore linked records, and test scheduling constraints.

The idea is not to claim that this is a real hospital management product. It is to demonstrate frontend engineering, domain modeling, state management, simple analytics, and thoughtful UI.

## Try the demo

1. Open **Operations studio**. Explore the weekly planner, appointment counts, department workload and signals.
2. Open **Appointments**. Add a fictional visit, then return to Operations studio. The schedule and counts update.
3. Try booking the **same doctor at exactly the same start time**. The form rejects overlapping Scheduled appointments and explains the conflict. It also blocks a patient from being booked twice at the same start time.
4. Explore the **What-if scenario lab**. Add 0–10 hypothetical department bookings using the slider. The projected counts change, but no appointments are created.
5. Open **Patient journeys** and select a fictional patient. See linked appointments and medical notes.
6. Try **Reset demo** to restore the starter dataset, or **Export demo JSON** from a records screen.

## Current features

| Feature | Function |
| --- | --- |
| Overview dashboard | Counts, upcoming appointments and quick actions |
| Five-entity record manager | CRUD and search for departments, doctors, patients, appointments and medical records |
| Operations studio | Status counts, department workload bars and transparent rule-based operational signals |
| Seven-day planner | Navigate appointment schedules by week |
| Conflict checks | Prevent exact doctor–time and patient–time collisions for Scheduled appointments |
| Start-time hints | Suggest unoccupied 30-minute increments after a conflicting start time |
| What-if simulation | Preview added workload without changing saved records |
| Patient journeys | Explore connected fictional visits and undated medical notes |
| Relational reports | Browser-calculated relationship and aggregation examples |
| Local demo persistence | Browser localStorage keeps fictional edits on the same device |
| Export/reset | Download demo JSON or restore fictional starter records |

## Project design

Five interconnected entities are represented as JavaScript objects:

- departments — department_id, department_name, location
- doctors — doctor_id, doctor_name, specialization, department_id
- patients — patient_id, patient_name, age, gender, phone
- appointments — appointment_id, patient_id, doctor_id, appointment_date, status
- medical_records — record_id, patient_id, doctor_id, diagnosis, treatment

Doctors belong to departments. Appointments link a patient to a doctor. Medical notes also link patients and doctors. Validation checks these relationships. The system prevents deleting a record that is referenced by another record.

Medical records have **no date field** in this five-entity model, so the journey explorer explicitly labels them **undated** instead of inventing a clinical timeline.

## Technology and architecture

**HTML5 · CSS3 · Vanilla JavaScript · Browser localStorage · GitHub Pages**

Browser → interface + rule-based calculations → localStorage

There is **no MySQL, Python backend, cloud storage, paid API, or AI model** in CareFlow Studio. Its “intelligence” consists of transparent, deterministic calculations rather than machine-learning predictions.

The static project requires no build process or installation. Download and extract the repository ZIP, then open index.html in a modern browser. You can also use the live GitHub Pages URL.

Important files:

- index.html — core interface, data model, forms and browser-side CRUD
- studio.js — weekly calendar, workload analysis, what-if lab, patient journey explorer
- studio.css — responsive Studio design
- README.md — purpose, architecture, usage and limitations
- .nojekyll — simple GitHub Pages publishing

## What has been implemented and tested

- All major navigation sections render with fictional starter data.
- A new fictional patient can be created in demo mode and saved in browser storage.
- A duplicate Scheduled appointment for the same doctor/start time is rejected.
- Operations Studio updates from the current dataset; the what-if calculations do not save extra bookings.
- JavaScript syntax checks pass for the Studio scripts.

These are focused functional checks, **not** a full automated end-to-end test suite or proof of production readiness.

## Engineering decisions

**Why localStorage?** Visitors can safely explore a standalone portfolio interface without provisioning servers or maintaining accounts. The tradeoff is device-local state; visitors do not share records.

**Why transparent rules?** Workload and conflicts can be explained directly from the data. Claiming medical “AI” without a validated model would misrepresent the project.

**Why a separate operations view?** The value of connected data is clearer when users see operational consequences, not only CRUD forms.

**Why stop at exact start-time conflicts?** Appointment durations, staff availability and room allocation are not modeled. The UI describes this limitation rather than claiming complete scheduling optimization.

## Known limitations

- **Never use with real patient data.** Browser localStorage is not a secured medical database.
- No real accounts, roles, audit logs, server, backups or multi-user collaboration.
- The scheduler checks matching start times only, not overlapping visit durations, staff shifts or resources.
- The scenario lab changes a projected count; it doesn't schedule actual appointments.
- The relational reports are calculated in JavaScript; they are **not SQL queries**.
- Starter data is fictional; analytics are demonstrations rather than evidence of real hospital operations.
- Comprehensive keyboard, accessibility and end-to-end testing remains future work.

## Genuine development roadmap

The following enhancements are **not yet complete**:

- [ ] Extract independently testable scheduling and reporting modules and add automated tests.
- [ ] Improve keyboard navigation and evaluate accessibility across devices.
- [ ] Build a visual entity-relationship explorer with linked records.
- [ ] Add appointment duration and overlap handling.
- [ ] Add a guided first-visit tour and annotated screenshots.

For the real evolution of this project, see the repository's **Commits** and **Issues**. Commits show recorded changes, not hours worked.

---

**CareFlow Studio is a frontend and data-modeling portfolio project, not a clinical application or medical AI system.**
