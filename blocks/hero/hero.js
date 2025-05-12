// Constants for configuration
const PARALLAX_SCROLL_FACTOR = 0.5;
const THROTTLE_DELAY = 16; // ~60fps

// Utility function for throttling
const throttle = (fnc, delay) => {
  let last = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - last < delay) return;
    last = now;
    fnc(...args);
  };
};

function decorageBackgroundError(block, error = null) {
  const message = error ?? 'There was an error rendering the background video, please check the authored link.';
  const errorContainer = document.createElement('div');
  errorContainer.className = 'video-error-message';
  errorContainer.innerHTML = message;
  block.prepend(errorContainer);
}

function decorateBackgroundVideo(block) {
  try {
    const bg = block.querySelector(':scope > div');
    const link = bg?.querySelector('a');
    if (!link) return;

    const videoEl = document.createElement('video');
    videoEl.className = 'video-bg';
    Object.assign(videoEl, {
      autoplay: true,
      loop: true,
      muted: true,
      playsInline: true,
    });
    videoEl.addEventListener('error', (e) => decorageBackgroundError(block, e.target.error));

    const sourceEl = document.createElement('source');
    sourceEl.src = link.href;
    sourceEl.type = 'video/mp4';
    sourceEl.addEventListener('error', (e) => decorageBackgroundError(block, e.target.parentNode.error));

    videoEl.appendChild(sourceEl);
    block.prepend(videoEl);
  } catch {
    decorageBackgroundError(block);
  }
}

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
    if (bgValue) {
      block.style.setProperty('--hero-background', bgValue);
    }
  }
  bg.remove();
}

function decorateCustomColumns(block) {
  const colsClass = block.className.split(' ').find((cls) => cls.includes('columns'));
  if (!colsClass) return;

  const cols = colsClass.split('-').slice(1);
  const children = [...block.firstElementChild?.children || []];
  children.forEach((child, index) => {
    if (cols[index]) {
      child.style.setProperty('width', `${cols[index]}%`);
    }
  });
}

function decorateContentMeta(block) {
  const metas = block.querySelectorAll(':scope code');
  metas.forEach((meta) => {
    const content = meta.closest('div');
    if (!content) return;

    if (meta.textContent.includes('meta:')) {
      const [, key = '', value = ''] = meta.textContent.split(':');
      if (!key || !value) return;

      const trimmedKey = key.trim();
      const trimmedValue = value.trim();

      if (trimmedKey === 'style') {
        content.classList.add(trimmedValue);
      } else {
        content.style.setProperty(trimmedKey, trimmedValue);
      }
    } else {
      meta.classList.add('code-content');
    }
  });
}

function createParallaxHandler(block) {
  if (!block.firstChild) return null;

  return throttle(() => {
    const offset = window.scrollY * PARALLAX_SCROLL_FACTOR;
    block.firstChild.style.inset = `calc(1px - ${offset}px) 50%`;
  }, THROTTLE_DELAY);
}

function decorateBackgroundParallax(block) {
  if (!block.classList.contains('parallax')) return;
  const handler = createParallaxHandler(block);
  if (handler) {
    window.addEventListener('scroll', handler, { passive: true });
  }
}

export default async function decorate(block) {
  if (!block) return;

  if (block.children.length > 1) {
    decorateBackground(block);
  }

  const content = block.querySelector(':scope > div');
  if (content) {
    content.className = 'content-wrapper';
  }

  decorateBackgroundParallax(block);
  decorateCustomColumns(block);
  decorateContentMeta(block);
}
