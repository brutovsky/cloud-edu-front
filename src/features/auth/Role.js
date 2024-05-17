export const Role = {
    Admin: 'Admin',
    Student: 'Student',
    Teacher: 'Teacher'
}

export const userHasRole = (user, role) => user && user.userRoles && user.userRoles.includes(role);
export const userHasAnyRole = (user, roles) => {
    if (!user || !user.userRoles) {
        return false;
    }
    return roles.some(role => user.userRoles.includes(role));
};
