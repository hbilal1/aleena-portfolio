(()=>{'use strict';
const open=document.getElementById('complaintOpen'),close=document.getElementById('complaintClose'),overlay=document.getElementById('complaintOverlay'),form=document.getElementById('complaintForm');
const picker=document.getElementById('complaintFiles'),drop=document.getElementById('complaintDrop'),previews=document.getElementById('complaintPreviews'),error=document.getElementById('complaintFileError'),share=document.getElementById('complaintShare');
const recipient='aleena.postproduction@gmail.com';// Replace with your real receiving email.
const allowed=new Set(['image/jpeg','image/png','image/webp','video/mp4','video/webm']);
const MAX=20*1024*1024, LIMIT=4;
let lastFocus=null,chosen=[];
function toggle(show){overlay.hidden=!show;document.body.classList.toggle('complaint-is-open',show);document.body.style.overflow=show?'hidden':'';if(show){lastFocus=document.activeElement;document.getElementById('complaintName').focus()}else{lastFocus?.focus()}}
open.addEventListener('click',()=>toggle(true));close.addEventListener('click',()=>toggle(false));overlay.addEventListener('click',e=>{if(e.target===overlay)toggle(false)});
document.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape'){e.stopPropagation();toggle(false)}if(e.key==='Tab'){const nodes=[...overlay.querySelectorAll('button,input,select,textarea')].filter(el=>!el.disabled&&el.offsetParent!==null);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
function render(){previews.replaceChildren();for(const [index,entry] of chosen.entries()){
 const card=document.createElement('div');card.className='complaint-file-card';
 const media=document.createElement(entry.file.type.startsWith('video/')?'video':'img');media.src=entry.url;if(media.tagName==='VIDEO'){media.controls=true;media.preload='metadata';media.playsInline=true}else media.alt='Image attachment preview';
 const details=document.createElement('div');details.className='file-details';const name=document.createElement('strong');name.textContent=entry.file.name;name.title=entry.file.name;const size=document.createElement('small');size.textContent=(entry.file.size/(1024*1024)).toFixed(2)+' MB · '+(entry.file.type.startsWith('video/')?'Video':'Image');details.append(name,size);
 const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.setAttribute('aria-label','Remove '+entry.file.name);remove.addEventListener('click',()=>{URL.revokeObjectURL(entry.url);chosen.splice(index,1);render()});card.append(media,details,remove);previews.append(card);
}}
function addFiles(files){let warnings=[];for(const file of files){if(chosen.length>=LIMIT){warnings.push('Maximum 4 attachments allowed.');break}if(!allowed.has(file.type)){warnings.push('Unsupported file type: '+file.name);continue}if(file.size>MAX){warnings.push(file.name+' exceeds 20 MB.');continue}if(chosen.some(x=>x.file.name===file.name&&x.file.size===file.size)){warnings.push('Already selected: '+file.name);continue}chosen.push({file,url:URL.createObjectURL(file)})}error.textContent=warnings.join(' ');picker.value='';render()}
picker.addEventListener('change',()=>addFiles([...picker.files]));
drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('is-over')});drop.addEventListener('dragleave',()=>drop.classList.remove('is-over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('is-over');addFiles([...e.dataTransfer.files])});
function values(){if(!form.reportValidity())return null;const name=document.getElementById('complaintName').value.trim(),email=document.getElementById('complaintEmail').value.trim(),type=document.getElementById('complaintType').value,msg=document.getElementById('complaintMessage').value.trim();if(!name||msg.length<10){error.textContent='Please enter your name and at least 10 characters in the message.';return null}return {name,email,type,msg}}
function formatted(v){return 'Name: '+v.name+'\nEmail: '+(v.email||'Not provided')+'\nReason: '+v.type+'\n\nMessage:\n'+v.msg+'\n\nEvidence files ('+chosen.length+'):\n'+(chosen.length?chosen.map(e=>'- '+e.file.name).join('\n'):'None')+'\n\nPlease attach the selected media files before sending, if they are not already attached.'}
function prepareEmail(v){const subject=encodeURIComponent('Aleena Khan Portfolio — '+v.type),body=encodeURIComponent(formatted(v));window.open('https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(recipient)+'&su='+subject+'&body='+body,'_blank','noopener,noreferrer')}
form.addEventListener('submit',e=>{e.preventDefault();const v=values();if(v)prepareEmail(v)});
share.addEventListener('click',async()=>{const v=values();if(!v)return;error.textContent='';const files=chosen.map(x=>x.file);if(!files.length){prepareEmail(v);return}if(navigator.share&&navigator.canShare&&navigator.canShare({files})){
 try{await navigator.share({title:'Complaint — '+v.type,text:formatted(v),files});return}catch(e){if(e.name==='AbortError')return;error.textContent='Sharing failed. Prepare an email and attach your files manually.'}
 }else error.textContent='Your device cannot share these attachments directly. Use Prepare Email and attach the files manually.';
});
window.addEventListener('pagehide',()=>{chosen.forEach(entry=>URL.revokeObjectURL(entry.url))});
})();