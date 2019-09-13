import React from 'react';
import {getLinkHref} from '../../model'
import {Button} from 'reactstrap';
import moment from 'moment';
import isNil from 'lodash/isNil'

const UserItem = ({user, onUserSelected, onEditUser, onDeleteUser}) => {

  let payload = {
    ...user
  };
  if (isNil(payload.dateOfBirth)) {
    payload.dateOfBirth = new Date();
  }

  return (
    <div className="media text-muted pt-3">
      <span className="mr-2 rounded" style={{width: 32, height: 32, backgroundColor: '#0d7dbd'}}
            data-holder-rendered="true"></span>
      <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
        <a href={getLinkHref('self', payload.links)} onClick={(event) => {
          event.preventDefault();
          onUserSelected(payload);
        }} className="d-block text-gray-dark">@{payload.username}</a>
        <div className="row">
          <div className="col-sm-4 col-xs-12"><strong>Email</strong> {payload.email}</div>
          <div className="col-sm-4 col-xs-6">
            <strong>Age</strong> {moment(payload.dateOfBirth).fromNow(true).replace(/year[s]?/g, '')}
          </div>
          <div className="col-sm-4 col-xs-6 text-right">
            <Button onClick={() => onEditUser(payload)}>Edit</Button>
            <Button onClick={() => onDeleteUser(payload)} color="warning" className="ml-2">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;