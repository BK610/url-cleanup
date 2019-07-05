'use strict';

console.log("Background page started");

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     switch (request.method) {
//         case 'getClipboard':
//             console.log("getClipboard event");
//             sendResponse(getClipboard());
//             break;
//         case 'setClipboard':
//             console.log("setClipboard event");
//             sendResponse(setClipboard(request.value));
//             break;
//         default:
//             console.error('Unknown method "%s"', request.method);
//             break;
//     }
// });

function getClipboard() {
    let result = null;
    let textarea = document.getElementById('ta');
    textarea.value = '';
    textarea.select();

    if (document.execCommand('paste')) {
        result = textarea.value;
        console.log("Got clipboard content: " + result);
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

function sendPasteToContentScript(toBePasted) {
    // We first need to find the active tab and window and then send the data
    // along. This is based on:
    // https://developer.chrome.com/extensions/messaging
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {type: 'paste', data: toBePasted}
        );
    });
}

function sendMessageToUser(msg) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {type: 'message', message: msg}
        );
    });
}

/*---------------------------------------------------*/

/**
 * The function that will handle our context menu clicks.
 */
function onClickHandler(info, tab) {
    var clipboardContent = getClipboard();
    console.log('clipboardContent: ' + clipboardContent);
    if (info.menuItemId === 'pasteDemo') {
        console.log('clicked paste demo');
        sendPasteToContentScript(clipboardContent);
    }
}

// Register the click handler for our context menu.
chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up the single one item "paste"
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.create(
        {
            'title': 'Paste Demo',
            'id': 'pasteDemo',
            'contexts': ['editable']
        });
});

/*---------------------------------------------------*/

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

//TODO:
// Add logic to keep searches
function cleanUrl(url) {
    let cleanedUrl = url;
    let idx = cleanedUrl.indexOf("?");
    if (idx !== -1) {
        cleanedUrl = cleanedUrl.slice(0, idx);
    }

    return cleanedUrl;
}