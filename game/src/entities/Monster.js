export default class Monster {
    constructor(scene, x, y, type = 'Orc') {
        this.scene = scene;
        this.type = type;
        
        // 애니메이션 먼저 생성
        this.createAnimations();
        
        // 몬스터 스프라이트 생성
        const idleKey = `mob_${type}_Idle`;
        // 텍스처가 없으면 기본 사각형으로 대체
        if (!scene.textures.exists(idleKey)) {
            console.warn(`Texture not found: ${idleKey}, creating placeholder`);
            this.sprite = scene.physics.add.sprite(x, y, '__DEFAULT');
            this.sprite.setDisplaySize(48, 48);
            this.sprite.setTint(0xff0000); // 빨간색으로 표시
        } else {
            this.sprite = scene.physics.add.sprite(x, y, idleKey);
        }
        this.sprite.monster = this; // 역참조
        
        // 몬스터 타입별 스탯
        this.stats = this.getStatsByType(type);
        
        // 상태
        this.state = {
            isAttacking: false,
            isDead: false,
            isChasing: false
        };
        
        // AI 타이머
        this.aiTimer = 0;
        this.aiInterval = 1000; // 1초마다 AI 업데이트
        
        // 기본 애니메이션 재생 (있을 때만)
        const animKey = `mob_${type}_idle`;
        if (scene.anims.exists(animKey)) {
            this.sprite.play(animKey);
        }
        
        // 물리 설정
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(30, 40);
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
                this.scene.anims.create({
                    key: animKey,
                    frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: -1 }),
                    frameRate: state === 'Idle' ? 6 : state === 'Run' ? 10 : 8,
                    repeat: state === 'Death' ? 0 : -1
                });
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
        
        const isMoving = this.sprite.body.velocity.x !== 0 || this.sprite.body.velocity.y !== 0;
        
        if (this.state.isChasing && isMoving) {
            const runAnim = `mob_${this.type}_run`;
            if (this.scene.anims.exists(runAnim)) {
                this.sprite.play(runAnim, true);
            }
        } else {
            const idleAnim = `mob_${this.type}_idle`;
            if (this.scene.anims.exists(idleAnim)) {
                this.sprite.play(idleAnim, true);
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
            this.sprite.play(deathAnim);
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
