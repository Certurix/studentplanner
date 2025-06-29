import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Alert from "@/components/ui/Alert";
import useUser from "@/hooks/useUser";
import useNotification from "@/hooks/useNotification";
import Logo from "@/components/ui/Logo";
import Navbar from "@/components/ui/Navbar";

/**
 * Composant de connexion utilisateur
 */
const Login = () => {
  const { updateUserId } = useUser();
  const { error: showError, warning: showWarning } = useNotification();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Récupère un message stocké dans la session (après redirection vers la page de connexion)
  useEffect(() => {
    const message = sessionStorage.getItem("loginMessage");
    if (message) {
      showWarning(message);
      sessionStorage.removeItem("loginMessage");
    }
  }, [showWarning]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Réinitialise les messages
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    // Validation des champs du formulaire
    if (!email || !password) {
      showError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ""}/api/login`,
        { email, password }
      );

      const userId = response.data;

      if (typeof userId === "number") {
        updateUserId(userId);
        window.location.href = "/";
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showError("Identifiants incorrects");
      } else {
        showError(
          error?.message || "Une erreur s'est produite lors de la connexion"
        );
        console.error("Erreur de connexion:", error);
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pt-16">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Se connecter</h2>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse email
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <input
                ref={passwordRef}
                type="password"
                id="password"
                className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="********"
                autoComplete="current-password"
              />
            </div>

            {/* Additional options */}
            <div className="flex items-center justify-between">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="form-check-input"
                />
                <label
                  htmlFor="remember-me"
                  className="form-check-label text-sm text-gray-700"
                >
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full btn btn-primary py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Se connecter
            </button>
          </form>

          {/* Registration link */}
          <div className="text-sm text-center mt-4">
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <a
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                S'inscrire
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
