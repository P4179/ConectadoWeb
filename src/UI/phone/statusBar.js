export default class StatusBar {
    constructor(scene, screen, x, y, w, h, character) {
        let bgCol = 0xc0c0c0;
        let borderCol = 0x000000;
        let borderThickness = 2;
        this.minValCol = 0xff0000;
        this.maxValCol = 0x00ff00;

        let bgRadius = this.calculateRadius(w, h, 0.25)
        let bgGraphics = scene.make.graphics().fillStyle(bgCol, 1).fillRoundedRect(0, 0, w, h, bgRadius).lineStyle(borderThickness, borderCol, 1).strokeRoundedRect(0, 0, w, h, bgRadius)
        bgGraphics.generateTexture('statusBarBg' + character, w, h);
        let bg = scene.add.image(x, y, 'statusBarBg' + character).setOrigin(0.5, 0.5);
        bgGraphics.destroy();

        let barW = w * 0.95;
        let barH = h * 0.75;
        let barRadius = this.calculateRadius(barW, barH, 0.25)
        let barGraphics = scene.make.graphics().fillStyle(0xffffff, 1).fillRoundedRect(0, 0, barW, barH, barRadius).lineStyle(borderThickness, borderCol, 1).strokeRoundedRect(0, 0, barW, barH, barRadius)
        barGraphics.generateTexture('statusBarFill' + character, barW, barH);
        this.bar = scene.add.image(x - barW / 2, y, 'statusBarFill' + character).setOrigin(0, 0.5);
        barGraphics.destroy();

        this.value = 50;
        this.updateColor();

        screen.add(bg);
        screen.add(this.bar);        
    }

    calculateRadius(w, h, ratio) {
        let min = Math.min(w, h);
        return min * ratio;
    }

    updateColor() {
        let minHexColor = Phaser.Display.Color.ValueToColor(this.minValCol);
        let maxHexColor = Phaser.Display.Color.ValueToColor(this.maxValCol);

        let scale = Phaser.Math.Clamp(this.value, 0, 100);
        let col = Phaser.Display.Color.Interpolate.ColorWithColor(minHexColor, maxHexColor, 100, scale);
        let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
        this.bar.setTint(colInt);

        this.bar.setScale(scale / 100, 1);
    }
}