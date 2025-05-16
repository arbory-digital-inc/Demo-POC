import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Check if this is the plus-desc variant
  const isPlusDesc = block.classList.contains('plus-desc');
  
  // Process each card
  [...block.children].forEach((card) => {
    // Add appropriate classes
    if (card.children.length >= 2) {
      // First div contains the image
      const imageDiv = card.children[0];
      // Second div contains the heading/link or paragraphs
      const textDiv = card.children[1];
      
      if (isPlusDesc) {
        // Handle plus-desc variant with paragraphs and strong tags
        const firstP = textDiv?.querySelector('p:first-child');
        const strongTag = firstP?.querySelector('strong');
        
        if (strongTag) {
          // Check if the strong tag contains a link
          const link = strongTag.querySelector('a');
          
          if (link) {
            // Make the entire card clickable
            card.classList.add('card-clickable');
            
            // Store the href to use for the entire card
            const href = link.getAttribute('href');
            const title = link.getAttribute('title') || link.textContent;
            
            // Add click event to the entire card
            card.addEventListener('click', (e) => {
              // Only trigger if the click wasn't on the link itself
              if (!e.target.closest('a')) {
                window.location.href = href;
              }
            });
            
            // Add aria attributes for accessibility
            card.setAttribute('role', 'link');
            card.setAttribute('aria-label', title);
            card.setAttribute('tabindex', '0');
            
            // Add keyboard navigation
            card.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = href;
              }
            });
          }
        }
      } else {
        // Handle standard card-cut with h2 and links
        const h2 = textDiv?.querySelector('h2');
        const link = h2?.querySelector('a');
        
        if (link && h2) {
          // Add has-link class to h2 to avoid double borders
          h2.classList.add('has-link');
          
          // Make the entire card clickable
          card.classList.add('card-clickable');
          
          // Store the href to use for the entire card
          const href = link.getAttribute('href');
          const title = link.getAttribute('title') || link.textContent;
          
          // Add click event to the entire card
          card.addEventListener('click', (e) => {
            // Only trigger if the click wasn't on the link itself
            if (!e.target.closest('a')) {
              window.location.href = href;
            }
          });
          
          // Add aria attributes for accessibility
          card.setAttribute('role', 'link');
          card.setAttribute('aria-label', title);
          card.setAttribute('tabindex', '0');
          
          // Add keyboard navigation
          card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              window.location.href = href;
            }
          });
        }
      }
      
      // Optimize images
      if (imageDiv && imageDiv.querySelector('picture')) {
        const img = imageDiv.querySelector('img');
        if (img) {
          const picture = createOptimizedPicture(img.src, img.alt, false, [
            { width: '750' },
            { width: '2000', media: '(min-width: 600px)' },
          ]);
          imageDiv.innerHTML = '';
          imageDiv.appendChild(picture);
        }
      }
    }
  });
}
