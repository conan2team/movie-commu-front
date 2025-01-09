// 유저 데이터
export const users = [
  {
    userId: 1,
    id: "moviefan1",
    password: "hashedpw1",
    role: "USER"
  },
  {
    userId: 2,
    id: "moviemania",
    password: "hashedpw2",
    role: "USER"
  },
  {
    userId: 3,
    id: "cinephile",
    password: "hashedpw3",
    role: "USER"
  },
  {
    userId: 4,
    id: "admin",
    password: "adminpw",
    role: "ADMIN"
  },
  {
    userId: 5,
    id: "filmcritic",
    password: "hashedpw5",
    role: "USER"
  },
  {
    userId: 6,
    id: "movielover",
    password: "hashedpw6",
    role: "USER"
  }
];

// 게시판 데이터
export const boards = [
  {
    boardId: 1,
    userId: 1,
    title: "인생 영화 추천 부탁드립니다",
    content: "요즘 재미있는 영화 없나요? 추천 부탁드립니다!",
    created: "2024-03-15",
    cnt: 45,
    like: 12
  },
  {
    boardId: 2,
    userId: 2,
    title: "올해 기대되는 영화들",
    content: "2024년에 개봉 예정인 기대작들을 공유해요.",
    created: "2024-03-14",
    cnt: 67,
    like: 23
  },
  {
    boardId: 3,
    userId: 3,
    title: "영화 '오펜하이머' 후기",
    content: "오펜하이머 진짜 대단한 영화네요...",
    created: "2024-03-13",
    cnt: 89,
    like: 34
  },
  {
    boardId: 4,
    userId: 4,
    title: "듄 파트2 기대됩니다",
    content: "3월 개봉하는 듄 파트2 기대가 너무 큽니다.",
    created: "2024-03-12",
    cnt: 56,
    like: 18
  },
  {
    boardId: 5,
    userId: 5,
    title: "최고의 애니메이션 영화 추천",
    content: "어린 시절의 애니메이션 영화 중 어떤 것이 가장 좋았나요?",
    created: "2024-03-11",
    cnt: 30,
    like: 10
  },
  {
    boardId: 6,
    userId: 6,
    title: "영화 OST 추천",
    content: "좋아하는 영화의 OST를 공유해요!",
    created: "2024-03-10",
    cnt: 25,
    like: 8
  },
  {
    boardId: 7,
    userId: 1,
    title: "영화관에서의 경험",
    content: "최근에 영화관에서 본 영화에 대한 경험을 나눠요.",
    created: "2024-03-09",
    cnt: 40,
    like: 15
  },
  {
    boardId: 8,
    userId: 2,
    title: "영화 속 명대사",
    content: "가장 기억에 남는 영화 속 명대사를 공유해요.",
    created: "2024-03-08",
    cnt: 20,
    like: 12
  },
  {
    boardId: 9,
    userId: 3,
    title: "영화 리뷰 작성하기",
    content: "최근에 본 영화에 대한 리뷰를 작성해보세요.",
    created: "2024-03-07",
    cnt: 35,
    like: 18
  },
  {
    boardId: 10,
    userId: 4,
    title: "영화 추천 시스템",
    content: "어떤 영화 추천 시스템을 사용하고 있나요?",
    created: "2024-03-06",
    cnt: 28,
    like: 9
  },
  {
    boardId: 11,
    userId: 5,
    title: "영화 속 캐릭터 분석",
    content: "가장 좋아하는 영화 캐릭터에 대해 이야기해요.",
    created: "2024-03-05",
    cnt: 22,
    like: 11
  },
  {
    boardId: 12,
    userId: 6,
    title: "영화 촬영지 여행",
    content: "가고 싶은 영화 촬영지에 대해 이야기해요.",
    created: "2024-03-04",
    cnt: 15,
    like: 7
  },
  {
    boardId: 13,
    userId: 1,
    title: "영화 속 패션",
    content: "영화 속에서 인상 깊었던 패션을 공유해요.",
    created: "2024-03-03",
    cnt: 18,
    like: 10
  },
  {
    boardId: 14,
    userId: 2,
    title: "영화 시리즈 추천",
    content: "좋아하는 영화 시리즈를 추천해 주세요.",
    created: "2024-03-02",
    cnt: 27,
    like: 14
  },
  {
    boardId: 15,
    userId: 3,
    title: "영화 속 음악",
    content: "영화에서 가장 감명 깊었던 음악은 무엇인가요?",
    created: "2024-03-01",
    cnt: 20,
    like: 8
  },
  {
    boardId: 16,
    userId: 4,
    title: "영화 속 음식",
    content: "영화에서 보고 먹고 싶었던 음식은 무엇인가요?",
    created: "2024-02-28",
    cnt: 12,
    like: 5
  },
  {
    boardId: 17,
    userId: 5,
    title: "영화의 메시지",
    content: "가장 인상 깊었던 영화의 메시지는 무엇인가요?",
    created: "2024-02-27",
    cnt: 30,
    like: 13
  },
  {
    boardId: 18,
    userId: 6,
    title: "영화 속 여행지",
    content: "영화에서 본 아름다운 여행지를 공유해요.",
    created: "2024-02-26",
    cnt: 25,
    like: 9
  },
  {
    boardId: 19,
    userId: 1,
    title: "영화의 역사",
    content: "영화의 역사에 대해 이야기해보세요.",
    created: "2024-02-25",
    cnt: 18,
    like: 7
  },
  {
    boardId: 20,
    userId: 2,
    title: "영화의 미래",
    content: "영화 산업의 미래에 대해 어떻게 생각하시나요?",
    created: "2024-02-24",
    cnt: 22,
    like: 11
  }
];

// 댓글 데이터
export const comments = [
  {
    commentId: 1,
    userId: 2,
    boardId: 1,
    content: "저는 인셉션 추천드립니다!",
    created: "2024-03-15"
  },
  {
    commentId: 2,
    userId: 3,
    boardId: 1,
    content: "인터스텔라도 좋아요",
    created: "2024-03-15"
  },
  {
    commentId: 3,
    userId: 1,
    boardId: 2,
    content: "올해 기대되는 영화가 많네요!",
    created: "2024-03-14"
  },
  {
    commentId: 4,
    userId: 4,
    boardId: 2,
    content: "저는 '듄'이 기대됩니다.",
    created: "2024-03-14"
  },
  {
    commentId: 5,
    userId: 5,
    boardId: 3,
    content: "오펜하이머 정말 대단했어요!",
    created: "2024-03-13"
  },
  {
    commentId: 6,
    userId: 6,
    boardId: 3,
    content: "역사적인 영화네요.",
    created: "2024-03-13"
  },
  {
    commentId: 7,
    userId: 1,
    boardId: 4,
    content: "듄 파트2 기대돼요!",
    created: "2024-03-12"
  },
  {
    commentId: 8,
    userId: 2,
    boardId: 4,
    content: "3월 개봉이라니 빨리 보고 싶어요.",
    created: "2024-03-12"
  },
  {
    commentId: 9,
    userId: 3,
    boardId: 5,
    content: "어린 시절 애니메이션 영화는 정말 소중하죠.",
    created: "2024-03-11"
  },
  {
    commentId: 10,
    userId: 4,
    boardId: 5,
    content: "저는 '라이온 킹'이 가장 좋았어요.",
    created: "2024-03-11"
  },
  {
    commentId: 11,
    userId: 5,
    boardId: 6,
    content: "영화 OST는 감정이 담겨있죠.",
    created: "2024-03-10"
  },
  {
    commentId: 12,
    userId: 6,
    boardId: 6,
    content: "좋아하는 OST가 많아요!",
    created: "2024-03-10"
  },
  {
    commentId: 13,
    userId: 1,
    boardId: 7,
    content: "영화관에서의 경험은 항상 특별해요.",
    created: "2024-03-09"
  },
  {
    commentId: 14,
    userId: 2,
    boardId: 7,
    content: "최근에 본 영화는 정말 좋았어요.",
    created: "2024-03-09"
  },
  {
    commentId: 15,
    userId: 3,
    boardId: 8,
    content: "영화 속 명대사는 잊을 수 없죠.",
    created: "2024-03-08"
  },
  {
    commentId: 16,
    userId: 4,
    boardId: 8,
    content: "가장 기억에 남는 대사는 '인셉션'의 대사입니다.",
    created: "2024-03-08"
  },
  {
    commentId: 17,
    userId: 5,
    boardId: 9,
    content: "최근에 본 영화 리뷰를 작성해볼게요.",
    created: "2024-03-07"
  },
  {
    commentId: 18,
    userId: 6,
    boardId: 9,
    content: "영화 리뷰는 항상 재미있어요.",
    created: "2024-03-07"
  },
  {
    commentId: 19,
    userId: 1,
    boardId: 10,
    content: "추천 시스템이 궁금해요.",
    created: "2024-03-06"
  },
  {
    commentId: 20,
    userId: 2,
    boardId: 10,
    content: "어떤 시스템을 사용하고 계신가요?",
    created: "2024-03-06"
  },
  {
    commentId: 21,
    userId: 3,
    boardId: 11,
    content: "좋아하는 캐릭터가 많아요.",
    created: "2024-03-05"
  },
  {
    commentId: 22,
    userId: 4,
    boardId: 11,
    content: "저는 '해리 포터'의 해리와 론이 좋아요.",
    created: "2024-03-05"
  },
  {
    commentId: 23,
    userId: 5,
    boardId: 12,
    content: "영화 촬영지 여행은 꿈이에요.",
    created: "2024-03-04"
  },
  {
    commentId: 24,
    userId: 6,
    boardId: 12,
    content: "가고 싶은 곳이 많아요.",
    created: "2024-03-04"
  },
  {
    commentId: 25,
    userId: 1,
    boardId: 13,
    content: "영화 속 패션은 항상 흥미로워요.",
    created: "2024-03-03"
  },
  {
    commentId: 26,
    userId: 2,
    boardId: 13,
    content: "특히 '그레이트 개츠비'의 패션이 인상적이었어요.",
    created: "2024-03-03"
  },
  {
    commentId: 27,
    userId: 3,
    boardId: 14,
    content: "좋아하는 영화 시리즈가 많아요.",
    created: "2024-03-02"
  },
  {
    commentId: 28,
    userId: 4,
    boardId: 14,
    content: "저는 '반지의 제왕' 시리즈가 최고입니다.",
    created: "2024-03-02"
  },
  {
    commentId: 29,
    userId: 5,
    boardId: 15,
    content: "영화 속 음악은 감정이 풍부하죠.",
    created: "2024-03-01"
  },
  {
    commentId: 30,
    userId: 6,
    boardId: 15,
    content: "특히 '타이타닉'의 음악이 기억에 남아요.",
    created: "2024-03-01"
  }
];

// 영화 데이터
export const movies = {
  1: {
    movieId: 1,
    title: "시네마 천국",
    des: "영화에 대한 사랑과 추억을 담은 명작.",
    star: 8.9,
    director: "주세페 토르나토레",
    created: "1988-11-17",
    isAge: 12,
    runningTime: 155,
    country: "이탈리아",
    genre: "드라마",
    casting: "필리프 누아레,살바토레 카시오",
    poster: "https://example.com/cinema-paradiso.jpg",
    onAir: 0
  },
  2: {
    movieId: 2,
    title: "쇼생크 탈출",
    des: "희망을 잃지 않은 한 남자의 감동적인 이야기...",
    star: 9.52,
    director: "프랭크 다라본트",
    created: "1994-09-23",
    isAge: 15,
    runningTime: 142,
    country: "미국",
    genre: "드라마",
    casting: "팀 로빈스,모건 프리먼",
    poster: "https://example.com/shawshank.jpg"
  },
  3: {
    movieId: 3,
    title: "대부",
    des: "마피아 가문의 이야기를 그린 갱스터 영화의 걸작...",
    star: 9.48,
    director: "프란시스 포드 코폴라",
    created: "1972-03-14",
    isAge: 18,
    runningTime: 175,
    country: "미국",
    genre: "범죄,드라마",
    casting: "말론 브란도,알 파치노",
    poster: "https://example.com/godfather.jpg"
  },
  4: {
    movieId: 4,
    title: "펄프 픽션",
    des: "로스앤젤레스를 배경으로 벌어지는 범죄 이야기...",
    star: 9.32,
    director: "쿠엔틴 타란티노",
    created: "1994-10-14",
    isAge: 18,
    runningTime: 154,
    country: "미국",
    genre: "범죄,드라마",
    casting: "존 트라볼타,사무엘 L. 잭슨,우마 서먼",
    poster: "https://example.com/pulp-fiction.jpg"
  },
  5: {
    movieId: 5,
    title: "인셉션",
    des: "꿈 속의 꿈을 탐험하는 이야기를 다룬 영화.",
    star: 8.8,
    director: "크리스토퍼 놀란",
    created: "2010-07-16",
    isAge: 15,
    runningTime: 148,
    country: "미국",
    genre: "액션,모험,SF",
    casting: "레오나르도 디카프리오,조셉 고든 레빗",
    poster: "https://example.com/inception.jpg"
  },
  6: {
    movieId: 6,
    title: "타이타닉",
    des: "사랑과 비극이 얽힌 타이타닉 호의 이야기.",
    star: 7.8,
    director: "제임스 카메론",
    created: "1997-12-19",
    isAge: 12,
    runningTime: 195,
    country: "미국",
    genre: "드라마,로맨스",
    casting: "레오나르도 디카프리오,케이트 윈슬렛",
    poster: "https://example.com/titanic.jpg",
    onAir: 1
  },
  7: {
    movieId: 7,
    title: "어벤져스: 엔드게임",
    des: "어벤져스가 타노스를 물리치기 위한 마지막 전투를 벌인다.",
    star: 8.4,
    director: "안소니 루소,조 루소",
    created: "2019-04-26",
    isAge: 12,
    runningTime: 181,
    country: "미국",
    genre: "액션,모험,SF",
    casting: "로버트 다우니 주니어,크리스 에반스",
    poster: "https://example.com/endgame.jpg",
    onAir: 1
  },
  8: {
    movieId: 8,
    title: "조커",
    des: "한 남자의 비극적인 변화를 그린 영화.",
    star: 8.5,
    director: "토드 필립스",
    created: "2019-10-04",
    isAge: 15,
    runningTime: 122,
    country: "미국",
    genre: "범죄,드라마,스릴러",
    casting: "호아킨 피닉스,로버트 드니로",
    poster: "https://example.com/joker.jpg",
    onAir: 1
  },
  9: {
    movieId: 9,
    title: "스파이더맨: 노 웨이 홈",
    des: "스파이더맨이 멀티버스를 탐험하는 이야기.",
    star: 8.7,
    director: "존 왓츠",
    created: "2021-12-17",
    isAge: 12,
    runningTime: 148,
    country: "미국",
    genre: "액션,모험,판타지",
    casting: "톰 홀랜드,제이콥 배덜론",
    poster: "https://example.com/spiderman.jpg",
    onAir: 1
  },
  10: {
    movieId: 10,
    title: "기생충",
    des: "부자 가족과 가난한 가족의 이야기를 다룬 영화.",
    star: 8.6,
    director: "봉준호",
    created: "2019-05-30",
    isAge: 15,
    runningTime: 132,
    country: "한국",
    genre: "드라마,스릴러",
    casting: "송강호,이선균",
    poster: "https://example.com/parasite.jpg",
    onAir: 0
  },
  11: {
    movieId: 11,
    title: "매트릭스",
    des: "가상 현실과 인간의 존재에 대한 질문을 던지는 영화.",
    star: 8.7,
    director: "라나 워쇼스키,릴리 워쇼스키",
    created: "1999-03-31",
    isAge: 15,
    runningTime: 136,
    country: "미국",
    genre: "액션,SF",
    casting: "키아누 리브스,로렌스 피시번",
    poster: "https://example.com/matrix.jpg"
  },
  12: {
    movieId: 12,
    title: "포레스트 검프",
    des: "한 남자의 인생을 통해 미국 현대사를 돌아보는 영화.",
    star: 8.8,
    director: "로버트 제메키스",
    created: "1994-07-06",
    isAge: 12,
    runningTime: 142,
    country: "미국",
    genre: "드라마,로맨스",
    casting: "톰 행크스,로빈 라이트",
    poster: "https://example.com/forrest-gump.jpg"
  },
  13: {
    movieId: 13,
    title: "스타워즈: 새로운 희망",
    des: "은하계를 구하기 위한 전투를 그린 SF 영화.",
    star: 8.6,
    director: "조지 루카스",
    created: "1977-05-25",
    isAge: 12,
    runningTime: 121,
    country: "미국",
    genre: "액션,모험,SF",
    casting: "마크 해밀,해리슨 포드",
    poster: "https://example.com/star-wars.jpg"
  },
  14: {
    movieId: 14,
    title: "인사이드 아웃",
    des: "소녀의 감정을 의인화한 애니메이션 영화.",
    star: 8.1,
    director: "피트 닥터",
    created: "2015-06-19",
    isAge: 0,
    runningTime: 95,
    country: "미국",
    genre: "애니메이션,가족,코미디",
    casting: "디나 스미스,빌 하이더",
    poster: "https://example.com/inside-out.jpg"
  }
};

// 리뷰 데이터
export const reviews = [
  {
    reviewId: 1,
    movieId: 1,
    userId: 1,
    content: "시네마 천국 정말 감동적이에요",
    star: 5,
    created: "2024-03-15",
    likes: 10,
    dislikes: 1
  },
  {
    reviewId: 2,
    movieId: 2,
    userId: 2,
    content: "쇼생크 탈출은 최고의 영화입니다",
    star: 5,
    created: "2024-03-14",
    likes: 15,
    dislikes: 2
  },
  {
    reviewId: 3,
    movieId: 1,
    userId: 3,
    content: "영화에 대한 사랑이 느껴지는 영화",
    star: 4,
    created: "2024-03-13",
    likes: 8,
    dislikes: 1
  },
  {
    reviewId: 4,
    movieId: 3,
    userId: 4,
    content: "대부는 정말 클래식한 영화입니다.",
    star: 5,
    created: "2024-03-12",
    likes: 12,
    dislikes: 0
  },
  {
    reviewId: 5,
    movieId: 4,
    userId: 5,
    content: "펄프 픽션의 스토리가 너무 흥미로웠어요.",
    star: 4,
    created: "2024-03-11",
    likes: 9,
    dislikes: 1
  },
  {
    reviewId: 6,
    movieId: 5,
    userId: 6,
    content: "인셉션은 정말 독창적인 아이디어의 영화입니다.",
    star: 5,
    created: "2024-03-10",
    likes: 20,
    dislikes: 2
  },
  {
    reviewId: 7,
    movieId: 6,
    userId: 1,
    content: "타이타닉은 언제 봐도 감동적입니다.",
    star: 5,
    created: "2024-03-09",
    likes: 15,
    dislikes: 0
  },
  {
    reviewId: 8,
    movieId: 7,
    userId: 2,
    content: "어벤져스: 엔드게임은 최고의 액션 영화입니다.",
    star: 5,
    created: "2024-03-08",
    likes: 18,
    dislikes: 3
  },
  {
    reviewId: 9,
    movieId: 8,
    userId: 3,
    content: "조커의 연기가 정말 인상적이었어요.",
    star: 4,
    created: "2024-03-07",
    likes: 14,
    dislikes: 1
  },
  {
    reviewId: 10,
    movieId: 9,
    userId: 4,
    content: "스파이더맨: 노 웨이 홈은 정말 재미있었습니다.",
    star: 5,
    created: "2024-03-06",
    likes: 22,
    dislikes: 2
  },
  {
    reviewId: 11,
    movieId: 10,
    userId: 5,
    content: "기생충은 사회적 메시지가 강한 영화입니다.",
    star: 5,
    created: "2024-03-05",
    likes: 19,
    dislikes: 1
  },
  {
    reviewId: 12,
    movieId: 11,
    userId: 6,
    content: "매트릭스는 정말 혁신적인 영화입니다.",
    star: 4,
    created: "2024-03-04",
    likes: 11,
    dislikes: 0
  },
  {
    reviewId: 13,
    movieId: 12,
    userId: 1,
    content: "포레스트 검프는 감동적인 이야기입니다.",
    star: 5,
    created: "2024-03-03",
    likes: 17,
    dislikes: 1
  },
  {
    reviewId: 14,
    movieId: 13,
    userId: 2,
    content: "스타워즈는 항상 저에게 특별한 영화입니다.",
    star: 5,
    created: "2024-03-02",
    likes: 13,
    dislikes: 0
  },
  {
    reviewId: 15,
    movieId: 14,
    userId: 3,
    content: "인사이드 아웃은 정말 감정적으로 다가오는 영화입니다.",
    star: 4,
    created: "2024-03-01",
    likes: 10,
    dislikes: 2
  },
  {
    reviewId: 16,
    movieId: 1,
    userId: 4,
    content: "시네마 천국은 언제나 제 마음속에 남아있습니다.",
    star: 5,
    created: "2024-02-28",
    likes: 12,
    dislikes: 1
  },
  {
    reviewId: 17,
    movieId: 2,
    userId: 5,
    content: "쇼생크 탈출은 정말 인상 깊은 영화입니다.",
    star: 5,
    created: "2024-02-27",
    likes: 14,
    dislikes: 0
  },
  {
    reviewId: 18,
    movieId: 3,
    userId: 6,
    content: "대부는 영화 역사에 길이 남을 작품입니다.",
    star: 5,
    created: "2024-02-26",
    likes: 16,
    dislikes: 1
  },
  {
    reviewId: 19,
    movieId: 4,
    userId: 1,
    content: "펄프 픽션은 정말 독특한 스토리입니다.",
    star: 4,
    created: "2024-02-25",
    likes: 8,
    dislikes: 2
  },
  {
    reviewId: 20,
    movieId: 5,
    userId: 2,
    content: "인셉션은 정말 놀라운 영화입니다.",
    star: 5,
    created: "2024-02-24",
    likes: 20,
    dislikes: 0
  }
];

// 유저 정보를 가져오는 헬퍼 함수
export const getUserById = (userId) => {
  return users.find(user => user.userId === userId);
};

// API 함수들
export const getHomeData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 평점순으로 정렬된 상위 10개 영화
      const topMovies = Object.values(movies)
        .sort((a, b) => b.star - a.star)
        .slice(0, 10);

      // 최신순으로 정렬된 상위 5개 영화
      const recentMovies = Object.values(movies)
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 5);

      // 최신 게시글 15개 (작성자 정보 포함)
      const recentPosts = Object.values(boards)  // boards가 배열이 아닌 경우를 위해 Object.values 사용
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 15)
        .map(post => ({
          ...post,
          author: getUserById(post.userId)?.id
        }));

      resolve({
        topMovies,
        recentMovies,
        recentPosts
      });
    }, 500);
  });
};

// 상영관 정보
export const halls = {
  1: { hallId: 1, name: '1관', price: 12000 },
  2: { hallId: 2, name: '2관', price: 12000 },
  3: { hallId: 3, name: '3관', price: 12000 }
};

// 상영 스케줄
export const schedules = [
  // 오늘 스케줄
  {
    scheduleId: 1,
    movieId: 6,  // 타이타닉
    hallId: 1,
    date: new Date().toISOString().split('T')[0], // 오늘 날짜
    startTime: '10:30',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 2,
    movieId: 6,
    hallId: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '13:30',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 3,
    movieId: 7,  // 어벤져스
    hallId: 2,
    date: new Date().toISOString().split('T')[0],
    startTime: '11:00',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  // 3월 21일 스케줄
  {
    scheduleId: 4,
    movieId: 6,
    hallId: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '11:00',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 5,
    movieId: 6,
    hallId: 2,
    date: new Date().toISOString().split('T')[0],
    startTime: '14:20',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 6,
    movieId: 7,
    hallId: 3,
    date: new Date().toISOString().split('T')[0],
    startTime: '16:45',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  // 3월 22일 스케줄
  {
    scheduleId: 7,
    movieId: 6,
    hallId: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '09:30',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 8,
    movieId: 7,
    hallId: 2,
    date: new Date().toISOString().split('T')[0],
    startTime: '12:15',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 9,
    movieId: 8,  // 조커
    hallId: 3,
    date: new Date().toISOString().split('T')[0],
    startTime: '15:00',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  // 3월 23일 스케줄
  {
    scheduleId: 10,
    movieId: 8,
    hallId: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 11,
    movieId: 7,
    hallId: 2,
    date: new Date().toISOString().split('T')[0],
    startTime: '13:30',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 12,
    movieId: 6,
    hallId: 3,
    date: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  // 3월 24일 스케줄
  {
    scheduleId: 13,
    movieId: 7,
    hallId: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '11:30',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 14,
    movieId: 8,
    hallId: 2,
    date: new Date().toISOString().split('T')[0],
    startTime: '14:45',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 15,
    movieId: 6,
    hallId: 3,
    date: new Date().toISOString().split('T')[0],
    startTime: '17:20',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  // 3월 25일 스케줄
  {
    scheduleId: 16,
    movieId: 8,
    hallId: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '10:15',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 17,
    movieId: 6,
    hallId: 2,
    date: new Date().toISOString().split('T')[0],
    startTime: '13:00',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  },
  {
    scheduleId: 18,
    movieId: 7,
    hallId: 3,
    date: new Date().toISOString().split('T')[0],
    startTime: '15:45',
    day: ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  }
];

// 좌석 예약 정보
export const reservations = [
  {
    reserveId: 1,
    scheduleId: 1,
    seatId: 'A1',
    userId: 1
  },
  // ... 예약된 좌석들
];

// 좌석 배치 정보 (A1-D10)
export const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D'];
  const seats = [];
  rows.forEach(row => {
    for (let i = 1; i <= 10; i++) {
      seats.push(`${row}${i}`);
    }
  });
  return seats;
}; 