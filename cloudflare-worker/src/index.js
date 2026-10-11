// GitHub-backed, database-free Articles API for Aleena Khan.
// SECRET bindings required: ADMIN_PASSWORD, GITHUB_TOKEN, SESSION_SECRET.
const enc=new TextEncoder();
function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store',...extra}})}
function b64url(bytes){return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function fromB64url(s){const t=s.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(t+'='.repeat((4-t.length%4)%4)),c=>c.charCodeAt(0))}
async function sha(s){return new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s)))}
async function same(a,b){const aa=await sha(a),bb=await sha(b);let different=0;for(let i=0;i<aa.length;i++)different|=aa[i]^bb[i];return different===0}
async function sign(payload,secret){const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64url(new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(payload))))}
async function validToken(value,secret){try{const [p,s]=value.split('.');if(!p||!s)return false;const sig=await sign(p,secret);if(!(await same(sig,s)))return false;const data=JSON.parse(new TextDecoder().decode(fromB64url(p)));return data.role==='admin'&&Date.now()<data.exp&&data.exp-Date.now()<14400001}catch{return false}}
function cors(origin,env){return origin===env.SITE_ORIGIN?{'Access-Control-Allow-Origin':origin,'Vary':'Origin','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Allow-Methods':'GET, POST, OPTIONS'}:{}}
const cats=['Movie Journal','Filmmaking','Video Editing','Motion Graphics'];
async function github(env,method,body){const owner=encodeURIComponent(env.GITHUB_OWNER),repo=encodeURIComponent(env.GITHUB_REPO),branch=encodeURIComponent(env.GITHUB_BRANCH||'main');const url=`https://api.github.com/repos/${owner}/${repo}/contents/data/articles.json${method==='GET'?'?ref='+branch:''}`;const r=await fetch(url,{method,headers:{Authorization:'Bearer '+env.GITHUB_TOKEN,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Aleena-Khan-Article-Publisher','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(`GitHub API ${r.status}: ${j.message||'request failed'}`);return j}
function decodeContent(content){const raw=atob(content.replace(/\s/g,''));return new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0)))}
function encodeContent(str){return b64url(enc.encode(str)).replace(/-/g,'+').replace(/_/g,'/').replace(/=+$/,'')}
async function readArticles(env){const response=await github(env,'GET');const data=JSON.parse(decodeContent(response.content));if(!Array.isArray(data))throw Error('articles.json must be an array');return {articles:data,sha:response.sha}}
export default {async fetch(req,env){const origin=req.headers.get('Origin')||'';const headers=cors(origin,env);const url=new URL(req.url),path=url.pathname;const isAllowed=origin===env.SITE_ORIGIN;
if(req.method==='OPTIONS')return new Response(null,{status:isAllowed?204:403,headers});
if(!['/articles','/login','/publish','/health'].includes(path))return json({error:'Not found'},404,headers);
if(path==='/health')return json({ok:true,configured:Boolean(env.GITHUB_OWNER&&env.GITHUB_REPO&&env.SITE_ORIGIN)},200,headers);
// All browser requests must come from exactly the configured website origin.
if(!isAllowed)return json({error:'Website origin is not authorized. Check SITE_ORIGIN.'},403,headers);
if(!env.ADMIN_PASSWORD||!env.GITHUB_TOKEN||!env.SESSION_SECRET||!env.GITHUB_OWNER||!env.GITHUB_REPO)return json({error:'Worker secrets or repository settings are missing.'},503,headers);
try{
if(path==='/articles'&&req.method==='GET'){const {articles}=await readArticles(env);return json({articles:articles.filter(a=>a.status==='published')},200,headers)}
if(path==='/login'&&req.method==='POST'){const data=await req.json();if(typeof data.password!=='string'||!(await same(data.password,env.ADMIN_PASSWORD)))return json({error:'Incorrect admin password'},401,headers);const payload=b64url(enc.encode(JSON.stringify({role:'admin',exp:Date.now()+14400000,nonce:crypto.randomUUID()})));return json({token:payload+'.'+await sign(payload,env.SESSION_SECRET)},200,headers)}
if(path==='/publish'&&req.method==='POST'){
const data=await req.json();if(typeof data.password!=='string'||!(await same(data.password,env.ADMIN_PASSWORD)))return json({error:'Incorrect publish password'},401,headers);
const title=String(data.title||'').trim(),body=String(data.body||'').trim(),category=String(data.category||'');if(title.length<3||title.length>150||body.split(/\s+/).filter(Boolean).length<20||body.length>15000||!cats.includes(category))return json({error:'Please provide a valid title, category, and article text (minimum 20 words, maximum 15,000 characters).'},400,headers);
const {articles,sha}=await readArticles(env);const article={id:crypto.randomUUID(),title,body,category,status:'published',publishedAt:new Date().toISOString()};articles.unshift(article);
await github(env,'PUT',{message:`Publish article: ${title.slice(0,80)}`,content:encodeContent(JSON.stringify(articles,null,2)+'\n'),sha,branch:env.GITHUB_BRANCH||'main'});
return json({ok:true,article},201,headers)}
return json({error:'Method not allowed'},405,headers)
}catch(e){return json({error:String(e.message||e)},e.message?.startsWith('GitHub API 409')?409:502,headers)}
}};