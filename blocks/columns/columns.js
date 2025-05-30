export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // use block column widths from variant
  let widths;
  const customWidths = [...block.classList].filter((i) => i.includes('widths'));
  if (customWidths?.length) {
    widths = customWidths[0]?.split('-');
    widths?.shift();
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col, i) => {
      if (widths) col.style.setProperty('--col-width', `${widths[i]}%`);
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
