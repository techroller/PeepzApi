import { connect } from 'react-redux';
import { UserList } from './user-list';
import { queryForUsersAction, userCreating } from '../index';


const mapStateToProps = (state) => {
  return {
    users: state.users
  };
};

const mapDispatchToProps = (dispatch) => ({
  onPageResize: (size, sort) => {
    dispatch(queryForUsersAction({page: 0, take: size, sort}));
  },
  onNext: (page, sort) => {
    dispatch(
        queryForUsersAction({page: page.number + 1, take: page.size, sort}));
  },
  onPrev: (page, sort) => {
    let pageNumber = page.number - 1;
    if (pageNumber > -1) {
      dispatch(queryForUsersAction({page: pageNumber, take: page.size, sort}));
    }
  },
  onGoTo: (ix, page, sort) => {
    dispatch(queryForUsersAction({page: ix, take: page.size, sort}));
  },
  onSort: (page, sort) => {
    dispatch(queryForUsersAction({page: page.number, take: page.size, sort}));
  },
  onUserCreate: () => {
    dispatch(userCreating());
  },
  onLoad: () => {
    dispatch(queryForUsersAction({page: 0, take: 20, sort: 'username,asc'}));
  },
});

export const UserListContainer = connect(mapStateToProps, mapDispatchToProps)(UserList);