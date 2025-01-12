export const hasDeletePermission = (currentUser, authorId) => {
    if (!currentUser) return false;
    return currentUser.role === 'ROLE_ADMIN' || Number(currentUser.userId) === Number(authorId);
}; 