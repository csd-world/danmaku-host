

var isHidden = (win) => {
    if (win.isFullScreen()) {
        return win.isHidden;
    } else {
        return win.isMinimized();
    }
};

var toggleHidden = (win, force) => {
    if (!win) return;
    if (force === undefined) force = !isHidden(win);
    if (win.isFullScreen()) {
        if (force) {
            win.minimize(); // workaround to release focus
            win.hide();
            win.isHidden = true;
        } else {
            // The window is not fullscreen after minimize()
            win.setFullScreen(true);
            win.show();
            win.focus();
            win.isHidden = false;
        }
    } else {
        if (force) {
            win.minimize();
            win.hide();
        } else {
            // win.restore();
            win.show();
            win.focus();
        }
    }
};

var tryShow = function (win, tryHide) {
    if (win && !win.isDestroyed()) {
        toggleHidden(win, tryHide ? undefined : false);
        return true;
    }
    return false;
}

module.exports = {
    isHidden,
    toggleHidden,
    tryShow
}