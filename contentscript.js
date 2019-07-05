'use strict';

var extensionId = 'kdjihipfjekomponmajpffoomkecnkle';

// document.addEventListener('DOMContentLoaded', function() {
//     readClipboard();
//     console.log("domcontentloaded");
//
//     // Re-read the clipboard every time the page becomes visible.
//     document.addEventListener('visibilitychange', function() {
//         if (!document.hidden) {
//             readClipboard();
//         }
//     });
// });

function readClipboard() {
    chrome.runtime.sendMessage(
        extensionId,
        { method: 'getClipboard' },
        function(response) {
            document.getElementById('clipboard-content').textContent = response;
            console.log('extension getClipboard response', response);
        }
    );
}

// function insertTextAtCursor(text) {
//     // This will let us use the undo history. It doesn't seem to be working for
//     // the contentEditable="true" divs gmail uses, though. Text inputs but
//     // doesn't undo.
//     var el = document.activeElement;
//     var e = document.createEvent('TextEvent');
//     e.initTextEvent('textInput', true, true, null, text);
//     el.focus();
//     el.dispatchEvent(e);
// }

// chrome.runtime.onMessage.addListener(function(request) {
//     if (request.type === 'paste') {
//         insertTextAtCursor(request.data);
//     } else if (request.type === 'message') {
//         // currently we will assume that all of the messages are errors.
//         console.error(request.message);
//     }
// });

/*-------------------------------------------------*/


function insertTextAtCursor(text) {
    var el = document.activeElement;
    var val = el.value;
    var endIndex;
    var range;
    var doc = el.ownerDocument;
    if (typeof el.selectionStart === 'number' &&
        typeof el.selectionEnd === 'number') {
        endIndex = el.selectionEnd;
        el.value = val.slice(0, endIndex) + text + val.slice(endIndex);
        el.selectionStart = el.selectionEnd = endIndex + text.length;
    } else if (doc.selection !== 'undefined' && doc.selection.createRange) {
        el.focus();
        range = doc.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.data) {
        insertTextAtCursor(request.data);
    }
});