/* Page runtime: renders the desktop page templates. No need to edit. */
(function(){
class DCLogic{constructor(props){this.props=props||{};this.state={};}
 setState(p){var n=typeof p==='function'?p(this.state,this.props):p;Object.assign(this.state,n||{});if(this.__r)this.__r();}
 forceUpdate(){if(this.__r)this.__r();}}
window.DCLogic=DCLogic;
var HOLE=/\{\{\s*([^}]+?)\s*\}\}/g, WHOLE=/^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
function get(s,p){p=p.trim();if(p==='true')return true;if(p==='false')return false;if(p==='null')return null;
 if(/^-?\d+(\.\d+)?$/.test(p))return +p;if(/^(['"]).*\1$/.test(p))return p.slice(1,-1);
 var parts=p.split('.'),o=s;for(var i=0;i<parts.length;i++){if(o==null)return undefined;o=o[parts[i]];}return o;}
function interp(str,s){return str.replace(HOLE,function(_,p){var v=get(s,p);return v==null||v===false?'':String(v);});}
function build(node,s,out){
 if(node.nodeType===3){out.push(document.createTextNode(interp(node.nodeValue,s)));return;}
 if(node.nodeType!==1)return;
 var tag=node.localName;
 if(tag==='sc-if'){var c=get(s,(node.getAttribute('value').match(WHOLE)||[,'false'])[1]);if(c)kids(node,s,out);return;}
 if(tag==='sc-for'){var l=get(s,(node.getAttribute('list').match(WHOLE)||[,''])[1])||[];var as=node.getAttribute('as')||'item';
  l.forEach(function(it,i){var sc=Object.create(s);sc[as]=it;sc.$index=i;kids(node,sc,out);});return;}
 var el=document.createElementNS(node.namespaceURI,tag);el.__h={};
 for(var i=0;i<node.attributes.length;i++){var a=node.attributes[i],n=a.name,v=a.value;
  if(n.indexOf('hint-')===0)continue;
  var w=v.match(WHOLE);
  if(n.slice(0,2)==='on'&&w){var f=get(s,w[1]);if(typeof f==='function')el.__h[n.slice(2)]=f;continue;}
  if(w){var val=get(s,w[1]);if(val==null||val===false)continue;el.setAttribute(n,val===true?'':String(val));}
  else el.setAttribute(n,interp(v,s));}
 var ch=[];kids(node,s,ch);ch.forEach(function(c){el.appendChild(c);});
 out.push(el);}
function kids(node,s,out){for(var c=node.firstChild;c;c=c.nextSibling)build(c,s,out);}
function bindH(el,h){for(var k in el.__bound||{})if(!h||!h[k]){el.removeEventListener(k,el.__bound[k]);delete el.__bound[k];}
 el.__hh=h||{};el.__bound=el.__bound||{};for(var e in el.__hh){if(!el.__bound[e]){(function(ev){var fn=function(x){if(el.__hh[ev])el.__hh[ev](x);};el.__bound[ev]=fn;el.addEventListener(ev,fn);})(e);}}}
function wire(el){if(el.nodeType!==1)return;bindH(el,el.__h);for(var c=el.firstChild;c;c=c.nextSibling)wire(c);}
function morph(o,n){
 if(o.nodeType!==n.nodeType||o.nodeName!==n.nodeName){wire(n);o.parentNode.replaceChild(n,o);return;}
 if(o.nodeType===3){if(o.nodeValue!==n.nodeValue)o.nodeValue=n.nodeValue;return;}
 var oa=o.attributes,na=n.attributes,i;
 for(i=oa.length-1;i>=0;i--){if(!n.hasAttribute(oa[i].name))o.removeAttribute(oa[i].name);}
 for(i=0;i<na.length;i++){if(o.getAttribute(na[i].name)!==na[i].value)o.setAttribute(na[i].name,na[i].value);}
 bindH(o,n.__h);
 var oc=Array.prototype.slice.call(o.childNodes),nc=Array.prototype.slice.call(n.childNodes);
 for(i=0;i<nc.length;i++){if(i<oc.length)morph(oc[i],nc[i]);else{wire(nc[i]);o.appendChild(nc[i]);}}
 for(i=nc.length;i<oc.length;i++)o.removeChild(oc[i]);}
window.mountDC=function(host,tplId,Logic){
 var tpl=document.getElementById(tplId);var inst=new Logic({});
 function render(){var vals=inst.renderVals?inst.renderVals():{};var out=[];kids(tpl.content,vals,out);
  var frag=document.createElement('div');out.forEach(function(x){frag.appendChild(x);});
  if(!host.__m){out.forEach(function(x){wire(x);host.appendChild(x);});host.__m=1;}
  else{var tmp=document.createElement('div');out.forEach(function(x){tmp.appendChild(x);});
   var hc=Array.prototype.slice.call(host.childNodes),nc=Array.prototype.slice.call(tmp.childNodes);
   for(var i=0;i<nc.length;i++){if(i<hc.length)morph(hc[i],nc[i]);else{wire(nc[i]);host.appendChild(nc[i]);}}
   for(i=nc.length;i<hc.length;i++)host.removeChild(hc[i]);}}
 inst.__r=render;render();if(inst.componentDidMount)inst.componentDidMount();};
})();
