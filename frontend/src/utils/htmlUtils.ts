export function extractPlainText(
  html: string,
  maxLength?: number,
  fallback = ''
): string {
  if (!html) {
    return fallback;
  }

  let text = '';
  if (typeof document !== 'undefined') {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    text = temp.textContent || temp.innerText || '';
  } else {
    text = html.replace(/<[^>]+>/g, ' ');
  }

  text = text.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();

  if (!text) {
    return fallback;
  }

  if (typeof maxLength === 'number' && text.length > maxLength) {
    return `${text.slice(0, maxLength)}…`;
  }

  return text;
}
