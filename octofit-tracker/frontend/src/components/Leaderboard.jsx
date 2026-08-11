import { useEffect, useState } from 'react';
import { fetchApiData } from '../api.js';

// API endpoint: /api/leaderboard/
export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await fetchApiData('leaderboard');
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
