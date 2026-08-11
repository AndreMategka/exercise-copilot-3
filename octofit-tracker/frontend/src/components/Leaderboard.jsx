import { useEffect, useState } from 'react';

// API endpoint: /api/leaderboard/
// Requires VITE_CODESPACE_NAME in .env.local; falls back to localhost
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const API_URL =
  codespaceName && codespaceName !== 'undefined'
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const json = await res.json();
        const data = json.results ? json.results : Array.isArray(json) ? json : [];
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) return <div className="alert alert-info">Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h2>🏆 Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No leaderboard data found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry._id} className={index === 0 ? 'table-warning' : ''}>
                  <td><strong>#{entry.rank}</strong></td>
                  <td>{entry.user?.displayName || entry.user?.username || 'Unknown'}</td>
                  <td><strong>{entry.points}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
