import { useEffect, useState } from 'react';

// API endpoint: /api/workouts/
// Requires VITE_CODESPACE_NAME in .env.local; falls back to localhost
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const API_URL =
  codespaceName && codespaceName !== 'undefined'
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const json = await res.json();
        const data = json.results ? json.results : Array.isArray(json) ? json : [];
        setWorkouts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  if (loading) return <div className="alert alert-info">Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h2>Workouts</h2>
      {workouts.length === 0 ? (
        <p>No workouts found</p>
      ) : (
        <div className="row">
          {workouts.map((workout) => (
            <div key={workout._id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{workout.title}</h5>
                  <p className="card-text">{workout.description}</p>
                  <p className="card-text">
                    <strong>Difficulty:</strong> <span className="badge bg-info">{workout.difficulty}</span><br />
                    <strong>Duration:</strong> {workout.estimatedMinutes} min<br />
                    <strong>Activity Types:</strong> {workout.activityTypes?.join(', ') || 'N/A'}
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
