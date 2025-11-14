// 리소스 자동 로딩 시스템
export class ResourceLoader {
    constructor(scene) {
        this.scene = scene;
        // game 폴더 내부의 Pixel-Crawler-Pack 사용
        this.basePath = 'Pixel-Crawler-Pack';
    }

    // 캐릭터 애니메이션 로드
    loadCharacterAnimations() {
        const animations = [
            { folder: 'Idle_Base', prefix: 'Idle', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Walk_Base', prefix: 'Walk', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Run_Base', prefix: 'Run', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Slice_Base', prefix: 'Slice', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Pierce_Base', prefix: 'Pierce', directions: ['Down', 'Side', 'Top'] },
            { folder: 'Crush_Base', prefix: 'Crush', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Hit_Base', prefix: 'Hit', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Death_Base', prefix: 'Death', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Carry_Idle', prefix: 'Carry_Idle', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Carry_Walk', prefix: 'Carry_Walk', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Carry_Run', prefix: 'Carry_Run', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Collect_Base', prefix: 'Collect', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Fishing_Base', prefix: 'Fishing', directions: ['Down', 'Side', 'Up'] },
            { folder: 'Watering_Base', prefix: 'Watering', directions: ['Down', 'Side', 'Up'] }
        ];

        animations.forEach(anim => {
            anim.directions.forEach(dir => {
                const key = `player_${anim.folder}_${dir}`;
                const path = `${this.basePath}/Entities/Characters/Body_A/Animations/${anim.folder}/${anim.prefix}_${dir}-Sheet.png`;
                this.scene.load.spritesheet(key, path, {
                    frameWidth: 48,
                    frameHeight: 48
                });
            });
        });
    }

    // 몬스터 로드
    loadMonsters() {
        const mobs = [
            { name: 'Orc', path: 'Orc Crew/Orc' },
            { name: 'OrcRogue', path: 'Orc Crew/Orc - Rogue' },
            { name: 'OrcShaman', path: 'Orc Crew/Orc - Shaman' },
            { name: 'OrcWarrior', path: 'Orc Crew/Orc - Warrior' },
            { name: 'Skeleton', path: 'Skeleton Crew/Skeleton - Base' },
            { name: 'SkeletonMage', path: 'Skeleton Crew/Skeleton - Mage' },
            { name: 'SkeletonRogue', path: 'Skeleton Crew/Skeleton - Rogue' },
            { name: 'SkeletonWarrior', path: 'Skeleton Crew/Skeleton - Warrior' }
        ];

        const states = ['Idle', 'Run', 'Death'];

        mobs.forEach(mob => {
            states.forEach(state => {
                const key = `mob_${mob.name}_${state}`;
                const path = `${this.basePath}/Entities/Mobs/${mob.path}/${state}/${state}-Sheet.png`;
                this.scene.load.spritesheet(key, path, {
                    frameWidth: 48,
                    frameHeight: 48
                });
            });
        });
    }

    // NPC 로드
    loadNPCs() {
        const npcs = ['Knight', 'Rogue', 'Wizzard'];
        const states = ['Idle', 'Run', 'Death'];

        npcs.forEach(npc => {
            states.forEach(state => {
                const key = `npc_${npc}_${state}`;
                const path = `${this.basePath}/Entities/Npc's/${npc}/${state}/${state}-Sheet.png`;
                this.scene.load.spritesheet(key, path, {
                    frameWidth: 48,
                    frameHeight: 48
                });
            });
        });
    }

    // 환경 오브젝트 로드
    loadEnvironment() {
        const props = [
            'Dungeon_Props', 'Esoteric', 'Farm', 'Furniture',
            'Meat', 'Pan', 'Resources', 'Rocks', 'Shadows',
            'Tools', 'Vegetation'
        ];

        props.forEach(prop => {
            const key = `env_${prop}`;
            const path = `${this.basePath}/Environment/Props/Static/${prop}.png`;
            this.scene.load.image(key, path);
        });

        // 애니메이션 오브젝트
        for (let i = 1; i <= 5; i++) {
            const key = `env_Pan_0${i}`;
            const num = i < 10 ? `0${i}` : `${i}`;
            const path = `${this.basePath}/Environment/Props/Animated/Pan_${num}-Sheet.png`;
            this.scene.load.spritesheet(key, path, {
                frameWidth: 16,
                frameHeight: 16
            });
        }
    }

    // 타일셋 로드
    loadTilesets() {
        const tilesets = [
            'Dungeon_Tiles', 'Floors_Tiles', 'Wall_Tiles',
            'Wall_Variations', 'Water_tiles'
        ];

        tilesets.forEach(tileset => {
            const key = `tileset_${tileset}`;
            const path = `${this.basePath}/Environment/Tilesets/${tileset}.png`;
            this.scene.load.image(key, path);
        });
    }

    // 건물 구조물 로드
    loadBuildings() {
        const buildings = ['Floors', 'Props', 'Roofs', 'Shadows', 'Walls'];

        buildings.forEach(building => {
            const key = `building_${building}`;
            const path = `${this.basePath}/Environment/Structures/Buildings/${building}.png`;
            this.scene.load.image(key, path);
        });
    }

    // 무기 로드
    loadWeapons() {
        const weapons = ['Bone', 'Hands', 'Wood'];

        weapons.forEach(weapon => {
            const key = `weapon_${weapon}`;
            const path = `${this.basePath}/Weapons/${weapon}/${weapon}.png`;
            this.scene.load.image(key, path);
        });
    }

    // 모든 리소스 로드
    loadAll() {
        this.loadCharacterAnimations();
        this.loadMonsters();
        this.loadNPCs();
        this.loadEnvironment();
        this.loadTilesets();
        this.loadBuildings();
        this.loadWeapons();
    }
}
