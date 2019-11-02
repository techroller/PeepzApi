import React, { useState, useEffect } from 'react';
import has from 'lodash/has';
import moment from 'moment';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
} from 'reactstrap';
import DatePicker from 'react-datepicker';

export const UserEditModal = (props) => {
  const {
    onUserUpdated,
    isOpen,
    onClose,
  } = props;

  const [isDirty, setDirty] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  const handleClose = () => {
    setDirty(false);
    onClose();
  };

  const handleChange = (e) => {
    const {name, value} = e.target;

    const newUser = {...user};
    newUser[name] = value;
    setUser(newUser);
    setDirty(true);
  };

  const setDateOfBirth = (date) => {
    const newUser = {...user};
    newUser.dateOfBirth = date;
    setUser(newUser);
    setDirty(true);
  };

  const handleSubmit = () => {
    const newUser = {...user};
    newUser.dateOfBirth = moment(user.dateOfBirth).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    onUserUpdated(newUser);
    handleClose();
  };

  return (
      <Modal isOpen={isOpen} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>
          {has(user, 'username') ?
              `Edit ${user.username}` :
              'Create new user'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="user-modal-username">Username</Label>
              <Input type="text" name="username" id="user-modal-username"
                     defaultValue={user.username}
                     onChange={handleChange}
                     placeholder="Enter username"/>
            </FormGroup>
            <FormGroup>
              <Label for="user-modal-email">Email</Label>
              <Input type="email" name="email" id="user-modal-email"
                     defaultValue={user.email}
                     onChange={handleChange}
                     placeholder="Enter email address"/>
            </FormGroup>
            <FormGroup>
              <Label for="user-modal-dateOfBirth">Date of birth</Label>
              <div>
                <DatePicker id="user-modal-dateOfBirth" name="dateOfBirth"
                            className="form-control"
                            selected={user.dateOfBirth}
                            onSelect={setDateOfBirth}
                            openToDate={moment(user.dateOfBirth).toDate()}/>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}
                  disabled={!isDirty}>Save</Button>
        </ModalFooter>
      </Modal>
  );
};