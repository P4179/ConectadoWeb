import CorridorBase from "../baseScenarios/corridorBase.js";
import Character from "../../../gameObjects/character.js";

export default class CorridorMorningDay2 extends CorridorBase {
    constructor() {
        super('CorridorMorningDay2');
    }

    create(params) {
        super.create(params);
        
        this.stairs = "StairsMorningDay2";
        this.class = "ClassFrontMorningDay2";

        let tr = {
            x: this.rightBound * 0.58,
            y: this.CANVAS_HEIGHT * 0.75,
            scale: 0.088
        };
        let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
            this.dialogManager.setNode(alexNode);
        });
        alex.setScale(-tr.scale, tr.scale);
        alex.setAnimation("IdleBase", true);
        this.portraits.set("Alex", alex.getPortrait());

        let nodes = this.cache.json.get('corridorMorningDay2');
        let alexNode = super.readNodes(nodes, "day2\\corridorMorningDay2", "alex", true);

        
        // Si no se llega tarde, se colocan personajes en el fondo
        if (!this.gameManager.getValue("isLate")) {
            tr = {
                x: 250,
                y: this.CANVAS_HEIGHT * 0.77,
                scale: 0.087
            };
            let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
                this.dialogManager.setNode(alisonNode);
            });
            alison.setScale(-tr.scale, tr.scale);
            alison.setAnimation("IdleBase", true);
            this.portraits.set("Alison", alison.getPortrait());
    
    
            tr = {
                x: this.rightBound * 0.78,
                y: this.CANVAS_HEIGHT * 0.93,
                scale: 0.15
            };
            let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
                this.dialogManager.setNode(guilleNode);
                this.gameManager.setValue("metGuille", true);
            });
            guille.setAnimation("IdleBase", true);
            this.portraits.set("Guille", guille.getPortrait());
    
            
            let alisonNode = super.readNodes(nodes, "day2\\corridorMorningDay2", "alison", true);
            let guilleNode = super.readNodes(nodes, "day2\\corridorMorningDay2", "guille", true);
        }
        
    }
}
