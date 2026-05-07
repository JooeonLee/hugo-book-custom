function copyCode(button) {
  const codeBlock = button.closest('.book-codeblock');
  const code = codeBlock?.querySelector('pre code');

  if (!code) return;

  const codeLines = code.querySelectorAll('.hljs-ln-code');
  text = Array.from(codeLines)
    .map(line => {
      const content = line.textContent || line.innerText || ''
      return content.trim() === '' ? '' : content;
    }).join('\n');

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => copySuccess(button))
      .catch(() => fallbackCopy(text, button));
  } else {
    fallbackCopy(text, button);
  }
}

function copySuccess(button) {
  const icon = button.querySelector('i');
  const textNode = Array.from(button.childNodes)
    .find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

  if (!icon || !textNode) return;

  const originalClass = icon.className;
  const originalText = textNode.textContent;

  icon.className = 'fa-solid fa-check';
  textNode.textContent = 'COPIED';
  button.classList.add('copied');

  setTimeout(() => {
    icon.className = originalClass;
    textNode.textContent = originalText;
    button.classList.remove('copied');
  }, 2000);
}

function fallbackCopy(text, button) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.cssText = 'position:fixed;opacity:0;';

  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (document.execCommand('copy')) {
      copySuccess(button);
    }
  } catch (error) {
    console.error('Copy failed:', error);
  }
  
  document.body.removeChild(textarea);
}
