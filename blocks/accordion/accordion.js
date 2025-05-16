/*
 * Accordion Block
 * Recreate an accordion with smooth animations
 * https://www.hlx.live/developer/block-collection/accordion
 */

export default function decorate(block) {
  // Add CSS for animations
  document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: '.accordion-item-body { overflow: hidden; transition: height 0.4s ease-out, padding 0.4s ease-out; }'
  }));
  
  [...block.children].forEach((row) => {
    // Create accordion structure
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...row.children[0].childNodes);
    
    const body = row.children[1];
    body.className = 'accordion-item-body';
    body.style.height = '0';
    body.style.padding = '0 16px';
    
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    
    // Handle click animation
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Prevent animation conflicts
      if (summary.dataset.animating === 'true') return;
      summary.dataset.animating = 'true';
      
      const isOpen = details.hasAttribute('open');
      
      if (isOpen) {
        // Close animation
        body.style.height = `${body.scrollHeight}px`;
        requestAnimationFrame(() => {
          body.style.height = '0';
          body.style.padding = '0 16px';
        });
        
        body.addEventListener('transitionend', function handler() {
          details.removeAttribute('open');
          summary.dataset.animating = 'false';
          body.removeEventListener('transitionend', handler);
        }, { once: true });
      } else {
        // Open animation
        details.setAttribute('open', '');
        
        // Measure content height
        const height = body.scrollHeight;
        
        requestAnimationFrame(() => {
          body.style.height = `${height}px`;
          body.style.padding = '16px';
        });
        
        body.addEventListener('transitionend', function handler() {
          body.style.height = 'auto';
          summary.dataset.animating = 'false';
          body.removeEventListener('transitionend', handler);
        }, { once: true });
      }
    });
    
    row.replaceWith(details);
  });
}
