const modal=document.querySelector('.modal');
const cards=[...document.querySelectorAll('.project-card')];
const data={};
cards.forEach(c=>data[c.dataset.project]={type:c.querySelector('.project-type').textContent,title:c.querySelector('h3').textContent,description:c.querySelector('p:not(.project-type)').textContent,tech:[...c.querySelectorAll('.tech-row span')].map(x=>x.textContent)});

// Smooth project filtering with a tiny fade/scale transition.
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));button.classList.add('active');
  const filter=button.dataset.filter;
  cards.forEach((card,i)=>{
    const show=filter==='all'||card.dataset.category.split(' ').includes(filter);
    if(show){card.style.display='flex';card.animate([{opacity:.15,transform:'translateY(8px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:420,delay:i%4*35,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});}else{card.style.display='none';}
  });
}));

// Project detail modal.
cards.forEach(card=>card.addEventListener('click',event=>{
  if(event.target.closest('.project-links'))return;
  const d=data[card.dataset.project];
  document.getElementById('modal-type').textContent=d.type;
  document.getElementById('modal-title').textContent=d.title;
  document.getElementById('modal-description').textContent=d.description;
  document.getElementById('modal-tech').innerHTML=d.tech.map(t=>`<span>${t}</span>`).join('');
  modal.classList.add('open');document.body.classList.add('lock');
}));
function closeModal(){modal.classList.remove('open');document.body.classList.remove('lock')}
document.querySelector('.modal-close')?.addEventListener('click',closeModal);
document.querySelector('.modal-backdrop')?.addEventListener('click',closeModal);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

// Gentle scroll-reveal, matching the original portfolio's clean rhythm.
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -45px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Frosted navigation becomes slightly stronger after scrolling.
const navbar=document.querySelector('.navbar');
const setNav=()=>navbar?.classList.toggle('scrolled',window.scrollY>24);
window.addEventListener('scroll',setNav,{passive:true});setNav();

// Highlight the current section in the navigation.
const sections=[...document.querySelectorAll('main section[id]')];
const navItems=[...document.querySelectorAll('.nav-links a')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){navItems.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`))}
}),{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>sectionObserver.observe(s));

// Interactive cursor ambience: the light follows the pointer and cards get their own local glow.
const glow=document.querySelector('.cursor-glow');
const finePointer=matchMedia('(pointer:fine)').matches;
if(glow&&finePointer){
  let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty;
  window.addEventListener('pointermove',e=>{
    tx=e.clientX; ty=e.clientY;
    document.body.style.setProperty('--mx',tx+'px');
    document.body.style.setProperty('--my',ty+'px');
  },{passive:true});
  const tick=()=>{
    x+=(tx-x)*.13; y+=(ty-y)*.13;
    glow.style.left=x+'px'; glow.style.top=y+'px';
    requestAnimationFrame(tick);
  };
  tick();
  document.querySelectorAll('.project-card,.skill-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--card-x',((e.clientX-r.left)/r.width*100)+'%');
      card.style.setProperty('--card-y',((e.clientY-r.top)/r.height*100)+'%');
    },{passive:true});
  });
  window.addEventListener('pointerleave',()=>glow.style.opacity='0');
  window.addEventListener('pointerenter',()=>glow.style.opacity='.95');
}

// Mobile navigation.
document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.remove('open')));
