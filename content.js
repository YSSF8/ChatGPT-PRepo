if (!document.body.classList.contains('script-injected')) {
    document.body.classList.add('script-injected');

    chrome.runtime.onMessage.addListener(message => {
        if (message.action == 'overrideElement') {
            try {
                const input = document.getElementById('prompt-textarea');
                input.focus();
                input.value = message.prompt.replace(/^[ \t]+/gm, '').trim();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, input.value);
            } catch (e) {
                if (e.message.indexOf('Cannot read properties of null') != -1) {
                    alert('Input field not found.\nPlease ensure you are on the official ChatGPT page.');
                }
            }
        }
    });
}