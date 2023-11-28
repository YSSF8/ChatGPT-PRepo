chrome.runtime.onMessage.addListener(message => {
    if (message.action == 'overrideElement') {
        const input = document.getElementById('prompt-textarea');
        input.focus();
        input.value = message.prompt.replace(/^[ \t]+/gm, '').trim();
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, input.value);
    }
});