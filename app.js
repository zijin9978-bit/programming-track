
const START = new Date(2026, 7, 24); // Aug = 7
const END = new Date(2028, 5, 7);
const STORAGE_KEY = "programmingTrackProgressV2";
const THEME_KEY = "programmingTrackTheme";

const WEEKS = [
  ["Python：输入、输出与基本类型","完成 BMI / 成绩判断 / 简单计算器中的至少 2 个"],
  ["Python：循环与列表","完成平均分、最大值、及格人数 3 个练习"],
  ["Python：字典、集合与字符串","做一个简易学生成绩管理器"],
  ["Python：函数","把前 3 周至少 2 个程序重构成函数"],
  ["文件读写","完成 TXT 文本 / 单词统计器"],
  ["异常与调试","故意制造并修复 5 个报错，记录原因"],
  ["类与对象基础","写一个 Student 或 Task 类"],
  ["工程基础：pip / venv / Git / Terminal","把本阶段代码初始化成 Git 仓库并提交"],
  ["NumPy：array / shape / dtype / ndim","完成 10 个数组创建与 shape 练习"],
  ["NumPy：索引 / 切片 / reshape / transpose","完成 8 个形状变换练习"],
  ["NumPy：向量 / 矩阵 / 点积 / 矩阵乘法","手算 2 题，再用 NumPy 验证"],
  ["NumPy：broadcasting / 聚合 / 简单可视化","做一个小型数据分析脚本"],
  ["机器学习概念：train/val/test / feature / label","自己画出一次 ML pipeline"],
  ["线性回归","完成一个学习时间 → 成绩的回归小实验"],
  ["分类入门：Logistic Regression / Decision Tree","完成 Iris 分类实验"],
  ["PyTorch：Tensor / shape / dtype / device","把常见 NumPy 操作用 Torch 再做一遍"],
  ["PyTorch：autograd","用 3 个简单函数观察梯度"],
  ["PyTorch：nn.Module / Linear / ReLU","定义并跑通一个两层网络"],
  ["训练循环：loss / backward / optimizer","手写完整 training loop"],
  ["MNIST：数据加载","加载并可视化 MNIST 样本"],
  ["MNIST：训练与测试","训练一个基础数字识别网络"],
  ["MNIST：收尾与复盘","保存 / 加载模型，并写一页复盘"]
];

const PHASES = [
  ["2027-02-01","2027-03-31","巩固 Python + NumPy","每周 2–3 次，复写旧项目、补薄弱点"],
  ["2027-04-01","2027-06-30","机器学习 + PyTorch 巩固","以小实验为主，不追求课程速度"],
  ["2027-07-01","2027-08-31","暑假：第一个完整 AI 小项目","集中完成一个可展示的小项目"],
  ["2027-09-01","2028-06-07","高三维护模式","每周 1 次即可，只保持手感，不系统开新坑"]
];

const DAY_MODES = [
  ["学习","25–35 分钟","学习本周主题的一个小概念；看课不要连续超过 15 分钟。"],
  ["练习","25–35 分钟","不看答案，自己写 2–4 个小练习；卡住先读报错。"],
  ["手搓","25–35 分钟","围绕本周主题写一个能运行的小东西，哪怕只有 20 行。"],
  ["复盘","25–35 分钟","重写或整理本周代码，解释关键概念。"],
  ["休息","0 分钟","今天默认不安排编程，把时间让给高考主线。"],
  ["周项目","60–90 分钟","把本周知识做成一个小项目或完整练习。"],
  ["弹性","0–30 分钟","默认休息；如果本周有欠账，只补最重要的一项。"]
];

let currentStatus = "未开始";
let currentMastery = 3;
let deferredPrompt = null;

function pad(n){ return String(n).padStart(2,"0"); }
function keyOf(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function parseLocal(s){
  const [y,m,d] = s.split("-").map(Number);
  return new Date(y,m-1,d);
}
function dayDiff(a,b){
  const aa = new Date(a.getFullYear(),a.getMonth(),a.getDate());
  const bb = new Date(b.getFullYear(),b.getMonth(),b.getDate());
  return Math.floor((aa-bb)/86400000);
}
function loadProgress(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
function saveProgress(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function taskFor(d){
  if(d < START) return {title:"尚未开学",duration:"0 分钟",task:"计划从 2026-08-24 开始。现在不用提前赶进度。",output:"保持高考主线即可"};
  if(d > END) return {title:"计划已结束",duration:"—",task:"高中阶段计划已经结束。",output:"进入大学阶段 AI 学习路线"};

  const wi = Math.floor(dayDiff(d, START)/7);
  if(wi >= 0 && wi < WEEKS.length){
    const [topic, output] = WEEKS[wi];
    const [mode,duration,instruction] = DAY_MODES[d.getDay() === 0 ? 6 : d.getDay()-1];
    return {title:`第 ${wi+1} 周 · ${topic}`, duration, task:`${mode}：${instruction}`, output};
  }

  for(const [s,e,title,desc] of PHASES){
    const sd=parseLocal(s), ed=parseLocal(e);
    if(d>=sd && d<=ed){
      if(title==="高三维护模式"){
        const isSat = d.getDay()===6;
        return {
          title,
          duration:isSat?"30–45 分钟":"0 分钟",
          task:isSat?"维护：回看一个旧项目/旧笔记，亲手写 30–45 分钟代码，不开新知识线。":"今天不安排编程。",
          output:desc
        };
      }
      const [mode,duration,instruction] = DAY_MODES[d.getDay() === 0 ? 6 : d.getDay()-1];
      return {title,duration,task:d.getDay()===5?"今天不安排编程。":`${mode}：${instruction}`,output:desc};
    }
  }
  return {title:"弹性阶段",duration:"0–30 分钟",task:"复习旧内容或休息，不强行开新知识。",output:"以高考为主"};
}

function formatDate(d){
  const names=["日","一","二","三","四","五","六"];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 · 周${names[d.getDay()]}`;
}

function currentStreak(progress){
  let d = new Date();
  d = new Date(d.getFullYear(),d.getMonth(),d.getDate());
  let streak=0;
  while(d>=START){
    if(progress[keyOf(d)]?.status==="完成"){streak++; d.setDate(d.getDate()-1);}
    else break;
  }
  return streak;
}

function weekRecords(progress){
  const now=new Date();
  const monday=new Date(now);
  const day=(now.getDay()+6)%7;
  monday.setDate(now.getDate()-day);
  monday.setHours(0,0,0,0);
  let c=0;
  for(let i=0;i<7;i++){
    const d=new Date(monday); d.setDate(monday.getDate()+i);
    if(progress[keyOf(d)]?.status && progress[keyOf(d)].status!=="未开始") c++;
  }
  return c;
}

function renderToday(){
  const d=new Date();
  d.setHours(0,0,0,0);
  const task=taskFor(d);
  const progress=loadProgress();
  const rec=progress[keyOf(d)] || {};

  document.getElementById("todayDate").textContent=formatDate(d);
  document.getElementById("taskTitle").textContent=task.title;
  document.getElementById("taskSummary").textContent=task.output;
  document.getElementById("durationPill").textContent=task.duration;
  document.getElementById("taskDetail").textContent=task.task;
  document.getElementById("weeklyOutput").textContent=task.output;

  const done=Object.values(progress).filter(x=>x.status==="完成").length;
  document.getElementById("statDone").textContent=done;
  document.getElementById("statStreak").textContent=currentStreak(progress);
  document.getElementById("statWeek").textContent=weekRecords(progress);

  currentStatus=rec.status || "未开始";
  currentMastery=rec.mastery || 3;
  document.getElementById("minutesInput").value=rec.minutes || 0;
  document.getElementById("notesInput").value=rec.notes || "";
  document.getElementById("artifactInput").value=rec.artifact || "";
  syncControls();
}

function syncControls(){
  document.querySelectorAll("#statusControl button").forEach(b=>b.classList.toggle("active",b.dataset.status===currentStatus));
  document.querySelectorAll("#masteryControl button").forEach(b=>b.classList.toggle("active",Number(b.dataset.mastery)===Number(currentMastery)));
}

function saveToday(){
  const d=new Date(); d.setHours(0,0,0,0);
  const progress=loadProgress();
  progress[keyOf(d)]={
    status:currentStatus,
    minutes:Number(document.getElementById("minutesInput").value||0),
    mastery:Number(currentMastery),
    notes:document.getElementById("notesInput").value.trim(),
    artifact:document.getElementById("artifactInput").value.trim(),
    updatedAt:new Date().toISOString()
  };
  saveProgress(progress);
  const toast=document.getElementById("savedToast");
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1200);
  renderToday();
  renderCalendar();
}

function monthCard(year,month,progress){
  const card=document.createElement("div");
  card.className="month-card";
  const title=document.createElement("div");
  title.className="month-title";
  title.textContent=`${year}.${pad(month+1)}`;
  card.appendChild(title);

  const wd=document.createElement("div");
  wd.className="weekdays";
  ["一","二","三","四","五","六","日"].forEach(x=>{
    const el=document.createElement("div"); el.textContent=x; wd.appendChild(el);
  });
  card.appendChild(wd);

  const days=document.createElement("div"); days.className="days";
  const first=new Date(year,month,1);
  const last=new Date(year,month+1,0).getDate();
  const offset=(first.getDay()+6)%7;
  for(let i=0;i<offset;i++){
    const el=document.createElement("div"); el.className="day off"; days.appendChild(el);
  }
  const today=new Date(); today.setHours(0,0,0,0);
  for(let n=1;n<=last;n++){
    const d=new Date(year,month,n);
    const el=document.createElement("div");
    el.className="day";
    el.textContent=n;
    if(d<START || d>END) el.classList.add("off");
    else{
      const st=progress[keyOf(d)]?.status;
      if(st==="完成") el.classList.add("done");
      else if(st==="部分完成") el.classList.add("partial");
      else if(d<today) el.classList.add("missed");
      else el.classList.add("future");
    }
    if(keyOf(d)===keyOf(today)) el.classList.add("today");
    days.appendChild(el);
  }
  card.appendChild(days);
  return card;
}

function renderCalendar(){
  const grid=document.getElementById("calendarGrid");
  grid.innerHTML="";
  const progress=loadProgress();
  let y=START.getFullYear(), m=START.getMonth();
  while(y<END.getFullYear() || (y===END.getFullYear() && m<=END.getMonth())){
    grid.appendChild(monthCard(y,m,progress));
    m++;
    if(m===12){m=0;y++;}
  }
}

function renderPlan(){
  const list=document.getElementById("planList");
  list.innerHTML="";
  WEEKS.forEach(([topic,out],i)=>{
    const s=new Date(START); s.setDate(START.getDate()+i*7);
    const e=new Date(s); e.setDate(s.getDate()+6);
    const item=document.createElement("div");
    item.className="plan-item";
    item.innerHTML=`<div class="plan-meta">第 ${i+1} 周 · ${pad(s.getMonth()+1)}/${pad(s.getDate())}–${pad(e.getMonth()+1)}/${pad(e.getDate())}</div><div class="plan-title">${topic}</div><div class="plan-output">${out}</div>`;
    list.appendChild(item);
  });

  const phases=document.getElementById("phaseList");
  phases.innerHTML="";
  PHASES.forEach(([s,e,title,desc])=>{
    const item=document.createElement("div");
    item.className="plan-item";
    item.innerHTML=`<div class="plan-meta">${s} → ${e}</div><div class="plan-title">${title}</div><div class="plan-output">${desc}</div>`;
    phases.appendChild(item);
  });
}

function switchPage(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.dataset.page===name));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.target===name));
  const titles={today:"今日",calendar:"日历",plan:"计划",data:"数据"};
  document.getElementById("pageTitle").textContent=titles[name];
  window.scrollTo({top:0,behavior:"smooth"});
}

function exportData(){
  const payload={version:2,exportedAt:new Date().toISOString(),progress:loadProgress()};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`programming-track-${keyOf(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importData(file){
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      const progress=data.progress || data;
      if(typeof progress!=="object") throw new Error();
      saveProgress(progress);
      renderToday(); renderCalendar();
      alert("导入成功");
    }catch{ alert("文件格式不正确"); }
  };
  reader.readAsText(file);
}

document.querySelectorAll("#statusControl button").forEach(b=>b.addEventListener("click",()=>{currentStatus=b.dataset.status;syncControls();}));
document.querySelectorAll("#masteryControl button").forEach(b=>b.addEventListener("click",()=>{currentMastery=Number(b.dataset.mastery);syncControls();}));
document.getElementById("saveBtn").addEventListener("click",saveToday);
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>switchPage(b.dataset.target)));
document.getElementById("exportBtn").addEventListener("click",exportData);
document.getElementById("importInput").addEventListener("change",e=>{if(e.target.files[0]) importData(e.target.files[0]);});
document.getElementById("resetBtn").addEventListener("click",()=>{
  if(confirm("确定清空本机全部学习记录？")){
    localStorage.removeItem(STORAGE_KEY);
    renderToday(); renderCalendar();
  }
});

const root=document.documentElement;
const savedTheme=localStorage.getItem(THEME_KEY);
if(savedTheme==="light") root.classList.add("light");
document.getElementById("themeBtn").addEventListener("click",()=>{
  root.classList.toggle("light");
  localStorage.setItem(THEME_KEY,root.classList.contains("light")?"light":"dark");
});

window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault();
  deferredPrompt=e;
  document.getElementById("installBtn").disabled=false;
});
document.getElementById("installBtn").addEventListener("click",async()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
  document.getElementById("installBtn").disabled=true;
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}

renderToday();
renderCalendar();
renderPlan();
