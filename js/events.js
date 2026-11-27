/* events.js — Eventos del navegador y arranque de la página. Debe cargarse al final. */

/* ===== 9. EVENTOS ===== atributos: data-a acción · data-f campo del formulario · data-s filtro
   · data-live buscador · data-att asistencia · data-enter botón de la tecla Enter */
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(b&&!b.disabled&&!S.wait)act(b.dataset.a,b.dataset.v)});
document.addEventListener("input",e=>{const el=e.target,d=el.dataset;
 if(d.f){S.f[d.f]=el.value;if(d.f==="exp")S.expMsg=null}
 if(d.live){S[d.live]=el.value;const at=el.selectionStart;draw();const n=document.querySelector(`[data-live="${d.live}"]`);n.focus();n.setSelectionRange(at,at)}});
document.addEventListener("change",e=>{const el=e.target,d=el.dataset;
 if(d.file){readFile(el.files[0]);return}
 if(d.chk){S.f[d.chk]=el.checked;return}
 if(d.att){S.att[d.att]=el.checked;return}
 if(d.f){S.f[d.f]=el.value;return}
 if(d.s){if(d.s==="role")Object.assign(S,{role:el.value,view:"catalog",err:{},sq:"",wf:"",f:{hrs:"1"}});else S[d.s]=el.value;draw()}});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.dataset.f){const b=$("[data-enter]");if(b)b.click()}});

/* ===== 10. ARRANQUE ===== */
draw();load();setInterval(load,10000);
