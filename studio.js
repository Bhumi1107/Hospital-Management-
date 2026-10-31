/* CareFlow Studio · browser-only operations intelligence.
   Deliberately no backend, no analytics tracking, no medical AI.
   All people and records are synthetic demonstration examples. */
(function () {
"use strict";
const api=window.CareFlow, $=id=>document.getElementById(id);
if(!api)return;
let weekOffset=0,selectedPatient=null,scenarioDept=null,scenarioExtra=2;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function nameOf(entity,id){const d=api.getData(),obj=(d[entity]||[]).find(x=>Number(x[entity.slice(0,-1)+"_id"])===Number(id));if(!obj)return "Unknown";return obj.patient_name||obj.doctor_name||obj.department_name||"Unknown";}
function dateId(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function niceDate(s){if(!s)return "Date not specified";const d=new Date(s);if(isNaN(d.getTime()))return String(s).replace("T"," ");return d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})+" · "+d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"});}
function conflicts(appointments){const found=[],seen=new Map();for(const a of appointments.filter(x=>x.status==="Scheduled")){const key=a.doctor_id+"|"+a.appointment_date;if(seen.has(key))found.push([seen.get(key),a]);else seen.set(key,a);}return found;}
function setHeader(title,description){
  $("crumb").textContent=title;
  $("pageTitle").textContent=title;
  $("pageDesc").textContent=description;
  document.querySelectorAll("[data-view]").forEach(n=>n.classList.toggle("active",n.dataset.view===api.getView()));
}
function activityBadge(status){return '<span class="pill '+esc(String(status).toLowerCase())+'">'+esc(status)+'</span>';}
function bar(label,n,maximum){
 return '<div class="workload-row"><span>'+esc(label)+'</span><div class="workload-track"><span class="workload-bar" style="width:'+Math.round(100*n/Math.max(1,maximum))+'%"></span></div><b>'+n+'</b></div>';
}
function renderInsights(){
  const d=api.getData(),a=d.appointments,scheduled=a.filter(x=>x.status==="Scheduled"),done=a.filter(x=>x.status==="Completed"),cancelled=a.filter(x=>x.status==="Cancelled"),today=dateId(new Date()),upcoming=scheduled.filter(x=>x.appointment_date.slice(0,10)>=today);
  const overlaps=conflicts(a),counts=d.departments.map(dep=>{
    const doctorIds=d.doctors.filter(x=>Number(x.department_id)===Number(dep.department_id)).map(x=>Number(x.doctor_id));
    return {id:dep.department_id,name:dep.department_name,count:scheduled.filter(x=>doctorIds.includes(Number(x.doctor_id))).length};
  }).sort((x,y)=>y.count-x.count);
  if(scenarioDept===null||!d.departments.some(x=>String(x.department_id)===String(scenarioDept)))scenarioDept=d.departments[0]?.department_id??null;
  const max=Math.max(1,...counts.map(x=>x.count));
  const weekDate=new Date();weekDate.setHours(12,0,0,0);weekDate.setDate(weekDate.getDate()-((weekDate.getDay()+6)%7)+weekOffset*7);
  const lastDate=new Date(weekDate);lastDate.setDate(lastDate.getDate()+6);
  const days=Array.from({length:7},(_,i)=>{
    const day=new Date(weekDate);day.setDate(day.getDate()+i);
    const id=dateId(day),appts=scheduled.filter(x=>x.appointment_date.slice(0,10)===id).sort((x,y)=>x.appointment_date.localeCompare(y.appointment_date));
    return '<div class="week-day '+(id===today?"today":"")+'"><header>'+esc(day.toLocaleDateString(undefined,{weekday:"short"}))+'<strong>'+day.getDate()+'</strong></header>'+
      (appts.length?appts.map(x=>'<div class="appointment-chip"><b>'+esc(x.appointment_date.slice(11,16))+'</b>'+esc(nameOf("patients",x.patient_id))+'<span class="chip-doctor">'+esc(nameOf("doctors",x.doctor_id))+'</span></div>').join(""):'<div class="week-empty">No bookings</div>')+'</div>';
  }).join("");
  const signals=[];
  if(overlaps.length)signals.push('<div class="ops-alert warn"><span class="alert-icon">⚠</span><div><b>Existing double bookings</b>'+overlaps.length+' doctor–time conflict(s). Edit overlapping records.</div></div>');
  else signals.push('<div class="ops-alert"><span class="alert-icon">✓</span><div><b>No double bookings detected</b>Every scheduled doctor and exact start time is distinct.</div></div>');
  if(!upcoming.length)signals.push('<div class="ops-alert"><span class="alert-icon">◇</span><div><b>Quiet schedule ahead</b>No scheduled appointments dated today or later.</div></div>');
  const idle=d.doctors.filter(doc=>!scheduled.some(x=>Number(x.doctor_id)===Number(doc.doctor_id)));
  if(idle.length)signals.push('<div class="ops-alert"><span class="alert-icon">◷</span><div><b>Doctors without scheduled visits</b>'+idle.length+' doctor(s) have no active bookings in this scenario.</div></div>');
  signals.push('<div class="ops-alert"><span class="alert-icon">◎</span><div><b>Transparent analysis</b>These are counts and deterministic rules, not clinical advice or predictive AI.</div></div>');
  setHeader("Operations studio","Explore trends, plan schedules and discover operational patterns from your fictional records.");
  $("pageActions").innerHTML='<button class="btn light" data-studio="reset">↺ Reset demo</button><button class="btn primary" data-action="new" data-entity="appointments">＋ Book appointment</button>';
  $("content").innerHTML='<div class="studio-banner"><span>✳</span><div><strong>Interactive operations laboratory.</strong> Every chart below is calculated from this browser’s fictional appointment data. Try adding an appointment or changing its status, then return to see the changes.</div></div>'+
  '<div class="ops-hero"><div><div class="eyebrow">CARE OPERATIONS · INTERACTIVE SANDBOX</div><h2>See the system, not just the records.</h2><p>Explore workload patterns, a seven-day schedule and transparent scheduling checks. No server or external database.</p></div><div class="badge-art" aria-hidden="true">◈</div></div>'+
  '<div class="ops-kpis"><div class="ops-kpi"><label>Scheduled visits</label><strong>'+scheduled.length+'</strong><small>'+upcoming.length+' today or later</small></div><div class="ops-kpi"><label>Completed visits</label><strong>'+done.length+'</strong><small>All demo dates</small></div><div class="ops-kpi"><label>Cancellations</label><strong>'+cancelled.length+'</strong><small>All demo dates</small></div><div class="ops-kpi"><label>Doctor slot conflicts</label><strong>'+overlaps.length+'</strong><small>Exact start-time matches</small></div></div>'+
  '<div class="ops-grid"><section class="ops-card"><h3>Department workload</h3><p class="note">Scheduled appointments grouped by doctor department.</p>'+(counts.length?counts.map(x=>bar(x.name,x.count,max)).join(""):'<p class="note">Add a department and doctor to start exploring.</p>')+'</section><section class="ops-card"><h3>Operations signals</h3><p class="note">Simple rules you can understand and verify.</p><div class="ops-list">'+signals.join("")+'</div></section></div>'+
  '<div class="sectionhead"><div><h3>Weekly appointment planner</h3><p>Browse real demo appointments by calendar week.</p></div><div class="week-nav"><button class="btn light sm" data-studio="previous" aria-label="Previous week">←</button><span class="week-label">'+esc(weekDate.toLocaleDateString(undefined,{month:"short",day:"numeric"}))+' – '+esc(lastDate.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}))+'</span><button class="btn light sm" data-studio="next" aria-label="Next week">→</button><button class="btn light sm" data-studio="today">Today</button></div></div><div class="week-grid">'+days+'</div>'+
  '<div class="sectionhead"><div><h3>What-if scenario lab</h3><p>Preview extra bookings in one department without changing stored data.</p></div><span class="today-chip">◆ Simulation only</span></div>'+
  '<section class="ops-card"><div class="journey-selector"><label for="scenarioDepartment"><strong>Department</strong></label><select id="scenarioDepartment">'+d.departments.map(x=>'<option value="'+x.department_id+'" '+(String(x.department_id)===String(scenarioDept)?"selected":"")+'>'+esc(x.department_name)+'</option>').join("")+'</select><label for="scenarioExtra"><strong>Extra bookings</strong></label><input type="range" id="scenarioExtra" min="0" max="10" step="1" value="'+scenarioExtra+'"><strong id="scenarioExtraLabel">'+scenarioExtra+'</strong></div><div id="scenarioResult" class="ops-list"></div><p class="insight-micro">This models only the number of appointments, not appointment length, staffing, resource capacity or medical urgency.</p></section>'+
  '<div class="studio-actions"><button class="btn light" data-view="journey">View patient journeys →</button><button class="btn light" data-view="appointments">Manage appointments ↗</button></div>';
  updateScenario();
}
function updateScenario(){
 const d=api.getData(),department=d.departments.find(x=>String(x.department_id)===String(scenarioDept)),target=$("scenarioResult");
 if(!target)return;
 if(!department){target.innerHTML='<div class="blank">No departments available for simulation.</div>';return;}
 const ids=d.doctors.filter(x=>Number(x.department_id)===Number(department.department_id)).map(x=>Number(x.doctor_id));
 const current=d.appointments.filter(x=>x.status==="Scheduled"&&ids.includes(Number(x.doctor_id))).length,projected=current+scenarioExtra;
 target.innerHTML='<div class="ops-alert"><span class="alert-icon">↗</span><div><b>'+esc(department.department_name)+' — simulated workload</b>Current scheduled: <strong>'+current+'</strong> · Scenario: <strong>'+projected+'</strong> ('+(scenarioExtra?'+':'')+scenarioExtra+'). These additional bookings are <strong>not saved</strong>.</div></div>'+bar("Current",current,projected)+bar("Scenario",projected,projected);
 const label=$("scenarioExtraLabel");if(label)label.textContent=scenarioExtra;
}
function journey(){
 const d=api.getData(),patients=d.patients;
 setHeader("Patient journeys","Explore how visits and notes connect across your five relational entities.");
 $("pageActions").innerHTML='<button class="btn primary" data-action="new" data-entity="patients">＋ Add demo patient</button>';
 if(!patients.length){$("content").innerHTML='<div class="studio-banner"><strong>Fictional records only.</strong> Add a demo patient to begin.</div><div class="card"><div class="blank">No demo patient records.</div></div>';return;}
 if(!patients.some(x=>Number(x.patient_id)===Number(selectedPatient)))selectedPatient=patients[0].patient_id;
 const p=patients.find(x=>Number(x.patient_id)===Number(selectedPatient));
 const visits=d.appointments.filter(x=>Number(x.patient_id)===Number(selectedPatient)).sort((a,b)=>b.appointment_date.localeCompare(a.appointment_date));
 const notes=d.medical_records.filter(x=>Number(x.patient_id)===Number(selectedPatient));
 const events=visits.map(x=>'<div class="event"><span class="event-type">Appointment</span><h4>'+esc(nameOf("doctors",x.doctor_id))+'</h4><p>'+activityBadge(x.status)+' · '+esc(niceDate(x.appointment_date))+'</p></div>').join("");
 const medical=notes.map(x=>'<div class="event"><span class="event-type">Undated medical note</span><h4>'+esc(x.diagnosis)+'</h4><p>'+esc(x.treatment)+'</p><time>Linked doctor: '+esc(nameOf("doctors",x.doctor_id))+'</time></div>').join("");
 $("content").innerHTML='<div class="studio-banner"><span>◎</span><div><strong>A relationship explorer, not a patient portal.</strong> It follows fictional appointments and medical notes across linked records. Because this five-entity design has no record-date field, clinical notes are explicitly shown as undated.</div></div>'+
 '<div class="journey-selector"><label for="journeySelect"><strong>Explore a fictional patient</strong></label><select id="journeySelect">'+patients.map(x=>'<option value="'+x.patient_id+'" '+(Number(x.patient_id)===Number(selectedPatient)?"selected":"")+'>'+esc(x.patient_name)+'</option>').join("")+'</select><button class="btn light" data-view="patients">Manage patients ↗</button></div>'+
 '<div class="journey-shell"><aside class="journey-profile"><div class="profile-round">♙</div><span class="eyebrow">DEMO PROFILE</span><h3>'+esc(p.patient_name)+'</h3><p>Age '+esc(p.age)+' · '+esc(p.gender)+'<br>Contact: '+esc(p.phone)+'</p><div class="journey-data"><div><strong>'+visits.length+'</strong><span>Visits</span></div><div><strong>'+notes.length+'</strong><span>Notes</span></div></div></aside><section class="journey-details"><div class="card-title"><h3>Linked patient history</h3><span>Demo events</span></div><div class="event-list">'+(events||'<p class="note">No visits yet. Add an appointment to see it here.</p>')+medical+'</div><div class="studio-actions"><button class="btn primary" data-action="new" data-entity="appointments">＋ Book appointment</button><button class="btn light" data-action="new" data-entity="medical_records">＋ Add note</button></div><div class="notice-demo">Public portfolio prototype. Never enter real personal or clinical information here. Data is stored in this browser and is not protected for healthcare use.</div></section></div>';
}
function render(view){if(view==="insights")renderInsights();else if(view==="journey")journey();}
document.addEventListener("click",e=>{
 const book=e.target.closest('[data-action="new"][data-entity="appointments"]');
 if(book&&api.getView()==="journey"&&selectedPatient!==null){
   const selector=$("formFields")?.querySelector('[name="patient_id"]');
   if(selector){selector.value=String(selectedPatient);updateSlotHint();}
 }
 const b=e.target.closest("[data-studio]");if(!b)return;
 if(b.dataset.studio==="previous")weekOffset--;
 if(b.dataset.studio==="next")weekOffset++;
 if(b.dataset.studio==="today")weekOffset=0;
 if(b.dataset.studio==="reset"){if(!confirm("Restore the fictional sample data? All edits saved in this browser will be replaced."))return;api.resetDemo();api.notify("Sample demo restored.");return;}
 renderInsights();
});
document.addEventListener("change",e=>{
 if(e.target.id==="journeySelect"){selectedPatient=Number(e.target.value);journey();}
 if(e.target.id==="scenarioDepartment"){scenarioDept=e.target.value;updateScenario();}
});
document.addEventListener("input",e=>{
 if(e.target.id==="scenarioExtra"){scenarioExtra=Number(e.target.value);updateScenario();}
});

function updateSlotHint(){
 const hint=$("slotHint"),fields=$("formFields");if(!hint||!fields)return;
 const doctor=fields.querySelector('[name="doctor_id"]'),patient=fields.querySelector('[name="patient_id"]'),date=fields.querySelector('[name="appointment_date"]'),status=fields.querySelector('[name="status"]');
 const doctorId=Number(doctor?.value),patientId=Number(patient?.value),when=date?.value||"",state=status?.value||"Scheduled";
 if(!doctorId||!patientId||!when){hint.textContent="Select a doctor, patient and start time to check for overlapping bookings in this demo.";hint.className="slot-hint";return;}
 if(state!=="Scheduled"){hint.textContent="This appointment is not Scheduled, so it does not reserve the start-time slot.";hint.className="slot-hint";return;}
 const exclude=api.getEditId(),bookings=api.getData().appointments.filter(a=>a.status==="Scheduled"&&Number(a.appointment_id)!==Number(exclude));
 const colliding=bookings.filter(a=>a.appointment_date===when&&(Number(a.doctor_id)===doctorId||Number(a.patient_id)===patientId));
 if(!colliding.length){hint.textContent="✓ This exact start time is available in the current fictional dataset.";hint.className="slot-hint";return;}
 hint.className="slot-hint bad";
 let suggestion=[];
 const start=new Date(when);
 if(!isNaN(start.getTime())){
   for(let i=1;i<=12&&suggestion.length<3;i++){
      const later=new Date(start.getTime()+30*i*60000);
      const proposed=dateId(later)+"T"+String(later.getHours()).padStart(2,"0")+":"+String(later.getMinutes()).padStart(2,"0");
      if(proposed.slice(0,10)!==when.slice(0,10))break;
      if(!bookings.some(a=>a.appointment_date===proposed&&(Number(a.doctor_id)===doctorId||Number(a.patient_id)===patientId)))suggestion.push(proposed.slice(11,16));
   }
 }
 hint.textContent="⚠ That doctor or patient is booked at this exact time."+(suggestion.length?" Try a later start time: "+suggestion.join(", ")+".":" Choose another start time.");
}
document.addEventListener("input",e=>{if(e.target?.closest?.("#formFields"))updateSlotHint();});
document.addEventListener("change",e=>{if(e.target?.closest?.("#formFields"))updateSlotHint();});

window.CareFlowStudio={render};
})();
