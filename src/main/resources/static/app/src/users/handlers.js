import {resourceMatches} from "../model";

export const UserAction = {
    USER_CREATE: 'USER_CREATE',
    USER_UPDATE: 'USER_UPDATE',
    USER_DELETE: 'USER_DELETE',
    USER_CREATED: 'USER_CREATED',
    USER_UPDATED: 'USER_UPDATED',
    USER_DELETED: 'USER_DELETED',
    USER_CREATING: 'USER_CREATING',
    USER_EDITING: 'USER_EDITING',
    USER_LOADED: 'USER_LOADED',
    USERS_LOADED: 'USERS_LOADED',
    QUERY_FOR_USERS: 'QUERY_FOR_USERS',
    NOOP: 'NOOP'
};

// Reducer functions
const userCreated = (state, action) => {
    let newState = {
        ...state,
        current: action.payload.user
    };
    let allUsers = [...state.list];
    allUsers.push(action.payload.user);
    allUsers.sort((a, b) => {
        if (a && b && a.username && b.username) {
            let lowerA = a.username.toLowerCase();
            let lowerB = b.username.toLowerCase();
            return (lowerA < lowerB) ? -1 : (lowerA > lowerB) ? 1 : 0;
        }
        return 0;
    });

    // In a more robust implementation we would refresh the list from the server.
    newState.list = allUsers;
    newState.editing = false;
    return newState;
};

const userUpdated = (state, action) => {
    let allUsers = [...state.list];
    let updatedUser = action.payload.user;

    allUsers.forEach((user, ix) => {
        if (resourceMatches(user, updatedUser)) {
            allUsers[ix] = updatedUser;
        }
    });

    let newState = {
        ...state,
        list: allUsers
    };
    newState.editing = false;
    return newState;
};

const userLoaded = (state, action) => {
    let newState = {
        ...state,
        current: {
            ...action.payload.user
        }
    };
    return newState;
};

const usersLoaded = (state, action) => {
    let newState = {
        ...state,
        list: [
            ...action.payload.content
        ],
        page: {
            ...action.payload.page
        },
        links: [
            ...action.payload.links
        ]
    };
    return newState;
};

const userEditing = (state, action) => {
    let newState = {
        ...state,
        editing: action.payload.editing
    };
    if (action.payload.user && action.payload.editing) {
        newState.current = action.payload.user
    }

    return newState;
};

const userCreating = (state, action) => {
    let newState = {
        ...state,
        current: {},
        editing: true
    };
    return newState;
};

export default {
    [UserAction.USER_CREATED]: userCreated,
    [UserAction.USER_CREATING]: userCreating,
    [UserAction.USER_UPDATED]: userUpdated,
    [UserAction.USER_LOADED]: userLoaded,
    [UserAction.USERS_LOADED]: usersLoaded,
    [UserAction.USER_EDITING]: userEditing
};

