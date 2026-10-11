(()=>{'use strict';
const api=String(window.ALEENA_ARTICLES_API||'').replace(/\/$/,'');
const feed=document.getElementById('articleCards');if(!feed)return;
let articles=[];
const cardFor=id=>[...feed.querySelectorAll('.journal-card')].find(card=>card.querySelector('.journal-read')?.getAttribute('href')?.includes(encodeURIComponent(id)));
const isNew=p=>{const t=Date.parse(p.publishedAt);return Number.isFinite(t)&&Date.now()-t>=0&&Date.now()-t<7*86400000};
function el(tag,className,text){const x=document.createElement(tag);if(className)x.className=className;if(text!==undefined)x.textContent=text;return x}
const toast=msg=>{const x=document.getElementById('akManageStatus');if(x)x.textContent=msg};
async function call(path,body){const r=await fetch(api+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,cache:'no-store'});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Request failed');return d}
async function refresh(){try{const d=await call('/articles');articles=d.articles||[];decorate()}catch(e){toast(e.message)}}
let decorating=false;
function decorate(){if(decorating)return;decorating=true;try{for(const p of articles){const card=cardFor(p.id);if(!card)continue;if(isNew(p)&&!card.querySelector('.ak-fresh-sticker')){const st=el('span','ak-fresh-sticker','✦ NEW');card.querySelector('.journal-card-top')?.append(st)}let actions=card.querySelector('.ak-article-admin-actions');if(!actions){actions=el('div','ak-article-admin-actions');const edit=el('button','ak-edit-btn','✎ Edit');const del=el('button','ak-delete-btn','♢ Delete');edit.type=del.type='button';edit.onclick=()=>openEdit(p);del.onclick=()=>openDelete(p);actions.append(edit,del);card.querySelector('.journal-foot')?.append(actions)}}}finally{decorating=false}}
const overlay=el('div','ak-manage-overlay');overlay.hidden=true;overlay.innerHTML=`<section class="ak-manage-dialog" role="dialog" aria-modal="true" aria-labelledby="akDialogTitle"><button class="ak-manage-close" type="button" aria-label="Close">×</button><span class="ak-manage-kicker">ALEENA KHAN • SECURE MANAGEMENT</span><h2 id="akDialogTitle">Admin access</h2><p id="akDialogInfo">Only authorized administrators may edit or delete published articles.</p><form id="akManageForm"><div id="akManageFields"></div><p id="akManageStatus" role="status"></p><div class="ak-manage-actions"><button class="ak-cancel" type="button">Cancel</button><button class="ak-confirm" type="submit">Continue →</button></div></form></section>`;
document.body.append(overlay);let mode='',target=null;
const fields=overlay.querySelector('#akManageFields'),form=overlay.querySelector('form'),confirm=overlay.querySelector('.ak-confirm');
function close(){overlay.hidden=true;form.reset();toast('');target=null}
overlay.querySelector('.ak-manage-close').onclick=close;overlay.querySelector('.ak-cancel').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close()});
function field(name,label,value='',type='text'){const l=el('label','ak-field');l.textContent=label;let inp;if(name==='body'){inp=el('textarea');inp.rows=8}else if(name==='category'){inp=el('select');for(const c of ['Movie Journal','Filmmaking','Video Editing','Motion Graphics']){const o=el('option','',c);o.value=c;inp.append(o)}}else{inp=el('input');inp.type=type}inp.name=name;inp.value=value;inp.required=true;l.append(inp);return l}
function start(heading,info,action){overlay.querySelector('.ak-cancel').textContent='Cancel';overlay.hidden=false;overlay.querySelector('#akDialogTitle').textContent=heading;overlay.querySelector('#akDialogInfo').textContent=info;confirm.textContent=action;confirm.disabled=false;fields.replaceChildren();toast('')}
function openEdit(p){mode='edit';target=p;start('Edit published article','Changes will be saved to GitHub and visible to all readers.','Save changes');fields.append(field('title','Article title',p.title),field('category','Category',p.category),field('body','Article text (20 words minimum)',p.body),field('password','Admin password — required for every edit','','password'));fields.querySelector('input')?.focus()}
function openDelete(p){mode='delete';target=p;start('Delete article?','This will permanently remove “'+p.title+'” from the public journal. This action cannot be undone.','Yes, delete article');fields.append(field('password','Enter admin password to confirm deletion','','password'));confirm.textContent='Yes, delete';overlay.querySelector('.ak-cancel').textContent='No, cancel';fields.querySelector('[name=password]')?.focus();}
form.addEventListener('submit',async e=>{e.preventDefault();confirm.disabled=true;toast('Please wait…');try{
 const data=Object.fromEntries(new FormData(form));
 if(!data.password)throw Error('Enter your admin password to continue.');
 if(mode==='edit'&&data.body.trim().split(/\s+/).filter(Boolean).length<20)throw Error('At least 20 words are required.');
 const payload=mode==='edit'?{id:target.id,title:data.title,category:data.category,body:data.body,password:data.password}:{id:target.id,password:data.password};
 const result=await call('/'+mode,payload);
 if(!result.ok)throw Error('Action was not confirmed');
 close();location.reload();
}catch(err){toast(err.message);const passwordField=fields.querySelector('[name=password]');if(passwordField){passwordField.value='';passwordField.focus()} }finally{confirm.disabled=false}});
const observer=new MutationObserver(()=>{if(!decorating)decorate()});observer.observe(feed,{childList:true,subtree:false});
refresh();setInterval(refresh,90000);
})();
