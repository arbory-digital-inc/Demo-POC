/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  
  // All tables are responsive by default

  const header = !block.classList.contains('no-header');
  if (header) table.append(thead);
  table.append(tbody);
  
  // Store header text for responsive tables
  const headerTexts = [];

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) {
      thead.append(row);
      // Capture header text for data-label attributes
      [...child.children].forEach((col) => {
        headerTexts.push(col.textContent.trim());
      });
    } else {
      tbody.append(row);
    }
    
    [...child.children].forEach((col, colIndex) => {
      const cell = buildCell(header ? i : i + 1);
      const align = col.getAttribute('data-align');
      const valign = col.getAttribute('data-valign');
      if (align) cell.style.textAlign = align;
      if (valign) cell.style.verticalAlign = valign;
      
      // Add data-label attribute for responsive tables
      if (header && i > 0 && headerTexts[colIndex]) {
        cell.setAttribute('data-label', headerTexts[colIndex]);
      }
      
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);
}
