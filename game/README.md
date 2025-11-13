# 🎮 Pixel Crawler

[![Live Demo](https://img.shields.io/badge/Play-Live%20Demo-brightgreen)](https://mahyun-dev.github.io/PixelCrawler/game/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

2D 픽셀 아트 탑다운 액션 RPG / 로그라이크 웹 게임

![Pixel Crawler Screenshot](https://img.itch.zone/aW1nLzIwMDY3NTc3LnBuZw==/original/mG4zBn.png)

## 🌟 주요 기능

### ✅ 구현 완료
- ✨ **탑다운 액션 전투**: 실시간 전투와 다양한 공격 패턴
- 🗺️ **랜덤 던전 생성**: 로그라이크 스타일의 무한 던전
- 🎭 **캐릭터 애니메이션**: Pixel Crawler 스프라이트 애니메이션 적용
- 👾 **몬스터 AI**: 8종의 몬스터 (Orc/Skeleton 계열)
- ⚔️ **전투 시스템**: 공격, 피격, 사망 애니메이션
- 📈 **성장 시스템**: 레벨업, 스탯 강화, 경험치
- 🎒 **인벤토리**: 아이템 관리 UI
- 💬 **NPC 시스템**: 대화 및 상점 기능
- 💰 **상점**: 아이템 구매/판매
- 💾 **로컬 저장**: 게임 진행 상황 저장

### 🔜 향후 계획
- 🌾 **농사 시스템**: 작물 재배와 수확
- 🎵 **사운드**: BGM 및 효과음
- 📱 **모바일 최적화**: 터치 컨트롤
- 🌐 **멀티플레이**: 협동 플레이 (Firebase 연동)

## 🎮 게임 방법

### 조작법
- **WASD**: 캐릭터 이동
- **SPACE**: 공격
- **E**: NPC와 상호작용
- **I**: 인벤토리 열기
- **ESC**: 일시정지/메뉴

### 게임 목표
1. 랜덤 생성 던전 탐험
2. 몬스터 처치 및 경험치 획득
3. 레벨업으로 캐릭터 강화
4. NPC에게서 아이템 구매
5. 더 강한 몬스터 도전!

## 🛠️ 기술 스택

- **Phaser 3** (v3.70.0) - 2D 게임 엔진
- **JavaScript ES6+** - 모듈 기반 게임 로직
- **HTML5 Canvas** - 렌더링
- **LocalStorage** - 게임 저장
- **GitHub Pages** - 무료 호스팅

## 📁 프로젝트 구조

```
game/
├── index.html              # 메인 HTML
├── assets/
│   └── css/
│       └── style.css       # 픽셀 아트 최적화 스타일
├── src/
│   ├── main.js             # 게임 초기화
│   ├── scenes/             # 게임 씬
│   │   ├── BootScene.js    # 리소스 로딩
│   │   ├── MenuScene.js    # 메인 메뉴
│   │   └── GameScene.js    # 게임 플레이
│   ├── entities/           # 게임 엔티티
│   │   ├── Player.js       # 플레이어 (애니메이션, 전투, 인벤토리)
│   │   ├── Monster.js      # 몬스터 AI 및 전투
│   │   └── NPC.js          # NPC 대화 및 상점
│   ├── systems/            # 게임 시스템
│   │   ├── ResourceLoader.js  # 자동 리소스 로딩
│   │   └── DungeonGenerator.js # 랜덤 던전 생성
│   └── ui/                 # UI 컴포넌트
│       └── InventoryUI.js  # 인벤토리 인터페이스
└── Pixel-Crawler-Pack/     # 게임 리소스 (Anokolisa)
```

## 🚀 로컬 실행

### [여기를 클릭하여 실행하기](https://mahyun-dev.github.io/PixelCrawler/game)

### 1. 저장소 클론
```bash
git clone https://github.com/mahyun-dev/PixelCrawler.git
cd PixelCrawler
```

### 2. 로컬 서버 실행
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000

# VS Code Live Server 확장 사용 가능
```

### 3. 브라우저 접속
```
http://localhost:8000/game/
```

## 🎨 리소스 크레딧

게임 그래픽: **[Pixel Crawler - Free Pack](https://anokolisa.itch.io/)** by **[Anokolisa](https://www.patreon.com/Anokolisa)**

### 라이선스
- ✅ 상업적 사용 가능
- ✅ 수정/변경 가능
- ✅ 크레딧 표시 권장
- ❌ 에셋 자체 재판매 불가

## 🎯 게임 시스템 세부 사항

### 플레이어 시스템
- **14가지 애니메이션**: Idle, Walk, Run, Attack, Hit, Death 등
- **스탯**: HP, Attack Power, Speed, Level, EXP
- **인벤토리**: 최대 20슬롯
- **전투**: 방향별 공격, 히트박스 판정

### 몬스터 시스템
| 몬스터 | HP | 공격력 | 속도 | 경험치 | 골드 |
|--------|-----|--------|------|---------|------|
| Orc | 50 | 10 | 80 | 25 | 10 |
| Orc Rogue | 40 | 15 | 120 | 30 | 15 |
| Orc Shaman | 35 | 20 | 60 | 35 | 20 |
| Orc Warrior | 80 | 18 | 70 | 40 | 25 |
| Skeleton | 30 | 8 | 90 | 20 | 8 |
| Skeleton Mage | 25 | 25 | 70 | 35 | 18 |
| Skeleton Rogue | 28 | 12 | 110 | 28 | 12 |
| Skeleton Warrior | 60 | 15 | 80 | 38 | 22 |

### NPC 시스템
- **Knight (기사)**: 무기와 갑옷 판매
- **Rogue (도적)**: 특수 아이템 및 정보
- **Wizard (마법사)**: 마법 아이템 및 포션

### 던전 생성
- 50x50 타일 맵
- 5-10개의 랜덤 방
- 복도로 연결된 구조
- 몬스터 5-10마리 스폰
- NPC 2마리 배치

## 📊 개발 로드맵

### Phase 1 ✅ (완료)
- [x] 프로젝트 구조 및 Phaser 설정
- [x] 리소스 로딩 시스템
- [x] 플레이어 애니메이션 및 이동
- [x] 메뉴 시스템

### Phase 2 ✅ (완료)
- [x] 랜덤 던전 생성
- [x] 몬스터 AI 및 전투 시스템
- [x] 경험치 및 레벨업
- [x] 아이템 드롭

### Phase 3 ✅ (완료)
- [x] 인벤토리 UI
- [x] NPC 대화 시스템
- [x] 상점 기능
- [x] 게임 저장/불러오기

### Phase 4 🚧 (진행 예정)
- [ ] 농사 시스템
- [ ] 다양한 무기/갑옷
- [ ] 퀘스트 시스템
- [ ] BGM 및 효과음

### Phase 5 📅 (장기 계획)
- [ ] 보스 몬스터
- [ ] 던전 층수 시스템
- [ ] 모바일 최적화
- [ ] 멀티플레이 (Firebase)

## 🐛 알려진 이슈

- [ ] 스프라이트 로딩 경로 확인 필요
- [ ] 몬스터 충돌 판정 개선 필요
- [ ] 인벤토리 아이템 사용 기능 미구현

## 🤝 기여하기

버그 리포트나 기능 제안은 [Issues](https://github.com/mahyun-dev/PixelCrawler/issues)에 등록해 주세요!

### 개발 환경 설정
```bash
git clone https://github.com/mahyun-dev/PixelCrawler.git
cd PixelCrawler
# 로컬 서버 실행
python -m http.server 8000
```

## 📝 라이선스

게임 코드: **MIT License**

게임 리소스: **Pixel Crawler - Free Pack by Anokolisa**

## 📧 연락처

프로젝트 관련 문의: [GitHub Issues](https://github.com/mahyun-dev/PixelCrawler/issues)

---

**Made with ❤️ and Phaser 3**

⭐ 이 프로젝트가 마음에 드신다면 Star를 눌러주세요!
