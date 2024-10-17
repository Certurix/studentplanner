import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <a href="#home">Home</a>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <a href="#profile">Profile</a>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <a href="#settings">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <header className="mb-4">
          <h2 className="text-3xl font-semibold">Dashboard</h2>
        </header>
        <section>
          {/* <p>This is the main content area.</p> */}
        </section>
        <section className="mt-4">
          <h3 className="text-2xl font-semibold">Users</h3>
          <ul>
            {users.map(user => (
              <li key={user[0]} className="p-2 border-b border-gray-200">
                {user[1]} {user[2]} - {user[3]}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;