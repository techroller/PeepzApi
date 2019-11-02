import { connect } from 'react-redux';
import { UserEditModal } from './user-edit-modal';
import { createUserAction, updateUserAction, userEditing } from '../index';

const mapStateToProps = (state) => ({
  user: state.users.current,
  isOpen: state.users.editing,
});

const mapDispatchToProps = (dispatch) => ({
  onUserUpdated: (user) => {
    if (user && user.links) {
      dispatch(updateUserAction(user));
    } else {
      dispatch(createUserAction(user));
    }
  },
  onClose: () => {
    dispatch(userEditing(false, false));
  },
});

export const UserEditModalContainer = connect(mapStateToProps, mapDispatchToProps)(UserEditModal);