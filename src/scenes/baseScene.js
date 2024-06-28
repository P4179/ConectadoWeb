export default class BaseScene extends Phaser.Scene {
    constructor(name) {
        super({ key: name });
    }

    create() {
        this.dialogManager = this.scene.get('DialogManager');
        this.camera = this.cameras.main;
        
        this.portraitCamera = this.cameras.add(0, 0, this.sys.game.canvas.width, this.sys.game.canvas.height).setOrigin(0.5, 0.5);
        // this.portraitCamera.alpha = 0;
        this.portraitCamera.setZoom(0.2);
        this.portraitCamera.inputEnabled = false;

        this.dialogManager.changeScene(this);
    }

    changeScene(scene) {
        this.scene.start(scene);
    }
}