// Genera el objeto replacements para la plantilla HTML de cotización
// quoteData: { quoteNo, date, clientName, modelOfHouse, selections, pricePerSqft, sqftTotal, total }
function buildQuoteReplacements(quoteData) {
  const replacements = {
    quoteNo: quoteData.quoteNo || '',
    date: quoteData.date || new Date().toLocaleDateString(), // usa la fecha actual si no viene
    clientName: quoteData.clientName || '',
    modelOfHouse: quoteData.modelOfHouse || '',
    pricePerSqft: quoteData.pricePerSqft || '',
    sqftTotal: quoteData.sqftTotal || '',
    total: quoteData.total || '',
    stampImageUrl: quoteData.stampImageUrl || quoteData.image || '', // usa el campo correcto
    modelSelectionsRows: ''
  };
  if (Array.isArray(quoteData.selections)) {
    // [{category, subcategories: [opción, opción, ...]}]
    if (
      quoteData.selections.length &&
      typeof quoteData.selections[0] === 'object' &&
      'category' in quoteData.selections[0] &&
      Array.isArray(quoteData.selections[0].subcategories)
    ) {
      replacements.modelSelectionsRows = quoteData.selections
        .map(sel => {
          // Extrae solo el valor después de ": " en cada subcategoría
          const options = sel.subcategories
            .map(sub => {
              const idx = sub.indexOf(': ');
              return idx !== -1 ? sub.slice(idx + 2) : sub;
            })
            .join(', ');
          return `<li>${sel.category}: ${options}</li>`;
        })
        .join('\n');
    } else {
      // Soporta array de strings o array de objetos con subcategories
      replacements.modelSelectionsRows = quoteData.selections
        .map(sel => {
          if (typeof sel === 'string') {
            // Si el string tiene ":", solo muestra lo que está después
            const idx = sel.indexOf(': ');
            return `<li>${idx !== -1 ? sel.slice(idx + 2) : sel}</li>`;
          }
          if (Array.isArray(sel.subcategories)) {
            const options = sel.subcategories
              .map(sub => {
                const idx = sub.indexOf(': ');
                return idx !== -1 ? sub.slice(idx + 2) : sub;
              })
              .join(', ');
            return `<li>${options}</li>`;
          }
          return '';
        })
        .join('\n');
    }
  }
  return replacements;
}

// Utilidad para reemplazar los campos marcados con ´...´ en una plantilla HTML
// Uso: const html = fillQuoteTemplate(htmlTemplate, data);

function fillQuoteTemplate(template, data) {
  let html = template;
  for (const key in data) {
    // Reemplaza todas las apariciones de ´key´ por el valor correspondiente
    const regex = new RegExp(`´${key}´`, 'g');
    html = html.replace(regex, data[key] ?? '');
  }
  return html;
}

module.exports = { fillQuoteTemplate };
module.exports.buildQuoteReplacements = buildQuoteReplacements;
