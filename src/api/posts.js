import api from './axios';

export const postsAPI = {
    // 게시글 목록 조회 (페이지네이션)
    getPostsList: (page = 0, size = 10) => 
        api.get(`/posts/list/page?page=${page}&size=${size}`),
    
    // 게시글 상세 조회
    getPostDetail: (postId) => 
        api.get(`/posts/${postId}`),
    
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
    deletePost: (postId) => 
        api.post(`/posts/delete/${postId}`),
    
    // 게시글 검색 (제목/내용)
    searchPosts: (keyword, page = 0, size = 10) => 
        api.get(`/posts/search?keyword=${keyword}&page=${page}&size=${size}`),
    
    // 게시글 검색 (작성자)
    searchByUsername: (nickname, page = 0, size = 10) => 
        api.get(`/posts/search/nickname?nickname=${nickname}&page=${page}&size=${size}`),
    
    // 게시글 좋아요 상태 확인
    checkLikeStatus: async (postId, username) => {
        try {
            const response = await api.get('/posts/like/check', {
                params: {
                    postId,
                    username
                }
            });
            return response.data;
        } catch (error) {
            console.error('Check like status error:', error);
            return false;
        }
    },
    
    // 게시글 좋아요
    likePost: (postId, username) => 
        api.post('/posts/like', null, {
            params: {
                postId,
                username
            }
        }),
    
    // 유저 팔로우/언팔로우
    followUser: (username) => 
        api.post('/follow', null, {
            params: { username }
        }),
    
    // 팔로우 상태 확인
    checkFollowStatus: async (username) => {
        try {
            const response = await api.get('/follow/check', {
                params: { username }
            });
            return response.data;
        } catch (error) {
            console.error('Check follow status error:', error);
            return false;
        }
    },
    
    // 댓글 관련 API 추가
    createComment: (content, postId, username) => 
        api.post(`/api/comments/newcomment?content=${encodeURIComponent(content)}&postId=${postId}&username=${username}`),
    
    updateComment: (commentId, content) => 
        api.put(`/api/comments/${commentId}?content=${encodeURIComponent(content)}`),
    
    deleteComment: (commentId) => 
        api.delete(`/api/comments/${commentId}`),
    
    // 전체 게시글 목록 조회 (페이지네이션 없이)
    getAllPosts: () => 
        api.get('/posts/list/all'),
}; 