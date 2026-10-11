(()=>{'use strict';
const STORAGE='aleena-khan-articles-demo-v1';
// DEMO ONLY: client-side passwords are visible in source code. Not secure authentication.
const DEMO_PASSWORD='ALEENA2026';
const $=id=>document.getElementById(id);
function all(){try{const items=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(items)?items:[]}catch{return []}}
function store(items){try{localStorage.setItem(STORAGE,JSON.stringify(items));return true}catch{alert('Your browser could not save this article. Check storage settings.');return false}}
const formatDate=d=>new Date(d).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
function node(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function askPassword(){const pw=prompt('Admin password required for this action (demo):');if(pw===null)return false;if(pw!==DEMO_PASSWORD){alert('Incorrect admin password. Nothing was published.');return false}return true}
function listing(){const box=$('articleCards');if(!box)return;const search=$('articleSearch')?.value?.trim().toLowerCase()||'';box.replaceChildren();const items=all().filter(x=>x.status==='published').filter(x=>(x.title+' '+x.summary+' '+x.category).toLowerCase().includes(search)).sort((a,b)=>(b.publishedAt||0)-(a.publishedAt||0));if(!items.length){const e=node('div','empty');e.append(node('h3','',search?'No matching articles':'Articles coming soon'),node('p','',search?'Try a different search.':'This is the space for Aleena Khan’s upcoming film and editing articles.'));box.append(e);return}for(const it of items){let card=node('article','article-card');card.append(node('div','meta',it.category+' · '+formatDate(it.publishedAt)));card.append(node('h3','',it.title));card.append(node('p','',it.summary));const a=node('a','open-story','READ ARTICLE ↗');a.href='article.html?id='+encodeURIComponent(it.id);card.append(a);box.append(card)}}
$('articleSearch')?.addEventListener('input',listing);listing();
function reader(){const box=$('storyReader');if(!box)return;const id=new URLSearchParams(location.search).get('id');const it=all().find(x=>x.id===id&&x.status==='published');box.replaceChildren();if(!it){box.append(node('h1','', 'Article not found'),node('p','hint','This article is not published in this browser.'));return}box.append(node('div','meta',it.category+' · '+formatDate(it.publishedAt)));box.append(node('h1','',it.title));box.append(node('p','lead',it.summary));box.append(node('div','story-body',it.body));document.title=it.title+' | Aleena Khan'}reader();
const form=$('articleForm');if(!form)return;
let current=null;const feedback=$('editorFeedback');
function values(){return {title:$('articleTitle').value.trim(),category:$('articleCategory').value,summary:$('articleSummary').value.trim(),body:$('articleBody').value.trim()}}
function clean(){current=null;form.reset();feedback.textContent='';$('articleTitle').focus()}
function save(status){const v=values();if(!v.title||!v.summary||v.body.length<20){form.reportValidity();feedback.textContent='Please complete the title, introduction and article content (20+ characters).';return}if(status==='published'&&!askPassword())return;
const items=all(),idx=items.findIndex(a=>a.id===current);const prev=idx>=0?items[idx]:null;
// Do not let an update to an already-published article silently bypass the password.
if(status==='draft'&&prev?.status==='published'&&!askPassword())return;
const now=Date.now();const item={id:prev?.id||String(now)+'-'+Math.random().toString(36).slice(2,8),...v,status,createdAt:prev?.createdAt||now,publishedAt:status==='published'?now:null};if(idx>=0)items[idx]=item;else items.push(item);if(!store(items))return;current=item.id;feedback.textContent=status==='published'?'Article published in this browser. Open Articles to view it.':'Draft saved in this browser.';editList()}
$('saveDraft').addEventListener('click',()=>save('draft'));
form.addEventListener('submit',e=>{e.preventDefault();save('published')});
$('clearEditor').addEventListener('click',clean);
function editList(){const box=$('editList');box.replaceChildren();const items=all().sort((a,b)=>b.createdAt-a.createdAt);if(!items.length){box.append(node('p','hint','No saved articles yet.'));return}items.forEach(it=>{const row=node('div','edit-item');row.append(node('strong','',it.title));row.append(node('span','meta',it.status.toUpperCase()));const edit=node('button','','EDIT');edit.type='button';edit.addEventListener('click',()=>{current=it.id;$('articleTitle').value=it.title;$('articleCategory').value=it.category;$('articleSummary').value=it.summary;$('articleBody').value=it.body;window.scrollTo({top:0,behavior:'smooth'});feedback.textContent='Editing: '+it.title});const del=node('button','','DELETE');del.type='button';del.addEventListener('click',()=>{if(!confirm('Delete this article?'))return;if(!askPassword())return;if(store(all().filter(a=>a.id!==it.id))){if(current===it.id)clean();editList()}});row.append(edit,del);box.append(row)})}editList();
})();