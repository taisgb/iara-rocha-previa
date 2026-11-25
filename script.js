// Cole aqui a URL HTTPS do iframe fornecido por um serviço de feed do Instagram autorizado.
// Ex.: URL de um widget criado e conectado à conta profissional. Não use a URL normal do perfil.
const INSTAGRAM_FEED_URL = '';
const feed = document.getElementById('instagram-feed');
if (INSTAGRAM_FEED_URL && feed) {
  try { const url = new URL(INSTAGRAM_FEED_URL); if (url.protocol === 'https:') { feed.src = url.href; feed.title = 'Publicações recentes do Instagram'; } } catch(e) { console.warn('URL do feed inválida.'); }
}
const menu = document.querySelector('.menu'), nav = document.querySelector('nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const opening=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(opening));menu.setAttribute('aria-label',opening?'Fechar menu':'Abrir menu');nav.classList.toggle('open',opening)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
if('IntersectionObserver' in window){document.documentElement.classList.add('js');const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:0.08});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));}

/* Authorized real cases only. Add {before:"assets/case-01-before.webp",after:"assets/case-01-after.webp",caption:"Descrição validada"} to enable the carousel. */
const CASES = [];
const stage=document.getElementById('case-stage'), controls=document.getElementById('case-controls');
if(stage && controls && CASES.length){
 let index=0, timer=null, paused=false, hovering=false, focused=false;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const counter=document.getElementById('case-counter'), pause=document.getElementById('case-pause');
 function render(){
  const item=CASES[index], pair=document.createElement('div'); pair.className='case-pair';
  for(const [label,path] of [['Antes',item.before],['Depois',item.after]]){
   const fig=document.createElement('figure'), img=document.createElement('img'), caption=document.createElement('figcaption');
   img.src=path;img.alt=label+' do atendimento — caso '+(index+1);img.loading='lazy';
   caption.textContent=label;fig.append(img,caption);pair.append(fig);
  }
  const caption=document.createElement('p');caption.className='case-caption';caption.textContent=item.caption||'Caso '+(index+1);stage.replaceChildren(pair,caption);
  counter.textContent=(index+1)+' / '+CASES.length;
 }
 function advance(n){index=(index+n+CASES.length)%CASES.length;render();}
 function restart(){clearInterval(timer);if(!paused&&!hovering&&!focused&&!document.hidden&&!reduce.matches&&CASES.length>1)timer=setInterval(()=>advance(1),5500);}
 controls.hidden=CASES.length<2;render();
 document.getElementById('case-prev').addEventListener('click',()=>{advance(-1);restart()});
 document.getElementById('case-next').addEventListener('click',()=>{advance(1);restart()});
 pause.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Retomar carrossel':'Pausar carrossel');restart()});
 const carousel=stage.closest('.case-carousel');
 carousel.addEventListener('mouseenter',()=>{hovering=true;restart()});carousel.addEventListener('mouseleave',()=>{hovering=false;restart()});
 carousel.addEventListener('focusin',()=>{focused=true;restart()});carousel.addEventListener('focusout',e=>{if(!carousel.contains(e.relatedTarget)){focused=false;restart()}});
 let startX=0;stage.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});stage.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>45){advance(delta<0?1:-1);restart()}},{passive:true});
 document.addEventListener('visibilitychange',restart);reduce.addEventListener('change',restart);restart();
}
