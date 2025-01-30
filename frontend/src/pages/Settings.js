import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, Button, Form, Tabs, Tab, Row, Col } from "react-bootstrap";
import { Icon } from "@iconify-icon/react";

export default function UserSettings({ data }) {
  const [key, setKey] = useState("userdata");

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        data.photo = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.elements["name"].value,
      lastname: form.elements["lastname"].value,
      email: form.elements["email"].value,
      school: form.elements["school"].value,
      class: form.elements["class"].value,
      photo: data.photo
    };

    try {
      // Send individual requests to update user data
      const updateFields = ["name", "lastname", "email", "school", "classname"];
      for (const field of updateFields) {
        if (formData[field]) {
          const response = await fetch(`http://localhost:8000/users/1/${field}`, {
            method: "POST",
            body: JSON.stringify({
              [field]: formData[field],
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to update ${field}`);
          }
        }
      }

      // Update photo if it exists
      if (formData.photo) {
        const response = await fetch("http://localhost:8000/users/1/photo", {
          method: "POST",
          body: JSON.stringify({ photo: formData.photo }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to update photo");
        }
      }

      window.location.reload();
    } catch (error) {
      console.error("Error saving settings:", error);
      return
    }
  }

  return (
    <div className="container mt-4">
      <Tabs
        id="settings-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 custom-tabs"
      >
        <Tab eventKey="userdata" title="Mes infos">
          <Card className="p-4 shadow-sm">
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>Nom</Form.Label>
                <Col sm={5}>
                  <Form.Control name="name" defaultValue={data.name} className="rounded" />
                </Col>
                <Col sm={5}>
                  <Form.Control name="lastname" defaultValue={data.lastname} className="rounded" />
                </Col>
              </Form.Group>
              <hr className="mb-2" />
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>Email</Form.Label>
                <Col sm={10}>
                  <Form.Control type="email" name="email" defaultValue={data.email} className="rounded" />
                </Col>
              </Form.Group>
              <hr className="mb-2" />
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>Votre photo</Form.Label>
                <Col sm={10}>
                  <div className="d-flex align-items-center">
                    <img
                      src={data.photo}
                      alt="avatar utilisateur"
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div
                      {...getRootProps()}
                      className="border border-dashed p-3 rounded text-center w-50 cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <Icon
                        icon="tabler:upload"
                        className="text-secondary"
                        width="24"
                        height="24"
                      />
                      <p className="text-primary small">
                        Cliquez pour envoyer ou glissez-déposez
                      </p>
                      <p className="text-muted small">
                        SVG, PNG, JPG ou GIF (max. 800×400px)
                      </p>
                    </div>
                  </div>
                </Col>
              </Form.Group>
              <hr className="mb-2" />
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>École</Form.Label>
                <Col sm={10}>
                  <Form.Control name="school" defaultValue={data.school} className="rounded" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>Classe</Form.Label>
                <Col sm={10}>
                  <Form.Control name="class" defaultValue={data.class} className="rounded" />
                </Col>
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" type="button">Annuler</Button>
                <Button variant="primary" type="submit">Sauvegarder</Button>
              </div>
            </Form>
          </Card>
        </Tab>
        <Tab eventKey="securite" title="Sécurité">
          <Card className="p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Sécurité</h3>
            <p className="text-sm text-gray-500 mb-4">
              Mettez à jour vos paramètres de sécurité.
            </p>
            {/* Add security settings form here */}
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}