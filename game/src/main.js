import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,
    height: 720,
    pixelArt: true,
    backgroundColor: '#1a1a1a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// LocalStorage 관리
export class GameStorage {
    static save(key, data) {
        try {
            localStorage.setItem(`pixelCrawler_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('저장 실패:', error);
            return false;
        }
    }

    static load(key) {
        try {
            const data = localStorage.getItem(`pixelCrawler_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('불러오기 실패:', error);
            return null;
        }
    }

    static delete(key) {
        localStorage.removeItem(`pixelCrawler_${key}`);
    }

    static clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith('pixelCrawler_'))
            .forEach(key => localStorage.removeItem(key));
    }
}
