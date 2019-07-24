import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () => ({
    type: actionTypes.AUTH_START
});

export const authSuccess = (idToken, userId) => ({
    type: actionTypes.AUTH_SUCCESS,
    idToken,
    userId
});

export const authFail = error => ({
    type: actionTypes.AUTH_FAIL,
    error
});

export const logout = () => ({
    type: actionTypes.AUTH_LOGOUT
});

export const checkAuthTimeout = expirationTime => dispatch => {
    setTimeout(() => {
        dispatch(logout());
    }, expirationTime * 1000);
}

export const auth = (email, password, isSignup) => dispatch => {
    dispatch(authStart());
    const authData = {
        email,
        password,
        returnSecureToken: true
    };

    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCZRKiRjRiDCJIxLo0LHxov3o8yzdSGMG8';

    if (!isSignup) {
        url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCZRKiRjRiDCJIxLo0LHxov3o8yzdSGMG8'
    };

    axios.post(url, authData)
        .then(response => {
            console.log(response);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
        })
        .catch(err => {
            console.log(err);
            dispatch(authFail(err.response.data.error));
        });
};

export const setAuthRedirectPath = path => ({
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path
});
