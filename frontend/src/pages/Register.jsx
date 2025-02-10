import React, { useState } from "react";
import axios from "axios";
import Alert from "../components/Alert";

const Register = () => {
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlertMessage("");
    const name = document.getElementById("name").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !lastname || !email || !password) {
      setAlertMessage("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/register`, {
        name,
        lastname,
        email,
        password,
      });

      // Handle successful registration
      console.log("Registration successful:", response.data);

      // Redirect to the login page or another page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Une erreur s'est produite lors de l'inscription");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ${
          alertMessage ? "animate-shake" : ""
        }`}
      >
        {alertMessage && <Alert title="Erreur" message={alertMessage} />}
        <h2 className="text-2xl font-bold text-center">S'inscrire</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-group">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Prénom
            </label>
            <input
              type="text"
              id="name"
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nom"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700"
            >
              Nom
            </label>
            <input
              type="text"
              id="lastname"
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Prénom"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
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
              type="password"
              id="password"
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full btn btn-primary py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
