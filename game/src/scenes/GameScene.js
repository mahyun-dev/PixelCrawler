import Player from '../entities/Player.js';
import Monster from '../entities/Monster.js';
import NPC from '../entities/NPC.js';
import { DungeonGenerator } from '../systems/DungeonGenerator.js';
import { InventoryUI } from '../ui/InventoryUI.js';

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

        // 던전 생성
        this.createDungeon();

        // 플레이어 생성 (던전 시작 위치)
        const spawnPos = this.dungeon.getSpawnPosition();
        this.player = new Player(this, spawnPos.x, spawnPos.y);

        // 몬스터 그룹 생성
        this.monsters = this.physics.add.group();
        this.spawnMonsters();

        // NPC 그룹 생성
        this.npcs = this.physics.add.group();
        this.spawnNPCs();

        // 플레이어와 몬스터 충돌
        this.physics.add.collider(this.player.sprite, this.monsters);

        // 플레이어와 NPC 충돌
        this.physics.add.collider(this.player.sprite, this.npcs);

        // 인벤토리 UI 초기화
        this.inventoryUI = new InventoryUI(this);

        // 카메라 설정
        this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, this.mapWidth * 32, this.mapHeight * 32);

        // UI 텍스트
        this.createUI();

        // ESC 키로 메뉴 열기
        this.input.keyboard.on('keydown-ESC', () => {
            this.openPauseMenu();
        });

        console.log('게임 씬 시작됨');
    }

    createDungeon() {
        this.mapWidth = 50;
        this.mapHeight = 50;
        
        // 던전 생성기
        this.dungeon = new DungeonGenerator(this.mapWidth, this.mapHeight);
        const tiles = this.dungeon.generate();

        // 타일맵 렌더링
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tileType = tiles[y][x];
                const color = tileType === 0 ? 0x4a6741 : 0x2d3d29; // 바닥 : 벽
                const tile = this.add.rectangle(x * 32 + 16, y * 32 + 16, 32, 32, color);
                tile.setStrokeStyle(1, 0x1a1a1a);
                
                // 벽은 충돌 가능하게
                if (tileType === 1) {
                    this.physics.add.existing(tile, true); // static body
                    if (this.player) {
                        this.physics.add.collider(this.player.sprite, tile);
                    }
                }
            }
        }
    }

    spawnMonsters() {
        const monsterTypes = ['Orc', 'OrcRogue', 'Skeleton', 'SkeletonRogue'];
        const monsterCount = Phaser.Math.Between(5, 10);

        for (let i = 0; i < monsterCount; i++) {
            const pos = this.dungeon.getRandomRoomPosition(true); // 첫 번째 방 제외
            const type = Phaser.Utils.Array.GetRandom(monsterTypes);
            const monster = new Monster(this, pos.x, pos.y, type);
            this.monsters.add(monster.sprite);
        }
    }

    spawnNPCs() {
        const npcTypes = ['Knight', 'Rogue', 'Wizzard'];
        const npcCount = 2; // 2-3개의 NPC

        for (let i = 0; i < npcCount; i++) {
            const pos = this.dungeon.getRandomRoomPosition(false); // 아무 방에나 배치
            const type = Phaser.Utils.Array.GetRandom(npcTypes);
            const npc = new NPC(this, pos.x, pos.y, type);
            this.npcs.add(npc.sprite);
        }
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

        // 경험치 표시
        this.expText = this.add.text(20, 80, 'EXP: 0 / 100', {
            font: '16px monospace',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.expText.setScrollFactor(0);

        // 골드 표시
        this.goldText = this.add.text(20, 110, 'Gold: 0', {
            font: '16px monospace',
            fill: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.goldText.setScrollFactor(0);

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

        // 몬스터 AI 업데이트
        if (this.monsters) {
            this.monsters.children.entries.forEach(monsterSprite => {
                if (monsterSprite.monster) {
                    monsterSprite.monster.update(this.player);
                }
            });
        }

        // NPC 업데이트
        if (this.npcs) {
            this.npcs.children.entries.forEach(npcSprite => {
                if (npcSprite.npc) {
                    npcSprite.npc.update(this.player);
                }
            });
        }

        // UI 업데이트
        this.updateUI();
    }

    updateUI() {
        if (!this.player) return;

        this.hpText.setText(`HP: ${this.player.stats.hp} / ${this.player.stats.maxHp}`);
        this.levelText.setText(`Level: ${this.player.stats.level}`);
        this.expText.setText(`EXP: ${this.player.stats.exp} / ${this.player.stats.expToLevel}`);
        this.goldText.setText(`Gold: ${this.player.inventory.gold}`);
    }

    openPauseMenu() {
        this.scene.pause();
        console.log('일시정지 메뉴 - 미구현');
        // 나중에 일시정지 씬 추가
    }

    gameOver() {
        // 게임 오버 화면
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const gameOverText = this.add.text(width / 2, height / 2, 'GAME OVER', {
            font: 'bold 48px monospace',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setScrollFactor(0);

        const restartText = this.add.text(width / 2, height / 2 + 60, 'Press SPACE to restart', {
            font: '24px monospace',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        restartText.setOrigin(0.5);
        restartText.setScrollFactor(0);

        // SPACE키로 재시작
        const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceKey.once('down', () => {
            this.scene.restart();
        });
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
