/* Draws the testimonial cards and the arrows. Edit js/testimonials.js instead. */
(function(){
 var TONES=["#E2F0E5","#EEF6D5","#F1F1EC"];
 var STAR='<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z" fill="#0A2E1B"/></svg>';
 var STAR0=STAR.replace('fill="#0A2E1B"','fill="none" stroke="#0A2E1B" stroke-width="1.5"');
 var CAM='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"></path><circle cx="12" cy="13" r="3.5"></circle></svg>';
 function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
 function card(t,i){var n=Math.max(0,Math.min(5,+t.stars||5)),st='';for(var k=0;k<5;k++)st+=k<n?STAR:STAR0;
  var ph=t.photo?'<img src="'+esc(t.photo)+'" alt="'+esc(t.name)+'" loading="lazy">':CAM+'<span>GROWER’S PHOTO</span>';
  var who=[t.crop,t.place].filter(Boolean).map(esc).join(' · ');
  return '<article class="ngv-card" style="background:'+TONES[i%3]+'"><div class="ngv-ph">'+ph+'</div><div class="ngv-b"><div class="ngv-stars">'+st+'</div><p class="ngv-q">“'+esc(t.quote)+'”</p><div class="ngv-who"><b>'+esc(t.name)+'</b><span>'+who+'</span></div></div></article>';}
 function wire(strip){var el=document.getElementById(strip);if(!el||el.__w)return;el.__w=1;
  var btns=document.querySelectorAll('[data-strip="'+strip+'"]');
  function upd(){var max=el.scrollWidth-el.clientWidth-2;btns.forEach(function(b){b.disabled=b.classList.contains('ngv-prev')?el.scrollLeft<=2:el.scrollLeft>=max;});}
  btns.forEach(function(b){b.addEventListener('click',function(){var c=el.querySelector('.ngv-card');var step=c?c.getBoundingClientRect().width+24:400;
   var z=parseFloat(getComputedStyle(document.getElementById('site')).zoom)||1;if(el.id==='ng-vd')step=step/z;
   el.scrollBy({left:b.classList.contains('ngv-prev')?-step:step,behavior:'smooth'});});});
  el.addEventListener('scroll',function(){clearTimeout(el.__t);el.__t=setTimeout(upd,80);});upd();}
 window.NGVoices=function(){var list=window.NG_TESTIMONIALS||[];
  document.querySelectorAll('.ng-count').forEach(function(e){e.textContent=window.NG_GROWER_COUNT||'150+';});
  ['ng-vd','ng-vm'].forEach(function(id){var el=document.getElementById(id);if(!el||el.__r)return;el.__r=1;el.innerHTML=list.map(card).join('');wire(id);});};
 if(document.readyState!=='loading')NGVoices();else document.addEventListener('DOMContentLoaded',NGVoices);
})();
