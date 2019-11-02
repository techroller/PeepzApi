import React, { useState, useEffect, Component } from 'react';
import { UserItem } from './user-item';

import {
  getLinkHref,
} from '../../model';
import Paginate from '../../ui/paginate';
import { Button } from 'reactstrap';

export const UserList = (props) => {
  const {
    users,
    onLoad,
    onSort,
    onPageResize,
    onNext,
    onPrev,
    onGoTo,
    onUserCreate,
  } = props;

  const [state, setState] = useState({
    search: '',
    sort: 'username,asc',
    size: 20,
    openEditModal: false,
  });

  useEffect(onLoad);

  const handlePageSizeChange = (size) => {
    onPageResize(size, state.sort);
  };

  const handleNext = () => {
    onNext(users.page, state.sort);
  };

  const handlePrev = () => {
    onPrev(users.page, state.sort);
  };

  const handleGoTo = (ix) => {
    onGoTo(ix, users.page, state.sort);
  };

  const handleSort = (prop, dir) => {
    let sort = `${prop},${dir}`;
    let newState = {...state, sort};
    setState(newState);
    onSort(sort);
  };

  let items = users.list.map(
      (user) => <UserItem user={user} key={getLinkHref('self', user.links)}/>);
  return (
      <React.Fragment>
        <div className="my-3 p-3 rounded box-shadow">
          <div className="row border-bottom border-gray pb-2 mb-0">
            <div className="col-12">
              <h4 className="float-left">The PeepZ</h4>
              <Button className="float-right" color="info"
                      onClick={onUserCreate}>Create user</Button>
            </div>
          </div>

          {items}
        </div>
        <div className="my-3 p-3 float-right">
          <Paginate payload={users} onNext={handleNext}
                    onPrevious={handlePrev}
                    onGoTo={handleGoTo}/>
        </div>
      </React.Fragment>
  );
};