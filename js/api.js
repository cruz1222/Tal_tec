/* api.js — Comunicación con la hoja de Google (Apps Script). */

/* ===== 4. API: una sola función para hablar con la hoja ===== */
async function call(a,d,msg){
 if(msg){S.wait=true;toast(msg+"…",true)}
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),30000);
 try{const r=await fetch(API,{method:"POST",signal:ctl.signal,headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({a,...d})});return await r.json()}
 catch(e){return{ok:false,msg:e.name==="AbortError"?"La hoja tardó más de 30 segundos. Intenta de nuevo.":"No se pudo leer la respuesta de la hoja. Puede ser tu internet, o que la implementación de Apps Script necesite autorización o una versión nueva."}}
 finally{clearTimeout(timer);if(msg){S.wait=false;hideToast()}}}
async function pullStaff(role){const s=staff[role];if(!s)return;
 const r=await call(STAFF[role].act,{clave:s.clave,t:s.t});if(r.ok)s.data=r.insc||r.regs}
async function load(){
 const r=await call("estado");
 if(!r.ok){S.fail=true;return S.ready||draw()}
 Object.assign(S,{fail:false,ready:true,open:r.abierto,goal:r.meta||50,school:r.inst||""});W=r.talleres;
 await pullStaff(S.role);
 if(!["INPUT","SELECT"].includes(document.activeElement.tagName))draw()}
