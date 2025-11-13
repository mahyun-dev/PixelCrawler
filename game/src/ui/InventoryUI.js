export class InventoryUI {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;
        this.container = null;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.scene.scene.pause();
        
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        // 배경
        const bg = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.8);
        bg.setOrigin(0);
        bg.setScrollFactor(0);
        bg.setDepth(100);

        // 인벤토리 패널
        const panelWidth = 600;
        const panelHeight = 500;
        const panel = this.scene.add.rectangle(
            width / 2, height / 2,
            panelWidth, panelHeight,
            0x1a1a1a
        );
        panel.setStrokeStyle(4, 0xffffff);
        panel.setScrollFactor(0);
        panel.setDepth(101);

        // 제목
        const title = this.scene.add.text(width / 2, height / 2 - panelHeight / 2 + 30, 'INVENTORY', {
            font: 'bold 32px monospace',
            fill: '#ffffff'
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(102);

        // 플레이어 정보
        const player = this.scene.player;
        const statsText = this.scene.add.text(
            width / 2 - panelWidth / 2 + 30,
            height / 2 - panelHeight / 2 + 80,
            `Level: ${player.stats.level}\n` +
            `HP: ${player.stats.hp} / ${player.stats.maxHp}\n` +
            `Attack: ${player.stats.attackPower}\n` +
            `Gold: ${player.inventory.gold}`,
            {
                font: '18px monospace',
                fill: '#ffff00',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            }
        );
        statsText.setScrollFactor(0);
        statsText.setDepth(102);

        // 아이템 슬롯
        const slotSize = 60;
        const slotsPerRow = 5;
        const startX = width / 2 - (slotSize * slotsPerRow) / 2 + slotSize / 2;
        const startY = height / 2 - 80;

        for (let i = 0; i < player.inventory.maxSlots; i++) {
            const col = i % slotsPerRow;
            const row = Math.floor(i / slotsPerRow);
            const x = startX + col * (slotSize + 10);
            const y = startY + row * (slotSize + 10);

            const slot = this.scene.add.rectangle(x, y, slotSize, slotSize, 0x333333);
            slot.setStrokeStyle(2, 0x666666);
            slot.setScrollFactor(0);
            slot.setDepth(102);

            // 아이템이 있으면 표시
            if (player.inventory.items[i]) {
                const item = player.inventory.items[i];
                const itemText = this.scene.add.text(x, y, item.name.substring(0, 1), {
                    font: 'bold 24px monospace',
                    fill: '#ffffff'
                });
                itemText.setOrigin(0.5);
                itemText.setScrollFactor(0);
                itemText.setDepth(103);
            }
        }

        // 닫기 안내
        const closeText = this.scene.add.text(
            width / 2,
            height / 2 + panelHeight / 2 - 30,
            'Press I or ESC to close',
            {
                font: '16px monospace',
                fill: '#888888'
            }
        );
        closeText.setOrigin(0.5);
        closeText.setScrollFactor(0);
        closeText.setDepth(102);

        // 컨테이너에 모든 UI 요소 저장
        this.container = [bg, panel, title, statsText, closeText];

        // ESC나 I 키로 닫기
        const escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        const iKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        escKey.once('down', () => this.close());
        iKey.once('down', () => this.close());
    }

    close() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.scene.scene.resume();

        // UI 요소 제거
        if (this.container) {
            this.container.forEach(element => {
                if (element && element.destroy) {
                    element.destroy();
                }
            });
            this.container = null;
        }
    }
}
