(() => {
  const stylesContent = '[data-testid],body{outline:rgb(61,166,255) dashed 1px}body{outline-offset:-2px}[data-testid]{position:relative}[data-testid]::after{content:attr(data-testid);position:absolute;top:0;left:0;font-size:10px;font-family:monospace;text-align:left;padding:2px;border-radius:2px;user-select:all;background-color:#fff;border:2px solid #3da6ff;color:#000;line-height:1;opacity:0;pointer-events:none}[data-testid]:hover::after{opacity:1}';

  const stylesId = '__DEBUG_TESTID_STYLE_ELEMENT__';
  const handlerName = '__DEBUG_TESTID_HANDLER__';

  const createDialog = (content) => {
    const dialogElement = document.createElement('dialog');

    dialogElement.style = 'padding: 12rem; font-size: 12px;';

    dialogElement.innerHTML = `
      <p style="font-family: monospace;">${content}</p>
      <form method="dialog" style="margin-top: 12px">
        <button>OK</button>
      </form>
    `;

    document.body.append(dialogElement);

    dialogElement.showModal();
  };

  window[handlerName] = async (event) => {
    const targetTestElement = event.target.closest('[data-testid]');

    if (event.shiftKey && targetTestElement) {
      event.preventDefault();
      event.stopImmediatePropagation();

      const trace = [];
      let currentElement = targetTestElement;

      while (currentElement.parentElement) {
        if (currentElement.dataset.testid) {
          trace.push(currentElement.dataset.testid);
        }

        currentElement = currentElement.parentElement;
      }

      const result = trace.reverse().map((id) => `[data-testid="${id}"]`).join(' ');

      createDialog(result);
    }
  };

  if (document.getElementById(stylesId)) {
    document.getElementById(stylesId).remove();

    if (window[handlerName]) window.removeEventListener('click', window[handlerName]);
  } else {
    const styleElement = document.createElement('style');

    styleElement.id = stylesId;
    styleElement.textContent = stylesContent;

    document.head.prepend(styleElement);

    if (window[handlerName]) window.addEventListener('click', window[handlerName]);
  }
})();
