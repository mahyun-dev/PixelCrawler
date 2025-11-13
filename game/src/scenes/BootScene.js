import { ResourceLoader } from '../systems/ResourceLoader.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 로딩 바 생성
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 320, height / 2 - 30, 640, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.add.text(width / 2, height / 2, '0%', {
            font: '18px monospace',
            fill: '#ffffff'
        });
        percentText.setOrigin(0.5, 0.5);

        const assetText = this.add.text(width / 2, height / 2 + 50, '', {
            font: '14px monospace',
            fill: '#ffffff'
        });
        assetText.setOrigin(0.5, 0.5);

        // 로딩 진행 상황 표시
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 310, height / 2 - 20, 620 * value, 30);
        });

        this.load.on('fileprogress', (file) => {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // 리소스 로더 초기화 및 모든 리소스 로드
        const resourceLoader = new ResourceLoader(this);
        resourceLoader.loadAll();
    }

    create() {
        // 메뉴 씬으로 전환
        this.scene.start('MenuScene');
    }
}
