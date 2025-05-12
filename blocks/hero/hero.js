import { createVideo, throttle, useContentMeta } from '../../scripts/utils.js';

const SCROLL_FACTOR = 0.5;
const THROTTLE_DELAY = 16; // ~60fps

/**
 * Displays an error message in the hero block when video decoration fails
 * @param {HTMLElement} block - The hero block element
 * @param {string} [errMessage] - Optional custom error message
 */
function decorageBackgroundError(block, errMessage = null) {
  const message = errMessage ?? 'Problem rendering video, please check the authored link.';
  const error = document.createElement('div');
  error.className = 'video-error-message';
  error.innerHTML = `<strong>Hero Error:</strong> ${message}`;
  block.prepend(error);
}

/**
 * Decorates the hero block with a video background
 * @param {HTMLElement} block - The hero block element
 */
function decorateBackgroundVideo(block) {
  try {
    const bg = block.querySelector(':scope > div');
    const link = bg?.querySelector('a');
    if (!link) return;

    const videoEl = createVideo(link, (e) => decorageBackgroundError(block, e.target.error));
    videoEl.className = 'video-bg';
    block.prepend(videoEl);
  } catch {
    decorageBackgroundError(block);
  }
}

/**
 * Decorates the hero block with appropriate background (video, image, or color)
 * @param {HTMLElement} block - The hero block element
 */
function decorateBackground(block) {
  const bg = block.querySelector(':scope > div');
  if (!bg) return;

  const pic = bg.querySelector('picture');
  const fixed = block.classList.contains('fixed-bg');

  if (bg.querySelector('a')?.href.endsWith('.mp4')) {
    decorateBackgroundVideo(block);
  } else if (pic && !fixed) {
    pic.classList.add('img-bg');
    block.prepend(pic);
  } else {
    const bgValue = pic ? `url(${pic.querySelector('img')?.src})` : bg.textContent;
    if (bgValue) block.style.setProperty('--hero-background', bgValue);
  }
  bg.remove();
}

/**
 * Applies custom column widths to child elements based on class names
 * @param {HTMLElement} block - The hero block element
 */
function decorateCustomColumns(block) {
  const customCols = block.className.split(' ').find((cls) => cls.includes('columns'));
  if (!customCols) return;
  const cols = customCols.split('-').slice(1);
  const children = [...block.firstElementChild?.children || []];
  children.forEach((child, index) => {
    if (cols[index]) {
      child.style.setProperty('width', `${cols[index]}%`);
    }
  });
}

/**
 * Creates a throttled scroll handler for parallax effect
 * @param {HTMLElement} block - The hero block element
 * @returns {Function|null} Throttled scroll handler or null if block has no children
 */
function createParallaxHandler(block) {
  if (!block.firstChild) return null;
  return throttle(() => {
    const offset = window.scrollY * SCROLL_FACTOR;
    block.firstChild.style.inset = `calc(1px - ${offset}px) 50%`;
  }, THROTTLE_DELAY);
}

/**
 * Sets up parallax scrolling effect for the hero block
 * @param {HTMLElement} block - The hero block element
 */
function decorateBackgroundParallax(block) {
  if (!block.classList.contains('parallax')) return;
  const handler = createParallaxHandler(block);
  if (handler) window.addEventListener('scroll', handler, { passive: true });
}

/**
 * Main decoration function that orchestrates all hero block enhancements
 * @param {HTMLElement} block - The hero block element
 */
export default async function decorate(block) {
  if (!block) return;
  if (block.children.length > 1) decorateBackground(block);
  const content = block.querySelector(':scope > div');
  if (content) content.className = 'content-wrapper';
  decorateBackgroundParallax(block);
  decorateCustomColumns(block);
  useContentMeta(block);
}
