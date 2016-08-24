class WebsiteWindow {
    constructor(top, left, height, width, isMaximized) {
        this.tabs = [];

        this.positionUsed = true;
        this.isMaximized = isMaximized;

        this.top = top;
        this.left = left;
        this.height = height;
        this.width = width;
    }
}