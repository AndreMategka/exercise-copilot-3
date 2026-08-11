import { useEffect, useState } from 'react';

// API endpoint: /api/activities/
// Requires VITE_CODESPACE_NAME in .env.local; falls back to localhost
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const API_URL =
  codespaceName && codespaceName !== 'undefined'
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const json = await res.json();
        const data = json.results ? json.results : Array.isArray(json) ? json : [];
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  if (loading) return <div className="alert alert-info">Loading activities...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h2>Activities</h2>
      {activities.length === 0 ? (
        <p>No activities found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Duration (min)</th>
                <th>Calories</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity.user?.displayName || activity.user?.username || 'Unknown'}</td>
                  <td>{activity.type}</td>
                  <td>{activity.durationMinutes}</td>
                  <td>{activity.caloriesBurned}</td>
                  <td>{new Date(activity.activityDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
