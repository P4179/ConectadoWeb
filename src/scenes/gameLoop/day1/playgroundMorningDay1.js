import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundMorningDay1 extends PlaygroundBase {
    constructor() {
        super('PlaygroundMorningDay1');
    }

    create(params) {
        super.create(params);

        this.home = "";
        this.stairs = "StairsMorningDay1";

        let nodes = this.cache.json.get('everydayDialog');
        this.homeNode = super.readNodes(nodes, "everydayDialog", "playground.homeMorning", true);

        // Si no se llega tarde, se colocan personajes de fondo
        if (!this.gameManager.getValue("isLate")) {
            // Se establece el dialogo de la puerta para que no se pueda entrar hasta que se abran 
            this.phoneManager.setDayInfo("playgroundMorning");
            this.doorNode = super.readNodes(nodes, "everydayDialog","playground.doorMorning", true);

            let tr = {
                x: 280,
                y: this.CANVAS_HEIGHT * 0.95,
                scale: 0.065
            };
            let jose = new Character(this, "Jose", tr, this.portraitTr, () => {
                this.dialogManager.setNode(joseNode);
            });
            jose.setScale( -tr.scale, tr.scale);
            jose.setAnimation("IdleBase", true);
            this.portraits.set("Jose", jose.getPortrait());
    
            tr = {
                x: this.rightBound * 0.65,
                y: this.CANVAS_HEIGHT * 0.92,
                scale: 0.055
            };
            let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
                this.dialogManager.setNode(alisonNode);
            });
            alison.setAnimation("IdleBase", true);
            this.portraits.set("Alison", alison.getPortrait());

            tr = {
                x: this.rightBound * 0.96,
                y: this.CANVAS_HEIGHT * 1.25,
                scale: 0.2
            };
            let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
                this.dialogManager.setNode(guilleNode);
            });
            guille.setAnimation("IdleBase", true);
            this.portraits.set("Guille", guille.getPortrait());


            nodes = this.cache.json.get('playgroundMorningDay1');
            let joseNode = super.readNodes(nodes, "day1\\playgroundMorningDay1", "jose", true);
            let alisonNode = super.readNodes(nodes, "day1\\playgroundMorningDay1", "alison", true);
            let guilleNode = super.readNodes(nodes, "day1\\playgroundMorningDay1", "guille", true);
            

            // Evento llamado cuando suena la campana
            this.dispatcher.addOnce("openDoors", this, (obj) => {
                // Cambia la hora del movil
                this.phoneManager.setDayInfo("classStart");
                // Se quita el dialogo que aparece al hacer click en las puertas
                this.doorNode = null;

                jose.char.disableInteractive();
                alison.char.disableInteractive();
                guille.char.disableInteractive();
                // Se hace fade out de todos los personajes de la escena
                let anim = this.tweens.add({
                    targets: [jose.char, alison.char, guille.char],
                    alpha: { from: 1, to: 0 },
                    duration: 1000,
                    repeat: 0,
                });

                // Una vez termina la animacion, se abren las puertas
                anim.on('complete', () => {
                    super.openDoors();
                })
            });
        }
        // Si no, se pone la hora de llegar tarde, se dejan las puertas abiertas, y se quita el dialogo de la puerta
        else {
            this.phoneManager.setDayInfo("playgroundMorningLate");
            super.openDoors();
            this.doorNode = null;
        }
    }
}
