(()=>{'use strict';
const $=id=>document.getElementById(id),body=$('quickPostText'),password=$('quickAdminPassword');
function update(){const value=body?.value||'',words=value.trim()?value.trim().split(/\s+/).length:0;const wc=$('editorWordCount'),rt=$('editorReadTime');if(wc)wc.textContent=words+' '+(words===1?'word':'words');if(rt)rt.textContent=Math.max(1,Math.ceil(words/220))+' min read';}
body?.addEventListener('input',update);update();
$('toggleArticlePassword')?.addEventListener('click',()=>{const show=password.type==='password';password.type=show?'text':'password';$('toggleArticlePassword').textContent=show?'Hide':'Show';$('toggleArticlePassword').setAttribute('aria-pressed',String(show));$('toggleArticlePassword').setAttribute('aria-label',show?'Hide password':'Show password');password.focus();});
let priorFocus=null;
window.addEventListener('aleena:published',e=>{const ov=$('publishSuccessOverlay');if(!ov)return;priorFocus=document.activeElement;const link=$('successReadLink');if(link&&e.detail?.article?.id)link.href='article.html?id='+encodeURIComponent(e.detail.article.id);ov.hidden=false;document.body.classList.add('success-open');$('closePublishSuccess')?.focus();});
function close(){const ov=$('publishSuccessOverlay');if(!ov)return;ov.hidden=true;document.body.classList.remove('success-open');priorFocus?.focus?.();}
$('closePublishSuccess')?.addEventListener('click',close);$('publishSuccessOverlay')?.addEventListener('click',e=>{if(e.target===$('publishSuccessOverlay'))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('publishSuccessOverlay')?.hidden)close();});
})();
