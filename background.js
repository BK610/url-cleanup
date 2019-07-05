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
}

function setClipboard(value) {
    let result = false;
    let textarea = document.getElementById('ta');

    if (isUrl(value)) {
        console.log("Copied value, " + value + " is a URL!");
        value = cleanUrl(value);
    }
    textarea.value = value;
    textarea.select();

    if (document.execCommand('copy')) {
        result = true;
    } else {
        console.error('Failed to set clipboard content');
    }

    textarea.value = '';
    return result;
}

//TODO:
// Add handling for URLs without "http" start
// Add handling for problems within the URL
function isUrl(copiedValue) {
    copiedValue = copiedValue.trim();

    if (copiedValue.startsWith("http")) {
        return true;
    } else {
        return false;
    }
}

function cleanUrl(url) {

}