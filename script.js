// Cole aqui a URL HTTPS do iframe fornecido por um serviço de feed do Instagram autorizado.
// Ex.: URL de um widget criado e conectado à conta profissional. Não use a URL normal do perfil.
const INSTAGRAM_FEED_URL = '';
const feed = document.getElementById('instagram-feed');
if (INSTAGRAM_FEED_URL && feed) {
  try { const url = new URL(INSTAGRAM_FEED_URL); if (url.protocol === 'https:') { feed.src = url.href; feed.title = 'Publicações recentes do Instagram'; } } catch(e) { console.warn('URL do feed inválida.'); }
}
const menu = document.querySelector('.menu'), nav = document.getElementById('navlinks');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const opening=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(opening));menu.setAttribute('aria-label',opening?'Fechar menu':'Abrir menu');nav.classList.toggle('open',opening)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
if('IntersectionObserver' in window){document.documentElement.classList.add('js');const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:0.08});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));}


/* Use only complete, authorized before/after montages. WebP is preferred, with original JPG accepted. */
const CASES = [1,2,3,4].map(n => 'assets/antes-depois'+String(n).padStart(2,'0'));
const stage=document.getElementById('case-stage'),track=document.getElementById('gallery-track'),controls=document.getElementById('case-controls');
if(stage && track && controls){
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const counter=document.getElementById('case-counter'), pause=document.getElementById('case-pause'),dots=document.getElementById('gallery-dots'),empty=document.getElementById('gallery-empty');
 let index=0,timer=null,paused=false,hovering=false,focused=false,drag=null,slides=[];
 function load(base){return new Promise(resolve=>{const img=new Image();img.decoding='async';img.draggable=false;img.onload=()=>resolve(img);img.onerror=()=>{if(img.getAttribute('src').endsWith('.webp'))img.src=base+'.jpg';else resolve(null)};img.src=base+'.webp';});}
 function render(animate=true){
  track.classList.toggle('no-transition',!animate);
  track.style.transform='translateX('+(-index*100)+'%)';
  slides.forEach((el,i)=>el.setAttribute('aria-hidden',String(i!==index)));
  Array.from(dots.children).forEach((el,i)=>el.setAttribute('aria-current',String(i===index)));
  counter.textContent='Imagem '+(index+1)+' de '+slides.length+' · Arraste para navegar';
 }
 function advance(delta){if(slides.length<2)return;index=(index+delta+slides.length)%slides.length;render();}
 function restart(){clearInterval(timer);if(!paused&&!hovering&&!focused&&!drag&&!document.hidden&&!reduce.matches&&slides.length>1)timer=setInterval(()=>advance(1),5500);}
 Promise.all(CASES.map(load)).then(images=>{
  images.filter(Boolean).forEach((img,i)=>{
   const figure=document.createElement('figure');figure.className='gallery-slide';img.alt='Montagem de antes e depois — imagem '+(i+1);img.width=900;img.height=1125;
   const caption=document.createElement('figcaption');const before=document.createElement('span'),after=document.createElement('span');before.textContent='Antes';after.textContent='Depois';caption.append(before,after);figure.append(img,caption);track.append(figure);slides.push(figure);
   const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label','Ver imagem '+(i+1));dot.addEventListener('click',()=>{index=i;render();restart()});dots.append(dot);
  });
  if(!slides.length)return;
  empty.hidden=true;controls.hidden=slides.length<2;counter.hidden=false;render(false);restart();
 });
 document.getElementById('case-prev').addEventListener('click',()=>{advance(-1);restart()});
 document.getElementById('case-next').addEventListener('click',()=>{advance(1);restart()});
 pause.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Retomar reprodução automática':'Pausar reprodução automática');restart()});
 const carousel=stage.closest('.case-carousel');
 carousel.addEventListener('mouseenter',()=>{hovering=true;restart()});carousel.addEventListener('mouseleave',()=>{hovering=false;restart()});
 carousel.addEventListener('focusin',()=>{focused=true;restart()});carousel.addEventListener('focusout',e=>{if(!carousel.contains(e.relatedTarget)){focused=false;restart()}});
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();advance(e.key==='ArrowLeft'?-1:1);restart()}});
 stage.addEventListener('pointerdown',e=>{if(slides.length<2||!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0};stage.setPointerCapture(e.pointerId);track.classList.add('no-transition');stage.classList.add('dragging');restart()});
 stage.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;drag.dx=e.clientX-drag.x;const dy=e.clientY-drag.y;if(Math.abs(dy)>Math.abs(drag.dx)&&e.pointerType!=='mouse')return;let dx=drag.dx;if((index===0&&dx>0)||(index===slides.length-1&&dx<0))dx*=.3;track.style.transform='translateX(calc('+(-index*100)+'% + '+dx+'px))'});
 function end(e,cancel=false){if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag=null;stage.classList.remove('dragging');if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);if(!cancel&&Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))advance(dx<0?1:-1);else render();restart();}
 stage.addEventListener('pointerup',e=>end(e));stage.addEventListener('pointercancel',e=>end(e,true));stage.addEventListener('lostpointercapture',e=>end(e,true));
 document.addEventListener('visibilitychange',restart);reduce.addEventListener('change',restart);
}
