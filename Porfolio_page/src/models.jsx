import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Models {
    constructor(gl_app) {
        this.scene = gl_app.scene
        this.group = new THREE.Group()
        this.scene.add(this.group)

        this.gridSize = 24
        this.spacing = 0.65
        this.grids_config = [
            {
                id: 'smile',
                mask: 'smile.jpg',
                video: 'https://res.cloudinary.com/dqtxm0xb2/video/upload/v1771077404/lv_7568434162294803717_20260214155317_za7mou.mp4'
            },
        ]
        this.grids_config.forEach((config, index) => this.createMask(config, index))
        this.group.scale.setScalar(0.15)
        this.is_ready = true
        this.grids = []
    }

    createMask(config, index) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const maskImage = new Image()
        maskImage.crossOrigin = 'anonymous'
        maskImage.onload = () => {
            const originalWidth = maskImage.width
            const originalHeight = maskImage.height
            const aspectRatio = originalWidth / originalHeight

            if (aspectRatio > 1) {
                this.gridWidth = this.gridSize
                this.gridHeight = Math.round(this.gridSize / aspectRatio)
            } else {
                this.gridHeight = this.gridSize
                this.gridWidth = Math.round(this.gridSize * aspectRatio)
            }

            canvas.width = this.gridWidth
            canvas.height = this.gridHeight
            ctx.drawImage(maskImage, 0, 0, this.gridWidth, this.gridHeight)

            const imageData = ctx.getImageData(0, 0, this.gridWidth, this.gridHeight)
            this.data = imageData.data
            this.createGrid(config, index)
        }

        maskImage.src = `/${config.mask}`
    }

    createVideoTexture(config) {
        this.video = document.createElement('video')
        this.video.src = config.video
        this.video.crossOrigin = 'anonymous'
        this.video.loop = true
        this.video.muted = true
        this.video.play()

        this.videoTexture = new THREE.VideoTexture(this.video)
        this.videoTexture.minFilter = THREE.LinearFilter
        this.videoTexture.magFilter = THREE.LinearFilter
        this.videoTexture.colorSpace = THREE.SRGBColorSpace
    }

    createGrid(config, index) {
        this.createVideoTexture(config)
        const grid_group = new THREE.Group()
        this.group.add(grid_group)

        const material = new THREE.MeshBasicMaterial({
            map: this.videoTexture,
            side: THREE.FrontSide
        })

        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {

                const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

                const flippedY = this.gridHeight - 1 - y
                const pixelIndex = (flippedY * this.gridWidth + x) * 4
                const r = this.data[pixelIndex]
                const g = this.data[pixelIndex + 1]
                const b = this.data[pixelIndex + 2]

                const brightness = (r + g + b) / 3

                if (brightness < 128) {
                    const uvX = x / this.gridWidth
                    const uvY = y / this.gridHeight
                    const uvWidth = 1 / this.gridWidth
                    const uvHeight = 1 / this.gridHeight

                    const uvAttribute = geometry.attributes.uv
                    const uvArray = uvAttribute.array

                    for (let i = 0; i < uvArray.length; i += 2) {
                        uvArray[i] = uvX + (uvArray[i] * uvWidth)
                        uvArray[i + 1] = uvY + (uvArray[i + 1] * uvHeight)
                    }
                    uvAttribute.needsUpdate = true

                    const mesh = new THREE.Mesh(geometry, material);

                    mesh.position.x = (x - (this.gridWidth - 1) / 2) * this.spacing;
                    mesh.position.y = (y - (this.gridHeight - 1) / 2) * this.spacing;
                    mesh.position.z = 0;

                    grid_group.add(mesh);
                }
            }
        }
        grid_group.name = config.id
        this.grids.push(grid_group);

        this.initInteractions()
    }

    initInteractions() {
        this.current = 'smile'
        this.old = null
        this.is_animating = false
        this.duration = 1

        this.DOM = {
            $btns: document.querySelectorAll('.btns__item button'),
            $canvas: document.querySelector('canvas#sketch')
        }
    }

    update() {
        if (this.is_ready) {
            this.group.children.forEach((model, index) => {
                model.position.z = Math.sin(Date.now() * 0.005 + index * 0.1) * 0.6
            })
        }
    }
}
