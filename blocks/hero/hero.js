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

function decorateBackground(block) {
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

function decorateCustomColumns(block) {
  if (block.className.includes('columns')) {
    const colsClass = block.className.split(' ').find((cls) => cls.includes('columns'));
    const cols = colsClass.split('-');
    cols.shift();
    [...block.firstElementChild.children].forEach((child, index) => {
      child.style.setProperty('width', `${cols[index]}%`);
    });
  }
}

function decorateContentMeta(block) {
  const metas = block.querySelectorAll(':scope code');
  metas.forEach((meta) => {
    if (meta.textContent.includes('meta:')) {
      const metaData = meta.textContent.split(':');
      metaData.shift();
      const [key, value] = metaData;
      const content = meta.closest('div');
      if (key.trim() === 'style') {
        content.classList.add(value.trim());
      } else {
        content.style.setProperty(key.trim(), value.trim());
      }
    } else {
      meta.classList.add('code-content');
    }
  });
}

function parallaxBg(block) {
  if (block.classList.contains('parallax')) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.5;
      block.firstChild.style.inset = `calc(1px - ${offset}px) 50%`;
    });
  }
}

export default async function decorate(block) {
  if (block.children.length > 1) decorateBackground(block);
  const content = block.querySelector(':scope > div');
  content.className = 'content-wrapper';
  if (block.classList.contains('parallax')) parallaxBg(block);
  decorateCustomColumns(block);
  decorateContentMeta(block);
}
