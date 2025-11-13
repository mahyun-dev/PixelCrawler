export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 배경
        this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0);

        // 타이틀
        const title = this.add.text(width / 2, height / 3, 'PIXEL CRAWLER', {
            font: 'bold 64px monospace',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        title.setOrigin(0.5);

        // 메뉴 버튼들
        const menuItems = [
            { text: 'NEW GAME', y: height / 2, action: () => this.startNewGame() },
            { text: 'CONTINUE', y: height / 2 + 70, action: () => this.continueGame() },
            { text: 'OPTIONS', y: height / 2 + 140, action: () => this.openOptions() }
        ];

        menuItems.forEach((item, index) => {
            const button = this.add.text(width / 2, item.y, item.text, {
                font: '32px monospace',
                fill: '#cccccc'
            });
            button.setOrigin(0.5);
            button.setInteractive({ useHandCursor: true });

            button.on('pointerover', () => {
                button.setStyle({ fill: '#ffffff' });
            });

            button.on('pointerout', () => {
                button.setStyle({ fill: '#cccccc' });
            });

            button.on('pointerdown', item.action);
        });

        // 버전 정보
        this.add.text(10, height - 30, 'v0.1.0 Alpha', {
            font: '14px monospace',
            fill: '#666666'
        });

        // 세이브 데이터 확인
        this.checkSaveData();
    }

    checkSaveData() {
        const saveData = localStorage.getItem('pixelCrawler_saveData');
        // 세이브 데이터가 없으면 CONTINUE 버튼 비활성화 등 처리 가능
    }

    startNewGame() {
        // 새 게임 시작
        this.scene.start('GameScene', { isNewGame: true });
    }

    continueGame() {
        // 저장된 게임 불러오기
        const saveData = localStorage.getItem('pixelCrawler_saveData');
        if (saveData) {
            this.scene.start('GameScene', { saveData: JSON.parse(saveData) });
        } else {
            console.log('저장된 게임이 없습니다.');
        }
    }

    openOptions() {
        console.log('옵션 메뉴 - 미구현');
    }
}
