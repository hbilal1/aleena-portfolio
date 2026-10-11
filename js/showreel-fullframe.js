(()=>{'use strict';
const frame=document.getElementById('showreelFrame');
const video=document.getElementById('aleenaShowreelVideo');
const button=document.getElementById('showplay');
const error=document.getElementById('showreelError');
if(!frame||!video||!button)return;
button.addEventListener('click',async()=>{
  error.hidden=true;
  video.controls=true;
  try{await video.play();frame.classList.add('is-playing');}
  catch(e){video.controls=false;frame.classList.remove('is-playing');error.hidden=false;}
});
video.addEventListener('error',()=>{video.controls=false;frame.classList.remove('is-playing');error.hidden=false;});
video.addEventListener('ended',()=>{frame.classList.remove('is-playing');video.controls=false;video.currentTime=0;});
})();
