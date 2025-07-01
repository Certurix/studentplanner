import { useState } from "react";
import {
  Card,
  Button,
  Label,
  TextInput,
  Textarea,
  Accordion,
} from "flowbite-react";
import { Icon } from "@iconify-icon/react";
import useNotification from "@/hooks/useNotification";

const FAQ_ITEMS = [
  {
    id: "account",
    title: "Comment puis-je mettre à jour les informations de mon compte ?",
    content:
      "Naviguez vers Paramètres depuis le menu de la barre latérale. Vous pouvez mettre à jour vos informations de profil, changer votre mot de passe et gérer vos préférences à partir de là.",
  },
  {
    id: "calendar",
    title: "Comment puis-je ajouter des événements à mon calendrier ?",
    content:
      "Cliquez sur n'importe quelle date dans la vue calendrier ou utilisez le bouton 'Ajouter un événement'. Remplissez les détails de l'événement et sélectionnez le type de calendrier approprié (personnel, professionnel ou académique).",
  },
  {
    id: "sync",
    title: "Puis-je synchroniser avec des calendriers externes ?",
    content:
      "Actuellement, la plateforme prend en charge la gestion manuelle des événements. L'intégration de calendriers externes est prévue pour les futures mises à jour.",
  },
  {
    id: "mobile",
    title: "Y a-t-il une application mobile ?",
    content:
      "L'application web est responsive et fonctionne bien sur les navigateurs mobiles. Une application mobile dédiée est en cours de réflexion pour le développement futur.",
  },
];

const CONTACT_CATEGORIES = [
  { value: "technical", label: "Problème technique" },
  { value: "account", label: "Problème de compte" },
  { value: "feature", label: "Demande de fonctionnalité" },
  { value: "other", label: "Autre" },
];

export default function Support() {
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    message: "",
  });
  const { success, error } = useNotification();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.subject || !formData.message) {
      error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      // Simulation d'envoi du formulaire
      await new Promise((resolve) => setTimeout(resolve, 1000));

      success("Votre demande de support a été soumise avec succès");
      setFormData({ category: "", subject: "", message: "" });
    } catch (err) {
      error(
        "Échec de la soumission de la demande de support. Veuillez réessayer."
      );
    }
  };

  return (
    <section className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">
        {/* Section FAQ */}
        <Card className="flex flex-col h-full lg:min-h-[600px]">
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <Icon
              icon="tabler:help-circle-filled"
              className="text-blue-600 flex-shrink-0"
              width={24}
              height={24}
            />
            <h2 className="text-xl font-semibold text-gray-900">
              Foire aux questions
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Accordion collapseAll={true}>
              {FAQ_ITEMS.map((item) => (
                <Accordion.Panel key={item.id}>
                  <Accordion.Title className="text-gray-900 text-sm md:text-base">
                    {item.title}
                  </Accordion.Title>
                  <Accordion.Content className="pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </Accordion.Content>
                </Accordion.Panel>
              ))}
            </Accordion>
          </div>
        </Card>

        {/* Formulaire de contact */}
        <Card className="flex flex-col h-full lg:min-h-[600px]">
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <Icon
              icon="tabler:mail-filled"
              className="text-green-600 flex-shrink-0"
              width={24}
              height={24}
            />
            <h2 className="text-xl font-semibold text-gray-900">
              Contacter le support
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex-1 flex flex-col"
          >
            <div className="space-y-4 flex-1">
              <div>
                <Label htmlFor="category" value="Catégorie *" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {CONTACT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="subject" value="Sujet *" />
                <TextInput
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Brève description de votre demande"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex-1">
                <Label htmlFor="message" value="Message *" />
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Veuillez décrire votre demande en détail..."
                  rows={8}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="resize-none h-full min-h-[200px]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              color="default"
              className="w-full mt-4 flex-shrink-0"
            >
              <Icon
                icon="tabler:send"
                className="mr-2"
                width={20}
                height={20}
              />
              Envoyer la demande
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
