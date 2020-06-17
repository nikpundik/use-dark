import { draw, fade } from './draw';

const FADE_TIME = 750;

class LoadImage {
  constructor(src, onLoaded) {
    this.img = new Image();
    this.onLoaded = onLoaded;

    this.loadComplete = this.loadComplete.bind(this);

    this.img.addEventListener('load', this.loadComplete, false);
    this.img.src = src;
  }
  loadComplete() {
    if (this.onLoaded) this.onLoaded(this.img);
  }
  destroy() {
    this.img.removeEventListener('load', this.loadComplete);
  }
}

class Animation {
  constructor() {
    this.time = 0;
    this.accumTimeout = 0;
    this.accumImage = 0;

    this.image = null;
    this.next = null;

    this.commands = [];

    this.resize = this.resize.bind(this);
    this.update = this.update.bind(this);

    this.start();
  }

  setup(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.resize();
    this.request = requestAnimationFrame(this.update);
  }

  start() {
    this.startListeners();
  }

  update(time) {
    const delta = time - this.time;
    this.time = time;
    this.accumTimeout += delta;
    this.accumImage += delta;

    if (this.image) {
      const type = this.getType();
      draw(
        this.context,
        this.size,
        this.image,
        this.accumImage,
        type,
        this.data.speed
      );
    }

    if (this.accumTimeout < FADE_TIME) {
      const opacity = this.accumTimeout / FADE_TIME;
      fade(this.context, this.size, opacity);
    } else if (this.accumTimeout < FADE_TIME * 2) {
      const opacity = 1 - (this.accumTimeout - FADE_TIME) / FADE_TIME;
      fade(this.context, this.size, opacity);
    }

    this.request = requestAnimationFrame(this.update);
  }

  getType() {
    if (!this.data.responsive) return this.data.type;
    let min = this.data.type;
    for (let [breakpoint, type] of this.data.responsive) {
      if (this.canvas.width > breakpoint) return min;
      min = type;
    }
    return min;
  }

  startListeners() {
    window.addEventListener('resize', this.resize, false);
  }

  stopListeners() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;
    this.size = { width, height };
  }

  setSize(size) {
    this.size = size;
  }

  setImage(data, onLoaded) {
    const imageData = Object.assign(
      {
        type: 3,
        speed: 0.3,
        responsive: [[600, 1]],
      },
      data
    );
    if (imageData.responsive)
      imageData.responsive.sort(([b1], [b2]) => b2 - b1);
    if (this.loadingImage) this.loadingImage.destroy();
    clearTimeout(this.fadeInTimeout);
    this.loadingImage = new LoadImage(imageData.image, (img) =>
      this.showImage(imageData, img, onLoaded)
    );
  }

  showImage(data, image, onLoaded) {
    this.accumTimeout = 0;

    this.fadeInTimeout = setTimeout(() => {
      this.data = data;
      this.image = image;
      this.accumImage = 0;
      if (onLoaded) onLoaded(data);
    }, FADE_TIME);
  }

  destroy() {
    this.stopListeners();
    clearTimeout(this.fadeInTimeout);
    cancelAnimationFrame(this.request);
  }
}

export default Animation;
