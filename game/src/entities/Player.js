export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // 플레이어 스프라이트 생성 (임시로 사각형 사용, 나중에 애니메이션으로 교체)
        this.sprite = scene.add.rectangle(x, y, 32, 32, 0x00ff00);
        scene.physics.add.existing(this.sprite);
        
        // 물리 속성 설정
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(32, 32);
        
        // 플레이어 스탯
        this.stats = {
            level: 1,
            hp: 100,
            maxHp: 100,
            speed: 200,
            attackPower: 10
        };
        
        // 상태
        this.state = {
            isAttacking: false,
            isDead: false,
            direction: 'down'
        };
        
        // 키보드 입력 설정
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            attack: Phaser.Input.Keyboard.KeyCodes.SPACE,
            interact: Phaser.Input.Keyboard.KeyCodes.E,
            inventory: Phaser.Input.Keyboard.KeyCodes.I
        });
        
        // 애니메이션 생성 (실제 스프라이트시트 로드 후 활성화)
        // this.createAnimations();
    }
    
    createAnimations() {
        const directions = ['Down', 'Side', 'Up'];
        const animations = [
            { key: 'idle', prefix: 'Idle_Base' },
            { key: 'walk', prefix: 'Walk_Base' },
            { key: 'run', prefix: 'Run_Base' },
            { key: 'attack', prefix: 'Slice_Base' }
        ];
        
        directions.forEach(dir => {
            animations.forEach(anim => {
                const animKey = `player_${anim.key}_${dir.toLowerCase()}`;
                const textureKey = `player_${anim.prefix}_${dir}`;
                
                if (this.scene.textures.exists(textureKey)) {
                    this.scene.anims.create({
                        key: animKey,
                        frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: -1 }),
                        frameRate: 10,
                        repeat: anim.key === 'idle' ? -1 : 0
                    });
                }
            });
        });
    }
    
    update() {
        if (this.state.isDead || this.state.isAttacking) {
            return;
        }
        
        // 이동 처리
        const velocity = { x: 0, y: 0 };
        
        if (this.keys.up.isDown) {
            velocity.y = -1;
            this.state.direction = 'up';
        } else if (this.keys.down.isDown) {
            velocity.y = 1;
            this.state.direction = 'down';
        }
        
        if (this.keys.left.isDown) {
            velocity.x = -1;
            this.state.direction = 'left';
        } else if (this.keys.right.isDown) {
            velocity.x = 1;
            this.state.direction = 'right';
        }
        
        // 대각선 이동 시 속도 정규화
        if (velocity.x !== 0 && velocity.y !== 0) {
            const length = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            velocity.x /= length;
            velocity.y /= length;
        }
        
        // 속도 적용
        this.sprite.body.setVelocity(
            velocity.x * this.stats.speed,
            velocity.y * this.stats.speed
        );
        
        // 공격 처리
        if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
            this.attack();
        }
        
        // 상호작용 처리
        if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
            this.interact();
        }
        
        // 인벤토리 열기
        if (Phaser.Input.Keyboard.JustDown(this.keys.inventory)) {
            this.openInventory();
        }
        
        // 애니메이션 업데이트 (나중에 활성화)
        // this.updateAnimation(velocity);
    }
    
    updateAnimation(velocity) {
        const isMoving = velocity.x !== 0 || velocity.y !== 0;
        
        if (isMoving) {
            let animKey = `player_walk_${this.state.direction}`;
            this.sprite.anims.play(animKey, true);
        } else {
            let animKey = `player_idle_${this.state.direction}`;
            this.sprite.anims.play(animKey, true);
        }
        
        // 좌우 반전
        if (this.state.direction === 'left') {
            this.sprite.setFlipX(true);
        } else if (this.state.direction === 'right') {
            this.sprite.setFlipX(false);
        }
    }
    
    attack() {
        if (this.state.isAttacking) return;
        
        this.state.isAttacking = true;
        console.log('플레이어 공격!');
        
        // 공격 애니메이션 재생 후 상태 복구
        this.scene.time.delayedCall(500, () => {
            this.state.isAttacking = false;
        });
    }
    
    interact() {
        console.log('상호작용 시도');
        // NPC나 오브젝트와의 상호작용 처리
    }
    
    openInventory() {
        console.log('인벤토리 열기 - 미구현');
        // 인벤토리 UI 표시
    }
    
    takeDamage(amount) {
        this.stats.hp = Math.max(0, this.stats.hp - amount);
        
        if (this.stats.hp <= 0) {
            this.die();
        }
        
        console.log(`플레이어 피해: ${amount}, 남은 HP: ${this.stats.hp}`);
    }
    
    heal(amount) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
        console.log(`플레이어 회복: ${amount}, 현재 HP: ${this.stats.hp}`);
    }
    
    die() {
        this.state.isDead = true;
        this.sprite.body.setVelocity(0, 0);
        console.log('플레이어 사망');
        // 사망 처리 및 게임 오버
    }
}
