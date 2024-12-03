import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

const Login = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch()
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Se connecter</h2>
                <form className="space-y-6">
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
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Mot de passe oublié ?</a>
                        </div>
                    </div>
                    <button type="submit" className="w-full btn btn-primary py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign in</button>
                </form>
            </div>
        </div>
    );
};

export default Login;