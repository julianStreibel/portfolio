const useUserState = () => {
    if (!localStorage.getItem('userState') || localStorage.getItem('userState') === 'undefined') {
        window.localStorage.setItem('userState', JSON.stringify({ stocks: [] }));
    }
    return [getUserState, setUserState]
}

const getUserState = () => {
    return window.localStorage.getItem('userState') !== undefined ? JSON.parse(window.localStorage.getItem('userState')) : {};
}

const setUserState = (name, val) => {
    let userState = getUserState();
    userState[name] = val
    window.localStorage.setItem('userState', JSON.stringify(userState));
}

export default useUserState;