const form=document.querySelector('#chatForm');
const input=document.querySelector('#messageInput');
const conversation=document.querySelector('#conversation');
const chatScroll=document.querySelector('#chatScroll');
const sendButton=document.querySelector('#sendButton');
const welcome=document.querySelector('#welcome');
const historyBox=document.querySelector('#history');
const STORE_KEY='xander-chat-history-v1';
let messages=[];
let busy=false;

function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function scrollToBottom(){requestAnimationFrame(()=>chatScroll.scrollTo({top:chatScroll.scrollHeight,behavior:'smooth'}));}
function showWelcome(show){welcome.hidden=!show;}
function appendMessage(role,text){
  showWelcome(false);
  const row=document.createElement('div');row.className=`message-row ${role}`;
  const avatar=role==='assistant'?'<div class="message-avatar"><span class="brand-mark"><i></i><i></i><i></i></span></div>':'';
  row.innerHTML=`${avatar}<div class="message-content">${escapeHtml(text)}</div>`;
  conversation.append(row);scrollToBottom();return row;
}
function addTyping(){
  const row=document.createElement('div');row.className='message-row assistant';row.innerHTML='<div class="message-avatar"><span class="brand-mark"><i></i><i></i><i></i></span></div><div class="typing" aria-label="Xander is thinking"><i></i><i></i><i></i></div>';conversation.append(row);scrollToBottom();return row;
}
function saveSession(){
  if(!messages.length)return;
  let sessions=[];try{sessions=JSON.parse(localStorage.getItem(STORE_KEY)||'[]')}catch{}
  const session={id:Date.now(),title:messages.find(m=>m.role==='user')?.content.slice(0,44)||'New conversation',messages};
  sessions.unshift(session);localStorage.setItem(STORE_KEY,JSON.stringify(sessions.slice(0,12)));renderHistory();
}
function renderHistory(){
  let sessions=[];try{sessions=JSON.parse(localStorage.getItem(STORE_KEY)||'[]')}catch{}
  historyBox.innerHTML=sessions.map((s,i)=>`<button class="history-item" data-session="${i}" title="${escapeHtml(s.title)}">${escapeHtml(s.title)}</button>`).join('');
  historyBox.querySelectorAll('[data-session]').forEach(btn=>btn.addEventListener('click',()=>loadSession(Number(btn.dataset.session))));
}
function loadSession(index){
  let sessions=[];try{sessions=JSON.parse(localStorage.getItem(STORE_KEY)||'[]')}catch{}
  const session=sessions[index];if(!session)return;
  conversation.querySelectorAll('.message-row').forEach(n=>n.remove());messages=session.messages||[];showWelcome(messages.length===0);
  messages.forEach(m=>appendMessage(m.role,m.content));document.querySelectorAll('.history-item').forEach((n,i)=>n.classList.toggle('active',i===index));
}
function newChat(){if(messages.length)saveSession();messages=[];conversation.querySelectorAll('.message-row').forEach(n=>n.remove());showWelcome(true);input.value='';input.focus();document.querySelectorAll('.history-item').forEach(n=>n.classList.remove('active'));}
function responseText(data){
  if(typeof data==='string')return data.trim();if(!data||typeof data!=='object')return '';
  for(const key of ['response','answer','reply','message','output','content'])if(typeof data[key]==='string'&&data[key].trim())return data[key].trim();
  if(Array.isArray(data.messages)){const last=data.messages.at(-1);if(typeof last==='string')return last;if(last&&typeof last.content==='string')return last.content;}
  return '';
}
async function sendMessage(text){
  text=text.trim();if(!text||busy)return;busy=true;sendButton.disabled=true;
  messages.push({role:'user',content:text});appendMessage('user',text);input.value='';input.style.height='auto';
  const typing=addTyping();
  try{
    const response=await fetch('/ai_agent/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:text})});
    const raw=await response.text();let data;try{data=raw?JSON.parse(raw):null}catch{data=raw;}
    typing.remove();
    if(!response.ok)throw new Error(typeof data==='object'?(data.detail||`Request failed (${response.status})`):`Request failed (${response.status})`);
    const answer=responseText(data);
    if(!answer){const note='The chat endpoint accepted your message but returned no reply. Add a return value to /ai_agent/chat to show the assistant response here.';messages.push({role:'assistant',content:note});const row=appendMessage('assistant',note);row.querySelector('.message-content').classList.add('error-note');}
    else{messages.push({role:'assistant',content:answer});appendMessage('assistant',answer);}
  }catch(error){
    typing.remove();const note=`Couldn't reach Xander: ${error.message||'Check that the FastAPI server is running.'}`;messages.push({role:'assistant',content:note});const row=appendMessage('assistant',note);row.querySelector('.message-content').classList.add('error-note');
  }finally{busy=false;sendButton.disabled=false;input.focus();}
}
form.addEventListener('submit',e=>{e.preventDefault();sendMessage(input.value)});
input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,140)+'px'});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
document.querySelectorAll('.suggestion').forEach(btn=>btn.addEventListener('click',()=>sendMessage(btn.dataset.prompt)));
document.querySelector('#newChat').addEventListener('click',newChat);
document.querySelector('#clearChat').addEventListener('click',()=>{if(!messages.length)return;messages=[];conversation.querySelectorAll('.message-row').forEach(n=>n.remove());showWelcome(true);input.focus();});
document.querySelector('#menuToggle').addEventListener('click',()=>document.querySelector('#sidebar').classList.toggle('open'));
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();newChat();}});
renderHistory();
