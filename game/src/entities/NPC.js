export default class NPC {
    constructor(scene, x, y, type = 'Knight') {
        this.scene = scene;
        this.type = type;
        
        // NPC 스프라이트 생성
        const idleKey = `npc_${type}_Idle`;
        
        console.log(`=== NPC ${type} Creation ===`);
        console.log('Looking for texture:', idleKey);
        console.log('Texture exists?', scene.textures.exists(idleKey));
        
        if (!scene.textures.exists(idleKey)) {
            console.warn(`Texture not found: ${idleKey}, creating placeholder`);
            this.sprite = scene.physics.add.sprite(x, y, '__DEFAULT');
            this.sprite.setDisplaySize(48, 48);
            this.sprite.setTint(0x0000ff); // 파란색으로 표시
        } else {
            // 철 번째 프레임을 명시적으로 지정
            this.sprite = scene.physics.add.sprite(x, y, idleKey, 0);
            
            const texture = scene.textures.get(idleKey);
            const sourceImage = texture.source[0];
            console.log(`Texture ${idleKey} loaded:`, {
                frameTotal: texture.frameTotal,
                frames: Object.keys(texture.frames).length,
                imageWidth: sourceImage.width,
                imageHeight: sourceImage.height,
                expectedFrames: Math.floor(sourceImage.width / 32) * Math.floor(sourceImage.height / 32)
            });
            
            // 스프라이트 크기 설정 (32x32를 48x48로 확대)
            this.sprite.setDisplaySize(48, 48);
        }
        this.sprite.npc = this; // 역참조
        
        // NPC 정보
        this.name = this.getNameByType(type);
        this.dialogue = this.getDialogueByType(type);
        this.shopItems = this.getShopItemsByType(type);
        
        // 애니메이션 생성
        this.createAnimations();
        
        // 기본 상태: Idle 첫 프레임으로 설정
        if (scene.textures.exists(idleKey)) {
            this.sprite.setTexture(idleKey, 0);
        }
        
        // 물리 설정
        this.sprite.body.setImmovable(true);
        this.sprite.body.setSize(30, 32);
        this.sprite.body.setOffset(9, 8);
        
        // 상호작용 범위 표시
        this.interactionRange = 50;
        this.showInteractionIndicator = false;
    }
    
    getNameByType(type) {
        const names = {
            'Knight': '기사',
            'Rogue': '도적',
            'Wizzard': '마법사'
        };
        return names[type] || 'NPC';
    }
    
    getDialogueByType(type) {
        const dialogues = {
            'Knight': [
                '용감한 모험가여, 환영하네!',
                '던전은 위험하니 조심하게.',
                '장비를 판매하고 있네. 둘러보게.'
            ],
            'Rogue': [
                '이봐, 재미있는 물건들이 있어.',
                '필요한 게 있으면 말해.',
                '비밀 정보도 팔고 있지.'
            ],
            'Wizzard': [
                '마법의 힘이 필요한가?',
                '포션과 마법 아이템을 판매하네.',
                '지혜롭게 사용하게나.'
            ]
        };
        return dialogues[type] || ['...'];
    }
    
    getShopItemsByType(type) {
        const shops = {
            'Knight': [
                { name: '철검', price: 100, type: 'weapon', power: 15 },
                { name: '철갑옷', price: 150, type: 'armor', defense: 10 },
                { name: '체력 포션', price: 30, type: 'potion', heal: 50 }
            ],
            'Rogue': [
                { name: '단검', price: 80, type: 'weapon', power: 12 },
                { name: '가죽 갑옷', price: 100, type: 'armor', defense: 6 },
                { name: '독 포션', price: 50, type: 'potion', damage: 30 }
            ],
            'Wizzard': [
                { name: '마법 지팡이', price: 200, type: 'weapon', power: 25 },
                { name: '마나 포션', price: 40, type: 'potion', mana: 30 },
                { name: '마법 두루마리', price: 80, type: 'scroll', effect: 'fire' }
            ]
        };
        return shops[type] || [];
    }
    
    createAnimations() {
        const states = ['Idle', 'Run', 'Death'];
        
        states.forEach(state => {
            const animKey = `npc_${this.type}_${state.toLowerCase()}`;
            const textureKey = `npc_${this.type}_${state}`;
            
            if (this.scene.textures.exists(textureKey) && !this.scene.anims.exists(animKey)) {
                try {
                    const texture = this.scene.textures.get(textureKey);
                    const lastFrame = texture.frameTotal - 1;
                    
                    if (lastFrame > 0) {
                        this.scene.anims.create({
                            key: animKey,
                            frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: lastFrame }),
                            frameRate: 4,
                            repeat: -1
                        });
                    }
                } catch (error) {
                    console.error(`Failed to create animation ${animKey}:`, error);
                }
            }
        });
    }
    
    update(player) {
        if (!player) return;
        
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        // 플레이어가 가까우면 상호작용 표시
        if (distance < this.interactionRange) {
            if (!this.showInteractionIndicator) {
                this.showIndicator();
            }
        } else {
            if (this.showInteractionIndicator) {
                this.hideIndicator();
            }
        }
    }
    
    showIndicator() {
        this.showInteractionIndicator = true;
        
        if (!this.indicator) {
            this.indicator = this.scene.add.text(
                this.sprite.x,
                this.sprite.y - 40,
                '[E]',
                {
                    font: 'bold 14px monospace',
                    fill: '#ffff00',
                    backgroundColor: '#000000',
                    padding: { x: 5, y: 2 }
                }
            );
            this.indicator.setOrigin(0.5);
        }
        this.indicator.setVisible(true);
    }
    
    hideIndicator() {
        this.showInteractionIndicator = false;
        if (this.indicator) {
            this.indicator.setVisible(false);
        }
    }
    
    interact(player) {
        console.log(`${this.name}와 대화 중...`);
        this.openDialogue(player);
    }
    
    openDialogue(player) {
        // 대화창 표시
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        const dialogueBg = this.scene.add.rectangle(
            width / 2,
            height - 120,
            width - 40,
            100,
            0x000000,
            0.9
        );
        dialogueBg.setStrokeStyle(2, 0xffffff);
        dialogueBg.setScrollFactor(0);
        dialogueBg.setDepth(200);
        
        const randomDialogue = Phaser.Utils.Array.GetRandom(this.dialogue);
        const dialogueText = this.scene.add.text(
            40,
            height - 150,
            `${this.name}: ${randomDialogue}`,
            {
                font: '18px monospace',
                fill: '#ffffff',
                wordWrap: { width: width - 80 }
            }
        );
        dialogueText.setScrollFactor(0);
        dialogueText.setDepth(201);
        
        // 상점 버튼
        const shopButton = this.scene.add.text(
            width / 2,
            height - 50,
            '[S] Shop    [ESC] Close',
            {
                font: '16px monospace',
                fill: '#ffff00'
            }
        );
        shopButton.setOrigin(0.5);
        shopButton.setScrollFactor(0);
        shopButton.setDepth(201);
        
        // ESC로 닫기
        const escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        const sKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        
        escKey.once('down', () => {
            dialogueBg.destroy();
            dialogueText.destroy();
            shopButton.destroy();
        });
        
        sKey.once('down', () => {
            dialogueBg.destroy();
            dialogueText.destroy();
            shopButton.destroy();
            this.openShop(player);
        });
    }
    
    openShop(player) {
        console.log(`${this.name}의 상점 열기`);
        
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        // 상점 UI (간단한 버전)
        const shopBg = this.scene.add.rectangle(
            width / 2,
            height / 2,
            500,
            400,
            0x1a1a1a,
            0.95
        );
        shopBg.setStrokeStyle(4, 0xffffff);
        shopBg.setScrollFactor(0);
        shopBg.setDepth(200);
        
        const shopTitle = this.scene.add.text(
            width / 2,
            height / 2 - 160,
            `${this.name}의 상점`,
            {
                font: 'bold 24px monospace',
                fill: '#ffffff'
            }
        );
        shopTitle.setOrigin(0.5);
        shopTitle.setScrollFactor(0);
        shopTitle.setDepth(201);
        
        // 아이템 목록
        let itemsText = 'Items:\n\n';
        this.shopItems.forEach((item, index) => {
            itemsText += `${index + 1}. ${item.name} - ${item.price}G\n`;
        });
        
        const itemsList = this.scene.add.text(
            width / 2,
            height / 2 - 50,
            itemsText,
            {
                font: '16px monospace',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 10 }
            }
        );
        itemsList.setOrigin(0.5);
        itemsList.setScrollFactor(0);
        itemsList.setDepth(201);
        
        const goldText = this.scene.add.text(
            width / 2,
            height / 2 + 130,
            `Your Gold: ${player.inventory.gold}G`,
            {
                font: '18px monospace',
                fill: '#ffff00'
            }
        );
        goldText.setOrigin(0.5);
        goldText.setScrollFactor(0);
        goldText.setDepth(201);
        
        const closeText = this.scene.add.text(
            width / 2,
            height / 2 + 160,
            'Press ESC to close',
            {
                font: '14px monospace',
                fill: '#888888'
            }
        );
        closeText.setOrigin(0.5);
        closeText.setScrollFactor(0);
        closeText.setDepth(201);
        
        // ESC로 닫기
        const escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        escKey.once('down', () => {
            shopBg.destroy();
            shopTitle.destroy();
            itemsList.destroy();
            goldText.destroy();
            closeText.destroy();
        });
    }
}
