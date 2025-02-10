import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

import Alert from '../components/Alert';

const Login = () => {
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlertMessage('');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      setAlertMessage('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/auth`, {
        email,
        password,
      });

      const { token } = response.data;
      const decodedToken = jwtDecode(token);

      // Handle successful login
      console.log('Login successful:', decodedToken);

      // Store the token in localStorage or sessionStorage
      localStorage.setItem('token', token);

      // Redirect to the dashboard or another page
      window.location.href = '/';
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage(error?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className={`w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ${alertMessage ? 'animate-shake' : ''}`}>
        {alertMessage && <Alert title="Erreur" message={alertMessage} />}
        <h2 className="text-2xl font-bold text-center">Se connecter</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
            <input type="email" id="email" className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input type="password" id="password" className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="********" />
          </div>
          <div className="flex items-center justify-between">
            <div className="form-check">
              <input type="checkbox" id="remember-me" className="form-check-input" />
              <label htmlFor="remember-me" className="form-check-label text-sm text-gray-700">Se souvenir de moi</label>
            </div>
            <div className="text-sm">
              <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">Mot de passe oublié ?</button>
            </div>
          </div>
          <button type="submit" className="w-full btn btn-primary py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;