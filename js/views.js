/* views.js — Pantallas: alumno, personal (jefatura, entrenador, servicios médicos) y la función draw(). */

/* ===== 5. VISTAS DEL ALUMNO ===== */
function student(){switch(S.view){
 case"login":return login();
 case"recover":return recover();
 case"form":if(me)return enroll();break;
 case"done":if(me)return receipt();break;
 case"mine":if(me)return mine();break;
 case"cert":if(S.cert)return certificate();break}
 return catalog()}

function catalog(){
 if(!S.ready)return card(S.fail?'No se pudo conectar. <button class="btn sec" data-a="retry">Reintentar</button>':"Cargando talleres…");
 const q=S.q.toLowerCase(),list=W.filter(w=>(S.type==="Todos"||w.t===S.type)&&(!S.slot||w.s!==S.slot)&&w.n.toLowerCase().includes(q));
 const top=me?`<span>Hola, <b>${esc(me.p.n)}</b> · ${esc(me.c)}</span><span class="row"><button class="btn sec" data-a="mine">Mi inscripción</button><button class="btn sec" data-a="logout">Salir</button></span>`
  :`<span class="mut">Para inscribirte entra con tu número de control y NIP.</span><button class="btn" data-a="gologin">Entrar</button>`;
 return `<h2>Talleres disponibles</h2>${card(`<div class="row between">${top}</div>`)}
 <input data-live="q" placeholder="Buscar taller" value="${esc(S.q)}">
 <div class="row" style="margin:8px 0">${TYPES.map(t=>`<button class="chip" data-a="type" data-v="${t}" aria-pressed="${S.type===t}">${t}</button>`).join("")}</div>
 ${me?`<label>Mis horas de clase (oculta los talleres que choquen con tu horario)<select data-s="slot">${Object.entries(SLOTS).map(([k,v])=>`<option value="${k}"${S.slot===k?" selected":""}>${v}</option>`).join("")}</select></label>`:""}
 ${S.open?"":'<div class="note bad">Las inscripciones están cerradas. Consulta con Extraescolares.</div>'}
 <h3>${list.length} talleres</h3><div class="grid">${list.map(w=>{const[k,tx]=status(w),ya=me&&me.mis.some(m=>m.t===w.id);
  return card(`<b>${esc(w.n)}</b> <span class="mut">· ${esc(w.t)}</span><div class="mut">${esc(w.h)}</div><div class="bar"><i style="width:${pct(w.ins,w.c)}%"></i></div><div class="mut">${w.ins} de ${w.c} lugares</div><p><span class="tag ${k}">${tx}</span></p><button class="btn" data-a="pick" data-v="${w.id}"${!S.open||k==="lleno"||ya?" disabled":""}>${ya?"Ya inscrito":"Inscribirme"}</button>`)}).join("")||card("Ningún taller cumple el filtro.")}</div>`}

const back='<button class="btn sec" data-a="back">← Talleres</button>';
function login(){return `${back}<h2 style="margin-top:12px">Entrar como alumno</h2>${card(`<p class="mut">Usa tu número de control y tu NIP.</p>${fld("lc","Número de control","text","8 dígitos","username")}${fld("ln","NIP","password","","current-password")}<p class="row"><button class="btn" data-enter data-a="login">Entrar</button><button class="btn sec" data-a="gorecover">Recuperar NIP</button></p>`)}`}

function recover(){return `<button class="btn sec" data-a="gologin">← Volver a entrar</button><h2 style="margin-top:12px">Recuperar NIP</h2>${card(S.nipMsg
 ?`<div class="note">Tu NIP es <b style="font-size:22px">${esc(S.nipMsg)}</b>. Anótalo y no lo compartas.</div><button class="btn" data-a="gologin">Ir a entrar</button>`
 :`<p class="mut">Escribe tu número de control y el teléfono que registraste al inscribirte. Si coinciden, se te muestra tu NIP.</p>${fld("rc","Número de control","text","8 dígitos","username")}${fld("rt","Teléfono registrado","tel","10 dígitos","tel")}<p><button class="btn" data-enter data-a="recover">Mostrar mi NIP</button></p>`)}`}

const expBlock=()=>`<h3>Expediente médico (opcional)</h3>
 <details class="note"><summary><b>¿Qué es el expediente médico?</b></summary><p>Es el registro de tu salud que abre Servicios Médicos de la escuela (enfermedades, alergias, medicamentos) para que te cuiden si te sientes mal durante un taller. Si todavía no tienes uno, déjalo en blanco: puedes agregarlo después.</p></details>
 <details class="note"><summary><b>Aviso de privacidad</b></summary><p>${AVISO}</p></details>
 <label><input type="checkbox" data-chk="aut"${S.f.aut?" checked":""}> Acepto el aviso de privacidad</label>${S.err.aut?`<div class="err">${esc(S.err.aut)}</div>`:""}
 ${fld("exp","Número de expediente (el folio que te dieron en Servicios Médicos)","text","Ej.: EXP-0001","off")}
 <p><button class="btn sec" data-a="verify">Comprobar mi número de expediente</button></p>${S.expMsg?`<div class="note${S.expMsg.ok?"":" bad"}">${esc(S.expMsg.msg)}</div>`:""}
 ${S.file?`<p class="row"><span>📄 <b>${esc(S.file.name)}</b></span><button class="btn sec" data-a="rmfile">Quitar archivo</button></p>`:`<label>O sube una foto o PDF de tu expediente (máx. 2 MB)<input type="file" data-file accept="application/pdf,image/jpeg,image/png"></label>`}
 <p><button class="btn sec" data-a="doc">Leer y comprobar documento</button></p>${S.docMsg?`<div class="note${S.docMsg.ok?"":" bad"}">${esc(S.docMsg.msg)}</div>`:""}`;

function enroll(){const w=shop(S.pick),p=me.p,other=me.mis.some(m=>m.t!==S.pick);
 return `${back}<h2 style="margin-top:12px">Inscripción: ${esc(w.n)}</h2><p class="mut">${esc(w.t)} · ${esc(w.h)}</p>
 ${card(`<b>${esc(p.n)}</b> · ${esc(me.c)}
 ${p.sem?"":`<label>Semestre<select data-f="sem"><option value="">Elige uno</option>${[1,2,3,4,5,6,7,8,9].map(n=>`<option${S.f.sem==n?" selected":""}>${n}</option>`).join("")}</select></label>${S.err.sem?`<div class="err">${S.err.sem}</div>`:""}`}
 ${p.x?"":`<label>Sexo<select data-f="x"><option value="">Elige uno</option><option value="M"${S.f.x==="M"?" selected":""}>Mujer</option><option value="H"${S.f.x==="H"?" selected":""}>Hombre</option></select></label>${S.err.x?`<div class="err">${S.err.x}</div>`:""}`}
 ${fld("tel","Teléfono (para el grupo de WhatsApp)","tel","10 dígitos","tel")}${expBlock()}
 ${other?'<div class="note bad">Ya estás inscrito en otro taller. Solo recibirás un crédito.</div>':""}
 <p><button class="btn" data-a="send">Confirmar inscripción</button></p>`)}`}

const logos='<p><img src="logo-tec.png.jfif" height="60" alt="" onerror="this.remove()"> <img src="logo-tecnm.png" height="60" alt="" onerror="this.remove()"></p>';
function receipt(){const d=S.done,w=shop(d.t);
 return `<div class="note noprint">¡Listo! Quedaste inscrito.</div>
 <div class="doc">${logos}<h3>Comprobante de inscripción</h3><p>${esc(S.school)}</p><p>Se registró la inscripción de</p><div class="big">${esc(me.p.n)}</div><p>con número de control <b>${esc(me.c)}</b>, en el taller</p><div class="big">${esc(w.n)}</div><p>${esc(w.t)} · ${esc(w.h)}</p><small>Fecha: ${esc(d.fecha)} · Conserva este comprobante.</small></div>
 ${card(`<div class="row noprint"><button class="btn" data-a="print">Imprimir / guardar PDF</button><button class="btn sec" data-a="mine">Mi inscripción</button><button class="btn sec" data-a="back">Ver talleres</button></div>
 <label>¿Quieres cambiarte de taller?<select data-f="chg">${W.filter(x=>x.id!==d.t&&!me.mis.some(m=>m.t===x.id)).map(x=>`<option value="${x.id}">${esc(x.n)} (${x.ins}/${x.c})</option>`).join("")}</select></label>
 <p><button class="btn sec" data-a="change"${S.open?"":" disabled"}>Cambiar de taller</button></p>`)}`}

function mine(){
 const list=me.mis.map(m=>{const w=shop(m.t),ok=m.h>=S.goal;
  return card(`<b>${esc(w.n)}</b><br>${esc(w.h)}<br><span class="mut">Horas: ${m.h} de ${S.goal}</span><div class="bar"><i style="width:${pct(m.h,S.goal)}%"></i></div>${ok?`<span class="tag">Cumples las ${S.goal} horas</span> <button class="btn" data-a="cert" data-v="${m.t}">Descargar constancia</button>`:""}`)}).join("");
 return `${back}<h2 style="margin-top:12px">Mi inscripción</h2><p class="mut">${esc(me.p.n)} · ${esc(me.c)}</p>${list||'<div class="note bad">Todavía no tienes inscripciones.</div>'}
 ${card(`<h3 style="margin-top:0">Mis datos de contacto y expediente</h3>${fld("tel","Teléfono","tel","10 dígitos","tel")}${expBlock()}<p><button class="btn" data-a="saveContact">Guardar</button></p>`)}`}

function certificate(){const d=S.cert;
 return `<div class="row noprint"><button class="btn sec" data-a="mine">← Mi inscripción</button><button class="btn" data-a="print">Imprimir / guardar PDF</button></div>
 <div class="doc">${logos}<h3>${esc(d.inst||"TalTec")}</h3><p>Actividades extraescolares</p><div class="big">CONSTANCIA</div><p>Se hace constar que</p><div class="big">${esc(d.nombre)}</div>
 <p>con número de control <b>${esc(d.c)}</b>, cumplió satisfactoriamente <b>${d.horas} horas</b> (mínimo: ${d.meta}) en el taller <b>${esc(d.taller)}</b> (${esc(d.tipo)}).</p><p>Se expide el ${esc(d.fecha)}.</p>
 <div class="sign">${esc(d.resp||"Jefatura de Extraescolares")}<br><small style="margin:0">Jefatura de Extraescolares</small></div><small>Folio: <b>${esc(d.folio)}</b></small></div>`}

/* ===== 6. VISTAS DEL PERSONAL (jefatura, entrenador, medicina) ===== */
function staffView(){const cfg=STAFF[S.role],s=staff[S.role];
 if(!s){const pick=S.role==="entrenador"?`<label>Taller<select data-f="t">${W.map(w=>`<option value="${w.id}"${S.f.t==w.id?" selected":""}>${esc(w.n)}</option>`).join("")}</select></label>`:"";
  return `<h2>${cfg.title}</h2>${card(`${pick}${fld("key",cfg.label,"password","","current-password")}<p><button class="btn" data-enter data-a="slogin">Entrar</button></p>`)}`}
 return `<div class="row between"><h2>${cfg.title}</h2><button class="btn sec" data-a="slogout">Salir</button></div>`+({jefatura:adminBody,entrenador:coachBody,medicina:doctorBody}[S.role])(s)}

function adminBody(s){
 const L=s.data.filter(e=>(!S.wf||e.t==S.wf)&&e.c.includes(S.sq));
 return `${card(`<div class="row between"><span>Inscripciones y cambios: <b>${S.open?"abiertos":"cerrados"}</b></span><button class="btn${S.open?"":" sec"}" data-a="period">${S.open?"Cerrar periodo":"Reabrir periodo"}</button></div>`)}
 <h3>Talleres</h3>${card(`<div class="tw"><table><tr><th>Taller</th><th>Inscritos</th><th>Cupo</th><th>Estado</th></tr>${W.map(w=>{const[k,tx]=status(w);return `<tr><td>${esc(w.n)}</td><td>${w.ins}</td><td>${w.c}</td><td><span class="tag ${k}">${tx}</span></td></tr>`}).join("")}</table></div>`)}
 <h3>Alumnos inscritos</h3>${card(`<div class="grid"><label>Taller<select data-s="wf"><option value="">Todos</option>${W.map(w=>`<option value="${w.id}"${S.wf==w.id?" selected":""}>${esc(w.n)}</option>`).join("")}</select></label>
 <label>Número de control<input data-live="sq" value="${esc(S.sq)}" placeholder="Busca por número"></label></div>
 <p class="mut">${L.length} alumnos (se muestran 40) <button class="btn sec" data-a="copy">Copiar lista</button></p>
 <div class="tw"><table><tr><th>Control</th><th>Nombre</th><th>Sem.</th><th>Taller</th><th>Horas</th><th>Expediente</th></tr>${L.slice(0,40).map(e=>`<tr><td>${esc(e.c)}</td><td>${esc(e.n)}</td><td>${e.sem}</td><td>${esc(shop(e.t).n)}</td><td>${e.h}</td><td>${e.med?esc(e.med.folio):"Sin expediente"}</td></tr>`).join("")}</table></div>`)}`}

function coachBody(s){const h=+S.f.hrs;
 return `<p class="mut">Solo ves a los inscritos de tu taller. De su expediente solo se te envía lo necesario para cuidarlos (condiciones, alergias y contacto de emergencia). Es confidencial.</p><h3>${s.data.length} inscritos</h3>
 ${card(`<div class="tw"><table><tr><th>Asistió</th><th>Nombre</th><th>Teléfono</th><th>Horas</th><th>Expediente</th></tr>${s.data.map(e=>`<tr><td><input type="checkbox" data-att="${esc(e.c)}"${S.att[e.c]?" checked":""} aria-label="Asistió ${esc(e.n)}"></td><td>${esc(e.n)}</td><td>${esc(e.tel)}</td><td>${e.h}${e.h>=S.goal?` <span class="tag">Cumple</span>`:""}</td><td>${e.med?`<span class="tag espera">${medLine(e)}</span>`:"—"}</td></tr>`).join("")}</table></div>`)}
 ${card(`<b>Horas de esta sesión</b><div class="row" style="margin-top:6px">${[1,2,3].map(n=>`<button class="chip" data-a="hours" data-v="${n}" aria-pressed="${h===n}">${n} h</button>`).join("")}<input data-f="hrs" type="number" min="0.25" max="12" step="0.25" value="${esc(S.f.hrs)}" style="width:110px" aria-label="Horas"></div>`)}
 <div class="row"><button class="btn sec" data-a="all">Marcar a todos</button><button class="btn" data-a="session">Registrar sesión</button></div>`}

const MED_FIELDS=[["Control","c"],["Semestre","sem"],["Sexo","x"],["Teléfono","tel"],["Taller(es)","talleres"],["Sangre","sangre"],["Condiciones","cond"],["Alergias","alergias"],["Medicamentos","meds"],["Contacto de emergencia","contacto"],["Observaciones","obs"],["Documento subido","doc"]];
function doctorBody(s){
 const q=S.sq.trim().toLowerCase(),L=s.data.filter(r=>[r.folio,r.c,r.n].join(" ").toLowerCase().includes(q)),exact=q&&s.data.find(r=>r.folio.toLowerCase()===q);
 let msg;switch(true){
  case!q:msg=`<p class="mut">${s.data.length} expedientes. Escribe un folio, control o nombre.</p>`;break;
  case!!exact:msg=`<div class="note">✔ Folio válido: ${esc(exact.folio)} · ${esc(exact.n)}</div>`;break;
  case L.length>0:msg=`<p class="mut">${L.length} resultado(s). Para verificar un folio escríbelo completo.</p>`;break;
  default:msg='<div class="note bad">✖ No existe expediente con ese dato.</div>'}
 return `<p class="mut">Aquí el personal de servicios médicos comprueba que un expediente existe (escribe el folio completo) y consulta los datos del alumno. Información confidencial: úsala solo para cuidar al alumno. Cada consulta queda registrada.</p><label>Folio, número de control o nombre<input data-live="sq" value="${esc(S.sq)}" placeholder="Ej.: EXP-0001" autocomplete="off"></label>${msg}
 ${L.slice(0,30).map(r=>card(`<b>${esc(r.n)}</b> <span class="tag">Folio ${esc(r.folio)}</span><dl>${MED_FIELDS.map(([t,k])=>`<dt>${t}</dt><dd>${esc(r[k]||"—")}</dd>`).join("")}</dl>`)).join("")}`}

/* ===== 7. DIBUJO ===== */
const draw=()=>{$("#role").value=S.role;$("#app").innerHTML=(S.role==="alumno"?student:staffView)()};
