import api from './axios';

export const postsAPI = {
    // 게시글 목록 조회 (페이지네이션)
    getPostsList: (page = 0, size = 10) => 
        api.get(`/posts/list/page?page=${page}&size=${size}`),
    
    // 게시글 상세 조회
    getPostDetail: (postId, isBackNavigation = false) => {
        const params = new URLSearchParams();
        if (isBackNavigation) {
            params.append('skipCount', 'true');
        }
        return api.get(`/posts/${postId}${params.toString() ? `?${params.toString()}` : ''}`);
    },
    
    // 게시글 작성
    createPost: (title, content, files) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (files) {
            files.forEach(file => formData.append('files', file));
        }
        return api.post('/posts/write', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    // 게시글 수정
    updatePost: (postId, title, content) => 
        api.put(`/posts/update/${postId}?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`),
    
    // 게시글 삭제
    deletePost: (postId, currentUser) => {
        const formData = new FormData();
        formData.append('postId', postId);
        if (currentUser.role === 'ROLE_ADMIN') {
            formData.append('isAdmin', true);
        }
        return api.post(`/posts/delete/${postId}`, formData);
    },
    
    // 게시글 검색 (검색 타입에 따라 다른 엔드포인트 사용)
    searchPosts: (keyword, page = 0, size = 10, searchType = 'title') => {
        switch(searchType) {
            case 'title':
                return api.get(`/posts/search/title?keyword=${keyword}&page=${page}&size=${size}`);
            case 'content':
                return api.get(`/posts/search/content?keyword=${keyword}&page=${page}&size=${size}`);
            case 'titleContent':
                return api.get(`/posts/search?keyword=${keyword}&page=${page}&size=${size}`);
            case 'author':
                return api.get(`/posts/search/nickname?nickname=${keyword}&page=${page}&size=${size}`);
            default:
                return api.get(`/posts/search/title?keyword=${keyword}&page=${page}&size=${size}`);
        }
    },
    
 
    // 게시글 좋아요 상태 확인
    checkLikeStatus: async (postId, username) => {
        try {
            const response = await api.get('/like/post', {
                params: {
                    username: username,
                    size: 100,
                    page: 0
                }
            });
            
            console.log('Like status response:', response.data);
            
            // post 배열에서 post_id로 매칭
            const likedPosts = response.data.post || [];
            return likedPosts.some(post => {
                // 둘 다 숫자로 변환하여 비교
                const likedPostId = Number(post.post_id);
                const currentPostId = Number(postId);
                console.log('Comparing postIds:', likedPostId, currentPostId);
                return likedPostId === currentPostId;
            });
        } catch (error) {
            console.error('Check like status error:', error);
            return false;
        }
    },
    
    // 게시글 좋아요/취소
    likePost: (postId, username) => 
        api.post('/posts/like', null, {
            params: {
                postId,
                username
            }
        }),
    
    // 팔로우 상태 확인
    checkFollowStatus: async (currentUsername, targetUsername) => {
        try {
            const response = await api.get('/followingList', {
                params: {
                    username: currentUsername,
                    size: 100,
                    page: 0
                }
            });
            
            console.log('Follow status response:', response.data);
            
            // users 배열에서 id로 매칭
            const followingUsers = response.data.users || [];
            const isFollowing = followingUsers.some(user => {
                console.log('Comparing usernames:', user.id, targetUsername);
                return user.id === targetUsername;
            });
            
            // 로컬 스토리지에 상태 저장
            localStorage.setItem(`follow_${currentUsername}_${targetUsername}`, isFollowing);
            
            return isFollowing;
        } catch (error) {
            console.error('Check follow status error:', error);
            // 로컬 스토리지에서 이전 상태 확인
            return localStorage.getItem(`follow_${currentUsername}_${targetUsername}`) === 'true';
        }
    },
    
    // 팔로우/언팔로우
    followUser: (username) => 
        api.post('/follow', null, {
            params: { username }
        }),
    
    // 댓글 관련 API 추가
    createComment: (content, postId, username) => 
        api.post(`/api/comments/newcomment?content=${encodeURIComponent(content)}&postId=${postId}&username=${username}`),
    
    updateComment: (commentId, content) => 
        api.put(`/api/comments/${commentId}?content=${encodeURIComponent(content)}`),
    
    deleteComment: (commentId, currentUser) => {
        const params = {};
        if (currentUser.role === 'ROLE_ADMIN') {
            params.isAdmin = true;
        }
        return api.delete(`/api/comments/${commentId}`, { params });
    },
    
    // 전체 게시글 목록 조회 (페이지네이션 없이)
    getAllPosts: () => 
        api.get('/posts/list/all'),
    
    // 유저 정보 조회
    getUserInfo: (username) => 
        api.get(`/userPage?username=${username}`),
    
    // 유저가 작성한 게시글 목록 (username으로 검색)
    getUserPosts: (username) => 
        api.get(`/posts/search/username`, {
            params: {
                username: username,
                page: 0,
                size: 100
            }
        }),
    
    // 팔로워 목록 조회
    getFollowers: (username) => 
        api.get(`/followerList`, {
            params: {
                username: username,
                size: 100,
                page: 0
            }
        }),
    
    // 팔로잉 목록 조회
    getFollowing: (username) => 
        api.get(`/followingList`, {
            params: {
                username: username,
                size: 100,
                page: 0
            }
        }),
}; 