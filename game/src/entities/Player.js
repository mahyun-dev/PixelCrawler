export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        
        console.log('=== Player Constructor Start ===');
        
        // 플레이어 스프라이트 생성 (실제 스프라이트 사용)
        const textureKey = 'player_Idle_Base_Down';  // ResourceLoader의 키와 일치
        
        console.log('Available textures:', Object.keys(scene.textures.list).filter(k => k.includes('player')).slice(0, 5));
        console.log('Looking for texture:', textureKey);
        console.log('Texture exists?', scene.textures.exists(textureKey));
        
        if (!scene.textures.exists(textureKey)) {
            console.warn(`Texture not found: ${textureKey}, creating placeholder`);
            this.sprite = scene.physics.add.sprite(x, y, '__DEFAULT');
            this.sprite.setDisplaySize(48, 48);
            this.sprite.setTint(0x00ff00); // 초록색으로 표시
        } else {
            // 철 번째 프레임을 명시적으로 지정
            this.sprite = scene.physics.add.sprite(x, y, textureKey, 0);
            this.sprite.setDisplaySize(48, 48); // 명시적 크기 설정
        }
        
        // 물리 속성 설정
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(32, 40);
        this.sprite.body.setOffset(8, 4);
        
        // 플레이어 스탯
        this.stats = {
            level: 1,
            hp: 100,
            maxHp: 100,
            speed: 200,
            attackPower: 10,
            exp: 0,
            expToLevel: 100
        };
        
        // 인벤토리
        this.inventory = {
            items: [],
            gold: 0,
            maxSlots: 20
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
        
        // 애니메이션 생성 (스프라이트 생성 후)
        this.createAnimations();
        
        // 기본 상태: Idle 첫 프레임으로 설정
        if (scene.textures.exists(textureKey)) {
            this.sprite.setTexture(textureKey, 0);
            console.log('✓ Player initialized with idle frame');
        }
        
        console.log('=== Player Constructor End ===');
    }
    
    createAnimations() {
        const animations = [
            { key: 'idle', folder: 'Idle_Base', directions: ['Down', 'Side', 'Up'], frameRate: 6, repeat: -1 },
            { key: 'walk', folder: 'Walk_Base', directions: ['Down', 'Side', 'Up'], frameRate: 8, repeat: -1 },
            { key: 'run', folder: 'Run_Base', directions: ['Down', 'Side', 'Up'], frameRate: 10, repeat: -1 },
            { key: 'attack', folder: 'Slice_Base', directions: ['Down', 'Side', 'Up'], frameRate: 12, repeat: 0 }
        ];
        
        animations.forEach(anim => {
            anim.directions.forEach(dir => {
                const animKey = `player_${anim.key}_${dir.toLowerCase()}`;
                const textureKey = `player_${anim.folder}_${dir}`;  // folder 사용!
                
                if (this.scene.textures.exists(textureKey)) {
                    if (!this.scene.anims.exists(animKey)) {
                        try {
                            const texture = this.scene.textures.get(textureKey);
                            const frameCount = texture.frameTotal;
                            
                            if (frameCount > 1) {  // 2프레임 이상이면 애니메이션 생성
                                console.log(`Creating animation ${animKey} with ${frameCount} frames (0-${frameCount-1}) from ${textureKey}`);
                                this.scene.anims.create({
                                    key: animKey,
                                    frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: frameCount - 1 }),
                                    frameRate: anim.frameRate,
                                    repeat: anim.repeat
                                });
                                console.log(`✓ Animation ${animKey} created successfully`);
                            } else {
                                console.warn(`Skipped ${animKey}: only ${frameCount} frame(s)`);
                            }
                        } catch (error) {
                            console.error(`Failed to create animation ${animKey}:`, error);
                        }
                    }
                } else {
                    console.warn(`Texture not found: ${textureKey}`);
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
        
        // 애니메이션 업데이트
        this.updateAnimation(velocity);
    }
    
    updateAnimation(velocity) {
        if (this.state.isAttacking) return;
        
        const isMoving = velocity.x !== 0 || velocity.y !== 0;
        
        // 방향 결정 (이동 중일 때만 방향 업데이트)
        if (isMoving) {
            if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
                // 좌우 이동이 더 큼
                this.state.direction = velocity.x < 0 ? 'left' : 'right';
            } else {
                // 상하 이동이 더 큼
                this.state.direction = velocity.y < 0 ? 'up' : 'down';
            }
        }
        
        // 방향 매핑 (left/right -> side)
        let direction = this.state.direction;
        if (direction === 'left' || direction === 'right') {
            direction = 'side';
        }
        
        // 좌우 반전
        const shouldFlip = this.state.direction === 'left';
        if (this.sprite.flipX !== shouldFlip) {
            this.sprite.setFlipX(shouldFlip);
        }
        
        if (isMoving) {
            // 이동 중: walk 애니메이션 재생
            const animKey = `player_walk_${direction}`;
            if (this.scene.anims.exists(animKey)) {
                const currentAnim = this.sprite.anims.currentAnim;
                if (!currentAnim || currentAnim.key !== animKey) {
                    this.sprite.anims.play(animKey);
                }
            }
        } else {
            // 정지: idle 애니메이션의 첫 프레임으로 고정
            const idleKey = `player_idle_${direction}`;
            const textureKey = `player_Idle_Base_${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
            
            if (this.scene.textures.exists(textureKey)) {
                // 애니메이션 정지하고 첫 프레임만 표시
                this.sprite.anims.stop();
                this.sprite.setTexture(textureKey, 0);
            }
        }
    }
    
    attack() {
        if (this.state.isAttacking) return;
        
        this.state.isAttacking = true;
        this.sprite.body.setVelocity(0, 0);
        
        let direction = this.state.direction;
        if (direction === 'left' || direction === 'right') {
            direction = 'side';
        }
        
        const attackAnim = `player_attack_${direction}`;
        if (this.scene.anims.exists(attackAnim)) {
            this.sprite.anims.play(attackAnim, true);
        }
        
        // 공격 히트박스 생성
        this.createAttackHitbox();
        
        // 공격 애니메이션 재생 후 상태 복구
        this.scene.time.delayedCall(400, () => {
            this.state.isAttacking = false;
        });
    }
    
    createAttackHitbox() {
        const offsetX = this.state.direction === 'left' ? -40 : 
                        this.state.direction === 'right' ? 40 : 0;
        const offsetY = this.state.direction === 'up' ? -40 : 
                        this.state.direction === 'down' ? 40 : 0;
        
        const hitbox = this.scene.add.rectangle(
            this.sprite.x + offsetX, 
            this.sprite.y + offsetY, 
            40, 40, 0xff0000, 0.3
        );
        
        this.scene.physics.add.existing(hitbox);
        
        // 몬스터와 충돌 체크
        if (this.scene.monsters) {
            this.scene.physics.overlap(hitbox, this.scene.monsters, (hitbox, monsterSprite) => {
                if (monsterSprite.monster) {
                    monsterSprite.monster.takeDamage(this.stats.attackPower);
                }
            });
        }
        
        // 히트박스 제거
        this.scene.time.delayedCall(100, () => {
            hitbox.destroy();
        });
    }
    
    interact() {
        // 주변 NPC나 오브젝트 찾기
        const interactRange = 50;
        
        if (this.scene.npcs) {
            this.scene.npcs.children.entries.forEach(npcSprite => {
                const distance = Phaser.Math.Distance.Between(
                    this.sprite.x, this.sprite.y,
                    npcSprite.x, npcSprite.y
                );
                
                if (distance < interactRange && npcSprite.npc) {
                    npcSprite.npc.interact(this);
                }
            });
        }
    }
    
    openInventory() {
        if (this.scene.inventoryUI) {
            this.scene.inventoryUI.toggle();
        } else {
            console.log('인벤토리:', this.inventory);
        }
    }
    
    addItem(item) {
        if (this.inventory.items.length < this.inventory.maxSlots) {
            this.inventory.items.push(item);
            console.log(`아이템 획득: ${item.name}`);
            return true;
        }
        console.log('인벤토리가 가득 찼습니다!');
        return false;
    }
    
    addGold(amount) {
        this.inventory.gold += amount;
        console.log(`골드 획득: ${amount}G`);
    }
    
    addExp(amount) {
        this.stats.exp += amount;
        
        while (this.stats.exp >= this.stats.expToLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.stats.level++;
        this.stats.exp -= this.stats.expToLevel;
        this.stats.expToLevel = Math.floor(this.stats.expToLevel * 1.5);
        
        // 스탯 증가
        this.stats.maxHp += 20;
        this.stats.hp = this.stats.maxHp;
        this.stats.attackPower += 5;
        
        console.log(`레벨 업! Lv.${this.stats.level}`);
        
        // UI 업데이트
        if (this.scene.updateUI) {
            this.scene.updateUI();
        }
    }
    
    takeDamage(amount) {
        this.stats.hp = Math.max(0, this.stats.hp - amount);
        
        // 피격 이펙트
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.sprite.clearTint();
        });
        
        if (this.stats.hp <= 0) {
            this.die();
        }
        
        // UI 업데이트
        if (this.scene.updateUI) {
            this.scene.updateUI();
        }
    }
    
    heal(amount) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
        
        // 회복 이펙트
        this.sprite.setTint(0x00ff00);
        this.scene.time.delayedCall(200, () => {
            this.sprite.clearTint();
        });
        
        // UI 업데이트
        if (this.scene.updateUI) {
            this.scene.updateUI();
        }
    }
    
    die() {
        this.state.isDead = true;
        this.sprite.body.setVelocity(0, 0);
        
        // 사망 애니메이션
        this.sprite.setTint(0x666666);
        this.sprite.setAlpha(0.5);
        
        // 게임 오버
        this.scene.time.delayedCall(1000, () => {
            this.scene.gameOver();
        });
    }
}
