import React from 'react';
import {useDispatch} from 'react-redux';
import {
  deleteUserAction,
  userLoaded,
  userEditing,
} from '../index';
import {getLinkHref} from '../../model'
import {Button} from 'reactstrap';
import moment from 'moment';
import isNil from 'lodash/isNil'

const UserItem = ({user}) => {
  const dispatch = useDispatch();

  if (isNil(user.dateOfBirth)) {
    user.dateOfBirth = new Date();
  }

  const onEditUser = (payload) => {
    dispatch(userEditing(payload));
  };

  const onUserSelected = (payload) => {
    dispatch(userLoaded(payload));
  };

  const onDeleteUser = () => {
    dispatch(deleteUserAction(payload));
  };

  return (
    <div className="media text-muted pt-3">
      <span className="mr-2 rounded" style={{width: 32, height: 32, backgroundColor: '#0d7dbd'}}
            data-holder-rendered="true"></span>
      <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
        <a href={getLinkHref('self', user.links)} onClick={(event) => {
          event.preventDefault();
          onUserSelected(user);
        }} className="d-block text-gray-dark">@{user.username}</a>
        <div className="row">
          <div className="col-sm-4 col-xs-12"><strong>Email</strong> {user.email}</div>
          <div className="col-sm-4 col-xs-6">
            <strong>Age</strong> {moment(user.dateOfBirth).fromNow(true).replace(/year[s]?/g, '')}
          </div>
          <div className="col-sm-4 col-xs-6 text-right">
            <Button onClick={() => onEditUser(user)}>Edit</Button>
            <Button onClick={() => onDeleteUser(user)} color="warning" className="ml-2">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;