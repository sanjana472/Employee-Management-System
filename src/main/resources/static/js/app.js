const API = { employees: "/api/employees", departments: "/api/departments", summary: "/api/dashboard/summary" };
let employees = [], departments = [], growthChart, departmentChart;
const $ = (id) => document.getElementById(id);
const money = (value) => value == null ? "—" : new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
const dateText = (value) => value ? new Date(value + "T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
function toast(message, error=false) {
  const el=$("toast"); el.textContent=message; el.style.background=error?"#4a202b":"#123d37"; el.style.borderColor=error?"#b94d67":"#1ba77f";
  el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2800);
}
async function api(url, options={}) {
  const response=await fetch(url,{headers:{"Content-Type":"application/json"},...options});
  const raw=await response.text(); let data=null;
  try { data=raw?JSON.parse(raw):null; } catch { data=raw; }
  if(!response.ok) throw new Error(data?.message || data?.detail || data || `Request failed (${response.status})`);
  return data;
}
function departmentName(employee){return employee.department?.name || "Unassigned";}
function avatarLetter(name){return (name||"?").trim().charAt(0).toUpperCase();}
function setDate(){ $("todayDate").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"}); }
async function loadAll(){
  try {
    [employees,departments]=await Promise.all([api(API.employees),api(API.departments)]);
    renderDashboard(); renderEmployees(); renderDepartments(); populateDepartmentSelect();
  } catch(err) { toast("Could not load data: "+err.message,true); }
}
async function loadSummary(){
  try {
    const s=await api(API.summary);
    $("totalEmployees").textContent=s.totalEmployees;
    $("activeEmployees").textContent=s.activeEmployees;
    $("departmentCount").textContent=s.departments;
    $("attendanceCount").textContent="—";
  } catch(e){ console.warn(e); }
}
function renderDashboard(){
  $("totalEmployees").textContent=employees.length;
  $("activeEmployees").textContent=employees.length;
  $("departmentCount").textContent=departments.length;
  $("attendanceCount").textContent="—";
  $("donutTotal").textContent=employees.length;
  const recent=[...employees].sort((a,b)=>b.id-a.id).slice(0,5);
  $("recentEmployees").innerHTML=recent.length?recent.map(e=>`<tr><td>EMP${String(e.id).padStart(3,"0")}</td><td><div class="emp-name"><span class="emp-avatar">${avatarLetter(e.name)}</span>${escapeHtml(e.name)}</div></td><td>${escapeHtml(departmentName(e))}</td><td>${escapeHtml(e.designation||"—")}</td><td>${dateText(e.joiningDate)}</td><td><span class="status">Active</span></td></tr>`).join(""):`<tr><td colspan="6">No employee records yet. Use Add Employee to get started.</td></tr>`;
  renderCharts();
}
function renderCharts(){
  const months=["Aug","Sep","Oct","Nov","Dec","Jan"];
  if(growthChart) growthChart.destroy();
  growthChart=new Chart($("growthChart"),{type:"line",data:{labels:months,datasets:[{data:months.map((_,i)=>Math.max(0,employees.length-(5-i)*2)),borderColor:"#54a9ff",backgroundColor:"rgba(93,82,255,.25)",fill:true,tension:.4,pointBackgroundColor:"#fff",pointBorderColor:"#657aff",pointRadius:3,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:"#a9bdd8",font:{size:10}}},y:{grid:{color:"rgba(137,166,205,.15)"},ticks:{color:"#8ea4c3",font:{size:10}},beginAtZero:true}}}});
  const counts=departments.map(d=>employees.filter(e=>e.department?.id===d.id).length);
  if(departmentChart) departmentChart.destroy();
  const colors=["#13b9ee","#9a55ed","#f5a623","#13d3a0","#e84ca9","#f5d33f","#638cff"];
  departmentChart=new Chart($("departmentChart"),{type:"doughnut",data:{labels:departments.map(d=>d.name),datasets:[{data:counts.map((n)=>n||0.001),backgroundColor:colors,borderWidth:0,hoverOffset:5}]},options:{responsive:true,maintainAspectRatio:false,cutout:"70%",plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>`${ctx.label}: ${counts[ctx.dataIndex]||0}`}}}}});
  $("departmentLegend").innerHTML=departments.length?departments.map((d,i)=>`<div class="legend-row"><span class="legend-dot" style="background:${colors[i%colors.length]}"></span>${escapeHtml(d.name)}<b>${counts[i]}</b></div>`).join(""):"<span class='muted'>No departments yet</span>";
}
function renderEmployees(filter=""){
  const q=filter.toLowerCase();
  const rows=employees.filter(e=>[e.name,e.email,e.designation,departmentName(e)].join(" ").toLowerCase().includes(q));
  $("employeeTotal").textContent=`${rows.length} record(s)`;
  $("employeesTable").innerHTML=rows.map(e=>`<tr><td>${e.id}</td><td><div class="emp-name"><span class="emp-avatar">${avatarLetter(e.name)}</span>${escapeHtml(e.name)}</div></td><td>${escapeHtml(e.email)}</td><td>${escapeHtml(departmentName(e))}</td><td>${escapeHtml(e.designation||"—")}</td><td>${money(e.salary)}</td><td>${dateText(e.joiningDate)}</td><td><button class="action-btn" onclick="editEmployee(${e.id})" title="Edit">✎</button><button class="action-btn" onclick="deleteEmployee(${e.id})" title="Delete">⌫</button></td></tr>`).join("") || `<tr><td colspan="8">No matching employees found.</td></tr>`;
}
function renderDepartments(){
  $("departmentCards").innerHTML=departments.map(d=>`<article class="department-card"><h3>${escapeHtml(d.name)}</h3><p>${escapeHtml(d.description||"No description provided.")}</p><small>${employees.filter(e=>e.department?.id===d.id).length} employee(s)</small><div class="card-actions"><button class="secondary-btn" onclick="editDepartment(${d.id})">Edit</button><button class="secondary-btn" onclick="deleteDepartment(${d.id})">Delete</button></div></article>`).join("") || "<p class='muted'>No departments created yet.</p>";
}
function populateDepartmentSelect(){
  $("empDepartment").innerHTML='<option value="">No department</option>'+departments.map(d=>`<option value="${d.id}">${escapeHtml(d.name)}</option>`).join("");
}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showModal(id){$(id).classList.remove("hidden");}
function hideModal(id){$(id).classList.add("hidden");}
function showView(view){
  $("dashboardView").classList.toggle("hidden",view!=="dashboard");
  $("employeesView").classList.toggle("hidden",view!=="employees");
  $("departmentsView").classList.toggle("hidden",view!=="departments");
  $("placeholderView").classList.toggle("hidden",["dashboard","employees","departments"].includes(view));
  if(!["dashboard","employees","departments"].includes(view)) $("placeholderTitle").textContent=view.charAt(0).toUpperCase()+view.slice(1)+" module";
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
}
function resetEmployeeForm(){ $("employeeForm").reset(); $("employeeId").value=""; $("employeeModalTitle").textContent="Add Employee"; }
$("employeeForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const id=$("employeeId").value, departmentId=$("empDepartment").value;
  const payload={name:$("empName").value.trim(),email:$("empEmail").value.trim(),phone:$("empPhone").value.trim(),designation:$("empDesignation").value.trim(),salary:$("empSalary").value?Number($("empSalary").value):0,joiningDate:$("empJoiningDate").value||null};
  const url=id?`${API.employees}/${id}${departmentId?`?departmentId=${departmentId}`:""}`:`${API.employees}${departmentId?`?departmentId=${departmentId}`:""}`;
  try{await api(url,{method:id?"PUT":"POST",body:JSON.stringify(payload)});hideModal("employeeModal");toast(id?"Employee updated":"Employee added successfully");await loadAll();}
  catch(err){toast(err.message,true);}
});
$("departmentForm").addEventListener("submit",async e=>{
  e.preventDefault(); const id=$("departmentId").value;
  const payload={name:$("deptName").value.trim(),description:$("deptDescription").value.trim()};
  try{await api(id?`${API.departments}/${id}`:API.departments,{method:id?"PUT":"POST",body:JSON.stringify(payload)});hideModal("departmentModal");toast(id?"Department updated":"Department added successfully");await loadAll();}
  catch(err){toast(err.message,true);}
});
window.editEmployee=(id)=>{
  const e=employees.find(x=>x.id===id);if(!e)return;
  resetEmployeeForm();$("employeeModalTitle").textContent="Edit Employee";$("employeeId").value=e.id;
  $("empName").value=e.name;$("empEmail").value=e.email;$("empPhone").value=e.phone||"";
  $("empDesignation").value=e.designation||"";$("empSalary").value=e.salary??"";
  $("empJoiningDate").value=e.joiningDate||"";$("empDepartment").value=e.department?.id||"";
  showModal("employeeModal");
};
window.deleteEmployee=async(id)=>{
  if(!confirm("Delete this employee record?"))return;
  try{await api(`${API.employees}/${id}`,{method:"DELETE"});toast("Employee deleted");await loadAll();}
  catch(err){toast(err.message,true);}
};
window.editDepartment=(id)=>{
  const d=departments.find(x=>x.id===id);if(!d)return;
  $("departmentForm").reset();$("departmentId").value=d.id;$("deptName").value=d.name;$("deptDescription").value=d.description||"";
  $("departmentModalTitle").textContent="Edit Department";showModal("departmentModal");
};
window.deleteDepartment=async(id)=>{
  if(!confirm("Delete this department? It must not contain employees."))return;
  try{await api(`${API.departments}/${id}`,{method:"DELETE"});toast("Department deleted");await loadAll();}
  catch(err){toast(err.message,true);}
};
$("addEmployeeBtn").onclick=$("quickAddEmployee").onclick=()=>{resetEmployeeForm();populateDepartmentSelect();showModal("employeeModal");};
$("addDepartmentBtn").onclick=$("quickAddDepartment").onclick=()=>{$("departmentForm").reset();$("departmentId").value="";$("departmentModalTitle").textContent="Add Department";showModal("departmentModal");};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>hideModal(b.dataset.close));
document.querySelectorAll(".modal-backdrop").forEach(backdrop=>backdrop.addEventListener("click",e=>{if(e.target===backdrop)hideModal(backdrop.id);}));
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
document.querySelectorAll("[data-coming]").forEach(b=>b.addEventListener("click",()=>toast(`${b.dataset.coming} is planned for the next phase.`)));
$("employeeSearch").addEventListener("input",e=>renderEmployees(e.target.value));
$("globalSearch").addEventListener("input",e=>{showView("employees");$("employeeSearch").value=e.target.value;renderEmployees(e.target.value);});
$("menuBtn").addEventListener("click",()=>document.querySelector(".sidebar").classList.toggle("sidebar-open"));
setDate();loadAll();
