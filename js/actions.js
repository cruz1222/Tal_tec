/* actions.js — Acciones de los botones y envío de formularios. */

/* ===== 8. ACCIONES (un solo switch) ===== */
async function act(a,v){switch(a){
 case"retry":return load();
 case"type":S.type=v;break;
 case"gologin":Object.assign(S,{after:"catalog",view:"login",err:{},f:{}});break;
 case"logout":me=null;Object.assign(S,{view:"catalog",pick:null,slot:"",f:{}});break;
 case"back":Object.assign(S,{view:"catalog",err:{}});break;
 case"pick":S.pick=+v;S.err={};if(me){resetForm();S.view="form"}else Object.assign(S,{after:"form",view:"login",f:{}});break;
 case"mine":S.err={};if(!me){Object.assign(S,{after:"mine",view:"login",f:{}});break}
  {const r=await call("login",{c:me.c,nip:me.nip},"Cargando");if(r.ok){me.p=r.perfil;me.mis=r.mis}resetForm();S.view="mine"}break;
 case"gorecover":Object.assign(S,{view:"recover",err:{},f:{},nipMsg:""});break;
 case"recover":return doRecover();
 case"login":return doLogin();
 case"verify":return doVerify();
 case"doc":return doDoc();
 case"send":return doSend();
 case"change":return doChange();
 case"saveContact":return doContact();
 case"cert":return doCert(+v);
 case"print":return print();
 case"slogin":return doStaffLogin();
 case"slogout":delete staff[S.role];Object.assign(S,{sq:"",wf:"",f:{hrs:"1"},att:{}});break;
 case"period":{const r=await call("periodo",{clave:staff.jefatura.clave,abierto:!S.open},"Guardando");if(!r.ok)return toast(r.msg||"No se pudo cambiar");await load();toast(S.open?"Periodo abierto":"Periodo cerrado")}break;
 case"copy":{const L=staff.jefatura.data.filter(e=>(!S.wf||e.t==S.wf)&&e.c.includes(S.sq));
  try{await navigator.clipboard.writeText(L.map(e=>[e.c,e.n,e.sem,e.x,e.tel,shop(e.t).n,e.h,e.med?e.med.folio:""].join("\t")).join("\n"));toast("Lista copiada")}catch(x){toast("No se pudo copiar")}return}
 case"hours":S.f.hrs=v;break;
 case"all":staff.entrenador.data.forEach(e=>S.att[e.c]=true);break;
 case"session":return doSession()}
 draw()}

function resetForm(){const p=me.p;S.f={tel:p.tel||"",sem:p.sem||"",x:p.x||"",exp:p.exp||"",aut:!!p.aviso};S.err={};S.expMsg=null;S.docMsg=null;S.file=null}
async function doLogin(){const c=(S.f.lc||"").trim(),nip=(S.f.ln||"").trim();
 S.err={};if(!/^\d{8}$/.test(c))S.err.lc="Escribe tu número de control (8 dígitos).";if(!nip)S.err.ln="Escribe tu NIP.";
 if(Object.keys(S.err).length)return draw();
 const r=await call("login",{c,nip},"Verificando");if(!r.ok){S.err={[r.field||"ln"]:r.msg||"No se pudo entrar."};return draw()}
 me={c,nip,p:r.perfil,mis:r.mis};resetForm();S.view=S.after==="catalog"?"catalog":S.after==="mine"?"mine":"form";draw()}
async function doRecover(){const c=(S.f.rc||"").trim();S.err={};
 if(!/^\d{8}$/.test(c)){S.err.rc="Escribe tu número de control (8 dígitos).";return draw()}
 const r=await call("solnip",{c},"Enviando");if(!r.ok){S.err={[r.field||"rc"]:r.msg};return draw()}
 S.nipMsg=r.msg;draw()}
function readFile(f){S.file=null;S.docMsg=null;if(!f)return;
 if(f.size>2*1024*1024){S.docMsg={ok:false,msg:"El archivo pesa más de 2 MB."};return draw()}
 const fr=new FileReader();fr.onload=()=>{S.file={mime:f.type,b64:String(fr.result).split(",")[1]};S.docMsg={ok:true,msg:"Archivo listo: "+f.name+". Presiona «Leer y comprobar documento»."};draw()};fr.readAsDataURL(f)}
async function doDoc(){
 if(!S.file){S.docMsg={ok:false,msg:"Primero elige un archivo."};return draw()}
 if(!S.f.aut){S.err.aut="Acepta el aviso de privacidad para subir tu documento.";return draw()}
 const r=await call("docexp",{c:me.c,nip:me.nip,mime:S.file.mime,datos:S.file.b64,aut:true},"Leyendo documento");
 if(!r.ok){if(r.field==="aut")S.err.aut=r.msg;S.docMsg={ok:false,msg:r.msg};return draw()}
 if(r.validado){S.f.exp=r.folio;me.p.exp=r.folio;me.p.aviso=true;S.docMsg={ok:true,msg:`✔ ${r.resultado}. Tu expediente ${r.folio} quedó vinculado; no necesitas hacer nada más.`}}
 else S.docMsg={ok:false,msg:"Tu documento quedó pendiente de revisión manual por Servicios Médicos. Motivo: "+r.motivos.join(" ")}
 S.file=null;draw()}
async function doVerify(){const exp=(S.f.exp||"").trim();
 if(!exp)S.expMsg={ok:false,msg:"Escribe tu número de expediente."};
 else{const r=await call("verexp",{c:me.c,nip:me.nip,exp},"Verificando");S.expMsg=r.ok?{ok:true,msg:`✔ Expediente ${r.exp.folio} verificado: ${r.exp.n}.`}:{ok:false,msg:r.msg}}
 draw()}
async function doSend(){const f=S.f,p=me.p;S.err={};
 if(!phoneOk(f.tel))S.err.tel="Escribe tu teléfono a 10 dígitos.";
 if(!p.sem&&!f.sem)S.err.sem="Elige tu semestre.";if(!p.x&&!f.x)S.err.x="Elige una opción.";if((f.exp||"").trim()&&!f.aut)S.err.aut="Acepta el aviso de privacidad para vincular tu expediente.";
 if(Object.keys(S.err).length)return draw();
 const r=await call("inscribir",{c:me.c,nip:me.nip,t:S.pick,tel:f.tel,sem:f.sem,x:f.x,exp:(f.exp||"").trim(),aut:!!f.aut},"Guardando");
 if(r.field==="exp"||r.field==="aut"){S.err[r.field]=r.msg;return draw()}
 if(!r.ok){toast(r.msg||"No se pudo guardar");S.view="catalog";await load();return draw()}
 me.p=r.perfil;me.mis=r.mis;S.done={t:S.pick,fecha:r.fecha};S.view="done";toast("Inscripción registrada");draw();load()}
async function doChange(){const t=+$("[data-f=chg]").value;
 const r=await call("cambiar",{c:me.c,nip:me.nip,t0:S.done.t,t},"Guardando");
 if(!r.ok){toast(r.msg||"No se pudo cambiar");await load();return draw()}
 me.mis=r.mis;S.done={t,fecha:r.fecha};toast("Cambio registrado");draw();load()}
async function doContact(){const f=S.f;S.err={};if(!phoneOk(f.tel))S.err.tel="Escribe tu teléfono a 10 dígitos.";if((f.exp||"").trim()&&!f.aut)S.err.aut="Acepta el aviso de privacidad para vincular tu expediente.";if(Object.keys(S.err).length)return draw();
 const r=await call("contacto",{c:me.c,nip:me.nip,tel:f.tel,exp:(f.exp||"").trim(),aut:!!f.aut},"Guardando");
 if(r.field==="exp"||r.field==="aut"){S.err[r.field]=r.msg;return draw()}
 if(!r.ok)return toast(r.msg||"No se pudo guardar");
 me.p=r.perfil;resetForm();toast("Datos guardados");draw()}
async function doCert(t){const r=await call("constancia",{c:me.c,nip:me.nip,t},"Generando constancia");
 if(!r.ok)return toast(r.msg||"No se pudo generar");S.cert=r;S.view="cert";draw()}
async function doStaffLogin(){const role=S.role,clave=S.f.key||"",t=+(S.f.t||(W[0]&&W[0].id)||0);
 if(!clave){S.err={key:"Escribe la contraseña."};return draw()}
 const r=await call(STAFF[role].act,{clave,t},"Verificando");if(!r.ok){S.err={key:r.msg||"No se pudo entrar."};return draw()}
 staff[role]={clave,t,data:r.insc||r.regs};S.err={};S.f={hrs:"1"};draw()}
async function doSession(){const s=staff.entrenador,h=Math.round(parseFloat(String(S.f.hrs).replace(",","."))*4)/4;
 if(!(h>=0.25&&h<=12))return toast("Escribe horas entre 0.25 y 12.");
 const who=s.data.filter(e=>S.att[e.c]).map(e=>e.c);if(!who.length)return toast("Marca al menos un alumno.");
 const r=await call("sesion",{t:s.t,clave:s.clave,controles:who,horas:h},"Guardando");if(!r.ok)return toast(r.msg||"No se pudo guardar");
 S.att={};toast(`Sesión de ${h} h registrada para ${r.registrados} alumno(s).`+(r.omitidos.length?` Ya tenían sesión hoy: ${r.omitidos.length}.`:"")+(r.noInscritos.length?` No inscritos: ${r.noInscritos.length}.`:""));await pullStaff("entrenador");draw()}
