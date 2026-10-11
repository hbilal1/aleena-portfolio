(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement,theme=$('#theme'),menu=$('#menu'),nav=$('#navlinks'),modal=$('#modal'),title=$('#modaltitle'),desc=$('#modaldesc'),art=$('#modalart'),close=$('#close'),topBtn=$('#backtop'),progress=$('#progress'),status=$('#status');
const icon=(paths)=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const sun=icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>');
const moon=icon('<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>');
const bars=icon('<path d="M4 7h16M4 12h16M4 17h16"/>');
const cross=icon('<path d="M5 5l14 14M19 5 5 19"/>');
const arrow=icon('<path d="m6 12 6-6 6 6M12 6v12"/>');
topBtn.innerHTML=arrow;
const themes=['dark','light','love','royal','emerald','sunset'];
const themeNames={dark:'Midnight',light:'Pearl Light',love:'Rose Love',royal:'Royal Violet',emerald:'Emerald',sunset:'Sunset'};
const themePanel=document.getElementById('themePanel');
function setTheme(t){
 if(!themes.includes(t))t='dark';
 root.dataset.theme=t;
 theme.innerHTML=t==='light'?moon:sun;
 theme.setAttribute('aria-label','Choose color theme; current '+themeNames[t]);
 theme.setAttribute('title','Current theme: '+themeNames[t]);
 document.querySelector('meta[name="theme-color"]').content=({dark:'#050913',light:'#f4f8fd',love:'#271220',royal:'#130f2b',emerald:'#071d1b',sunset:'#271320'})[t];
 themePanel.querySelectorAll('[data-set-theme]').forEach(b=>{const active=b.dataset.setTheme===t;b.setAttribute('aria-pressed',String(active));});
 try{localStorage.setItem('nexframe-theme',t)}catch{}
}
let stored;try{stored=localStorage.getItem('nexframe-theme')}catch{};
if(!stored&&matchMedia('(prefers-color-scheme:light)').matches)stored='light';
setTheme(themes.includes(stored)?stored:'dark');
function toggleThemes(open){themePanel.hidden=!open;theme.setAttribute('aria-expanded',String(open));}
theme.addEventListener('click',()=>toggleThemes(themePanel.hidden));
themePanel.querySelectorAll('[data-set-theme]').forEach(b=>b.addEventListener('click',()=>{setTheme(b.dataset.setTheme);toggleThemes(false)}));
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.theme-control'))toggleThemes(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleThemes(false)});
function setMenu(open){nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.innerHTML=open?cross:bars}
setMenu(false);menu.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('pointerdown',e=>{if(nav.classList.contains('open')&&!e.target.closest('.nav'))setMenu(false)});
window.addEventListener('resize',()=>{if(innerWidth>730)setMenu(false)},{passive:true});
const filters=$$('.filter'),projects=$$('.project');filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));projects.forEach(p=>{p.hidden=b.dataset.filter!=='all'&&p.dataset.category!==b.dataset.filter});}));
let previousFocus;
function openModal(name,description,isReel){previousFocus=document.activeElement;title.textContent=name;desc.textContent=description;art.textContent=isReel?'▶':'✦';modal.classList.add('open');document.body.style.overflow='hidden';close.focus({preventScroll:true});}
function closeModal(){modal.classList.remove('open');document.body.style.overflow='';previousFocus?.focus({preventScroll:true})}
projects.forEach(p=>{const go=()=>openModal(p.dataset.title,p.dataset.desc,false);p.addEventListener('click',go);p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
// Showreel now uses inline full-frame playback (js/showreel-fullframe.js).
close.addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(modal.classList.contains('open'))closeModal();else setMenu(false)}if(e.key==='Tab'&&modal.classList.contains('open')){const focusable=$$('.modal.open button:not([disabled]),.modal.open a[href],.modal.open [tabindex]:not([tabindex="-1"])');if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
$('#year').textContent=new Date().getFullYear();
const reveals=$$('.reveal');if('IntersectionObserver'in window){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{rootMargin:'0px 0px 70px 0px',threshold:0.02});reveals.forEach(e=>obs.observe(e))}else reveals.forEach(e=>e.classList.add('visible'));
// Low-cost scroll updates, scheduled once per frame.
let scheduled=false;function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?100*scrollY/max:0)+'%';topBtn.classList.toggle('visible',scrollY>550);scheduled=false}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});updateScroll();
topBtn.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));
if('IntersectionObserver'in window){const links=$$('.navlinks a[href^="#"]');const sections=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-25% 0px -60% 0px'});sections.forEach(s=>io.observe(s))}
if(matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches){const c=$('#cursor');let cx=-500,cy=-500,raf=false;addEventListener('pointermove',e=>{cx=e.clientX;cy=e.clientY;if(!raf){raf=true;requestAnimationFrame(()=>{c.style.left=cx+'px';c.style.top=cy+'px';raf=false})}},{passive:true})}
})();
// User-controlled ambient animation switch (accessible and persistent).
const motionToggle=document.getElementById('motionToggle');
const pauseIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
const playIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>';
let paused=false;
try { paused=localStorage.getItem('nexframe-motion-paused')==='true'; } catch(e){}
function setMotionPause(value){
 paused=value;
 document.documentElement.classList.toggle('motion-paused',paused);
 motionToggle.setAttribute('aria-pressed',String(paused));
 motionToggle.setAttribute('aria-label',paused?'Resume animations':'Pause animations');
 motionToggle.setAttribute('title',paused?'Resume animations':'Pause animations');
 motionToggle.innerHTML=paused?playIcon:pauseIcon;
 try { localStorage.setItem('nexframe-motion-paused',String(paused)); } catch(e){}
}
motionToggle.addEventListener('click',()=>setMotionPause(!paused));
setMotionPause(paused);

// Manual portrait setup: place images/aleena-khan.jpg beside index.html.
(()=>{const photo=document.getElementById('aleenaPortrait');const empty=document.getElementById('portraitEmpty');if(!photo||!empty)return;photo.addEventListener('load',()=>{photo.hidden=false;empty.hidden=true});photo.addEventListener('error',()=>{photo.hidden=true;empty.hidden=false});if(photo.complete&&photo.naturalWidth>0){photo.hidden=false;empty.hidden=true}})();
