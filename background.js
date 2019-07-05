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
