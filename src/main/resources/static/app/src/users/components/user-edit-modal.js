import React, {Component} from 'react';
import {connect} from 'react-redux';
import has from 'lodash/has';
import moment from 'moment';
import {updateUserAction, createUserAction, userEditing} from '../index';
import {Button, Form, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Label} from 'reactstrap';
import DatePicker from 'react-datepicker';

class UserEditModal extends Component {

  constructor(props) {
    super(props);

    let user = {
      ...props.user
    };

    if (!has(user, 'dateOfBirth')) {
      user.dateOfBirth = new Date();
    }

    this.state = {
      isDirty: false,
      user,
      isOpen: props.isOpen,
      isLoaded: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let nextState = {
      ...prevState,
      isOpen: nextProps.isOpen
    };
    if (nextProps.isOpen && !nextState.isLoaded) {
      nextState.isLoaded = true;
      nextState.user = {...nextProps.user}
    }

    return nextState;
  }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState((prevState) => {
      let state = {
        ...prevState,
        isDirty: true
      };
      state.user[name] = value;
      return state;
    });
  }

  setDateOfBirth = (date) => {
    this.setState((prevState) => {
      let state = {
        ...prevState,
        isDirty: true
      };
      state.user.dateOfBirth = date;
      return state;
    });
  }

  handleSubmit = () => {
    let user = {
      ...this.state.user
    };

    this.props.onUserUpdated(user);
    this.setState({
      isOpen: false,
      isDirty: false
    });
  }

  handleClose = () => {
    this.setState({
      user: {},
      isLoaded: false
    });
    this.props.onClose();
  }

  render = () => {
    let title = has(this.state.user, 'username') ? `Edit ${this.state.user.username}` : 'Create new user';
    return (
      <Modal isOpen={this.state.isOpen} toggle={this.handleClose}>
        <ModalHeader toggle={this.handleClose}>
          {title}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="user-modal-username">Username</Label>
              <Input type="text" name="username" id="user-modal-username" defaultValue={this.state.user.username}
                     onChange={this.handleChange}
                     placeholder="Enter username"/>
            </FormGroup>
            <FormGroup>
              <Label for="user-modal-email">Email</Label>
              <Input type="email" name="email" id="user-modal-email" defaultValue={this.state.user.email}
                     onChange={this.handleChange}
                     placeholder="Enter email address"/>
            </FormGroup>
            <FormGroup>
              <Label for="user-modal-dateOfBirth">Date of birth</Label>
              <div>
                <DatePicker id="user-modal-dateOfBirth" name="dateOfBirth"
                            className="form-control"
                            value={moment(this.state.user.dateOfBirth).format('MM/DD/YYYY')}
                            onSelect={this.setDateOfBirth}
                            openToDate={moment(this.state.user.dateOfBirth).toDate()}/>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
          <Button color="primary" onClick={this.handleSubmit} disabled={!this.state.isDirty}>Save</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.users.current,
    isOpen: state.users.editing
  }
};

const mapDispatchToProps = (dispatch) => ({
  onUserUpdated: (user) => {
    let payload = {
      ...user
    };
    payload.dateOfBirth = moment(user.dateOfBirth).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    if (user && user.links) {
      dispatch(updateUserAction(payload));
    } else {
      dispatch(createUserAction(payload));
    }
  },
  onClose: () => {
    dispatch(userEditing(false, false))
  }
});

const UserEditModalContainer = connect(mapStateToProps, mapDispatchToProps)(UserEditModal);

export default UserEditModalContainer;