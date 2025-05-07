export default async function decorate(block) {
  // set a background color if there is more than one child
  if (block.children.length === 2) {
    const bg = block.querySelector(':scope > div');
    block.style.setProperty('--sub-header-background', bg.textContent);
    bg.remove();
  }
}
