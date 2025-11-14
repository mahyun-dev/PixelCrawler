export default class Monster {
    constructor(scene, x, y, type = 'Orc') {
        this.scene = scene;
        this.type = type;
        
        // 몬스터 스프라이트 생성
        const idleKey = `mob_${type}_Idle`;
        
        console.log(`=== Monster ${type} Creation ===`);
        console.log('Looking for texture:', idleKey);
        console.log('Texture exists?', scene.textures.exists(idleKey));
        
        // 텍스처가 없으면 기본 사각형으로 대체
        if (!scene.textures.exists(idleKey)) {
            console.warn(`Texture not found: ${idleKey}, creating placeholder`);
            this.sprite = scene.physics.add.sprite(x, y, '__DEFAULT');
            this.sprite.setDisplaySize(48, 48);
            this.sprite.setTint(0xff0000); // 빨간색으로 표시
        } else {
            // 첫 번째 프레임을 명시적으로 지정
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
        this.sprite.monster = this; // 역참조
        
        // 몬스터 타입별 스탯
        this.stats = this.getStatsByType(type);
        
        // 상태
        this.state = {
            isAttacking: false,
            isDead: false,
            isChasing: false,
            lastAnimState: 'idle'  // 마지막 애니메이션 상태
        };
        
        // AI 타이머
        this.aiTimer = 0;
        this.aiInterval = 1000; // 1초마다 AI 업데이트
        
        // 애니메이션 생성
        this.createAnimations();
        
        // 기본 상태: Idle 첫 프레임으로 설정
        if (scene.textures.exists(idleKey)) {
            this.sprite.setTexture(idleKey, 0);
        }
        
        // 물리 설정
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(32, 32);
        this.sprite.body.setOffset(8, 8);
    }
    
    getStatsByType(type) {
        const stats = {
            'Orc': { hp: 50, maxHp: 50, speed: 80, attackPower: 10, exp: 25, gold: 10 },
            'OrcRogue': { hp: 40, maxHp: 40, speed: 120, attackPower: 15, exp: 30, gold: 15 },
            'OrcShaman': { hp: 35, maxHp: 35, speed: 60, attackPower: 20, exp: 35, gold: 20 },
            'OrcWarrior': { hp: 80, maxHp: 80, speed: 70, attackPower: 18, exp: 40, gold: 25 },
            'Skeleton': { hp: 30, maxHp: 30, speed: 90, attackPower: 8, exp: 20, gold: 8 },
            'SkeletonMage': { hp: 25, maxHp: 25, speed: 70, attackPower: 25, exp: 35, gold: 18 },
            'SkeletonRogue': { hp: 28, maxHp: 28, speed: 110, attackPower: 12, exp: 28, gold: 12 },
            'SkeletonWarrior': { hp: 60, maxHp: 60, speed: 80, attackPower: 15, exp: 38, gold: 22 }
        };
        
        return stats[type] || stats['Orc'];
    }
    
    createAnimations() {
        const states = ['Idle', 'Run', 'Death'];
        
        states.forEach(state => {
            const animKey = `mob_${this.type}_${state.toLowerCase()}`;
            const textureKey = `mob_${this.type}_${state}`;
            
            if (this.scene.textures.exists(textureKey) && !this.scene.anims.exists(animKey)) {
                try {
                    const texture = this.scene.textures.get(textureKey);
                    const source = texture.source[0];
                    // 실제 프레임 개수: 이미지 너비 ÷ 프레임 너비 (32px)
                    const actualFrames = Math.floor(source.width / 32);
                    const lastFrame = actualFrames - 1;
                    
                    if (actualFrames > 0) {
                        this.scene.anims.create({
                            key: animKey,
                            frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: lastFrame }),
                            frameRate: state === 'Idle' ? 4 : state === 'Run' ? 15 : 12,
                            repeat: state === 'Death' ? 0 : -1
                        });
                    }
                } catch (error) {
                    console.error(`Failed to create animation ${animKey}:`, error);
                }
            }
        });
    }
    
    update(player) {
        if (this.state.isDead) return;
        
        this.aiTimer += this.scene.game.loop.delta;
        
        if (this.aiTimer >= this.aiInterval) {
            this.aiTimer = 0;
            this.updateAI(player);
        }
        
        // 애니메이션 업데이트
        this.updateAnimation();
    }
    
    updateAI(player) {
        if (!player || player.state.isDead) {
            this.state.isChasing = false;
            this.sprite.body.setVelocity(0, 0);
            return;
        }
        
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        const detectionRange = 200;
        const attackRange = 40;
        
        if (distance < attackRange) {
            // 공격 범위 내
            this.attack(player);
        } else if (distance < detectionRange) {
            // 추적 범위 내
            this.state.isChasing = true;
            this.chasePlayer(player);
        } else {
            // 범위 밖 - 대기
            this.state.isChasing = false;
            this.sprite.body.setVelocity(0, 0);
        }
    }
    
    chasePlayer(player) {
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        const velocityX = Math.cos(angle) * this.stats.speed;
        const velocityY = Math.sin(angle) * this.stats.speed;
        
        this.sprite.body.setVelocity(velocityX, velocityY);
        
        // 방향에 따라 반전
        if (velocityX < 0) {
            this.sprite.setFlipX(true);
        } else {
            this.sprite.setFlipX(false);
        }
    }
    
    attack(player) {
        if (this.state.isAttacking) return;
        
        this.state.isAttacking = true;
        this.sprite.body.setVelocity(0, 0);
        
        // 플레이어에게 피해
        player.takeDamage(this.stats.attackPower);
        
        // 공격 쿨다운
        this.scene.time.delayedCall(1000, () => {
            this.state.isAttacking = false;
        });
    }
    
    updateAnimation() {
        if (this.state.isDead) return;
        
        const isMoving = Math.abs(this.sprite.body.velocity.x) > 5 || Math.abs(this.sprite.body.velocity.y) > 5;
        const animState = isMoving ? 'run' : 'idle';
        
        // 상태가 변하지 않았으면 아무것도 하지 않음
        if (animState === this.state.lastAnimState) return;
        
        this.state.lastAnimState = animState;
        
        if (isMoving) {
            // 이동 중: run 애니메이션
            const runAnim = `mob_${this.type}_run`;
            if (this.scene.anims.exists(runAnim)) {
                // 이미 같은 애니메이션이 재생 중이 아닐 때만 재생
                if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim.key !== runAnim) {
                    this.sprite.anims.play(runAnim);
                }
            }
        } else {
            // 정지: idle 첫 프레임
            const idleKey = `mob_${this.type}_Idle`;
            if (this.scene.textures.exists(idleKey)) {
                this.sprite.anims.stop();
                this.sprite.setTexture(idleKey, 0);
            }
        }
    }
    
    takeDamage(amount) {
        this.stats.hp -= amount;
        
        // 피격 이펙트
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.sprite.clearTint();
        });
        
        if (this.stats.hp <= 0) {
            this.die();
        }
    }
    
    die() {
        this.state.isDead = true;
        this.sprite.body.setVelocity(0, 0);
        this.sprite.body.enable = false;
        
        // 사망 애니메이션
        const deathAnim = `mob_${this.type}_death`;
        if (this.scene.anims.exists(deathAnim)) {
            this.sprite.anims.play(deathAnim, true);
        } else {
            this.sprite.setTint(0x666666);
            this.sprite.setAlpha(0.5);
        }
        
        // 드롭 아이템
        this.dropLoot();
        
        // 플레이어에게 경험치와 골드
        if (this.scene.player) {
            this.scene.player.addExp(this.stats.exp);
            this.scene.player.addGold(this.stats.gold);
        }
        
        // 몬스터 제거
        this.scene.time.delayedCall(2000, () => {
            this.sprite.destroy();
        });
    }
    
    dropLoot() {
        // 랜덤 아이템 드롭 (나중에 구현)
        const dropChance = Math.random();
        
        if (dropChance < 0.3) {
            console.log(`${this.type} dropped an item!`);
            // 아이템 생성
        }
    }
}
