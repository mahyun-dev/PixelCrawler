# Pixel Crawler

2D 픽셀 아트 탑다운 액션 RPG / 로그라이크 웹 게임

## 🎮 게임 소개

Pixel Crawler는 브라우저에서 플레이할 수 있는 2D 픽셀 아트 스타일의 액션 RPG 게임입니다. 랜덤 생성 던전을 탐험하고, 몬스터와 전투하며, 아이템을 수집하고 캐릭터를 성장시키세요.

## 🌟 주요 기능

- ✅ **탑다운 액션 전투**: 실시간 전투와 다양한 공격 패턴
- ✅ **로그라이크 요소**: 랜덤 생성 던전과 퍼머데스
- ✅ **캐릭터 성장**: 레벨업, 스탯 강화, 스킬 시스템
- ✅ **농사 시스템**: 작물 재배와 수확
- ✅ **로컬 저장**: 브라우저에 게임 진행 상황 저장
- 🔜 **멀티플레이**: 향후 추가 예정

## 🛠️ 기술 스택

- **Phaser 3**: 2D 게임 엔진
- **JavaScript (ES6+)**: 게임 로직
- **HTML5 & CSS3**: UI 및 스타일링
- **LocalStorage**: 게임 저장 시스템

## 🎨 리소스

게임 그래픽은 [Anokolisa](https://www.patreon.com/Anokolisa)의 **Pixel Crawler - Free Pack**을 사용합니다.

## 📁 프로젝트 구조

```
game/
├── index.html              # 메인 HTML 파일
├── assets/
│   └── css/
│       └── style.css       # 스타일시트
├── src/
│   ├── main.js             # 게임 초기화 및 설정
│   ├── scenes/             # 게임 씬들
│   │   ├── BootScene.js    # 리소스 로딩
│   │   ├── MenuScene.js    # 메인 메뉴
│   │   └── GameScene.js    # 게임 플레이
│   ├── entities/           # 게임 엔티티
│   │   └── Player.js       # 플레이어
│   ├── systems/            # 게임 시스템
│   │   └── ResourceLoader.js  # 리소스 로더
│   └── ui/                 # UI 컴포넌트
└── Pixel Crawler - Free Pack/  # 게임 리소스
```

## 🚀 시작하기

### 로컬 실행

1. 저장소 클론
```bash
git clone https://github.com/YOUR_USERNAME/pixel-crawler.git
cd pixel-crawler
```

2. 로컬 서버 실행
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 사용)
npx http-server -p 8000
```

3. 브라우저에서 접속
```
http://localhost:8000/game/
```

### GitHub Pages 배포

1. GitHub 저장소 생성
2. 코드 푸시
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. Settings → Pages에서 배포 설정
   - Source: `main` branch
   - Folder: `/game` (또는 루트)

4. 배포 완료 후 `https://YOUR_USERNAME.github.io/pixel-crawler/game/` 에서 접속

## 🎮 조작법

- **WASD**: 이동
- **SPACE**: 공격
- **E**: 상호작용
- **I**: 인벤토리
- **ESC**: 메뉴/일시정지

## 📋 개발 로드맵

### 1단계 (현재) ✅
- [x] 프로젝트 구조 설정
- [x] 리소스 로딩 시스템
- [x] 기본 플레이어 이동 및 조작
- [x] 메뉴 씬 구현

### 2단계 (진행 예정)
- [ ] 타일맵 및 던전 생성 시스템
- [ ] 몬스터 AI 및 전투 시스템
- [ ] 아이템 및 인벤토리 시스템
- [ ] UI/HUD 완성

### 3단계 (향후 계획)
- [ ] 농사 시스템
- [ ] NPC 및 퀘스트
- [ ] 사운드 및 음악
- [ ] 추가 콘텐츠 (몬스터, 아이템, 던전)

### 4단계 (장기 계획)
- [ ] 멀티플레이 기능 (Firebase 연동)
- [ ] 랭킹 시스템
- [ ] 모바일 최적화

## 📝 라이선스

게임 코드: MIT License

게임 리소스: [Pixel Crawler - Free Pack by Anokolisa](https://anokolisa.itch.io/)
- 상업적 사용 가능
- 수정 가능
- 에셋 자체 재판매 불가

## 👥 기여

버그 리포트나 기능 제안은 Issues에 등록해 주세요!

## 📧 연락처

프로젝트 관련 문의: [GitHub Issues](https://github.com/YOUR_USERNAME/pixel-crawler/issues)

---

**Made with ❤️ and Phaser 3**
