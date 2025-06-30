import React, { useState } from "react";
import { Button } from "flowbite-react";
import { Icon } from "@iconify-icon/react";
import Navbar from "@/components/ui/Navbar";
import Logo from "@/components/ui/Logo";

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded z-50"
      >
        Aller au contenu principal
      </a>

      <Navbar />

      {/* Contenu principal */}
      <main className="flex-1">
        {/* Section Hero */}
        <section className="relative overflow-hidden">
          {/* Décoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full rounded-bl-3xl rounded-br-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="text-indigo-600">ADIEU</span> LES AGENDAS
                  SURCHARGÉS 😟
                  <br />
                  BONJOUR{" "}
                  <span className="text-indigo-600">STUDENTPLANNER</span>
                  <span className="whitespace-nowrap"> 😎</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Domptez votre emploi du temps avec notre solution
                  d'organisation simplifiée, créez vos plannings sans plus
                  attendre !
                </p>
                <Button
                  color="default"
                  size="lg"
                  className="items-center content-center"
                >
                  Découvrir
                  <Icon
                    icon="akar-icons:arrow-right"
                    className="ml-2 h-5 w-5 self-center"
                  />
                </Button>
              </div>

              <div className="flex justify-center max-sm:hidden max-md:hidden md:hidden lg:flex rounded-br-3xl p-8">
                <img
                  src="calendar3d.png"
                  alt="Illustration d'un agenda digital"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section d'introduction */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <p className="text-indigo-600 text-lg mb-3">
                Une plateforme que les étudiants vont adorer.
              </p>
              <h2
                id="about"
                className="text-4xl font-extrabold text-gray-900 mb-6"
              >
                QU'EST-CE QUE STUDENT PLANNER ?
              </h2>
              <p className="text-xl text-gray-600">
                C'est votre lieu favoris pour tout plannifier ! Ne gardez plus
                rien en tête et découvrez nos outils magiques pour vous
                permettre de mieux vous organiser !
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-8">
                <div className="flex-1 border-t-2 border-indigo-600 rounded-lg p-8 text-center">
                  <h3 className="text-4xl font-bold text-indigo-600 mb-4">
                    GUIDE
                  </h3>
                  <p className="text-gray-700">
                    Un site recommandé aux étudiants qui les aideront tout au
                    long de leur parcours académique.
                  </p>
                </div>

                <div className="flex-1 border-b-2 border-indigo-600 rounded-lg p-8 text-center">
                  <h3 className="text-4xl font-bold text-indigo-600 mb-4">
                    SIMPLICITÉ
                  </h3>
                  <p className="text-gray-700">
                    Faites de StudentPlanner votre allié pour une organisation
                    sans faille.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <img
                  src="Image1.png"
                  alt="Illustration des fonctionnalités"
                  className="w-full h-80 object-cover rounded-3xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section "marketing" */}
        <section
          className="py-24 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: "url('Image5.png')" }}
        >
          {/* Overlay de flou */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center border-8 border-indigo-600">
                  <Icon
                    icon="tabler:calendar-filled"
                    width={64}
                    height={64}
                    className="text-white"
                  />
                </div>
                <div className="text-white space-y-4">
                  <h3 className="text-3xl font-bold drop-shadow-lg">
                    Organisation
                  </h3>
                  <p className="text-2xl drop-shadow-lg">
                    Un outil qui vous permet de mieux vous organiser et de
                    planifier votre quotidien.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6 md:mt-48">
                <div className="mx-auto w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center border-8 border-indigo-600">
                  <Icon
                    icon="tabler:bolt-filled"
                    width={64}
                    height={64}
                    className="text-white"
                  />
                </div>
                <div className="text-white space-y-4">
                  <h3 className="text-3xl font-bold drop-shadow-lg">Rythme</h3>
                  <p className="text-2xl drop-shadow-lg">
                    La plateforme qui équilibre vos différents modes de vie.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center border-8 border-indigo-600">
                  <Icon
                    icon="tabler:star-filled"
                    width={64}
                    height={64}
                    className="text-white"
                  />
                </div>
                <div className="text-white space-y-4">
                  <h3 className="text-3xl font-bold drop-shadow-lg">Unique</h3>
                  <p className="text-2xl drop-shadow-lg">
                    Créez des emplois du temps personnalisés, intégrez vos
                    rendez-vous, cours et loisirs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section des types de plannings */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-grey-900 drop-shadow-lg mb-28">
              LES DIFFÉRENTS TYPES DE PLANNINGS
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div
                className="group h-96 md:h-[524px] rounded-3xl bg-cover bg-center relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundImage: "url('Image2.png')" }}
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
                    <Icon icon="tabler:briefcase" width={48} height={48} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Professionnel</h3>
                  <p className="text-center">
                    Heures de travail, congés, entretiens...
                  </p>
                </div>
              </div>

              <div
                className="group h-96 md:h-[524px] rounded-3xl bg-cover bg-center relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundImage: "url('Image3.png')" }}
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
                    <img
                      src="personnel.png"
                      alt="Icône personnel"
                      className="w-10 h-10"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Personnel</h3>
                  <p className="text-center">
                    Événements familiaux, sorties entre amis, rendez-vous...
                  </p>
                </div>
              </div>

              <div
                className="group h-96 md:h-[524px] rounded-3xl bg-cover bg-center relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundImage: "url('Image4.png')" }}
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
                    <img
                      src="scolaire.png"
                      alt="Icône scolaire"
                      className="w-10 h-10"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Scolaire</h3>
                  <p className="text-center">Cours, examens, devoirs...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section du tableau de bord */}
        <section className="py-24 text-center">
          <h2 className="text-4xl font-bold text-slate-700 drop-shadow-lg mb-16">
            LE TABLEAU DE BORD
          </h2>
          <div className="py-16">
            <img
              src="Vector.png"
              alt="Illustration du tableau de bord"
              className="mx-auto max-w-full h-auto"
            />
          </div>
        </section>

        {/* Section CTA */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4 space-y-10">
            <div className="space-y-5">
              <h2 className="text-4xl font-bold text-gray-900">
                Organisez vous dès maintenant
              </h2>
              <p className="text-xl text-gray-600">
                Propulsez votre organisation et rejoignez-nous !
              </p>
            </div>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-600 transition-colors">
              Commencer
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Logo />
              <p className="text-gray-600">
                Une plateforme que les étudiants vont adorer
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Plateforme
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-gray-600 hover:text-indigo-600">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="/dashboard/support" className="text-gray-600 hover:text-indigo-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Ressources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-indigo-600">
                    Assistance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} StudentPlanner. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
