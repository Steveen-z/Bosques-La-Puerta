// ---- DATA ----
const lots = {
  A:{id:'A',zone:'Alta',price:40000,prima:8000,monthly:258,color:'#122E1C'},
  B:{id:'B',zone:'Baja',price:37500,prima:7500,monthly:242,color:'#1C3D2D'},
  C:{id:'C',zone:'Alta',price:37500,prima:7500,monthly:242,color:'#173521'},
  D:{id:'D',zone:'Alta',price:35000,prima:7000,monthly:226,color:'#183827'},
  E:{id:'E',zone:'Alta',price:35000,prima:7000,monthly:226,color:'#183827'},
  F:{id:'F',zone:'Alta',price:40000,prima:8000,monthly:258,color:'#122E1C'},
  G1:{id:'G1',zone:'Baja',price:25000,prima:5000,monthly:161,color:'#244A38'},
  G2:{id:'G2',zone:'Alta',price:30000,prima:6000,monthly:194,color:'#1E4A2E'}
};
const imgs = [
  {src:'assets/images/gallery-1.jpg',alt:'Vista aérea del entorno natural'},
  {src:'assets/images/gallery-2.jpg',alt:'Paisaje montañoso'},
  {src:'assets/images/gallery-3.jpg',alt:'Bosque nativo'},
  {src:'assets/images/gallery-4.jpg',alt:'Hogar moderno'},
  {src:'assets/images/gallery-5.jpg',alt:'Atardecer natural'},
  {src:'assets/images/gallery-6.jpg',alt:'Desarrollo residencial'}
];
let lbIdx=0;

// ---- NAVBAR ----
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{nav.classList.toggle('scr',window.scrollY>70)},{passive:true});

// ---- MOBILE MENU ----
const burger=document.getElementById('burger'),links=document.getElementById('navLinks');
burger.addEventListener('click',()=>{
  burger.classList.toggle('on');
  links.classList.toggle('open');
  burger.setAttribute('aria-expanded',links.classList.contains('open'));
});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('on');links.classList.remove('open')}));

// ---- HERO BG PARALLAX ----
const heroBg=document.getElementById('heroBg');
window.addEventListener('scroll',()=>{if(window.scrollY<window.innerHeight)heroBg.style.transform=`translateY(${window.scrollY*.28}px)`},{passive:true});

// ---- SCROLL REVEAL ----
const rvEls=document.querySelectorAll('.rv');
const io=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -40px 0px'});
rvEls.forEach(el=>io.observe(el));

// ---- COUNTERS ----
function animCount(el){
  const t=+el.dataset.count,fmt=el.dataset.fmt,pre=el.dataset.prefix||'',suf=el.dataset.suffix||'',dur=1400,s=Date.now();
  const run=()=>{const p=Math.min((Date.now()-s)/dur,1),e=1-Math.pow(1-p,3),c=Math.floor(e*t);
    el.textContent=fmt==='cur'?(pre+'$'+c.toLocaleString('en-US')):(pre+c.toLocaleString('en-US')+suf);
    if(p<1)requestAnimationFrame(run);else el.textContent=fmt==='cur'?(pre+'$'+t.toLocaleString('en-US')):(pre+t.toLocaleString('en-US')+suf);
  };requestAnimationFrame(run);
}
let counted=false;
new IntersectionObserver(([e])=>{if(e.isIntersecting&&!counted){counted=true;document.querySelectorAll('[data-count]').forEach(animCount)}},{threshold:.5}).observe(document.getElementById('stats'));

// ---- LOTS TABLE ----
function renderTable(filter='all'){
  const tbody=document.getElementById('tblBody');
  tbody.innerHTML=Object.values(lots).filter(l=>filter==='all'||l.zone.toLowerCase()===filter).map(l=>`
  <tr onclick="selectPoly('${l.id}')" title="Ver Polígono ${l.id} en el mapa">
    <td><div style="display:flex;align-items:center;gap:.7rem"><span class="lot-badge" style="background:${l.color}">${l.id}</span><span style="font-weight:600;font-size:.88rem">Polígono ${l.id}</span></div></td>
    <td><span class="ztag ${l.zone.toLowerCase()}">${l.zone==='Alta'?'⬆':' ⬇'} Zona ${l.zone}</span></td>
    <td><span class="lot-price">$${l.price.toLocaleString('en-US')}</span></td>
    <td>$${l.prima.toLocaleString('en-US')}</td>
    <td><span class="lot-mo">$${l.monthly}/mes</span></td>
    <td><span class="sdot"></span>Disponible</td>
    <td><button class="res-btn" onclick="event.stopPropagation();reserve('${l.id}')">Reservar</button></td>
   </tr>`).join('');
}
document.querySelectorAll('.flt-btn').forEach(b=>b.addEventListener('click',function(){
  document.querySelectorAll('.flt-btn').forEach(x=>x.classList.remove('on'));
  this.classList.add('on');renderTable(this.dataset.f);
}));
renderTable();

// ---- MAP INTERACTION ----
window.selectPoly = function(id){
  document.querySelectorAll('.lot-z').forEach(z=>z.classList.remove('sel'));
  const el=document.getElementById('p-'+id);
  if(el)el.classList.add('sel');
  const l=lots[id];if(!l)return;
  document.getElementById('mpEmpty').style.display='none';
  const d=document.getElementById('mpDetail');d.classList.add('on');
  document.getElementById('mpBadge').textContent=l.id;
  document.getElementById('mpBadge').style.background=l.color;
  document.getElementById('mpName').textContent='Polígono '+l.id;
  document.getElementById('mpZone').textContent='Zona '+l.zone;
  document.getElementById('mpPrice').textContent='$'+l.price.toLocaleString('en-US');
  document.getElementById('mpPrima').textContent='$'+l.prima.toLocaleString('en-US');
  document.getElementById('mpCuota').textContent='$'+l.monthly;
  document.getElementById('mpWaBtn').href=`https://wa.me/50378859547?text=${encodeURIComponent('Hola, me interesa el Polígono '+l.id+' de Bosques La Puerta (Zona '+l.zone+' – $'+l.price.toLocaleString('en-US')+'). ¿Pueden darme más información?')}`;
  const s=document.getElementById('simLot');
  for(let i=0;i<s.options.length;i++){if(s.options[i].value.startsWith(String(l.price))){s.selectedIndex=i;break}}
  calcSim();
}
document.querySelectorAll('.lot-z').forEach(el=>{
  el.addEventListener('click',function(){selectPoly(this.dataset.id)});
  el.addEventListener('keypress',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectPoly(this.dataset.id)}});
});

// ---- SIMULATOR ----
function getPrice(){const v=document.getElementById('simLot').value;return parseInt(v)||40000}
window.calcSim = function(){
  const price=getPrice(),pp=+document.getElementById('slPrima').value,mo=+document.getElementById('slPlazo').value;
  const prima=price*(pp/100),loan=price-prima,r=0.084/12;
  const pay=r===0?loan/mo:loan*(r*Math.pow(1+r,mo))/(Math.pow(1+r,mo)-1);
  const total=prima+pay*mo;
  document.getElementById('rPrima').textContent='$'+Math.round(prima).toLocaleString('en-US');
  document.getElementById('rLoan').textContent='$'+Math.round(loan).toLocaleString('en-US');
  document.getElementById('rPay').textContent='$'+Math.round(pay).toLocaleString('en-US');
  document.getElementById('rTotal').textContent='$'+Math.round(total).toLocaleString('en-US');
}
window.updPrima = function(v){document.getElementById('vPrima').textContent=v+'%'}
window.updPlazo = function(v){document.getElementById('vPlazo').textContent=v+' meses'}
calcSim();

// ---- RESERVE ----
window.reserve = function(id){
  const l=lots[id];if(!l)return;
  window.open(`https://wa.me/50378859547?text=${encodeURIComponent('Hola, deseo reservar el Polígono '+l.id+' de Bosques La Puerta (Zona '+l.zone+', $'+l.price.toLocaleString('en-US')+'). ¿Cuál es el proceso?')}`, '_blank','noopener');
}

// ---- LIGHTBOX ----
window.openLb = function(i){lbIdx=i;const img=document.getElementById('lbImg');img.src=imgs[i].src;img.alt=imgs[i].alt;document.getElementById('lb').classList.add('on');document.body.style.overflow='hidden'}
window.closeLb = function(){document.getElementById('lb').classList.remove('on');document.body.style.overflow=''}
window.navLb = function(d){lbIdx=(lbIdx+d+imgs.length)%imgs.length;const img=document.getElementById('lbImg');img.src=imgs[lbIdx].src;img.alt=imgs[lbIdx].alt}
document.getElementById('lb').addEventListener('click',function(e){if(e.target===this)closeLb()});
document.addEventListener('keydown',e=>{const lb=document.getElementById('lb');if(!lb.classList.contains('on'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')navLb(-1);if(e.key==='ArrowRight')navLb(1)});

// ---- FORM ----
function san(s){return s.replace(/[<>'"&]/g,c=>({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'}[c]))}
window.handleForm = function(e){
  e.preventDefault();
  const name=document.getElementById('fName').value.trim();
  const phone=document.getElementById('fPhone').value.trim();
  const email=document.getElementById('fEmail').value.trim();
  const priv=document.getElementById('fPriv').checked;
  if(!name||name.length<2){toast('Por favor ingresa tu nombre completo.',false);return}
  if(!phone||phone.length<7){toast('Por favor ingresa un teléfono válido.',false);return}
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Por favor ingresa un correo válido.',false);return}
  if(!priv){toast('Por favor acepta la política de privacidad.',false);return}
  const int=document.getElementById('fInt').value,type=document.getElementById('fType').value,msg=document.getElementById('fMsg').value.trim();
  const wa=`*Nueva consulta – Bosques La Puerta*\n\n👤 Nombre: ${san(name)}\n📞 Teléfono: ${san(phone)}${email?'\n📧 Email: '+email:''}${int?'\n🏡 Polígono: '+int:''}\n📋 Tipo: ${type}${msg?'\n💬 Mensaje: '+san(msg):''}`;
  toast('¡Consulta enviada con éxito! Te contactaremos pronto. 🌿');
  document.getElementById('conForm').reset();
  setTimeout(()=>{if(confirm('¿Deseas enviar tu consulta también por WhatsApp para mayor rapidez?'))window.open('https://wa.me/50378859547?text='+encodeURIComponent(wa),'_blank','noopener')},600);
}

// ---- TOAST ----
function toast(msg,ok=true){
  const t=document.getElementById('toast'),tx=document.getElementById('toastTxt'),ic=t.querySelector('i');
  tx.textContent=msg;ic.style.color=ok?'#22C55E':'#F87171';
  t.classList.add('show');setTimeout(()=>t.classList.remove('show'),4200);
}

// ---- WA BUBBLE ----
setTimeout(()=>{const b=document.getElementById('waBubble');b.classList.add('show');setTimeout(()=>b.classList.remove('show'),6000)},3500);
document.getElementById('waBtn').addEventListener('click',()=>document.getElementById('waBubble').classList.remove('show'));

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const t=document.querySelector(this.getAttribute('href'));
    if(t){e.preventDefault();window.scrollTo({top:t.offsetTop-78,behavior:'smooth'})}
  });
});

// ---- ACTIVE NAV ----
const sections=[...document.querySelectorAll('section[id]')];
const navAs=[...document.querySelectorAll('.nav-links a[href^="#"]')];
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-120)cur=s.id});
  navAs.forEach(a=>{a.style.color=a.getAttribute('href')==='#'+cur?'var(--cgl)':'';a.style.background=a.getAttribute('href')==='#'+cur?'rgba(193,154,69,.08)':''});
},{passive:true});

console.log('%c🌿 Bosques La Puerta','color:#3D8B5E;font-size:15px;font-weight:bold');
console.log('%cDesarrollado por Constructumoc | San Miguel, El Salvador','color:#C19A45;font-size:11px');