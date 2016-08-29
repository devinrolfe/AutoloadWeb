const ChromeExtensionID = {
    LOCAL: "ipjccbebefegfbclhobggiioeholkiii",
    STORE: "mifafbjbnhpmdjngkhnmfjdlefdgileh"
}

function isDevMode() {
    return !('update_url' in chrome.runtime.getManifest());
}



