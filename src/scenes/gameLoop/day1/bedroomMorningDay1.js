import BedroomBase from "../baseScenarios/bedroomBase.js";

export default class BedroomMorningDay1 extends BedroomBase {
    constructor() {
        super('BedroomMorningDay1');
    }

    create(params) {
        super.create(params);

        this.livingroom = "LivingroomMorningDay1";

        let nodes = this.cache.json.get('bedroomMorningDay1');
        
        // Dialogos del interior del armario y la cama
        this.wardrobe1Node = super.readNodes(nodes, "day1\\bedroomMorningDay1", "wardrobe1", true);
        this.wardrobe2Node = super.readNodes(nodes, "day1\\bedroomMorningDay1", "wardrobe2", true);
        this.bedNode = super.readNodes(nodes, "day1\\bedroomMorningDay1", "bed", true);

        // Mochila
        let bagNode = super.readNodes(nodes, "day1\\bedroomMorningDay1", "bag", true);
        let bag = this.add.image(170, this.CANVAS_HEIGHT - 170, this.atlasName, 'bag').setOrigin(0, 0).setScale(this.scale);
        bag.setInteractive({ useHandCursor: true });
        bag.on('pointerdown', () => {
            this.dialogManager.setNode(bagNode)
        });

        // Ropa
        this.add.image(852 * this.scale + 1, 848 * this.scale - 1, this.atlasName, 'bedroomJacket').setOrigin(0, 0).setScale(this.scale);
        this.add.image(2899 * this.scale + 1, 1296 * this.scale - 1, this.atlasName, 'clothes1').setOrigin(0, 0).setScale(this.scale).setDepth(this.bed + 1);
        this.add.image(2704 * this.scale + 1, 963 * this.scale - 1, this.atlasName, 'clothes2').setOrigin(0, 0).setScale(this.scale).setDepth(this.bed + 1);
        this.add.image(2061 * this.scale + 1, 928 * this.scale - 1, this.atlasName, 'clothes3').setOrigin(0, 0).setScale(this.scale);


        // Evento que se llama al encender el ordenador. Pone la hora a la de llegar tarde
        // en el telefono (la variable de llegar tarde la cambia el propio evento)
        this.dispatcher.add("turnPC", this, (obj) => {
            this.phoneManager.setDayInfo("pcLateHour");
        });

        // Evento que se llama al coger la mochila. Hace que la mochila desaparezca con 
        // una animacion (la variable de coger la mochila la cambia el propio evento)
        this.dispatcher.addOnce("pickBag", this, (obj) => {
            bag.disableInteractive();
            this.tweens.add({
                targets: bag,
                alpha: { from: 1, to: 0 },
                duration: 100,
                repeat: 0,
            });
        });

    }
}
