import React from "react";
import { Modal, Button } from "flowbite-react";
import EventAdd from "../Dashboard/Events/EventAdd";

const ModalEventAdd = ({ show, handleClose }) => {
  return (
    <Modal show={show} onClose={handleClose} size="6xl">
      <Modal.Body>
        <EventAdd close={handleClose} />
      </Modal.Body>
    </Modal>
  );
};

export default ModalEventAdd;