export const subscriptMap = {
  '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
  '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089',
  '+': '\u208A', '-': '\u208B', '=': '\u208C', '(': '\u208D', ')': '\u208E',
  'a': '\u2090', 'e': '\u2091', 'o': '\u2092', 'x': '\u2093', 'h': '\u2095',
  'k': '\u2096', 'l': '\u2097', 'm': '\u2098', 'n': '\u2099', 'p': '\u209A',
  's': '\u209B', 't': '\u209C'
};

export const superscriptMap = {
  '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
  '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
  '+': '\u207A', '-': '\u207B', 'n': '\u207F'
};

export function toSub(str) {
  return str.split('').map(c => subscriptMap[c] || c).join('');
}

export function toSuper(str) {
  return str.split('').map(c => superscriptMap[c] || c).join('');
}

/**
 * Normalizes mathematical, chemical, and biological formulas for professional rendering.
 * Converts chemical notation with subscripts (CO₂, H₂O, C₆H₁₂O₆), reaction arrows (→),
 * biological abbreviations (ATP, NADPH, NADP⁺), while preserving KaTeX syntax for
 * true mathematical equations ($...$ and $$...$$) and code blocks.
 */
export function normalizeMathAndFormulas(text) {
  if (!text || typeof text !== 'string') return text || '';

  // 1. Protect code blocks (fenced and inline) so variable names (e.g. user_id, my_var_1) are untouched
  const codeBlocks = [];
  let s = text.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
    const token = '\uE000CB' + codeBlocks.length + '\uE000';
    codeBlocks.push(match);
    return token;
  });

  // 2. Convert standard bracket math \[ ... \] and \( ... \) to $$ and $
  s = s.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, inner) => '\n\n$$\n' + inner.trim() + '\n$$\n\n');
  s = s.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, inner) => '$' + inner.trim() + '$');

  // 3. Handle chemical & biological formulas wrapped in $...$
  // E.g.: $\text{CO}_2$, $\text{CO}_{2}$, $\text{H}_2\text{O}$, $\text{C}_6\text{H}_{12}\text{O}_6$, $\text{ATP}$, $\text{NADPH}$, $\text{NADP}^+$
  s = s.replace(/\$([^\$\n]+)\$/g, (fullMatch, inner) => {
    const trimmed = inner.trim();
    // Check if it's a bio abbreviation or label
    const isBioWord = /^(?:\\(?:text|mathrm|mathbf)\{)?([A-Za-z0-9\+\-\^_{}]+)(?:\})?$/.test(trimmed) &&
      !/(?:\\frac|\\int|\\sum|\\sqrt|\\alpha|\\beta|\\gamma|=|\\le|\\ge|\\times)/.test(trimmed);
    
    // Check if it contains chemical syntax with \text, \mathrm, \ce
    const hasChemSyntax = /\\(?:text|mathrm|mathbf|ce)\{[A-Za-z0-9_+\-\s\.]+\}/.test(trimmed);
    const isReaction = /(?:->|-->|\\rightarrow|\\to|→)/.test(trimmed) && /[A-Z]/.test(trimmed);
    const isSimpleChem = /^[0-9\s]*[A-Z][a-z]?(?:_\{?\d+\}?|[0-9])*(?:[A-Z][a-z]?(?:_\{?\d+\}?|[0-9])*|\s*[\+\->→]\s*)*$/.test(trimmed);

    if (isBioWord || hasChemSyntax || isReaction || isSimpleChem) {
      let cleaned = trimmed;
      // Strip \text{...}, \mathrm{...}, \ce{...}, \mathbf{...}
      cleaned = cleaned.replace(/\\(?:text|mathrm|mathbf|ce)\{([^}]+)\}/g, '$1');
      // Normalize reaction arrows
      cleaned = cleaned.replace(/\s*(?:\\(?:rightarrow|to)|->|-->|==>|→)\s*/g, ' → ');
      // Subscripts and superscripts to Unicode
      cleaned = cleaned.replace(/_\{?([0-9a-z+\-]+)\}?/g, (_, g) => toSub(g));
      cleaned = cleaned.replace(/\^\{?([0-9+\-]+)\}?/g, (_, g) => toSuper(g));
      return cleaned.trim();
    }
    return fullMatch;
  });

  // 4. Protect remaining true LaTeX math ($$...$$ and $...$) from plain text transforms
  const mathBlocks = [];
  s = s.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g, (match) => {
    const token = '\uE000MATH' + mathBlocks.length + '\uE000';
    mathBlocks.push(match);
    return token;
  });

  // 5. Standalone \text{...}, \mathrm{...}, \ce{...}
  s = s.replace(/\\(?:text|mathrm|mathbf|ce)\{([^}]+)\}/g, '$1');

  // 6. Reaction arrows in text
  s = s.replace(/\s*(?:\\(?:rightarrow|to)|->|-->|==>)\s*/g, ' → ');

  // 7. Chemical formula subscripts in plain text:
  // Matches element symbols (e.g. C_6, H_{12}, O_2, Fe_2, (SO_4)_3)
  s = s.replace(/([A-Z][a-z]?|\))\s*_\{?(\d+)\}?/g, (_, elem, sub) => elem + toSub(sub));

  // 8. Chemical superscripts (ions): e.g. Ca^{2+}, Cl^-
  s = s.replace(/([A-Z][a-z]?|\))\s*\^\{?(\d*[\+\-])\}?/g, (_, elem, sup) => elem + toSuper(sup));

  // 9. Single letter variable subscripts in plain text (e.g., x_1 -> x₁, a_n -> aₙ)
  // but preserving snake_case words with multiple characters (e.g., user_id)
  s = s.replace(/\b([a-zA-Z])_\{?(\d+|[nmijkl])\}?\b/g, (_, v, sub) => v + toSub(sub));

  // 10. Common math symbols outside LaTeX
  s = s.replace(/\\times\b/g, '×');
  s = s.replace(/\\pm\b/g, '±');
  s = s.replace(/\\approx\b/g, '≈');
  s = s.replace(/\\(?:le|leq)\b/g, '≤');
  s = s.replace(/\\(?:ge|geq)\b/g, '≥');
  s = s.replace(/\\neq\b/g, '≠');
  s = s.replace(/\\cdot\b/g, '·');

  // 11. Restore real math blocks
  s = s.replace(/\uE000MATH(\d+)\uE000/g, (_, idx) => mathBlocks[Number(idx)]);

  // 12. Restore code blocks
  s = s.replace(/\uE000CB(\d+)\uE000/g, (_, idx) => codeBlocks[Number(idx)]);

  return s;
}
