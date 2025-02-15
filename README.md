# Movie Community Project

## 🚀 시작하기

### 설치 및 실행
1. 프로젝트 클론
```bash
git clone [repository URL]
cd movieapp
```

2. 의존성 패키지 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm start
```
- 브라우저에서 http://localhost:3000 으로 접속하여 확인할 수 있습니다.

## 🛠 사용 기술

### Frontend
- **React** 
  - SPA(Single Page Application) 구현
  - Component 기반 개발
  - React Router DOM을 활용한 라우팅
  - React Bootstrap을 활용한 UI 구현

### 주요 라이브러리
- **Bootstrap** 
  - 반응형 웹 디자인
  - Grid 시스템 활용
  - UI 컴포넌트 활용

- **Axios**
  - HTTP 통신 라이브러리
  - RESTful API 연동
  - 비동기 통신 처리

## 📦 프로젝트 구조
```
src/
├── api/          # API 통신 모듈
├── components/   # 재사용 컴포넌트
├── context/      # 전역 상태 관리
├── hooks/        # 커스텀 훅
├── pages/        # 페이지 컴포넌트
└── styles/       # CSS 스타일
```

## 🚀 주요 기능

### 1. 영화 서비스
- 홈 페이지 (Home.js)
  - 현재 상영작 배너
  - 평점 TOP 5 영화
  - 최신 영화 목록
  - 통합 검색 기능
    - 영화 제목
    - 배우
    - 감독

- 인기 영화 (TopMovies.js)
  - 평점 기준 TOP 10 영화
  - 영화 포스터 및 상세 정보
  - 호버 효과로 상세 정보 확인
  - 클릭 시 상세 페이지로 이동

### 2. 영화 예매 시스템
- 현재 상영작 (NowPlaying.js)
  - 현재 상영중인 영화 목록 표시
  - 날짜별 예매 시스템 (7일)
  - 영화 상세 정보 표시
  - 시간대별 예매 버튼

- 좌석 예매 (Booking.js)
  - 좌석 선택 시스템 (A~D열, 1~10번)
  - 실시간 예매 정보 표시
  - 결제 처리 시스템

### 3. 커뮤니티 시스템
- 게시판 목록 (CommunityBoard.js)
  - 게시글 목록 표시 (제목, 작성자, 작성일, 조회수, 추천수)
  - 페이지네이션 구현 (15개씩 표시)
  - 검색 기능 (제목/내용/제목+내용/작성자)
  - 로그인 사용자만 글쓰기 가능

- 게시글 상세 (CommunityDetail.js)
  - 게시글 정보 표시
  - 이미지 첨부 파일 표시
  - 좋아요 및 팔로우 기능
  - 댓글 시스템 (작성/수정/삭제)
  - 게시글 관리 (수정/삭제)

### 4. 회원 관리 시스템
- 마이페이지 (MyPage.js)
  - 회원 정보 관리 (조회/수정/탈퇴)
  - 팔로우 관리 (팔로잉/팔로워)
  - 활동 내역
    - 좋아요한 게시글 목록
    - 찜한 영화 목록
    - 현재/지난 예매 내역

- 유저 프로필 (UserProfile.js)
  - 사용자 기본 정보 표시
  - 팔로우/언팔로우 기능
  - 활동 내역 조회
    - 작성 게시글 목록
    - 팔로워/팔로잉 목록

### 5. 관리자 시스템
- 관리자 페이지(AdminUserManage.js)
  - 관리자 계정 추가 
  - 사용자회원계정 관리 (조회/삭제)
- 게시글 상세 (CommunityDetail.js)
  - 모든 게시글/댓글 삭제 권한 부여
- 영화 상세(MovieDetail.js)
  - 모든 리뷰 삭제 권한 부여  


