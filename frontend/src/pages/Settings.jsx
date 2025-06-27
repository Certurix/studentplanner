import { useRef } from "react";
import {
  Tabs,
  TabItem,
  Card,
  Button,
  Label,
  TextInput,
  FileInput,
} from "flowbite-react";
import { Icon } from "@iconify-icon/react";
import Avatar from "@/components/ui/Avatar";
import useNotification from "@/hooks/useNotification";

export default function UserSettings({ data }) {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const fileInputRef = useRef(null);
  const { success, error } = useNotification();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      data.avatar = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.elements["name"].value,
      lastname: form.elements["lastname"].value,
      email: form.elements["email"].value,
      school: form.elements["school"].value,
      class: form.elements["class"].value,
      avatar: data.avatar,
    };

    try {
      // Send individual requests to update user data
      const updateFields = [
        "name",
        "lastname",
        "email",
        "school",
        "classname",
        "avatar",
      ];
      for (const field of updateFields) {
        if (formData[field]) {
          const response = await fetch(
            `${baseUrl}/api/users/${data.userId}/${field}`,
            {
              method: "POST",
              body: JSON.stringify({
                [field]: formData[field],
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to update ${field}`);
          }
        }
      }

      // Update avatar if it exists
      if (formData.avatar) {
        const response = await fetch(
          `${baseUrl}/api/users/${data.userId}/avatar`,
          {
            method: "POST",
            body: JSON.stringify({ avatar: formData.avatar }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update avatar");
        }
      }
      success("Profile settings updated successfully", {
        title: "Settings Saved",
        duration: 5000,
      });
      // Reload with a small delay to let the user see the notification first
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Error saving settings:", err);
      error(`Failed to update profile: ${err.message}`, {
        title: "Settings Error",
      });
      return;
    }
  };

  return (
    <section className="container mx-auto mt-4">
      <Tabs aria-label="Paramètres utilisateur" defaultIndex={0}>
        <TabItem title="Mes infos">
          <Card className="p-4 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <Label htmlFor="name" value="Nom" />
                  <div className="flex gap-4">
                    <TextInput
                      id="name"
                      name="name"
                      placeholder="Nom"
                      defaultValue={data.name}
                      className="rounded w-1/2"
                      required
                    />
                    <TextInput
                      id="lastname"
                      name="lastname"
                      placeholder="Prénom"
                      defaultValue={data.lastname}
                      className="rounded w-1/2"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={data.email}
                  className="rounded"
                  required
                />
              </div>
              <div>
                <Label htmlFor="avatar" value="Avatar" />
                <div className="flex items-center gap-4 mt-2">
                  <Avatar
                    name={data.name}
                    lastname={data.lastname}
                    alt={`Avatar de ${data.name} ${data.lastname}`}
                    className="w-16 h-16"
                  />
                  <div className="flex w-1/2 items-center justify-center">
                    <Label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full p-3 border-2 border-dashed rounded cursor-pointer text-center bg-gray-50 hover:bg-gray-100 border-gray-300"
                    >
                      <div className="flex flex-col items-center justify-center pb-2 pt-2">
                        <Icon
                          icon="tabler:upload"
                          className="text-secondary mx-auto"
                          width="24"
                          height="24"
                        />
                        <p className="text-primary text-sm">
                          Cliquez pour envoyer ou glissez-déposez
                        </p>
                        <p className="text-gray-500 text-xs">
                          SVG, PNG, JPG ou GIF (max. 800×400px)
                        </p>
                      </div>
                      <FileInput
                        id="dropzone-file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        ref={fileInputRef}
                      />
                    </Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="school" value="École" />
                <TextInput
                  id="school"
                  name="school"
                  defaultValue={data.school}
                  className="rounded"
                />
              </div>
              <div>
                <Label htmlFor="class" value="Classe" />
                <TextInput
                  id="class"
                  name="class"
                  defaultValue={data.class}
                  className="rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button color="red" type="button">
                  Annuler
                </Button>
                <Button color="blue" type="submit">
                  Sauvegarder
                </Button>
              </div>
            </form>
          </Card>
        </TabItem>
        <TabItem title="Sécurité">
          <Card className="p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Sécurité</h3>
            <p className="text-sm text-gray-500 mb-4">
              Mettez à jour vos paramètres de sécurité.
            </p>
            {/* TODO: Security settings */}
          </Card>
        </TabItem>
      </Tabs>
    </section>
  );
}
