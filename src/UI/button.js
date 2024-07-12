export default class Button extends Phaser.GameObjects.Container {
    /**
    * Clase que permite crear un boton personalizable con animaciones para las diferentes interacciones
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {number} x - posicion x
    * @param {number} y - posicion y
    * @param {number} scale - escala del objeto
    * @param {function} fn - funcion que se ejecuta cuando se clica en el boton
    * @param {string} fill - sprite que se usa para el relleno
    * @param {color} normalCol - color RGB del boton cuando no se esta interactuando con el (opcional)
    * @param {color} highlightedCol - color RGB cuando se pasa el puntero por encima (opcional)
    * @param {color} pressedCol - color RGB del boton cuando se clica en el (opcional)
    * @param {text} text - texto que se escribe en el boton (opcional)
    * @param {object} fontParams - distintos parametros (tipografia, tam, estilo, color) para personalizar el texto anterior (opcional)
    * @param {string} edge - sprite que se usa para el borde (opcional)
    * @param {string} hitArea - cambiar el area de colision (opcional)
    */
    constructor(scene, x, y, scale, fn, fill, normalCol, highlightedCol, pressedCol, text, fontParams, edge, hitArea) {
        super(scene, x, y);
        this.scene.add.existing(this);

        let fillImg = this.scene.add.image(0, 0, fill);

        let nCol = Phaser.Display.Color.GetColor(normalCol.R, normalCol.G, normalCol.B);
        nCol = Phaser.Display.Color.IntegerToRGB(nCol);
        let hCol = Phaser.Display.Color.GetColor(highlightedCol.R, highlightedCol.G, highlightedCol.B);
        hCol = Phaser.Display.Color.IntegerToRGB(hCol);
        let pCol = Phaser.Display.Color.GetColor(pressedCol.R, pressedCol.G, pressedCol.B);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);

        if (normalCol) {
            fillImg.setTint(Phaser.Display.Color.GetColor(nCol.r, nCol.g, nCol.b));
        }
        if (hitArea) {
            fillImg.setInteractive(hitArea.area, hitArea.callback);
        }
        else {
            fillImg.setInteractive();
        }
        // dibujar el area de colision
        //this.scene.input.enableDebug(fillImg, '0xffff00');

        let tintFadeTime = 25;

        if (highlightedCol) {
            fillImg.on('pointerover', () => {
                scene.tweens.addCounter({
                    targets: [fillImg],
                    from: 0,
                    to: 100,
                    onUpdate: (tween) => {
                        const value = tween.getValue();
                        let col = Phaser.Display.Color.Interpolate.ColorWithColor(nCol, hCol, 100, value);
                        let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                        fillImg.setTint(colInt);
                    },
                    duration: tintFadeTime,
                    repeat: 0,
                });
            });
        }

        if (normalCol) {
            fillImg.on('pointerout', () => {
                scene.tweens.addCounter({
                    targets: [fillImg],
                    from: 0,
                    to: 100,
                    onUpdate: (tween) => {
                        const value = tween.getValue();
                        let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, nCol, 100, value);
                        let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                        fillImg.setTint(colInt);
                    },
                    duration: tintFadeTime,
                    repeat: 0,
                });
            });
        }

        fillImg.on('pointerdown', (pointer) => {
            fillImg.disableInteractive();
            if (pressedCol) {
                let down = scene.tweens.addCounter({
                    targets: [fillImg],
                    from: 0,
                    to: 100,
                    onUpdate: (tween) => {
                        const value = tween.getValue();
                        let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, pCol, 100, value);
                        let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                        fillImg.setTint(colInt);
                    },
                    duration: tintFadeTime,
                    repeat: 0,
                    yoyo: true,
                });
                down.on('complete', () => {
                    fillImg.setInteractive();
                    fn();
                });
            }
            else {
                fn();
            }
        });

        this.add(fillImg);

        if (edge) {
            let edgeImg = this.scene.add.image(0, 0, edge);
            this.add(edgeImg);
        }

        if (text) {
            let style = {
                fontFamily: fontParams.font,
                fontSize: fontParams.size + 'px',
                fontStyle: fontParams.style,
                color: fontParams.color
            }

            let buttonText = this.scene.add.text(0, 0, text, style);
            buttonText.setOrigin(0.5);
            this.add(buttonText);
        }

        this.setScale(scale);
    }
}