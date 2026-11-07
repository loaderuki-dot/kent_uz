"use strict";
const $=id=>document.getElementById(id);
function node(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{$("storageStatus").textContent="Saqlashga ruxsat yo‘q. Belgilar sahifa yopilguncha qoladi.";}}
// --- DATA (farqlangan nomlar + muallif + davomiylik) ---
const lessons=[
 {id:"o6aucC8_ot8",key:"one",title:"IT bilan tanishuv",category:"intro",author:"Nexorya tanlovi",duration:"~10 daq",description:"Avval tanlagan videong bilan o‘rganishni boshla.",task:"Videodan uchta yangi tushunchani yozib ol.",keywords:"it nima tanishuv boshlash"},
 {id:"0NdDKClb1eQ",key:"two",title:"Dasturlash nima? — Texnoplov",category:"coding",author:"Texnoplov",duration:"~12 daq",description:"Dasturlash olami bilan tanishuv.",task:"O‘zing yaratishni xohlagan bitta dastur g‘oyasini yoz.",keywords:"dasturlash kod texnoplov"},
 {id:"c6gdO6mwg8w",key:"translated-computer",title:"Kompyuter qanday ishlaydi? — Branch Education (o‘zbekcha tarjima)",category:"computer",author:"Branch Education",duration:"~14 daq",description:"Protsessor, xotira va disk qanday ishlaydi — ichki tuzilish.",task:"Protsessor, xotira va disk vazifalarini o‘z so‘zing bilan yoz.",keywords:"kompyuter protsessor xotira disk branch"},
 {id:"TB-y_Twwv9c",key:"translated-khan",title:"Kompyuterlar qanday ishlaydi? — Khan Academy Uzbek",category:"computer",author:"Khan Academy Uzbek",duration:"~6 daq",description:"Kiruvchi va chiquvchi ma’lumot — boshlovchilar uchun qisqa dars.",task:"Kompyuterga kiradigan va undan chiqadigan ma’lumotga misol top.",keywords:"khan academy kiruvchi chiquvchi ma'lumot"},
];
const music=[
 {id:"ZlS5VDLuGbs",title:"Interstellar — Where We’re Going",author:"Hans Zimmer / fan versiya",duration:"Uzun takror",description:"Uzun takroriy versiya.",keywords:"interstellar"},
 {id:"enYduGdGzjA",title:"Nuages — Closer",author:"Nuages",duration:"1 soat",description:"1 soatlik slowed + reverb versiyasi.",keywords:"nuages closer"},
 {id:"zMMuayoF_o4",title:"Idea 22 — Cello & Piano",author:"Gibran Alcocer",duration:"Sekin",description:"Sekinlashtirilgan violonchel va pianino.",keywords:"idea 22 cello piano"},
];
const stored=read("nexorya-completed-v2",[]);const completed=new Set(Array.isArray(stored)?stored.filter(k=>lessons.some(i=>i.key===k)):[]);
function updateProgress(){$("progress").textContent=`Belgilangan materiallar: ${completed.size} / ${lessons.length}` + (completed.size===lessons.length?" — Hammasi bajarildi! 🎉":"");}
function makeCard(item,track){
 const card=node("article",undefined,"card");const player=node("div",undefined,"player");
 const thumb=document.createElement("img");thumb.src=`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;thumb.alt=item.title+" — video muqovasi";thumb.loading="lazy";
 const play=node("button","▶ Pleerni ochish","play-button");play.type="button";
 play.addEventListener("click",()=>{const f=document.createElement("iframe");f.src="https://www.youtube.com/embed/"+item.id+"?autoplay=1";f.title=item.title;f.referrerPolicy="strict-origin-when-cross-origin";f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";f.allowFullscreen=true;player.replaceChildren(f);},{once:true});
 player.append(thumb,play);
 const info=node("div",undefined,"pad");info.append(node("h3",item.title));
 const meta=node("div",undefined,"meta");meta.append(node("span","👤 "+item.author),node("span","⏱ "+item.duration));info.append(meta,node("p",item.description));
 if(item.task)info.append(node("p","Mashq: "+item.task,"task"));
 const actions=node("div",undefined,"actions");const link=node("a","YouTube’da ochish ↗");link.href="https://www.youtube.com/watch?v="+item.id;link.target="_blank";link.rel="noopener noreferrer";actions.append(link);
 if(track){const btn=node("button");btn.type="button";function upd(){const d=completed.has(item.key);btn.textContent=d?"✓ Ko‘rilgan · bekor qilish":"Ko‘rdim deb belgilash";btn.setAttribute("aria-pressed",String(d));}btn.addEventListener("click",()=>{completed.has(item.key)?completed.delete(item.key):completed.add(item.key);save("nexorya-completed-v2",[...completed]);upd();updateProgress();});upd();actions.append(btn);}
 info.append(actions);card.append(player,info);return card;
}
function renderLessons(){
 const q=$("search").value.trim().toLocaleLowerCase("uz");const cat=$("category").value;
 const sel=lessons.filter(i=>{const t=(i.title+" "+i.description+" "+i.author+" "+i.task+" "+i.keywords+" "+i.category).toLocaleLowerCase("uz");return t.includes(q)&&(cat==="all"||cat===i.category);});
 $("lessonGrid").replaceChildren(...sel.map(i=>makeCard(i,true)));$("noResults").hidden=sel.length>0;
}
$("search").addEventListener("input",renderLessons);$("category").addEventListener("change",renderLessons);renderLessons();updateProgress();
music.forEach(i=>$("musicGrid").append(makeCard(i,false)));
// --- MENU ---
const menuBtn=$("menuBtn"),links=$("mainLinks");menuBtn.addEventListener("click",()=>{const open=links.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));menuBtn.textContent=open?"✕ Yopish":"☰ Menyu";});
links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{links.classList.remove("open");menuBtn.textContent="☰ Menyu";menuBtn.setAttribute("aria-expanded","false");}));
// --- QUIZ with explanations + persistence ---
const questions=[
 {q:"HTML asosan nima uchun ishlatiladi?",options:["Sahifa tuzilishini yaratish","Kompyuterni sovitish","Parolni yashirish"],answer:0,explain:"HTML — sahifaning suyagi. Sarlavha, matn, rasm, tugma qaerda turishini HTML belgilaydi."},
 {q:"CSS nimani boshqaradi?",options:["Internet tezligini","Sahifaning dizaynini","Disk hajmini"],answer:1,explain:"CSS — rang, shrift, joylashuv. HTML tuzilish, CSS ko‘rinish."},
 {q:"JavaScript saytga nima qo‘sha oladi?",options:["Faqat rasmlar","Faqat domen","Interaktiv harakatlar"],answer:2,explain:"JavaScript bilan tugma bosilganda nimadir bo‘ladi, taymer ishlaydi, qidiruv filtrlaydi."},
 {q:"Protsessorning asosiy vazifasi nima?",options:["Faqat ovoz chiqarish","Ko‘rsatmalarni bajarish","Faqat fayl saqlash"],answer:1,explain:"Protsessor — kompyuterning miyasi. U ko‘rsatmalarni birma-bir bajaradi."},
 {q:"Qaysi parol odatda yaxshiroq tanlov?",options:["123456","Isming va tug‘ilgan yiling","Uzun, noyob va taxmin qilish qiyin parol"],answer:2,explain:"Uzun + noyob + taxmin qilish qiyin parol eng xavfsizi. Har saytga alohida parol qo‘y."},
];
const last=read("nexorya-quiz-last",null);if(last)$("lastScore").textContent=`Oxirgi natijang: ${last.score} / ${questions.length} — ${last.date}`;
questions.forEach((item,idx)=>{const f=document.createElement("fieldset");f.append(node("legend",(idx+1)+". "+item.q));
 item.options.forEach((t,oi)=>{const lab=node("label",undefined,"answer");const r=document.createElement("input");r.type="radio";r.name="question"+idx;r.value=String(oi);r.required=true;lab.append(r,document.createTextNode(t));f.append(lab);});$("questions").append(f);});
$("quizForm").addEventListener("submit",e=>{e.preventDefault();const ans=new FormData(e.currentTarget);let score=0;const review=$("quizReview");review.replaceChildren();
 questions.forEach((item,idx)=>{const chosen=Number(ans.get("question"+idx));const ok=chosen===item.answer;if(ok)score++;
  const box=node("div",undefined,"review-item");box.append(node("strong",`${idx+1}. ${item.q} — ${ok?"✅ To‘g‘ri":"❌ Xato"}`),node("p",`To‘g‘ri javob: ${item.options[item.answer]}`),node("p",item.explain));review.append(box);
  // ranglash
  const labels=[...e.currentTarget.querySelectorAll(`input[name="question${idx}"]`)].map(r=>r.closest("label"));labels.forEach((lab,oi)=>{lab.classList.toggle("correct",oi===item.answer);lab.classList.toggle("wrong",oi===chosen&&!ok);});
 });
 $("quizResult").textContent=`Natija: ${score} / ${questions.length} — ${score===questions.length?"Ajoyib! Barcha javoblar to‘g‘ri.":score>=3?"Yaxshi ketayapsan, izohlarni o‘qi.":"Tushkunlikka tushma — videolarni qayta ko‘rib chiq."}`;
 save("nexorya-quiz-last",{score,date:new Date().toLocaleDateString("uz-UZ")});$("lastScore").textContent=`Oxirgi natijang: ${score} / ${questions.length}`;
});
$("quizForm").addEventListener("reset",()=>{setTimeout(()=>{$("quizResult").textContent="";$("quizReview").replaceChildren();document.querySelectorAll(".answer").forEach(l=>l.classList.remove("correct","wrong"));},0);});
// --- QUOTES ---
const quotes=["Kayfiyatni kutma. Birinchi kichik qadamni tashla.","Bugungi kichik harakat — ertangi o‘zingga sovg‘a.","Mukammal boshlash shart emas. Davom etish muhim.","Boshqalar bilan emas, kechagi o‘zing bilan solishtir.","Bitta dars. Bitta mashq. Yana bir qadam."];
let qi=0;$("nextQuote").addEventListener("click",()=>{qi=(qi+1)%quotes.length;$("quote").textContent=quotes[qi];});
// --- TASKS ---
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
let taskDay=today();const boxes=[...document.querySelectorAll("[data-task]")];
function loadTasks(){let t=read("nexorya-tasks-"+taskDay,{});if(!t||typeof t!=="object")t={};boxes.forEach(b=>b.checked=t[b.dataset.task]===true);}
boxes.forEach(b=>b.addEventListener("change",()=>{if(today()!==taskDay){taskDay=today();loadTasks();return;}const o={};boxes.forEach(i=>o[i.dataset.task]=i.checked);save("nexorya-tasks-"+taskDay,o);}));
window.addEventListener("focus",()=>{if(today()!==taskDay){taskDay=today();loadTasks();}});loadTasks();
// --- TIMER: Pomodoro + custom + sound + notification ---
let duration=1500,remaining=duration,deadline=0,interval=null,mode="focus",cycle=1;
function fmt(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");}
function drawTimer(){$("clock").textContent=fmt(remaining);document.title=interval!==null?`(${fmt(remaining)}) Nexorya — Fokus`:"Nexorya — O‘zbekcha IT darslari, test va fokus";}
function stopTimer(){clearInterval(interval);interval=null;drawTimer();}
function beep(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();[0,.25,.5].forEach((t,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=880+i*120;o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+.18);});}catch{}}
function notify(msg){if(!("Notification" in window))return;if(Notification.permission==="granted")new Notification("Nexorya",{body:msg});else if(Notification.permission!=="denied")Notification.requestPermission();}
function tick(){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));drawTimer();if(remaining===0){stopTimer();$("startTimer").textContent="Yana boshlash";$("timerStatus").textContent="Vaqt tugadi! Keyingi qadamni tanla.";if($("soundOn").checked){beep();notify(mode==="focus"?"Fokus tugadi — tanaffus qil!":"Tanaffus tugadi — yana fokus!");}
 if(mode==="focus"){if(cycle>=4){cycle=1;setMode(15,"long");}else{cycle++;setMode(5,"break");}}else{setMode(25,"focus");}} }
function setMode(min,m){mode=m;duration=min*60;remaining=duration;$("cycleLabel").textContent=`${cycle} / 4 fokus`;const label={focus:"Hozir: Fokus vaqti",break:"Hozir: Qisqa tanaffus",long:"Hozir: Uzun tanaffus"}[m];$("timerMode").textContent=label;drawTimer();}
$("startTimer").addEventListener("click",()=>{if(interval!==null){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));stopTimer();$("startTimer").textContent="Davom etish";$("timerStatus").textContent="Taymer pauzada.";return;}
 if(remaining===0)remaining=duration;deadline=Date.now()+remaining*1000;interval=setInterval(tick,250);$("startTimer").textContent="Pauza";$("timerStatus").textContent="Taymer ishlayapti.";tick();});
function resetTimer(){stopTimer();remaining=duration;drawTimer();$("startTimer").textContent="Boshlash";$("timerStatus").textContent="Tayyormisan?";}
$("resetTimer").addEventListener("click",resetTimer);
document.querySelectorAll("[data-minutes]").forEach(b=>b.addEventListener("click",()=>{setMode(Number(b.dataset.minutes),b.dataset.mode);resetTimer();}));
$("customMinutes").addEventListener("change",e=>{const v=Math.min(120,Math.max(1,Number(e.target.value)||25));e.target.value=v;setMode(v,"focus");resetTimer();});
$("soundOn").addEventListener("change",()=>{if($("soundOn").checked&&"Notification" in window&&Notification.permission==="default")Notification.requestPermission();});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&interval!==null)tick();});
drawTimer();$("year").textContent=new Date().getFullYear();
