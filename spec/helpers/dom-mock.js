// Mock canvas and DOM elements required by script.js
const mockCanvas = {
  getContext: () => ({
    clearRect: () => {},
    fillRect: () => {},
    drawImage: () => {},
  }),
  addEventListener: () => {},
};

const mockElement = {
  textContent: '',
  classList: { remove: () => {}, add: () => {} },
  addEventListener: () => {},
};

global.document = {
  getElementById: (id) => {
    const mocks = {
      'game-canvas': mockCanvas,
      'score': mockElement,
      'best-score': mockElement,
      'overlay': mockElement,
      'overlay-message': mockElement,
      'overlay-btn': mockElement,
    };
    return mocks[id] || mockElement;
  },
  addEventListener: () => {},
};

global.Image = class {
  constructor() {
    this.src = '';
    this.complete = false;
    this.naturalWidth = 0;
  }
};

global.performance = {
  now: () => Date.now(),
};

global.requestAnimationFrame = (cb) => {
  setTimeout(cb, 16);
  return 0;
};

global.cancelAnimationFrame = () => {};
