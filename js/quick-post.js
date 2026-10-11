(()=>{'use strict';
const $=id=>document.getElementById(id);const composer=$('quickPostText');if(!composer)return;
const STORAGE='aleena-khan-articles-demo-v1';
// DEMO ONLY: This password is visible in JavaScript. A real public site needs server-side login.
const DEMO_PASSWORD='ALEENA2026';
const overlay=$('postPasswordOverlay'),password=$('quickAdminPassword'),err=$('quickPasswordError'),btn=$('quickPostButton'),counter=$('postCount'),feedback=$('postFeedback');
let previousFocus=null;
composer.addEventListener('input',()=>{counter.textContent=composer.value.length+' / 8000'});
function open(){if(!composer.value.trim()){feedback.textContent='Write something first, then click Publish Post.';composer.focus();return;}previousFocus=document.activeElement;err.textContent='';password.value='';overlay.hidden=false;document.body.style.overflow='hidden';password.focus();}
function close(){overlay.hidden=true;document.body.style.overflow='';password.value='';previousFocus?.focus();}
btn.addEventListener('click',open);
$('cancelPostPassword').addEventListener('click',close);$('cancelPostPassword2').addEventListener('click',close);
overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close();if(e.key==='Tab'&&!overlay.hidden){const focusables=[...overlay.querySelectorAll('button,input')];let i=focusables.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();focusables.at(-1).focus()}else if(!e.shiftKey&&i===focusables.length-1){e.preventDefault();focusables[0].focus()}}});
$('postPasswordForm').addEventListener('submit',e=>{e.preventDefault();if(password.value!==DEMO_PASSWORD){err.textContent='Incorrect password. Post was not published.';password.value='';password.focus();return;}
const body=composer.value.trim();if(!body){close();return;}
const first=body.split(/\n/).find(x=>x.trim())||body;const title=first.length>76?first.slice(0,73)+'...':first;
const summary=body.length>200?body.slice(0,197)+'...':body;
let items;try{items=JSON.parse(localStorage.getItem(STORAGE)||'[]');if(!Array.isArray(items))items=[]}catch{items=[]}
const now=Date.now();items.push({id:'post-'+now+'-'+Math.random().toString(36).slice(2,7),title,summary,body,category:'Movie Journal',status:'published',createdAt:now,publishedAt:now});
try{localStorage.setItem(STORAGE,JSON.stringify(items))}catch{err.textContent='Browser storage unavailable. Post was not saved.';return}
close();composer.value='';counter.textContent='0 / 8000';feedback.textContent='Post published in this browser (demo mode).';$('articleSearch')?.dispatchEvent(new Event('input')); document.dispatchEvent(new Event('aleena:post-published')); 
});
})();