import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Models from './models';


gsap.registerPlugin(ScrollTrigger);

function Cylinder(props) {
  const ref = useRef();
  const tex = useTexture("/Frame 2.png");
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);

  useFrame((state, delta) => (ref.current.rotation.y += delta * 0.3));
  return (
    <group rotation={[0, 1, 0.2]}>
      <mesh {...props} ref={ref}>
        <cylinderGeometry args={[13, 13, 10, 60, 60, true]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive={new THREE.Color("white")}
          emissiveIntensity={0.1}
          transparent
          side={THREE.DoubleSide}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

function SmileyModel() {
  const mask = useTexture("/smile.jpg");
  const videoTexture = useVideoTexture("/lv_7568434162294803717_20260214155317.mp4", {
    muted: true,
    loop: true,
    start: true,
  });

  const meshRef = useRef();
  const gridSize = 25;
  const spacing = 0.25;

  const { positions, gridDim } = useMemo(() => {
    if (!mask.image) return { positions: [], gridDim: [0, 0] };
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = mask.image;
    const aspectRatio = img.width / img.height;
    let w, h;
    if (aspectRatio > 1) {
      w = gridSize;
      h = Math.round(gridSize / aspectRatio);
    } else {
      h = gridSize;
      w = Math.round(gridSize * aspectRatio);
    }
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    const pos = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = ((h - 1 - y) * w + x) * 4;
        if (data[i] < 128) {
          pos.push({
            x: (x - (w - 1) / 2) * spacing,
            y: (y - (h - 1) / 2) * spacing,
            ux: x / w,
            uy: y / h
          });
        }
      }
    }
    return { positions: pos, gridDim: [w, h] };
  }, [mask]);

  useFrame(() => {
    if (meshRef.current && positions.length > 0) {
      const tempMatrix = new THREE.Matrix4();
      positions.forEach((p, i) => {
        tempMatrix.setPosition(p.x, p.y, 0);
        meshRef.current.setMatrixAt(i, tempMatrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uVideo: { value: videoTexture },
      uGridSize: { value: new THREE.Vector2(gridDim[0], gridDim[1]) }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec2 vInstanceUv;
      attribute vec2 instanceUv;
      void main() {
        vUv = uv;
        // Basic R3F InstancedMesh doesn't have custom attributes easily, 
        // but we can calculate UV from instance position
        vInstanceUv = vec2(instanceMatrix[3][0], instanceMatrix[3][1]); 
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uVideo;
      uniform vec2 uGridSize;
      varying vec2 vUv;
      varying vec2 vInstanceUv;
      void main() {
        // Map instance position back to 0-1 range to sample video
        // spacing = 0.25, gridSize = 24
        vec2 sampleUv = (vInstanceUv / (0.25 * (uGridSize - 1.0))) + 0.5;
        // Offset a bit to get the center of the cube's portion
        vec2 finalUv = sampleUv + (vUv - 0.5) / uGridSize;
        gl_FragColor = texture2D(uVideo, finalUv);
      }
    `
  }), [videoTexture, gridDim]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, positions.length]}>
      <boxGeometry args={[spacing * 0.9, spacing * 0.9, spacing * 0.9]} />
      <shaderMaterial args={[shaderArgs]} />
    </instancedMesh>
  );
}

function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const message = e.target[2].value;

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    window.location.href = `mailto:tanmayvijaysherkar@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-[480px] h-[650px] bg-black text-white p-10 flex flex-col justify-center z-20 shadow-2xl relative">
      <h2 className="text-5xl font-cinzel font-bold mb-10 text-[#FF5314] tracking-tighter">Get in Touch</h2>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-merriweather uppercase tracking-[0.3em] text-gray-500">Name</label>
          <input
            type="text"
            required
            className="bg-black border-b border-gray-800 py-3 focus:border-[#FF5314] outline-none transition-all duration-300 font-merriweather text-lg placeholder:text-gray-700"
            placeholder="Your Name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-merriweather uppercase tracking-[0.3em] text-gray-500">Email</label>
          <input
            type="email"
            required
            className="bg-black border-b border-gray-800 py-3 focus:border-[#FF5314] outline-none transition-all duration-300 font-merriweather text-lg placeholder:text-gray-700"
            placeholder="your@email.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-merriweather uppercase tracking-[0.3em] text-gray-500">Message</label>
          <textarea
            rows="3"
            required
            className="bg-black border-b border-gray-800 py-3 focus:border-[#FF5314] outline-none transition-all duration-300 resize-none font-merriweather text-lg placeholder:text-gray-700"
            placeholder="How can I help you?"
          ></textarea>
        </div>
        <button type="submit" className="mt-6 bg-[#FF5314] text-black font-bold py-5 px-10 hover:bg-white hover:text-black transition-all duration-300 font-cinzel text-xl uppercase tracking-widest shadow-[0_0_20px_rgba(255,83,20,0.3)] cursor-pointer">
          Send Message
        </button>
      </form>
    </div>
  );
}

function App() {
  const frameCanvasRef = useRef(null);
  const heroRef = useRef(null);
  const menuItemsRef = useRef([]);
  const nameRef = useRef(null);
  const scrollerRef = useRef(null);

  const frames = useRef({
    currentIndex: 1,
    maxIndex: 154
  });

  const images = useRef([]);

  useGSAP(() => {
    gsap.from(menuItemsRef.current, {
      x: -100,
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".parent",
        start: "25% top",
        end: "40% top",
        scrub: true,
      }
    });

    gsap.to(heroRef.current, {
      y: "10%",
      opacity: 0,
      scrollTrigger: {
        trigger: ".parent",
        start: "top top",
        end: "5% top",
        scrub: true
      },
    });

    const preloadImages = () => {
      let imagesLoaded = 0;
      for (let i = 1; i <= frames.current.maxIndex; i++) {
        const imageUrl = `/frames/frame_${i.toString().padStart(4, "0")}.jpeg`;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          imagesLoaded++;
          if (imagesLoaded === frames.current.maxIndex) {
            loadImage(frames.current.currentIndex);
            startAnimation();

            gsap.set(frameCanvasRef.current, { opacity: 0 });
            gsap.to(frameCanvasRef.current, { opacity: 1, duration: 3, ease: "power4.out" });
          }
        };
        images.current.push(img);
      }
    };

    const loadImage = (index) => {
      const canvas = frameCanvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      const img = images.current[index - 1];

      if (!img) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    };

    const startAnimation = () => {
      gsap.to(frames.current, {
        currentIndex: frames.current.maxIndex,
        scrollTrigger: {
          trigger: ".parent",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
        onUpdate: function () {
          loadImage(Math.floor(frames.current.currentIndex));
        }
      });
    };

    preloadImages();

    if (scrollerRef.current) {
      gsap.to(scrollerRef.current, {
        x: () => -(scrollerRef.current.scrollWidth - window.innerWidth),
        scrollTrigger: {
          trigger: "#Page2",
          start: "top top",
          end: () => `+=${scrollerRef.current.scrollWidth * 0.5}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        }
      });
    }

    if (nameRef.current) {
      const text = nameRef.current.textContent;
      const half = Math.ceil(text.length / 2);
      nameRef.current.innerHTML = text.split('').map((char, i) =>
        `<span class="${i < half ? 'a' : 'b'} inline-block">${char}</span>`
      ).join('');

      gsap.from(".a", {
        y: 80,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".parent",
          start: "5% top",
          end: "25% top",
          scrub: true,
        },
      });

      gsap.from(".b", {
        y: 80,
        opacity: 0,
        stagger: -0.2,
        scrollTrigger: {
          trigger: ".parent",
          start: "5% top",
          end: "25% top",
          scrub: true,
        },
      });
    }

  });


  const lenis = useLenis(({ scroll }) => {
    ScrollTrigger.update();
  });

  const handleGithubClick = () => {
    window.open("https://github.com/Tanmay01-D3V", "_blank");
  };

  const scrollToSection = (sectionId) => {
    if (sectionId === 'Home') {
      lenis?.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      lenis?.scrollTo(element, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
  };





  return (
    <ReactLenis root>
      <div id="Home" className="w-full bg-black min-h-screen">
        <div className="parent relative w-full h-[700vh]">
          <div className="w-full canva sticky top-0 left-0 h-screen">
            <canvas ref={frameCanvasRef} className="w-full h-screen" id="frame"></canvas>

            <div
              ref={heroRef}
              className="hero absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white z-10 pointer-events-none font-merriweather overflow-hidden"
            >
              <h1 className="font-bold text-7xl text-center leading-tight font-merriweather">
                Watch me come into
                <br /> focus as you scroll
              </h1>
              <p className="text-center mt-4">
                I build interfaces that move with intention. Every animation serves a
                purpose, every frame<br />tells the story of what happens next.
              </p>
            </div>

            <div id="nav" className="absolute top-5 left-2 w-full p-4 flex justify-between items-center text-white z-20">
              <h2
                ref={nameRef}
                onClick={handleGithubClick}
                className="text-5xl font-bold font-pirata overflow-hidden text-[#147298] cursor-pointer pointer-events-auto"
              >
                Tanmay01-D3V
              </h2>
            </div>

            <div id="menu" className="absolute top-[25%] left-0 flex flex-col items-start gap-20 text-white pl-8">
              {[
                { label: 'Home', id: 'Home' },
                { label: 'Skills', id: 'Page2' },
                { label: 'Projects', id: 'Page3' },
                { label: 'Contact Me', id: 'Page4' }
              ].map((item, index) => (
                <h4
                  key={item.label}
                  ref={(el) => (menuItemsRef.current[index] = el)}
                  onClick={() => scrollToSection(item.id)}
                  className="text-3xl font-extrabold cursor-pointer hover:underline decoration-2 underline-offset-8 font-cinzel text-[#FF5314] pointer-events-auto"
                >
                  {item.label}
                </h4>
              ))}
            </div>
          </div>
        </div>
        <div id="Page2" className="w-full h-screen bg-black overflow-hidden flex items-center">
          <div ref={scrollerRef} className="Scroller w-fit h-screen bg-black overflow-hidden flex items-center flex-nowrap shrink-0">
            <h1 className="text-[37vw] text-[#FF5314] font-merriweather drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] uppercase whitespace-nowrap inline-block px-20">Skills</h1>
            <img
              src="/Frame 1.png"
              alt="Frame 1"
              className="h-screen w-auto max-w-none px-20"
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>
        </div>
        <div id="Page3" className="w-full h-screen bg-black overflow-hidden flex items-center justify-center">
          <Canvas camera={{ position: [0, 0, 23] }}>
            <EffectComposer>
              <Bloom
                intensity={0.8}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.01}
              />
            </EffectComposer>

            <ambientLight intensity={3} />
            <Cylinder position={[0, 2, 0]} rotation={[0, 0, 0]} />
            <OrbitControls enableZoom={false} />

          </Canvas>
        </div>
        <div id="Page4" className="w-full h-screen bg-black overflow-hidden flex items-center relative">
          <ContactForm />
          <div className="flex-1 h-full z-10">
            <Canvas camera={{ position: [0, 0, 6] }}>
              <ambientLight intensity={1} />
              <SmileyModel />
              <OrbitControls enableZoom={false} enablePan={true} enableRotate={true} />
            </Canvas>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}

export default App;