function decorateVideoBg(block) {
  const bg = block.querySelector(':scope > div');
  const link = bg.querySelector('a');
  const videoEl = document.createElement('video');
  videoEl.className = 'video-bg';
  Object.assign(videoEl, {
    autoplay: true,
    loop: true,
    muted: true,
    playsInline: true,
  });
  const sourceEl = document.createElement('source');
  sourceEl.src = link.href;
  sourceEl.type = 'video/mp4';
  videoEl.appendChild(sourceEl);
  block.prepend(videoEl);
}

function decorateBg(block) {
  const bg = block.querySelector(':scope > div');
  if (bg) {
    const vid = bg.querySelector('a')?.href.endsWith('.mp4');
    const pic = bg.querySelector('picture');
    const fixed = block.classList.contains('fixed-bg');
    if (vid) {
      decorateVideoBg(block);
    } else if (pic && !fixed) {
      pic.classList.add('img-bg');
      block.prepend(pic);
    } else {
      const bgValue = pic ? `url(${pic.querySelector('img').src})` : bg.textContent;
      block.style.setProperty('--hero-background', bgValue);
    }
    bg.remove();
  }
}

function parallaxBg(block) {
  if (block.classList.contains('parallax')) {
    window.onscroll = () => {
      const offset = window.scrollY * 0.5;
      block.firstChild.style.inset = `calc(1px - ${offset}px) 50%`;
    };
  }
}

export default async function decorate(block) {
  if (block.children.length > 1) decorateBg(block);
  const content = block.querySelector(':scope > div');
  content.className = 'content-wrapper';
  if (block.classList.contains('parallax')) parallaxBg(block);
}
