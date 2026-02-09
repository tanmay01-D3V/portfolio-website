gsap.from("#menu h4", {
    x: -100,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".parent",
        start: "25% top",
        end: "40% top",
        scrub: 2,
        markers: true,
    }
})


if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

window.scrollTo(0, 0);
setTimeout(() => {
    window.scrollTo(0, 0);
}, 50);

document.querySelector("#nav h2").addEventListener("click", function () {
    window.scrollTo({
        top: window.innerHeight * 0.15,
        behavior: "smooth"
    });
});

function breakTheText() {
    var h2 = document.querySelector("h2")
    var h2Text = h2.textContent

    var splittedText = h2Text.split("")
    var halfValue = splittedText.length / 2

    var clutter = ""

    splittedText.forEach(function (elem, idx) {
        if (idx < halfValue) {
            clutter += `<span class="a inline-block">${elem}</span>`
        } else {
            clutter += `<span class="b inline-block">${elem}</span>`
        }
    })

    h2.innerHTML = clutter
}

breakTheText()

gsap.from("#nav h2 .a", {
    y: 80,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".parent",
        start: "5% top",
        end: "25% top",
        scrub: 2,
        markers: true,
    },
})

gsap.from("#nav h2 .b", {
    y: 80,
    opacity: 0,
    stagger: -0.2,
    scrollTrigger: {
        trigger: ".parent",
        start: "5% top",
        end: "25% top",
        scrub: 2,
        markers: true,
    },
})


const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const frames = {
    currentIndex: 1,
    maxIndex: 154
};

let imagesloaded = 0;
const images = [];

function preloadImages() {
    for (var i = 1; i <= frames.maxIndex; i++) {
        const imageUrl = `frames/frame_${i.toString().padStart(4, "0")}.jpeg`
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            imagesloaded++;
            if (imagesloaded === frames.maxIndex) {
                loadImage(frames.currentIndex);
                startAnimation();

                gsap.set(canvas, { opacity: 0 });
                gsap.to(canvas, { opacity: 1, duration: 3, ease: "power4.inOut" });

                gsap.to(".hero", {
                    y: "10%",
                    scrollTrigger: {
                        trigger: ".parent",
                        start: "top top",
                        end: "5% top",
                        scrub: true
                    },
                    opacity: 0,
                });
            }
        }
        images.push(img);
    }
}
function loadImage(index) {
    if (index >= 0 && index <= frames.maxIndex) {
        const img = images[index];
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
        frames.currentIndex = index;
    }
}

function startAnimation() {
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".parent",
            start: "top top",
            scrub: 3,
        }
    })

    tl.to(frames, {
        currentIndex: frames.maxIndex,
        onUpdate: function () {
            loadImage(Math.floor(frames.currentIndex))
        }
    })
}
preloadImages();