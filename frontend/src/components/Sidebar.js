// src/components/Sidebar.js

import { FaHome, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-1/5 bg-gray-50 p-6 flex flex-col justify-between" style={{ minHeight: '100vh' }}>
      <div>
        <h2 className="text-lg font-semibold mb-4">StudentPlanner</h2>
        <input
          type="text"
          placeholder="Rechercher"
          className="w-full p-2 mb-6 rounded-md border border-gray-300"
        />
        <nav>
          <ul>
            <li className="flex items-center p-2 mb-4 text-indigo-600">
              <Link to="/" className="flex items-center">
                <FaHome className="mr-2" /> Accueil
              </Link>
            </li>
            <li className="flex items-center p-2 mb-4 text-gray-600">
              <Link to="/plannings" className="flex items-center">
                <FaCalendarAlt className="mr-2" /> Plannings
              </Link>
            </li>
            <li className="flex items-center p-2 mb-4 text-gray-600">
              <Link to="/class" className="flex items-center">
                <FaUser className="mr-2" /> Ma classe
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="rounded-full mr-4"
        />
        <div className=''>
          <p className="font-semibold">Marc Dubois</p>
          <p className="text-sm text-gray-500">marcdubois@exemple.com</p>
        </div>
      </div>
    </aside>
  );
}