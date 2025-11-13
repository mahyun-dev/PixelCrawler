// 던전 생성 시스템
export class DungeonGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.rooms = [];
        this.corridors = [];
        this.tiles = [];
    }

    generate() {
        // 타일 맵 초기화 (벽으로 채우기)
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = 1; // 1 = 벽
            }
        }

        // 방 생성
        const roomCount = Phaser.Math.Between(5, 10);
        for (let i = 0; i < roomCount; i++) {
            this.createRoom();
        }

        // 방들을 복도로 연결
        for (let i = 0; i < this.rooms.length - 1; i++) {
            this.connectRooms(this.rooms[i], this.rooms[i + 1]);
        }

        return this.tiles;
    }

    createRoom() {
        const roomWidth = Phaser.Math.Between(4, 10);
        const roomHeight = Phaser.Math.Between(4, 10);
        const x = Phaser.Math.Between(1, this.width - roomWidth - 1);
        const y = Phaser.Math.Between(1, this.height - roomHeight - 1);

        const room = { x, y, width: roomWidth, height: roomHeight };

        // 겹치는 방 체크
        let overlaps = false;
        for (let existingRoom of this.rooms) {
            if (this.roomsOverlap(room, existingRoom)) {
                overlaps = true;
                break;
            }
        }

        if (!overlaps) {
            // 방을 타일맵에 추가
            for (let ry = room.y; ry < room.y + room.height; ry++) {
                for (let rx = room.x; rx < room.x + room.width; rx++) {
                    this.tiles[ry][rx] = 0; // 0 = 바닥
                }
            }
            this.rooms.push(room);
        }
    }

    roomsOverlap(room1, room2) {
        return (
            room1.x < room2.x + room2.width + 1 &&
            room1.x + room1.width + 1 > room2.x &&
            room1.y < room2.y + room2.height + 1 &&
            room1.y + room1.height + 1 > room2.y
        );
    }

    connectRooms(room1, room2) {
        const center1 = {
            x: Math.floor(room1.x + room1.width / 2),
            y: Math.floor(room1.y + room1.height / 2)
        };
        const center2 = {
            x: Math.floor(room2.x + room2.width / 2),
            y: Math.floor(room2.y + room2.height / 2)
        };

        // 수평 복도
        const startX = Math.min(center1.x, center2.x);
        const endX = Math.max(center1.x, center2.x);
        for (let x = startX; x <= endX; x++) {
            if (this.tiles[center1.y]) {
                this.tiles[center1.y][x] = 0;
            }
        }

        // 수직 복도
        const startY = Math.min(center1.y, center2.y);
        const endY = Math.max(center1.y, center2.y);
        for (let y = startY; y <= endY; y++) {
            if (this.tiles[y]) {
                this.tiles[y][center2.x] = 0;
            }
        }
    }

    getSpawnPosition() {
        if (this.rooms.length > 0) {
            const room = this.rooms[0];
            return {
                x: (room.x + Math.floor(room.width / 2)) * 32,
                y: (room.y + Math.floor(room.height / 2)) * 32
            };
        }
        return { x: 400, y: 300 };
    }

    getRandomRoomPosition(excludeFirst = false) {
        const startIndex = excludeFirst ? 1 : 0;
        if (this.rooms.length > startIndex) {
            const room = this.rooms[Phaser.Math.Between(startIndex, this.rooms.length - 1)];
            return {
                x: (room.x + Phaser.Math.Between(1, room.width - 2)) * 32,
                y: (room.y + Phaser.Math.Between(1, room.height - 2)) * 32
            };
        }
        return { x: 400, y: 300 };
    }
}
