'use strict';

var extensionId = 'kdjihipfjekomponmajpffoomkecnkle';

document.getElementById('copyButton').addEventListener('click', function() {
    var text = document.getElementById('para').textContent;

    chrome.runtime.sendMessage(
        extensionId,
        { method: 'setClipboard', value: text },
        function(response) {
            console.log('extension setClipboard response', response);
        }
    );
});

document.addEventListener('DOMContentLoaded', function() {
    readClipboard();

    // Re-read the clipboard every time the page becomes visible.
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            readClipboard();
        }
    });
});

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
