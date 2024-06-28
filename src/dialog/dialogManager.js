import TextBox from './textbox.js'
import OptionBox from './optionBox.js'

export default class DialogManager extends Phaser.Scene {
    /**
    * Gestor de los dialogos. Crea la caja de texto y el texto y se encarga de actualizarlos.
    * Los textos a escribir se deben establecer con el metodo setdialogs()
    * @extends Phaser.Scene
    */
    constructor() {
        super({ key: 'DialogManager' });

        this.textbox = null;
        this.dialogs = [];
        this.textCount = 0;
        this.lastCharacter = "";
        this.playerName = "";

        this.options = [];
        this.selectedOption = null;
    }
    preload() {
        // Precarga las imagenes para la caja de texto y de opciones
        this.load.image('textbox', 'assets/textbox.png');
        this.load.image('textboxName', 'assets/textboxName.png');
        this.load.image('option', 'assets/optionBg.png');
        this.load.image('textboxMask', 'assets/textboxMask.png');

        // Precarga el plugin para hacer fade de colores
        this.load.plugin('rextintrgbplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextintrgbplugin.min.js', true);
    }

    create() {
        this.textbox = new TextBox(this);
        this.textbox.activate(false);
        this.activateOptions(false);

        this.currScene = null;

        let mask = this.add.image(this.textbox.box.x, this.textbox.box.y, 'textboxMask');
        mask.setOrigin(this.textbox.box.originX, this.textbox.box.originY);
        mask.setScale(this.textbox.box.scaleX, this.textbox.box.scaleY);
        mask.setCrop(0, 0, 160, mask.displayHeight);
        mask.visible = false;
        this.portraitMask = mask.createBitmapMask();
    }

    changeScene(scene) {
        this.currScene = scene;
        this.currScene.portraitCamera.setMask(this.portraitMask);
        if (this.textbox) {
            this.textbox.activate(false);
            this.textbox.portraitCam = this.currScene.portraitCamera;
        }
        this.activateOptions(false);
    }

    // Pruebas
    test1() {
        this.playerName = "Paco";
        this.activateOptions(false);
        this.setdialogs([
            {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Vulputate sapien nec sagittis aliquam. Massa vitae tortor condimentum lacinia. Duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Libero nunc consequat interdum varius sit amet mattis vulputate. Molestie a iaculis at erat pellentesque adipiscing commodo elit. Id aliquet risus feugiat in ante metus dictum. Odio facilisis mauris sit amet massa.",
                character: "player",
                name: " ",
            },
            {
                text: "texto2 texto2 texto2 texto2",
                character: "b",
                name: "Personaje 2",
            },
        ]);
        this.finished = false;
        this.textbox.activate(true);
    }

    test2() {
        this.textbox.activate(false);
        this.createOptions(["Opcion 1", "Opcion 2"]);
        this.activateOptions(true);
    }

    /**
    * Cambia la serie de dialogos a mostrar
    * @param {Array} dialogs - la coleccion de dialogos que se mostraran. Cada objeto debera tener los atributos text, character, name (completar)
    */
    setdialogs(dialogs) {
        this.textCount = 0;
        this.dialogs = dialogs;

        let splitDialogs = [];      // Nuevo array de dialogos tras dividir los dialogos demasiado largos
        let i = 0;                  // Indice del dialogo en el array de dialogos
        let txt = "";               // Texto del dialogo a separar

        let dialogCopy = { ...this.dialogs[i] };
        // Se establece el primer dialogo como el texto a separar
        if (this.dialogs.length > 0) txt = this.dialogs[i].text;

        // Mientras no se haya llegado al final de los dialogos
        while (i < this.dialogs.length) {
            // Cambia el texto a mostrar para obtener sus dimensiones 
            dialogCopy = { ...this.dialogs[i] };
            dialogCopy.text = txt;
            this.textbox.setText(dialogCopy, false);

            // Si la altura del texto supera la de la caja de texto 
            if (this.textbox.currText.getBounds().height > this.textbox.height) {
                let words = txt.split(' ');    // Se separan todas las palabras del dialogo por espacios
                let nextText = "";              // Parte del dialogo que no cabe en el cuadro

                // Va quitando palabras del final del dialogo mientras supere la altura de la caja de texto
                while (this.textbox.currText.getBounds().height > this.textbox.height && words.length > 0) {
                    // Guarda la palabra del final y la pone al principio del texto que no cabe 
                    // en el cuadro (al principio, ya que se va recorriendo en orden inverso)
                    let currWord = words.pop();
                    currWord += " " + nextText;
                    nextText = currWord;

                    // Reconstruye el texto sin la palabra que se ha eliminado y lo actualiza
                    txt = words.join(' ');

                    let next = { ...this.dialogs[i] };;
                    next.text = txt;
                    this.textbox.setText(next, false);
                }

                // Mete el texto que cabe en la caja en el array de dialogos
                // y actualiza el texto a separar por el texto de ese dialogo
                // que no cabia en la caja 
                dialogCopy = { ...this.dialogs[i] };
                dialogCopy.text = txt;
                splitDialogs.push(dialogCopy);
                txt = nextText;

            }
            // Si la altura no supera la de la caja de texto, se guarda el texto 
            // actual en el array de dialogos y se pasa a mirar el siguiente
            else {
                dialogCopy = { ...this.dialogs[i] };
                dialogCopy.text = txt;
                splitDialogs.push(dialogCopy);
                i++;
                if (this.dialogs[i]) txt = this.dialogs[i].text;
            }
        }

        // Actualiza los dialogos
        this.dialogs = splitDialogs;
        this.lastCharacter = this.dialogs[this.textCount].character;
        this.textbox.setText(this.dialogs[this.textCount], true);

    }

    
    createOptions(opts) {
        // Limpia las opciones
        this.options.forEach((option) => {
            option.activate(false, () => { option.destroy(); });
        });
        this.options = [];
        this.selectedOption = null;

        // Crea las opciones y las guarda en el array
        for (let i = 0; i < opts.length; i++) {
            this.options.push(new OptionBox(this, i, opts.length, opts[i]));
        }
    }

    // Activa/desactiva las cajas de opcion multiple
    activateOptions(active) {
        this.selectedOption = null;
        this.options.forEach((option) => { option.activate(active); });
    }

    selectOption(index) {
        this.activateOptions(false);
        this.selectedOption = index;
        console.log("Selected option " + index);
    }

    // Pasa al siguiente dialogo
    nextDialog() {
        // Si no ha acabado de aparecer todo el texto, lo muestra de golpe
        if (!this.textbox.finished) {
            this.textbox.forceFinish();
        }
        else {
            // Actualiza el numero de dialogos
            this.textCount++;

            // Si aun no se han escrito todos los dialogos, escribe el siguiente
            if (this.textCount < this.dialogs.length) {
                // Si es el mismo personaje el que habla, solo cambia el texto a mostrar
                if (this.dialogs[this.textCount].character === this.lastCharacter) {
                    this.textbox.setText(this.dialogs[this.textCount], true);
                }
                // Si es otro, oculta la caja de texto y una vez oculta,
                // actualiza el texto y el personaje y vuelve a mostrar la caja
                else {
                    this.textbox.activate(false, () => {
                        this.textbox.setText(this.dialogs[this.textCount], true);
                        this.textbox.activate(true);
                    });
                }
            }
            // Si se han acabado, desactiva la caja de texto
            else {
                this.textbox.activate(false);
            }
        }

    }
}