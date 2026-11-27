/* config.js — Configuración y estado: dirección de la API, listas fijas y estado de la página. */

/* ===== 1. CONFIGURACIÓN ===== API: dirección del Apps Script (la hoja es la base de datos). */
const API="https://script.google.com/macros/s/AKfycbyPiKyljZWYCyscnDJj0OzdG244rW-Ggh8N7ov6HV4jatS5ndXUbsJlTGhp5F6EusLYPg/exec";
const SLOTS={"":"Mostrar todos los talleres","LM":"Lun y Mié por la tarde","MJ":"Mar y Jue por la tarde","V":"Viernes por la tarde","AM":"Mañanas"};
// AVISO: texto de privacidad (► reemplázalo por el aviso oficial de tu institución ◄)
const AVISO="Tus datos del expediente médico se usan solo para cuidar tu salud durante los talleres y atender una emergencia. Los ve el personal de servicios médicos; tu entrenador ve únicamente tus condiciones, alergias y contacto de emergencia; la jefatura solo ve si tienes expediente. No se usan para calificar ni se publican. Si subes un documento, se procesa de forma automática con un servicio externo de lectura de texto solo para compararlo con el registro; el archivo no se guarda, únicamente el resultado.";
const TYPES=["Todos","Deportivo","Cívico","Cultural"];
// STAFF: roles con contraseña; comparten pantalla de entrada, cambia solo la acción de la hoja.
const STAFF={jefatura:{act:"jefa",title:"Panel de la jefatura",label:"Contraseña de jefatura"},
 entrenador:{act:"ent",title:"Mi taller (entrenador)",label:"Contraseña del taller"},
 medicina:{act:"med",title:"Consulta de expedientes médicos",label:"Contraseña de servicios médicos"}};

/* ===== 2. ESTADO ===== */
let W=[];       // talleres
let me=null;    // alumno con sesión: {c, nip, p: perfil, mis: inscripciones}
const staff={}; // sesión de cada rol de personal: {clave, t, data}
const S={role:"alumno",view:"catalog",type:"Todos",slot:"",q:"",sq:"",wf:"",open:true,goal:50,school:"",
 pick:null,after:"catalog",err:{},f:{hrs:"1"},att:{},done:null,cert:null,expMsg:null,nipMsg:"",file:null,docMsg:null,ready:false,fail:false,wait:false};
