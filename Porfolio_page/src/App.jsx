import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const menuItemsRef = useRef([]);
  const nameRef = useRef(null);

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
        scrub: 2,
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

            gsap.set(canvasRef.current, { opacity: 0 });
            gsap.to(canvasRef.current, { opacity: 1, duration: 3, ease: "power4.out" });
          }
        };
        images.current.push(img);
      }
    };

    const loadImage = (index) => {
      const canvas = canvasRef.current;
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
          scrub: 3,
        },
        onUpdate: function () {
          loadImage(Math.floor(frames.current.currentIndex));
        }
      });
    };

    preloadImages();

    gsap.to("#Page2 h1, #Page2 img", {
      x: "-70%",
      scrollTrigger: {
        trigger: "#Page2",
        start: "top 0%",
        end: "top -250%",
        scrub: 2,
        pin: true,
      }
    });

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
          scrub: 2,
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
          scrub: 2,
        },
      });
    }

  });


  const handleScrollToHero = () => {
    window.scrollTo({
      top: window.innerHeight * 0.15,
      behavior: "smooth"
    });
  };

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="parent relative w-full h-[700vh]">
        <div className="w-full canva sticky top-0 left-0 h-screen">
          <canvas ref={canvasRef} className="w-full h-screen" id="frame"></canvas>

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
              onClick={handleScrollToHero}
              className="text-5xl font-bold font-pirata overflow-hidden text-[#147298] cursor-pointer pointer-events-auto"
            >
              Tanmay01-D3V
            </h2>
          </div>

          <div id="menu" className="absolute top-[25%] left-0 flex flex-col items-start gap-10 text-white pl-8">
            {['Home', 'About', 'Projects', 'Skills', 'Contact Me', 'Tech Stack'].map((item, index) => (
              <h4
                key={item}
                ref={(el) => (menuItemsRef.current[index] = el)}
                className="text-3xl font-extrabold cursor-pointer hover:underline decoration-2 underline-offset-8 font-cinzel text-[#FF5314] pointer-events-auto"
              >
                {item}
              </h4>
            ))}
          </div>
        </div>
      </div>
      <div id="Page2" className="w-full h-screen bg-black overflow-hidden flex items-center">
        <h1 className="text-[37vw] text-[#FF5314] font-merriweather drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] uppercase whitespace-nowrap inline-block">Projects</h1>
        <img src="public/Frame 1.png" alt="Frame 1" className="h-screen w-auto max-w-none" />
      </div>
    </div>
  );
}

export default App;