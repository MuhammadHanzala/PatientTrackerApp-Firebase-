export default function (state = { isLoggedIn: false, user: null, data: null }, action) {
    switch (action.type) {
        case 'isLoggedIn':
            return { isLoggedIn: action.boolean };
        case 'currentUser':
            return { user: action.user };
        case 'patients':
            console.log(action.data)
            return { data: action.data };
        default:
            return state;
    }
}