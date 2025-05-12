/**
 * Throttles a function to limit its execution rate
 * @param {Function} fnc - The function to throttle
 * @param {number} delay - Minimum time (ms) between function executions
 * @returns {Function} Throttled function
 */
function throttle(fnc, delay) {
  let last = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - last < delay) return;
    last = now;
    fnc(...args);
  };
}

/**
 * Creates a video element with specified configuration and error handling
 * @param {HTMLAnchorElement} link - Link element containing video source
 * @param {Function} [onError] - Optional error handler function
 * @param {Object} [config] - Video element configuration
 * @param {boolean} [config.autoplay=true] - Whether to autoplay the video
 * @param {boolean} [config.loop=true] - Whether to loop the video
 * @param {boolean} [config.muted=true] - Whether to mute the video
 * @param {boolean} [config.playsInline=true] - Whether to play inline on mobile
 * @returns {HTMLVideoElement} Configured video element
 */
function createVideo(
  link,
  onError = null,
  config = {
    autoplay: true,
    loop: true,
    muted: true,
    playsInline: true,
  },
) {
  const videoEl = document.createElement('video');
  Object.assign(videoEl, config);
  if (onError) videoEl.addEventListener('error', onError);
  const sourceEl = document.createElement('source');
  sourceEl.src = link.href;
  sourceEl.type = 'video/mp4';
  if (onError) sourceEl.addEventListener('error', onError);
  videoEl.appendChild(sourceEl);
  return videoEl;
}

/**
 * Processes meta information in code blocks to apply styles or classes
 * @param {HTMLElement} block - The block element containing code elements
 */
function useContentMeta(block) {
  const metas = block.querySelectorAll(':scope code');
  if (!metas.length) return;
  metas.forEach((meta) => {
    const content = meta.closest('div');
    if (!content) return;
    if (meta.textContent.includes('meta:')) {
      const [, key = '', val = ''] = meta.textContent.split(':');
      if (!key || !val) return;
      const prop = key.trim();
      const value = val.trim();
      if (prop === 'style') content.classList.add(value);
      else content.style.setProperty(prop, value);
    } else {
      meta.classList.add('code-content');
    }
  });
}

export {
  throttle,
  createVideo,
  useContentMeta,
};
