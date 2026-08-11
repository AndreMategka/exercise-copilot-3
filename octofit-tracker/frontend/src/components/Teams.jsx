import { useEffect, useState } from 'react';

// API endpoint: /api/teams/
// Requires VITE_CODESPACE_NAME in .env.local; falls back to localhost
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const API_URL =
  codespaceName && codespaceName !== 'undefined'
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const json = await res.json();
        const data = json.results ? json.results : Array.isArray(json) ? json : [];
        setTeams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  if (loading) return <div className="alert alert-info">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h2>Teams</h2>
      {teams.length === 0 ? (
        <p>No teams found</p>
      ) : (
        <div className="row">
          {teams.map((team) => (
            <div key={team._id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">{team.description}</p>
                  <p className="card-text">
                    <strong>Members:</strong> {team.members?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
