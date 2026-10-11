"use client";

import { useEffect, useRef, useState } from "react";

const vertex = `attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `
precision highp float;
varying vec2 uv;
uniform vec2 resolution;
uniform float time;
uniform sampler2D artwork;
uniform float mobile;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1)),f.x),f.y),f.z);}
vec3 spectrum(float x){return .55+.45*cos(6.28318*(vec3(.02,.34,.67)+x));}
void main(){
 vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.);
 float t=time; float camera=sin(t*.18)*.018;
 vec2 sampleUV=clamp((vec2(uv.x,1.-uv.y)-.5)*(1.+sin(t*.15)*.012)+.5,0.,1.);
 vec3 back=texture2D(artwork,sampleUV).rgb;
 // The original artwork supplies the environment; the foreground is rendered geometry.
 float erase=exp(-pow((uv.x-.52)*5.,4.)-pow((uv.y-.52)*2.4,4.));
 vec3 col=back*mix(.85,.025,erase);
 vec2 center=vec2(mix(.045,0.,mobile),mix(-.015,.14,mobile));
 vec2 q=p-center; q.x+=camera;
 float beamX=q.x-.08; float beamY=q.y-.035;
 float spread=max(.018,beamX*.27); float band=beamY/spread;
 float beam=exp(-band*band*2.2)*smoothstep(.02,.15,beamX)*exp(-max(beamX,0.)*.3);
 col+=spectrum(band*.27+.05)*beam*(.38+.10*sin(t*1.3-beamX*8.));
 float white=exp(-pow((q.y-.025+q.x*.22)/.004,2.))*(1.-smoothstep(-.18,-.02,q.x));
 col+=vec3(1.,.89,.76)*white*.8;
 float angle=.33+sin(t*.25)*.22;
 mat3 rot=mat3(cos(angle),0.,sin(angle),0.,1.,0.,-sin(angle),0.,cos(angle));
 vec3 ro=rot*vec3(q/mix(1.,.74,mobile),2.8); vec3 rd=rot*normalize(vec3(q.x*.035,q.y*.035,-1.));
 float nearT=0.;float farT=10.;vec3 normal=vec3(0.);bool hit=true;
 // Intersect the eight planes of a solid, faceted crystal (no ray-marching loop).
 for(int i=0;i<8;i++){
  vec3 n=vec3(mod(float(i),2.)<1.?-1.:1.,mod(floor(float(i)/2.),2.)<1.?-1.:1.,i<4?-1.:1.)*vec3(1.,.68,1.);
  float denom=dot(n,rd);float dist=(.29-dot(n,ro))/denom;
  if(denom<0.){if(dist>nearT){nearT=dist;normal=normalize(n);}}else{farT=min(farT,dist);}
 }
 hit=nearT<farT;
 if(hit){
  vec3 pos=ro+rd*nearT;
  float grain=noise(pos*28.);float veins=abs(sin(pos.y*34.+noise(pos*18.)*9.));
  vec3 mineral=mix(vec3(.018,.055,.065),vec3(.62,.16,.035),smoothstep(.28,.72,grain));
  vec2 crystalUV=vec2(mix(.465,.49,mobile)+pos.x*mix(.34,.85,mobile),mix(.45,.38,mobile)-pos.y*mix(.72,.75,mobile));
  vec3 crystalTexture=texture2D(artwork,clamp(crystalUV,0.,1.)).rgb;
  mineral=mix(mineral,crystalTexture, .86);
  mineral+=vec3(.9,.52,.16)*pow(1.-veins,12.)*.12;
  float fresnel=pow(1.-max(dot(normal,-rd),0.),3.);
  vec2 refractUV=sampleUV+normal.xy*.075;
  vec3 glass=mix(texture2D(artwork,clamp(refractUV,0.,1.)).rgb,crystalTexture,.65)+vec3(.05,.13,.17);
  glass=mix(glass,spectrum(normal.x*.4+t*.035),fresnel*.65);
  float material=smoothstep(-.025,.025,pos.x);
  vec3 surface=mix(mineral,glass,material);
  float diffuse=.3+.7*max(dot(normal,normalize(vec3(-.7,.8,1.4))),0.);
  vec3 light=normalize(vec3(sin(t*.4)*.8,1.,1.5));
  float spec=pow(max(dot(reflect(-light,normal),-rd),0.),42.);
  float rim=pow(fresnel,2.);
  col=surface*diffuse+spec*vec3(1.,.9,.73)*1.8+rim*vec3(.48,.84,1.)*.65;
  // Fine facet boundaries sparkle as the crystal turns.
  vec3 a=abs(pos)*vec3(1.,.68,1.);float edge=min(min(a.x,a.y),a.z);
  col+=vec3(.65,.87,1.)*(1.-smoothstep(.0,.004,edge))*.5;
 }
 // Suspended motes follow separate trajectories, with restrained brightness.
 for(int j=0;j<24;j++){
  float id=float(j); vec2 mote=vec2(fract(sin(id*91.7)*437.5+t*(.004+mod(id,3.)*.002)),fract(sin(id*13.8)*217.3+t*.009));
  vec2 d=(uv-mote)*vec2(resolution.x/resolution.y,1.);
  col+=spectrum(id*.13)*exp(-dot(d,d)*180000.)*(.15+.3*pow(sin(t*.7+id),2.));
 }
 col+=vec3(.025,.12,.16)*exp(-dot(q-vec2(0.,-.43),q-vec2(0.,-.43))*35.);
 col*=.83+.17*pow(16.*uv.x*uv.y*(1.-uv.x)*(1.-uv.y),.2);
 gl_FragColor=vec4(col,1.);
}`;

export default function PrismCinema() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);
  useEffect(() => { pauseRef.current = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Shader unavailable");
      shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Shader compilation failed");
      return shader;
    };
    const program = gl.createProgram();
    if (!program) return;
    try { gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program); }
    catch { shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); return; }
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); return; }
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position"); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const sizeUniform = gl.getUniformLocation(program, "resolution"), timeUniform = gl.getUniformLocation(program, "time"), mobileUniform = gl.getUniformLocation(program, "mobile");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true, loaded = false, disposed = false, frame = 0, elapsed = 0, last = 0, lastDraw = 0, imageKey = "";
    let image: HTMLImageElement | null = null;
    const loadArtwork = () => {
      const key = canvas.clientWidth <= 600 ? "logo-640.webp" : "banner-1086.webp";
      if (key === imageKey) return;
      imageKey = key; const candidate = new Image(); image = candidate;
      candidate.onload = () => { if (disposed || image !== candidate) return; gl.bindTexture(gl.TEXTURE_2D, texture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, candidate); loaded = true; lastDraw = 0; };
      candidate.src = `/projects/jasperprism/${key}`;
    };
    const draw = (now: number) => {
      const stopped = pauseRef.current || motion.matches || document.documentElement.hasAttribute("data-reduce-motion");
      const delta = last ? Math.min(now-last, 60) : 0; last = now;
      if (visible && !document.hidden && !stopped) elapsed += delta / 1000;
      if (loaded && visible && !document.hidden && (!stopped || !lastDraw) && now-lastDraw >= 1000/30) {
        const width = canvas.clientWidth, height = canvas.clientHeight;
        const scale = Math.min(devicePixelRatio || 1, width <= 600 ? 1 : 1.25, 1440/width);
        const w = Math.max(1, Math.round(width*scale)), h = Math.max(1, Math.round(height*scale));
        if (canvas.width !== w || canvas.height !== h) { canvas.width=w; canvas.height=h; }
        gl.viewport(0,0,w,h); gl.uniform2f(sizeUniform,w,h); gl.uniform1f(timeUniform,elapsed); gl.uniform1f(mobileUniform,width<=600 ? 1 : 0); gl.drawArrays(gl.TRIANGLES,0,6);
        lastDraw=now; setReady(true);
      }
      frame=requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(() => { loadArtwork(); lastDraw=0; }); resize.observe(canvas);
    const observer = new IntersectionObserver(entries => { visible=entries[0].isIntersecting; last=0; }, { rootMargin: "50px" }); observer.observe(canvas);
    const lost = (event: Event) => { event.preventDefault(); setReady(false); cancelAnimationFrame(frame); };
    canvas.addEventListener("webglcontextlost",lost);
    loadArtwork(); frame=requestAnimationFrame(draw);
    return () => { disposed=true; if(image) image.onload=null; cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); canvas.removeEventListener("webglcontextlost",lost); gl.deleteTexture(texture); gl.deleteBuffer(buffer); shaders.forEach(shader=>gl.deleteShader(shader)); gl.deleteProgram(program); };
  }, []);

  return <div className="prism-cinema" data-rendering={ready ? "live" : "artwork"}>
    <picture><source media="(max-width: 600px)" type="image/webp" srcSet="/projects/jasperprism/logo-640.webp" /><source type="image/webp" srcSet="/projects/jasperprism/banner-1086.webp 1086w, /projects/jasperprism/banner-2172.webp 2172w" sizes="100vw" /><img src="/projects/jasperprism/banner.png" alt="JasperPrism crystal, with mineral facets and glass refracting light into a spectrum" width={2172} height={724} fetchPriority="high" /></picture>
    <canvas ref={canvasRef} aria-label="Animated JasperPrism artwork: a turning faceted crystal, flowing spectrum and floating light particles" role="img" />
    {ready && <button className="prism-cinema-toggle" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? "Play animation" : "Pause animation"}<span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span></button>}
  </div>;
}
