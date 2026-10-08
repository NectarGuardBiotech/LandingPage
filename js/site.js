/* Page behaviour: mobile layout, Living Plant, menus. Content comes from js/site-data.js */
(function(){
var D=window.NG_SITE_DATA;
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?'':s)};
// menu
var b=$('#m-burger'),menu=$('#m-menu');
if(b){b.addEventListener('click',function(){var o=menu.hidden;menu.hidden=!o;b.setAttribute('aria-expanded',String(o));});
 $$('#m-menu a').forEach(function(a){a.addEventListener('click',function(){menu.hidden=true;b.setAttribute('aria-expanded','false');});});}
// global terrace/farm mode
var mode='urban',stage=0,layer=0;
function setMode(m){mode=m;$$('.m [data-set-mode]').forEach(function(x){x.setAttribute('aria-pressed',String(x.getAttribute('data-set-mode')===m));});
 $$('.m [data-mode]').forEach(function(x){x.hidden=x.getAttribute('data-mode')!==m;});renderStage();renderLayers();}
$$('.m [data-set-mode]').forEach(function(x){x.addEventListener('click',function(){setMode(x.getAttribute('data-set-mode'));});});
// living plant
var CAM='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"></path><circle cx="12" cy="13" r="3.5"></circle></svg>';
function renderStage(){var bar=$('#m-stagebar');if(!bar)return;
 bar.innerHTML=D.stages.map(function(s,i){return '<button type="button" data-i="'+i+'" aria-pressed="'+(i===stage)+'"><b>0'+(i+1)+' · '+s.label+'</b><small>'+s.product+'</small></button>';}).join('');
 $$('button',bar).forEach(function(x){x.addEventListener('click',function(){stage=+x.getAttribute('data-i');renderStage();});});
 var s=D.stages[stage];
 $('#m-stage').innerHTML='<div class="m-st-head"><span>STAGE 0'+(stage+1)+'</span><b>'+s.label+'</b></div>'+
  '<div class="m-st-two"><div><span>WHAT THIS STAGE NEEDS</span><p>'+s.needs+'</p></div><div><span>'+(mode==='urban'?'ON YOUR TERRACE':'ON YOUR FARM')+'</span><p>'+(mode==='urban'?s.urban:s.farm)+'</p></div></div>'+
  '<div class="m-st-body"><div class="m-prod"><div class="ng-show m"><img src="'+s.img+'" alt="'+s.name+'"></div><div class="m-prod-cap"><span>'+s.series+'</span><b>'+s.name+'</b><small>'+s.objective+'</small></div></div>'+
  '<img class="m-st-plant" src="'+D.plant+'" alt="The living plant" loading="lazy">'+
  '<div class="m-calls">'+s.calls.map(function(c){return '<div class="m-call"><span>'+c.tag+'</span><b>'+c.title+'</b><p>'+c.body+'</p></div>';}).join('')+'</div></div>';}
function renderLayers(){var el=$('#m-layers');if(!el)return;
 el.innerHTML=D.layers.map(function(l,i){var on=i===layer;return '<div class="'+(on?'on':'')+'"><button type="button" data-i="'+i+'" aria-expanded="'+on+'"><span class="n">'+l.num+'</span><span><b>'+l.label+'</b><small>'+l.short+'</small></span></button>'+
  (on?'<div class="b"><span class="big">'+l.big+'</span><p>'+l.unit+'</p><p>'+l.body+'</p><p class="pk">'+(mode==='urban'?l.urban:l.farm)+'</p></div>':'')+'</div>';}).join('');
 $$('button',el).forEach(function(x){x.addEventListener('click',function(){var i=+x.getAttribute('data-i');layer=(layer===i?-1:i);renderLayers();});});}
// wizard
var W={mode:'farm',cat:'horti',crop:'grapes',base:null,plan:null,step:1};
var CAT={field:'Field Crops',horti:'Horticulture',flowveg:'Vegetables & Floriculture'};
function wr(){var farm=W.mode==='farm',C=D.C,I=D.IMG;
 var pool=farm?C.farm[W.cat]:C.terrace.all,all=farm?[].concat(C.farm.field,C.farm.horti,C.farm.flowveg):C.terrace.all;
 var sel=all.filter(function(c){return c.id===W.crop;})[0]||pool[0];
 var bases=[{id:'soil',title:farm?'Soil Testing with NectarGuard':'Potting-Soil Assessment',desc:farm?'Our team collects a soil sample and designs your programme around the laboratory results.':'A professional check of the soil in your pots, grow bags and beds.',img:I.soil,tag:'RECOMMENDED'},
  {id:'stage',title:'Crop-Stage Assessment',desc:'Share your current crop stage and we recommend the right inputs for it.',img:I.stage},
  {id:'guide',title:farm?'Agronomist Consultation':'Garden Expert Consultation',desc:farm?'Speak with our agronomist to identify the right starting point for your farm.':'Speak with our garden expert to identify the right starting point.',img:I.guide},
  {id:'photo',title:'Photo-Based Diagnosis',desc:'Send photos of your crop on WhatsApp for a quick expert review.',img:I.photo}];
 var plans=[{id:'below',title:farm?'Soil Health Programme':'Soil Revival Kit',desc:'NutriPrime to restore organic carbon, microbial life and balanced nutrition.',img:I.below},
  {id:'full',title:farm?'Integrated Soil & Crop Programme':'Complete Terrace Kit',desc:'NutriPrime for the soil plus stage-wise Plant Boosters for the crop.',img:I.full,tag:'RECOMMENDED'},
  {id:'std',title:'Standard Nutrition Plan — '+sel.short,desc:'Our proven stage-by-stage nutrition schedule for this crop.',img:sel.img},
  {id:'custom',title:farm?'Custom Advisory Programme':'Personal Garden Advisory',desc:farm?'A programme designed with our agronomist around your farm and goals.':'A plan designed with our expert around your exact set-up.',img:I.custom}];
 $$('#m-wmode button').forEach(function(x){x.setAttribute('aria-pressed',String(x.getAttribute('data-w')===W.mode));});
 var sd=[['Crop'],['Start'],['Programme'],['Book']];
 $('#m-wsteps').innerHTML=sd.map(function(d,i){var n=i+1,cur=W.step===n,ok=n<W.step;return '<button type="button" data-step="'+n+'" class="'+(cur?'cur':ok?'ok':'')+'"><i>'+(ok?'✓':n)+'</i><span>'+d[0]+'</span></button>';}).join('');
 var h='';
 if(W.step===1){h+='<h3>What are you growing?</h3>';
  if(farm)h+='<div class="m-cats" role="group" aria-label="Crop category">'+Object.keys(CAT).map(function(k){return '<button type="button" data-cat="'+k+'" class="'+(W.cat===k?'on':'')+'">'+CAT[k]+'</button>';}).join('')+'</div>';
  h+='<div class="m-crops">'+pool.map(function(c){var on=c.id===W.crop;return '<button type="button" class="m-crop'+(on?' on':'')+'" data-crop="'+c.id+'" aria-pressed="'+on+'"><img src="'+c.img+'" alt="" loading="lazy"><span>'+c.name+'</span>'+(on?'<i class="m-tick">✓</i>':'')+'</button>';}).join('')+'</div>';}
 function opts(arr,key){return '<div class="m-opts">'+arr.map(function(o){var on=W[key]===o.id;return '<button type="button" class="m-opt'+(on?' on':'')+'" data-'+key+'="'+o.id+'" aria-pressed="'+on+'"><img src="'+o.img+'" alt="" loading="lazy"><div><b>'+o.title+'</b>'+(o.tag?'<em>'+o.tag+'</em>':'')+'<p>'+o.desc+'</p></div>'+(on?'<i class="m-tick">✓</i>':'')+'</button>';}).join('')+'</div>';}
 if(W.step===2)h+='<h3>Choose your starting point</h3>'+opts(bases,'base');
 if(W.step===3)h+='<h3>Choose your programme</h3>'+opts(plans,'plan');
 if(W.step===4){var bl=(W.plan==='custom'||!W.plan)?'Book a Consultation':(farm?'Book My Plan & Soil Visit':'Order My Terrace Kit');
  h+='<h3>Almost there — where can we reach you?</h3><form class="m-wform" onsubmit="return false"><label for="mw-n">Your name</label><input id="mw-n" type="text" autocomplete="name"><label for="mw-p">Mobile / WhatsApp</label><input id="mw-p" type="tel" autocomplete="tel">'+
  '<label for="mw-v">'+(farm?'Village / taluka':'City / area')+'</label><input id="mw-v" type="text"><label for="mw-s">'+(farm?'Farm size (acres)':'Number of pots / beds')+'</label><input id="mw-s" type="text" inputmode="numeric">'+
  '<label for="mw-x">Anything we should know?</label><textarea id="mw-x" rows="3"></textarea><button type="submit" class="m-btn dark big">'+bl+' →</button><a class="m-btn m-btn-o" href="#m-contact">Chat on WhatsApp</a></form>';}
 var canNext=W.step<4&&((W.step===1&&W.crop)||(W.step===2&&W.base)||(W.step===3&&W.plan));
 h+='<div class="m-wnav">'+(W.step>1?'<button type="button" class="m-btn m-back" data-nav="back">← Back</button>':'<span class="hint">Not sure? Skip ahead and just talk to us.</span>')+
  (canNext?'<button type="button" class="m-btn lime" data-nav="next">'+(W.step===3?'Continue to Booking':'Next Step')+' →</button>':'')+'</div>';
 $('#m-wbox').innerHTML=h;
 var bs=bases.filter(function(o){return o.id===W.base;})[0],ps=plans.filter(function(o){return o.id===W.plan;})[0];
 var above=W.plan==='full'||W.plan==='std'||W.plan==='custom',below=W.plan==='full'||W.plan==='below'||W.plan==='custom';
 $('#m-plan').innerHTML='<div class="m-plan-img"><img src="'+sel.img+'" alt="'+sel.name+'"><div><span>YOUR PLAN FOR</span><b>'+sel.name+'</b></div></div>'+
  '<div class="m-cov"><span>YOUR PROGRAMME COVERS</span><div class="'+(above?'lit':'')+'"><span><small>CROP NUTRITION</small><b>Plant Booster Series</b></span><b>'+(above?'✓':'—')+'</b></div><div class="'+(below?'lit':'')+'"><span><small>SOIL HEALTH</small><b>NutriPrime</b></span><b>'+(below?'✓':'—')+'</b></div></div>'+
  '<div class="m-sum"><div><span>Crop</span><b>'+sel.short+'</b></div><div><span>Starting point</span><b>'+(bs?bs.title:'Not selected')+'</b></div><div><span>Programme</span><b>'+(ps?ps.title:'Not selected')+'</b></div></div>'+
  '<a class="m-btn lime big" href="#m-contact">Book a Consultation →</a>';
}
function wtop(){var e=$('#m-wsteps');if(e&&e.getBoundingClientRect().top<0)e.scrollIntoView({block:'start'});}
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.m [data-step],.m [data-cat],.m [data-crop],.m [data-base],.m [data-plan],.m [data-nav],.m [data-w]');if(!t)return;
 if(t.hasAttribute('data-w')){var m=t.getAttribute('data-w');W.mode=m;W.crop=m==='farm'?'grapes':'tveg';W.cat='horti';}
 else if(t.hasAttribute('data-step')){W.step=+t.getAttribute('data-step');wtop();}
 else if(t.hasAttribute('data-cat'))W.cat=t.getAttribute('data-cat');
 else if(t.hasAttribute('data-crop'))W.crop=t.getAttribute('data-crop');
 else if(t.hasAttribute('data-base'))W.base=t.getAttribute('data-base');
 else if(t.hasAttribute('data-plan'))W.plan=t.getAttribute('data-plan');
 else if(t.getAttribute('data-nav')==='next'){W.step=Math.min(4,W.step+1);wtop();}
 else if(t.getAttribute('data-nav')==='back'){W.step=Math.max(1,W.step-1);wtop();}
 wr();});
renderStage();renderLayers();wr();
})();

(function(){
 var mounted=false;
 function mountDesktop(){ 
(function(){var DCLogic=window.DCLogic;

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { aud: 'urban', stage: 'veg', layer: 'carbon' }; }
  renderVals() {
    const S = window.NG_SITE_DATA.stages;
    const L = window.NG_SITE_DATA.layers;
    const IX = 540, IY = 560, SC = 1.7361111111111112, SOIL = 1176;
    const st = this.state;
    const urban = st.aud === 'urban';
    const on = 'background: #1B7A3F; color: #FFFFFF; border: none;';
    const off = 'background: transparent; color: #0F3D25; border: none;';
    const idx = Math.max(0, S.findIndex((s) => s.id === st.stage));
    const cur = S[idx];
    const lay = L.find((l) => l.id === st.layer) || L[0];
    const seg = (x1, y1, x2, y2) => {
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const a = Math.atan2(dy, dx) * 180 / Math.PI;
      return 'left: ' + x1 + 'px; top: ' + (y1 - 1) + 'px; width: ' + len.toFixed(1) + 'px; transform-origin: 0 50%; transform: rotate(' + a.toFixed(2) + 'deg);';
    };
    const n = cur.calls.length;
    const gap = n > 3 ? 142 : 180;
    const calls = cur.calls.map((c, i) => {
      const x = Math.round(IX + c.px * SC), y = Math.round(IY + c.py * SC);
      const cy = 580 + i * gap;
      return { ...c, key: cur.id + i,
        line: seg(x, y, 1060, cy + 30),
        ring: 'left: ' + (x - 17) + 'px; top: ' + (y - 17) + 'px;',
        dot: 'left: ' + (x - 8) + 'px; top: ' + (y - 8) + 'px;',
        chip: 'top: ' + cy + 'px;' };
    });
    let ly = SOIL + 50;
    const layers = L.map((l, i) => {
      const x = Math.round(IX + l.px * SC), y = Math.round(IY + l.py * SC);
      const sel = l.id === st.layer;
      const top = ly; ly += (sel ? 380 : 64) + 10;
      return { ...l, on: sel, pressed: sel ? 'true' : 'false', pack: urban ? l.urban : l.farm,
        line: seg(x, y, 1060, top + 32) + (sel ? ' background: #B5E14C;' : ' background: rgba(181,225,76,0.35);'),
        ring: 'left: ' + (x - 17) + 'px; top: ' + (y - 17) + 'px;',
        dot: 'left: ' + (x - 8) + 'px; top: ' + (y - 8) + 'px; background: ' + (sel ? '#B5E14C' : '#E7D7B8') + ';',
        box: 'top: ' + top + 'px; ' + (sel ? 'background: #B5E14C; color: #0A2E1B; border: none;' : 'background: #2A2019; color: #FFFFFF; border: 1px solid #4A3A2C;'),
        pick: () => this.setState({ layer: l.id }) };
    });
    return {
      isUrban: urban, isFarm: !urban, isUrbanStr: urban ? 'true' : 'false', isFarmStr: urban ? 'false' : 'true',
      urbanPill: urban ? on : off, farmPill: urban ? off : on,
      setUrban: () => this.setState({ aud: 'urban' }), setFarm: () => this.setState({ aud: 'farm' }),
      cur: cur, curNum: '0' + (idx + 1), curUse: urban ? cur.urban : cur.farm, useLabel: urban ? 'ON YOUR TERRACE' : 'ON YOUR FARM',
      calls: calls, layers: layers,
      lay: lay, layPack: urban ? lay.urban : lay.farm, packLabel: urban ? 'IN A TERRACE PACK' : 'IN A FARM BAG',
      stages: S.map((s, i) => ({ id: s.id, label: s.label, product: s.product, num: '0' + (i + 1), pressed: s.id === st.stage ? 'true' : 'false',
        style: s.id === st.stage ? 'background: #0F3D25; color: #FFFFFF; border: 1px solid #0F3D25;' : 'background: #F1F7F2; color: #0F3D25; border: 1px solid #D5E6D9;',
        pick: () => this.setState({ stage: s.id }) })),
    };
  }
}

window.mountDC(document.getElementById("sec-Main"),"tpl-0",Component);})();
(function(){var DCLogic=window.DCLogic;

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { aud: 'urban', stage: 'veg', layer: 'carbon' }; }
  renderVals() {
    const S = window.NG_SITE_DATA.stages;
    const L = window.NG_SITE_DATA.layers;
    const IX = 540, IY = 560, SC = 1.7361111111111112, SOIL = 1176;
    const st = this.state;
    const urban = st.aud === 'urban';
    const on = 'background: #1B7A3F; color: #FFFFFF; border: none;';
    const off = 'background: transparent; color: #0F3D25; border: none;';
    const idx = Math.max(0, S.findIndex((s) => s.id === st.stage));
    const cur = S[idx];
    const lay = L.find((l) => l.id === st.layer) || L[0];
    const seg = (x1, y1, x2, y2) => {
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const a = Math.atan2(dy, dx) * 180 / Math.PI;
      return 'left: ' + x1 + 'px; top: ' + (y1 - 1) + 'px; width: ' + len.toFixed(1) + 'px; transform-origin: 0 50%; transform: rotate(' + a.toFixed(2) + 'deg);';
    };
    const n = cur.calls.length;
    const gap = n > 3 ? 142 : 180;
    const calls = cur.calls.map((c, i) => {
      const x = Math.round(IX + c.px * SC), y = Math.round(IY + c.py * SC);
      const cy = 580 + i * gap;
      return { ...c, key: cur.id + i,
        line: seg(x, y, 1060, cy + 30),
        ring: 'left: ' + (x - 17) + 'px; top: ' + (y - 17) + 'px;',
        dot: 'left: ' + (x - 8) + 'px; top: ' + (y - 8) + 'px;',
        chip: 'top: ' + cy + 'px;' };
    });
    let ly = SOIL + 50;
    const layers = L.map((l, i) => {
      const x = Math.round(IX + l.px * SC), y = Math.round(IY + l.py * SC);
      const sel = l.id === st.layer;
      const top = ly; ly += (sel ? 380 : 64) + 10;
      return { ...l, on: sel, pressed: sel ? 'true' : 'false', pack: urban ? l.urban : l.farm,
        line: seg(x, y, 1060, top + 32) + (sel ? ' background: #B5E14C;' : ' background: rgba(181,225,76,0.35);'),
        ring: 'left: ' + (x - 17) + 'px; top: ' + (y - 17) + 'px;',
        dot: 'left: ' + (x - 8) + 'px; top: ' + (y - 8) + 'px; background: ' + (sel ? '#B5E14C' : '#E7D7B8') + ';',
        box: 'top: ' + top + 'px; ' + (sel ? 'background: #B5E14C; color: #0A2E1B; border: none;' : 'background: #2A2019; color: #FFFFFF; border: 1px solid #4A3A2C;'),
        pick: () => this.setState({ layer: l.id }) };
    });
    return {
      isUrban: urban, isFarm: !urban, isUrbanStr: urban ? 'true' : 'false', isFarmStr: urban ? 'false' : 'true',
      urbanPill: urban ? on : off, farmPill: urban ? off : on,
      setUrban: () => this.setState({ aud: 'urban' }), setFarm: () => this.setState({ aud: 'farm' }),
      cur: cur, curNum: '0' + (idx + 1), curUse: urban ? cur.urban : cur.farm, useLabel: urban ? 'ON YOUR TERRACE' : 'ON YOUR FARM',
      calls: calls, layers: layers,
      lay: lay, layPack: urban ? lay.urban : lay.farm, packLabel: urban ? 'IN A TERRACE PACK' : 'IN A FARM BAG',
      stages: S.map((s, i) => ({ id: s.id, label: s.label, product: s.product, num: '0' + (i + 1), pressed: s.id === st.stage ? 'true' : 'false',
        style: s.id === st.stage ? 'background: #0F3D25; color: #FFFFFF; border: 1px solid #0F3D25;' : 'background: #F1F7F2; color: #0F3D25; border: 1px solid #D5E6D9;',
        pick: () => this.setState({ stage: s.id }) })),
    };
  }
}

window.mountDC(document.getElementById("sec-Living"),"tpl-1",Component);})();
(function(){var DCLogic=window.DCLogic;

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { focus: 'none' }; }
  renderVals() {
    const f = this.state.focus;
    const tW = f === 't' ? 1040 : (f === 'f' ? 400 : 720);
    const set = (v) => () => this.setState({ focus: v });
    return {
      tBox: 'left: 0px; width: ' + tW + 'px;',
      fBox: 'left: ' + tW + 'px; width: ' + (1440 - tW) + 'px;',
      tDim: 'opacity: ' + (f === 'f' ? 0.4 : 0) + ';',
      fDim: 'opacity: ' + (f === 't' ? 0.4 : 0) + ';',
      tFull: f !== 'f', tMini: f === 'f', tOpen: f === 't',
      fFull: f !== 't', fMini: f === 't', fOpen: f === 'f',
      openT: set('t'), openF: set('f'),
      medBox: 'left: ' + (tW - 170) + 'px;',
      medText: f === 'none' ? 'TAP TO EXPLORE' : 'SHOW BOTH',
      medClick: set(f === 'none' ? 't' : 'none'),
    };
  }
}

window.mountDC(document.getElementById("sec-Home2"),"tpl-2",Component);})();
(function(){var DCLogic=window.DCLogic;

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { mode: 'farm', cat: 'horti', crop: 'grapes', base: null, plan: null, step: 1 }; }
  renderVals() {
    const C = {"farm": {"field": [{"id": "sugarcane", "name": "Sugarcane", "short": "Sugarcane", "img": "images/photo-49.jpg"}, {"id": "cotton", "name": "Cotton", "short": "Cotton", "img": "images/photo-27.jpg"}, {"id": "soybean", "name": "Soybean", "short": "Soybean", "img": "images/photo-51.jpg"}, {"id": "tur", "name": "Tur (pigeon pea)", "short": "Tur", "img": "images/photo-30.jpg"}, {"id": "moong", "name": "Moong", "short": "Moong", "img": "images/photo-17.jpg"}], "horti": [{"id": "grapes", "name": "Grapes", "short": "Grapes", "img": "images/photo-45.jpg"}, {"id": "pomegranate", "name": "Pomegranate", "short": "Pomegranate", "img": "images/photo-35.jpg"}, {"id": "papaya", "name": "Papaya", "short": "Papaya", "img": "images/photo-02.jpg"}, {"id": "banana", "name": "Banana", "short": "Banana", "img": "images/photo-28.jpg"}, {"id": "citrus", "name": "Citrus / Orange", "short": "Citrus / Orange", "img": "images/photo-04.jpg"}, {"id": "mango", "name": "Mango", "short": "Mango", "img": "images/photo-03.jpg"}, {"id": "coconut", "name": "Coconut", "short": "Coconut", "img": "images/photo-46.jpg"}, {"id": "dragon", "name": "Dragon fruit", "short": "Dragon fruit", "img": "images/photo-19.jpg"}, {"id": "custard", "name": "Custard apple", "short": "Custard apple", "img": "images/photo-01.jpg"}], "flowveg": [{"id": "flowers", "name": "Flowers (BloomCare)", "short": "Flowers", "img": "images/photo-31.jpg"}, {"id": "veg", "name": "Vegetables", "short": "Vegetables", "img": "images/photo-15.jpg"}]}, "terrace": {"all": [{"id": "tveg", "name": "Tomato, chilli & vegetables", "short": "Tomato, chilli & vegetables", "img": "images/photo-16.jpg"}, {"id": "therb", "name": "Herbs & greens", "short": "Herbs & greens", "img": "images/photo-52.jpg"}, {"id": "tflower", "name": "Flowering plants", "short": "Flowering plants", "img": "images/photo-08.jpg"}, {"id": "tfruit", "name": "Fruit plants in pots", "short": "Fruit plants in pots", "img": "images/photo-39.jpg"}]}};
    const st = this.state;
    const farm = st.mode === 'farm';
    const catLabels = { field: 'Field Crops', horti: 'Horticulture', flowveg: 'Vegetables & Floriculture' };
    const pool = farm ? C.farm[st.cat] : C.terrace.all;
    const all = farm ? [].concat(C.farm.field, C.farm.horti, C.farm.flowveg) : C.terrace.all;
    const sel = all.find((c) => c.id === st.crop) || pool[0];
    const on = 'background: #0A2E1B; color: #FFFFFF; border: none;';
    const off = 'background: transparent; color: #0A2E1B; border: none;';
    const S = (k, v) => () => this.setState({ [k]: v });
    const IMG = { soil: 'images/photo-10.jpg', stage: 'images/photo-37.jpg', guide: 'images/photo-43.jpg',
                  photo: 'images/photo-23.jpg', below: 'images/photo-05.jpg', full: 'images/photo-09.jpg', std: sel.img, custom: 'images/photo-26.jpg' };
    const baseOpts = [
      { id: 'soil', title: farm ? 'Soil Testing with NectarGuard' : 'Potting-Soil Assessment', desc: farm ? 'Our team collects a soil sample and designs your programme around the laboratory results.' : 'A professional check of the soil in your pots, grow bags and beds.', img: IMG.soil, tag: 'RECOMMENDED' },
      { id: 'stage', title: 'Crop-Stage Assessment', desc: 'Share your current crop stage and we recommend the right inputs for it.', img: IMG.stage, tag: '' },
      { id: 'guide', title: farm ? 'Agronomist Consultation' : 'Garden Expert Consultation', desc: farm ? 'Speak with our agronomist to identify the right starting point for your farm.' : 'Speak with our garden expert to identify the right starting point.', img: IMG.guide, tag: '' },
      { id: 'photo', title: 'Photo-Based Diagnosis', desc: 'Send photos of your crop on WhatsApp for a quick expert review.', img: IMG.photo, tag: '' } ];
    const planOpts = [
      { id: 'below', title: farm ? 'Soil Health Programme' : 'Soil Revival Kit', desc: 'NutriPrime to restore organic carbon, microbial life and balanced nutrition.', img: IMG.below, tag: '' },
      { id: 'full', title: farm ? 'Integrated Soil & Crop Programme' : 'Complete Terrace Kit', desc: 'NutriPrime for the soil plus stage-wise Plant Boosters for the crop.', img: IMG.full, tag: 'RECOMMENDED' },
      { id: 'std', title: 'Standard Nutrition Plan — ' + sel.short, desc: 'Our proven stage-by-stage nutrition schedule for this crop.', img: IMG.std, tag: '' },
      { id: 'custom', title: farm ? 'Custom Advisory Programme' : 'Personal Garden Advisory', desc: farm ? 'A programme designed with our agronomist around your farm and goals.' : 'A plan designed with our expert around your exact set-up.', img: IMG.custom, tag: '' } ];
    const ring = (x) => x ? 'border: 3px solid #B5E14C; box-shadow: 0 10px 30px rgba(10,46,27,0.18);' : 'border: 1.5px solid #E2F0E5;';
    const mapOpts = (arr, key) => arr.map((o) => ({ ...o, hasTag: !!o.tag, on: st[key] === o.id, pressed: st[key] === o.id ? 'true' : 'false', ring: ring(st[key] === o.id), pick: S(key, o.id) }));
    const bases = mapOpts(baseOpts, 'base');
    const plans = mapOpts(planOpts, 'plan');
    const baseSel = baseOpts.find((o) => o.id === st.base);
    const planSel = planOpts.find((o) => o.id === st.plan);
    const above = st.plan === 'full' || st.plan === 'std' || st.plan === 'custom';
    const below = st.plan === 'full' || st.plan === 'below' || st.plan === 'custom';
    const lit = 'background: #B5E14C; color: #0A2E1B;';
    const dimA = 'background: #FFFFFF; color: #8A958D;';
    const dimB = 'background: #FFFFFF; color: #8A958D;';
    const stepDefs = [['Crop', 'Select your crop'], ['Starting Point', 'Soil test or crop stage'], ['Programme', 'Soil, crop or both'], ['Consultation', 'Schedule your visit']];
    const done = [true, !!st.crop, !!st.base, !!st.plan];
    const steps = stepDefs.map((d, i) => {
      const n = i + 1, cur = st.step === n, ok = n < st.step;
      return { label: d[0], sub: d[1], mark: ok ? '✓' : String(n), go: S('step', n),
        style: cur ? 'background: #0A2E1B; color: #FFFFFF; border: none;' : 'background: #FFFFFF; color: #0A2E1B; border: 1px solid #D5E6D9;',
        dot: cur ? 'background: #B5E14C; color: #0A2E1B;' : (ok ? 'background: #1B7A3F; color: #FFFFFF;' : 'background: #E2F0E5; color: #145A32;') };
    });
    const canNext = st.step < 4 && ((st.step === 1 && st.crop) || (st.step === 2 && st.base) || (st.step === 3 && st.plan));
    return {
      isFarm: farm, farmPressed: farm ? 'true' : 'false', terracePressed: farm ? 'false' : 'true',
      farmPill: farm ? on : off, terracePill: farm ? off : on,
      toFarm: () => this.setState({ mode: 'farm', crop: 'grapes', cat: 'horti' }),
      toTerrace: () => this.setState({ mode: 'terrace', crop: 'tveg' }),
      steps, isS1: st.step === 1, isS2: st.step === 2, isS3: st.step === 3, isS4: st.step === 4,
      cats: farm ? Object.keys(catLabels).map((k) => ({ label: catLabels[k], pick: S('cat', k), style: st.cat === k ? 'background: #0A2E1B; color: #FFFFFF; border: none;' : 'background: #F1F7F2; color: #0A2E1B; border: none;' })) : [],
      crops: pool.map((c) => ({ ...c, on: c.id === st.crop, pressed: c.id === st.crop ? 'true' : 'false', ring: ring(c.id === st.crop), pick: S('crop', c.id) })),
      bases, plans, sel,
      aboveStyle: above ? lit : dimA, belowStyle: below ? lit : dimB,
      aboveMark: above ? '✓' : '—', belowMark: below ? '✓' : '—',
      summary: [{ k: 'Crop', v: sel.short }, { k: 'Starting point', v: baseSel ? baseSel.title : 'Not selected' }, { k: 'Programme', v: planSel ? planSel.title : 'Not selected' }],
      canBack: st.step > 1, noBack: st.step === 1, back: S('step', Math.max(1, st.step - 1)),
      canNext: !!canNext, next: S('step', st.step + 1), nextLabel: st.step === 3 ? 'Continue to Booking' : 'Next Step',
      placeLabel: farm ? 'Village / taluka' : 'City / area', sizeLabel: farm ? 'Farm size (acres)' : 'Number of pots / beds',
      bookLabel: st.plan === 'custom' || !st.plan ? 'Book a Consultation' : (farm ? 'Book My Plan & Soil Visit' : 'Order My Terrace Kit'),
    };
  }
}

window.mountDC(document.getElementById("sec-Home3"),"tpl-3",Component);})();
(function(){var DCLogic=window.DCLogic;
class Component extends DCLogic { renderVals() { return {}; } }
window.mountDC(document.getElementById("sec-Home4"),"tpl-4",Component);})();
(function(){var DCLogic=window.DCLogic;
class Component extends DCLogic { renderVals() { return {}; } }
window.mountDC(document.getElementById("sec-Home5"),"tpl-5",Component);})();
 }
 function fit(){var w=document.documentElement.clientWidth;var s=document.getElementById('site');
  if(w>=1100){ if(!mounted){mounted=true;mountDesktop();if(window.NGVoices)setTimeout(NGVoices,0);} s.style.zoom=Math.min(w/1440,2); } }
 window.addEventListener('resize',fit);fit();
})();
