import React, {Component} from 'react';
import {connect} from 'react-redux';
import UserItem from './user-item';
import UserEditModalContainer from './user-edit-modal';
import {
  queryForUsersAction,
  deleteUserAction,
  userLoaded,
  userCreating,
  userEditing
} from '../index';
import {
  getLinkHref
} from '../../model';
import Paginate from '../../ui/paginate';
import {Button} from 'reactstrap';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      sort: 'username,asc',
      size: 20,
      openEditModal: false
    };
  }

  handlePageSizeChange = (size) => {
    this.props.onPageResize(size, this.state.sort);
  };

  handleNext = () => {
    this.props.onNext(this.props.users.page, this.state.sort);
  }

  handlePrev = () => {
    this.props.onPrev(this.props.users.page, this.state.sort);
  }

  handleGoTo = (ix) => {
    this.props.onGoTo(ix, this.props.users.page, this.state.sort);
  }

  handleSort = (prop, dir) => {
    let sort = `${prop},${dir}`;
    this.setState({sort});
    this.props.onSort(sort);
  }

  componentDidMount = () => {
    this.props.onLoad();
  }

  render() {
    let items = this.props.users.list.map((user) => <UserItem user={user} key={getLinkHref('self', user.links)}
                                                              onEditUser={this.props.onUserEdit}
                                                              onDeleteUser={this.props.onUserDelete}
                                                              onUserSelected={this.props.onUserSelected}/>);
    return (
      <React.Fragment>
        <div className="my-3 p-3 rounded box-shadow">
          <div className="row border-bottom border-gray pb-2 mb-0">
            <div className="col-12">
              <h4 className="float-left">The PeepZ</h4>
              <Button className="float-right" color="info" onClick={this.props.onUserCreate}>Create user</Button>
            </div>
          </div>

          {items}
        </div>
        <div className="my-3 p-3 float-right">
          <Paginate payload={this.props.users} onNext={this.handleNext} onPrevious={this.handlePrev}
                    onGoTo={this.handleGoTo}/>
        </div>
        <UserEditModalContainer/>
      </React.Fragment>
    );
  }
}

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
    dispatch(queryForUsersAction({page: page.number + 1, take: page.size, sort}));
  },
  onPrev: (page, sort) => {
    let pageNumber = page.number - 1;
    if (pageNumber > -1) {
      dispatch(queryForUsersAction({page: pageNumber, take: page.size, sort}))
    }
  },
  onGoTo: (ix, page, sort) => {
    dispatch(queryForUsersAction({page: ix, take: page.size, sort}));
  },
  onSort: (page, sort) => {
    dispatch(queryForUsersAction({page: page.number, take: page.size, sort}));
  },
  onUserSelected: (user) => {
    dispatch(userLoaded(user));
  },
  onUserCreate: () => {
    dispatch(userCreating());
  },
  onUserEdit: (user) => {
    dispatch(userEditing(user, true));
  },
  onUserDelete: (user) => {
    dispatch(deleteUserAction(user));
  },
  onLoad: () => {
    dispatch(queryForUsersAction({page: 0, take: 20, sort: 'username,asc'}));
  }
});

const UserListContainer = connect(mapStateToProps, mapDispatchToProps)(UserList);

export default UserListContainer;
