"use client";
import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
// Coordinates select light already present in the artwork. Texture coordinates never move.
const fragment = `precision mediump float;
varying vec2 uv;
uniform sampler2D artwork;
uniform vec2 texel;
uniform float phase;
uniform float identity;
float lum(vec3 c){return dot(c,vec3(.2126,.7152,.0722));}
void main(){
 vec2 p=vec2(uv.x,1.-uv.y);
 vec4 original=texture2D(artwork,p);
 vec2 entry=mix(vec2(.403,.405),vec2(.266,.490),identity);
 vec2 exitPoint=mix(vec2(.501,.399),vec2(.568,.467),identity);
 vec2 start=mix(vec2(0.,.12),vec2(0.,.421),identity);
 vec2 ray=entry-start;
 float along=clamp(dot(p-start,ray)/dot(ray,ray),0.,1.);
 float distanceToRay=length((p-start-ray*along)*vec2(mix(3.,1.,identity),1.));
 float incoming=exp(-pow(distanceToRay/.014,2.))*step(p.x,entry.x+.008);
 float transmission=.22+.78*pow(.5+.5*cos(phase-along*12.56637),6.);
 float contact=exp(-dot((p-entry)*vec2(3.,1.),(p-entry)*vec2(3.,1.))/mix(.0012,.0018,identity));
 vec2 outRay=p-exitPoint;
 float slope=outRay.y/max(outRay.x,.005);
 float fan=(1.-smoothstep(mix(.58,.88,identity),mix(.75,1.08,identity),abs(slope)))*smoothstep(0.,.025,outRay.x);
 float saturation=max(max(original.r,original.g),original.b)-min(min(original.r,original.g),original.b);
 float rainbow=fan*smoothstep(.13,.5,saturation)*smoothstep(.08,.3,lum(original.rgb));
 float outward=.18+.82*pow(.5+.5*cos(phase-outRay.x*18.84956+slope*2.),5.);
 vec2 stone=(p-mix(vec2(.465,.48),vec2(.47,.52),identity))/mix(vec2(.085,.31),vec2(.24,.31),identity);
 float facets=exp(-dot(stone,stone)*2.)*smoothstep(.48,.85,lum(original.rgb));
 float shimmer=.5+.5*sin(phase*2.+p.x*18.+p.y*11.);
 float energy=incoming*transmission*.16+contact*(.11+.06*sin(phase))+rainbow*outward*.16+facets*shimmer*.08;
 // Local samples give a restrained bloom without changing geometry or transparent edges.
 vec3 bloom=(texture2D(artwork,p+vec2(texel.x*2.,0.)).rgb+texture2D(artwork,p-vec2(texel.x*2.,0.)).rgb+
 texture2D(artwork,p+vec2(0.,texel.y*2.)).rgb+texture2D(artwork,p-vec2(0.,texel.y*2.)).rgb)*.25;
 vec3 light=min(vec3(1.),mix(original.rgb,bloom,.2)*1.2+vec3(.04));
 gl_FragColor=vec4(light,min(.24,energy)*original.a);
}`;

type Props = { active: boolean; variant: "banner" | "identity"; label?: string; onReady?: (ready: boolean) => void };
export default function PrismIllumination({ active, variant, label, onReady }: Props) {
 const canvasRef=useRef<HTMLCanvasElement>(null),activeRef=useRef(active),syncRef=useRef<(() => void)|null>(null),readyRef=useRef(onReady);
 useEffect(()=>{activeRef.current=active;syncRef.current?.();},[active]);
 useEffect(()=>{
  const canvas=canvasRef.current,picture=canvas?.parentElement?.querySelector("img");
  if(!canvas||!picture)return;
  const gl=canvas.getContext("webgl",{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,powerPreference:"low-power"});
  if(!gl)return;
  const shaders:WebGLShader[]=[],program=gl.createProgram();if(!program)return;
  const compile=(type:number,source:string)=>{const shader=gl.createShader(type);if(!shader)throw new Error("Shader unavailable");shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error("Light shader failed");gl.attachShader(program,shader);};
  try{compile(gl.VERTEX_SHADER,vertex);compile(gl.FRAGMENT_SHADER,fragment);gl.linkProgram(program);}catch{shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);return;}
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);return;}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,"position");gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const phaseUniform=gl.getUniformLocation(program,"phase"),texelUniform=gl.getUniformLocation(program,"texel");gl.uniform1f(gl.getUniformLocation(program,"identity"),variant==="identity"?1:0);
  const motion=matchMedia("(prefers-reduced-motion: reduce)");let loaded=false,visible=false,lost=false,frame=0,elapsed=0,last=0,lastDraw=0,source="";
  const permitted=()=>loaded&&visible&&!lost&&activeRef.current&&!document.hidden&&!motion.matches&&!document.documentElement.hasAttribute("data-reduce-motion");
  const draw=(now:number)=>{
   frame=0;if(!permitted()){sync();return;}elapsed+=(last?Math.min(now-last,80):0)/1000;last=now;
   if(now-lastDraw>=1000/30){const width=canvas.clientWidth,height=canvas.clientHeight,scale=Math.min(devicePixelRatio||1,width<=600?1:1.25,(variant==="banner"?1280:640)/Math.max(width,1));const w=Math.max(1,Math.round(width*scale)),h=Math.max(1,Math.round(height*scale));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);gl.uniform1f(phaseUniform,(elapsed%8)*Math.PI/4);gl.drawArrays(gl.TRIANGLES,0,6);canvas.dataset.lighting="active";lastDraw=now;}
   frame=requestAnimationFrame(draw);
  };
  function sync(){if(!permitted()){if(frame)cancelAnimationFrame(frame);frame=0;last=0;canvas.dataset.lighting="static";}else if(!frame){last=0;lastDraw=0;frame=requestAnimationFrame(draw);}}
  const load=()=>{if(!picture.complete||!picture.naturalWidth||picture.currentSrc===source)return;source=picture.currentSrc;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,picture);gl.uniform2f(texelUniform,1/picture.naturalWidth,1/picture.naturalHeight);loaded=true;readyRef.current?.(true);sync();};
  const resize=new ResizeObserver(()=>{load();lastDraw=0;sync();});resize.observe(canvas);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(canvas);
  const preferences=new MutationObserver(sync);preferences.observe(document.documentElement,{attributes:true,attributeFilter:["data-reduce-motion"]});
  const contextLost=(event:Event)=>{event.preventDefault();lost=true;readyRef.current?.(false);sync();};
  picture.addEventListener("load",load);canvas.addEventListener("webglcontextlost",contextLost);document.addEventListener("visibilitychange",sync);motion.addEventListener("change",sync);syncRef.current=sync;load();
  return()=>{lost=true;sync();syncRef.current=null;picture.removeEventListener("load",load);resize.disconnect();observer.disconnect();preferences.disconnect();canvas.removeEventListener("webglcontextlost",contextLost);document.removeEventListener("visibilitychange",sync);motion.removeEventListener("change",sync);gl.deleteTexture(texture);gl.deleteBuffer(buffer);shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);};
 },[variant]);
 return <canvas ref={canvasRef} className="prism-light-overlay" data-lighting="static" aria-label={label} aria-hidden={!label} role={label?"img":undefined} />;
}
