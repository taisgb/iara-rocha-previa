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
