// frontend/src/components/Modals/ModalEventAdd.js

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EventAdd from "../Dashboard/EventAdd";

const ModalEventAdd = ({ show, handleClose }) => {
  return (
    <Modal show={show} size={"lg"} onHide={handleClose} fullscreen={false}>
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
