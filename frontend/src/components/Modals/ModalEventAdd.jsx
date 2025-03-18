import React from "react";
import { Modal, Button } from "flowbite-react";
import EventAdd from "../Dashboard/Events/EventAdd";

const ModalEventAdd = ({ show, handleClose }) => {
  return (
    <Modal show={show} onClose={handleClose} size="2xl">
      <Modal.Body>
        <EventAdd />
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEventAdd;