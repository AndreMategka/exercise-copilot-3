import { useEffect, useState } from 'react';

// API endpoint: /api/users/
// Requires VITE_CODESPACE_NAME in .env.local; falls back to localhost
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const API_URL =
  codespaceName && codespaceName !== 'undefined'
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const json = await res.json();
        const data = json.results ? json.results : Array.isArray(json) ? json : [];
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <div className="alert alert-info">Loading users...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="row">
          {users.map((user) => (
            <div key={user._id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{user.displayName || user.username}</h5>
                  <p className="card-text">
                    <strong>Username:</strong> {user.username}<br />
                    <strong>Email:</strong> {user.email}
                  </p>
                  {user.team && (
                    <p className="card-text">
                      <strong>Team:</strong> {user.team.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
