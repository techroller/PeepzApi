import {ofType, combineEpics} from 'redux-observable';
import {mergeMap, map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {toastr} from 'react-redux-toastr';

import client from '../client';

import {
  getLink,
  resourceMatches,
  linkMatches
} from '../model'

// Actions to be handled by the epics
export const
  USER_CREATE = 'user/create',
  USER_UPDATE = 'user/update',
  USER_DELETE = 'user/delete';

// Responding to side effects in the reducer
export const
  USER_CREATED = 'user/created',
  USER_UPDATED = 'user/updated',
  USER_DELETED = 'user/deleted';

export const
  USER_CREATING = 'user/creating',
  USER_EDITING = 'user/editing',
  USER_LOADED = 'user/loaded',
  USERS_LOADED = 'user/usersLoaded';

export const NOOP = 'users/NOOP';

const NOOP_ACTION = {
  type: NOOP
};

export const QUERY_FOR_USERS = 'user/query';

// Default reducer
export default (state = {list: [], current: {}, editing: false}, action = {}) => {
  switch (action.type) {
    case USER_CREATED:
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
    case USER_UPDATED:
      allUsers = [...state.list];
      let updatedUser = action.payload.user;

      allUsers.forEach((user, ix) => {
        if (resourceMatches(user, updatedUser)) {
          allUsers[ix] = updatedUser;
        }
      });

      newState = {
        ...state,
        list: allUsers
      };
      newState.editing = false;
      return newState;
    case USER_DELETED:
      let link = action.payload.link;
      allUsers = state.list.filter(user => !linkMatches(getLink('self', user.links), link));

      newState = {
        ...state,
        list: allUsers
      };

      if (newState.current) {
        if (linkMatches(getLink('self', newState.current.links), link)) {
          newState.current = {};
        }
      }
      newState.editing = false;
      return newState;
    case USER_LOADED:
      newState = {
        ...state,
        current: {
          ...action.payload.user
        }
      };
      return newState;
    case USERS_LOADED:
      newState = {
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
    case USER_EDITING:
      newState = {
        ...state,
        editing: action.payload.editing
      };
      if (action.payload.user && action.payload.editing) {
        newState.current = action.payload.user
      }

      return newState;
    case USER_CREATING:
      newState = {
        ...state,
        current: {},
        editing: true
      };
      return newState;
    default:
      return state;
  }
};

/**
 * Receives a query object from a dispatch.
 * Notice the spread operator in payload.query; this is to counter Redux's behavior of rewriting the "id"
 * property of the "payload." Completely defensive.
 * @param {{page: integer, take: integer, search: string?, sort: "($propertyname,)+[asc|desc]?"}} queryForUsersRequest
 * The payload to be serialized into query string parameters or path parameters (path templates for REST requests are not currently supported).
 * @returns {{type: string, payload: {query: {}}}}
 */
export const queryForUsersAction = (queryForUsersRequest) => {
  return {
    type: QUERY_FOR_USERS,
    payload: {
      query: {
        ...queryForUsersRequest
      }
    }
  };
};

// Data loaded action creators

/**
 * Dispatches action containing the current page of user resources
 * @param payload The HAL payload containing users and paging information.
 * @returns {{type: string, payload: *}}
 */
export const usersLoaded = (payload) => {
  return {
    type: USERS_LOADED,
    payload
  };
};

/**
 * Dispatches action containing currently selected user resources
 * @param payload the HAL payload containing a single user resource
 * @returns {{type: string, payload: {user: *}}}
 */
export const userLoaded = (payload) => {
  return {
    type: USER_LOADED,
    payload: {
      user: payload
    }
  };
};

export const userEditing = (user, editing) => {
  return {
    type: USER_EDITING,
    payload: {
      user,
      editing
    }
  };
}

export const userCreating = () => {
  return {
    type: USER_CREATING
  };
}

// CRUD Action creators
export const createUserAction = (payload) => ({
  type: USER_CREATE,
  payload: {
    ...payload
  }
});

export const userCreatedAction = (createdUser) => {
  return {
    type: USER_CREATED,
    payload: {
      // I learned the hard way that if you don't put the actual subject of the payload
      // in a property then if the payload itself has a "id" property, Redux will overwrite the "id" property
      // with a sequential number indicating the number of actions it has handled via a dispatcher.
      user: createdUser
    }
  };
};

export const updateUserAction = (payload) => ({
  type: USER_UPDATE,
  payload: {...payload}
});

export const userUpdatedAction = (updatedUser) => ({
  type: USER_UPDATED,
  payload: {
    user: updatedUser
  }
});

export const deleteUserAction = (payload) => ({
  type: USER_DELETE,
  payload: {...payload}
});

export const userDeletedAction = (link) => ({
  type: USER_DELETED,
  payload: {
    link
  }
});

const toastSaveResource = (resource, theWord = 'saved') => {
  toastr.success('Success', `${resource.username} has been ${theWord}`);
  return NOOP_ACTION;
};

const toastRequestError = (response) => {
  if (response.status === 404) {
    toastr.warn('Resource was not found')
  } else if (response.status === 400) {
    if (response.data && response.data.message) {
      toastr.error('Bad request', response.data.message);
    } else {
      toastr.error('Bad request')
    }
  } else if (response.status === 401 || response.status === 403) {
    toastr.warn('Unauthorized access', 'You are not authorized to access this resource');
  }
  return NOOP_ACTION;
};

const toastSaveResourceError = (response, resource) => {
  if (response.status / 100 === 4) {
    toastRequestError(response);
  } else {
    toastr.error(`Error saving ${resource.username}: ${response.status}`, response.data.message);
  }
  return NOOP_ACTION;
};

// Epics
export const queryForUsersEpic = (action$) => action$.pipe(
  ofType(QUERY_FOR_USERS),
  mergeMap(action => {
    let path = 'users';
    let payload = {...action.payload};
    if (payload.href) {
      // this is a link, just use it.
      path = payload.href;
      payload.query = {};
    }
    return client.get(path, payload.query).pipe(
      // Notice we don't use mergeMap here because we don't need to chain observables. We only need to dispatch
      // the usersLoaded action.
      map(({data}) => usersLoaded(data)),
      catchError(error => of(toastRequestError(error.response)))
    );
  })
);

export const createUserEpic = (action$) => action$.pipe(
  ofType(USER_CREATE),
  mergeMap(action => {
    return client.post('users', action.payload).pipe(
      mergeMap(({data}) => of(userCreatedAction(data), toastSaveResource(data))),
      catchError(error => {
        return of(toastSaveResourceError(error.response, action.payload));
      })
    );
  })
);

export const updateUserEpic = (action$) => action$.pipe(
  ofType(USER_UPDATE),
  mergeMap(action => {
    let link = getLink('self', action.payload.links);
    return client.put(link.href, action.payload).pipe(
      mergeMap(({data}) => of(userUpdatedAction(data), toastSaveResource(data)))
    );
  }),
  catchError(error => {
    return of(toastSaveResourceError(error.response, action.payload));
  })
);

export const deleteUserEpic = (action$) => action$.pipe(
  ofType(USER_DELETE),
  mergeMap(action => {
    let link = getLink('self', action.payload.links);
    return client.delete(link.href).pipe(
      mergeMap(() => of(userDeletedAction(link), toastSaveResource(action.payload, 'deleted')))
    );
  }),
  catchError(error => {
    return of(toastRequestError(error.response));
  })
);

export const userEpics = combineEpics(
  queryForUsersEpic,
  createUserEpic,
  updateUserEpic,
  deleteUserEpic
);

