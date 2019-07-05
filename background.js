chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    switch (request.method) {
        case 'getClipboard':
            sendResponse(getClipboard());
            break;
        case 'setClipboard':
            sendResponse(setClipboard(request.value));
            break;
        default:
            console.error('Unknown method "%s"', request.method);
            break;
    }
});

function getClipboard() {
    var result = null;
    var textarea = document.getElementById('ta');
    textarea.value = '';
    textarea.select();

    if (document.execCommand('paste')) {
        result = textarea.value;
    } else {
        console.error('failed to get clipboard content');
    }

    textarea.value = '';
    return result;
};

function setClipboard(value) {
    var result = false;
    var textarea = document.getElementById('ta');
    textarea.value = value;
    textarea.select();

    if (document.execCommand('copy')) {
        result = true;
    } else {
        console.error('failed to get clipboard content');
    }

    textarea.value = '';
    return result;
};