/* utils.js — Utilidades pequeñas que usan todas las pantallas. */

/* ===== 3. UTILIDADES ===== */
const $=s=>document.querySelector(s);
const esc=v=>String(v==null?"":v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shop=id=>W.find(w=>w.id===id)||{n:"(taller)",h:"",t:""};
const card=h=>`<div class="card">${h}</div>`;
const pct=(a,b)=>Math.min(100,a/b*100);
const phoneOk=t=>/^\d{10}$/.test(t||"");
function status(w){switch(true){case w.ins>=w.c:return["lleno","Lleno"];case w.ins<w.m:return["espera","En espera: pocos inscritos"];default:return["abierto","Abierto"]}}
function medLine(e){if(!e.med)return"—";const m=e.med;if(m.cond===undefined)return esc(m.folio);
 const x=[m.cond,m.alergias&&"Alergia: "+m.alergias,m.contacto&&"Emergencia: "+m.contacto].filter(v=>v&&!/^ninguna?$/i.test(v));return esc(m.folio)+" · "+esc(x.join("; ")||"Sin condiciones")}
// fld: campo de texto; data-f guarda lo escrito en S.f[k].
const fld=(k,lb,type="text",hint="",ac="")=>`<label>${lb}<input data-f="${k}" type="${type}" placeholder="${hint}" value="${esc(S.f[k]||"")}"${ac?` autocomplete="${ac}"`:""}></label>${S.err[k]?`<div class="err">${esc(S.err[k])}</div>`:""}`;
function toast(m,keep){let t=$(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=m;t.hidden=false;clearTimeout(t.h);if(!keep)t.h=setTimeout(()=>t.hidden=true,2600)}
const hideToast=()=>{const t=$(".toast");if(t)t.hidden=true};
