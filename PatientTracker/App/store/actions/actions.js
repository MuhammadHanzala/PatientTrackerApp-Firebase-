export function isLoggedIn(boolean) {
    return {
        type: 'isLoggedIn',
        boolean
    }
}
export function currentUser(user) {
    return {
        type: 'currentUser',
        user
    }
}
export function patients(data) {
    console.log(data);
    return {
        type: 'patients',
        data
    }
}
