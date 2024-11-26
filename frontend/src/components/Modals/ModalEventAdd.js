// frontend/src/components/Modals/ModalEventAdd.js

import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import EventAdd from '../EventAdd';
import { css } from '@emotion/react';

const customModalStyles = css`
  .modal-content {
    background-color: rgba(255, 0, 255, 0.1); /* Adjust the opacity as needed */
  }
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
  }
`;

const ModalEventAdd = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName={customModalStyles}>
      <Modal.Body>
        <EventAdd />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEventAdd;