import Player from '../entities/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.isNewGame = data.isNewGame || false;
        this.saveData = data.saveData || null;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 임시 배경 (타일맵으로 대체 예정)
        this.add.rectangle(0, 0, width, height, 0x2d4a2b).setOrigin(0);

        // 플레이어 생성
        this.player = new Player(this, width / 2, height / 2);

        // 카메라 설정
        this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        this.cameras.main.setZoom(2);

        // UI 텍스트
        this.createUI();

        // ESC 키로 메뉴 열기
        this.input.keyboard.on('keydown-ESC', () => {
            this.openPauseMenu();
        });

        console.log('게임 씬 시작됨');
    }

    createUI() {
        // 고정 카메라에 UI 표시
        const uiCamera = this.cameras.add(0, 0, this.cameras.main.width, this.cameras.main.height);
        uiCamera.setScroll(0, 0);
        uiCamera.ignore(this.children.list.filter(child => child !== this.uiContainer));

        // HP 바
        this.hpText = this.add.text(20, 20, 'HP: 100 / 100', {
            font: '16px monospace',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.hpText.setScrollFactor(0);

        // 레벨 표시
        this.levelText = this.add.text(20, 50, 'Level: 1', {
            font: '16px monospace',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.levelText.setScrollFactor(0);

        // 조작 안내
        const controls = this.add.text(20, this.cameras.main.height - 100, 
            'WASD: 이동\nSPACE: 공격\nE: 상호작용\nI: 인벤토리\nESC: 메뉴', {
            font: '14px monospace',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        controls.setScrollFactor(0);
    }

    update(time, delta) {
        if (this.player) {
            this.player.update();
        }
    }

    openPauseMenu() {
        this.scene.pause();
        console.log('일시정지 메뉴 - 미구현');
        // 나중에 일시정지 씬 추가
    }

    saveGame() {
        const saveData = {
            playerPosition: {
                x: this.player.sprite.x,
                y: this.player.sprite.y
            },
            playerStats: {
                level: 1,
                hp: 100,
                maxHp: 100
            },
            timestamp: Date.now()
        };

        localStorage.setItem('pixelCrawler_saveData', JSON.stringify(saveData));
        console.log('게임 저장됨');
    }
}
