import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  
  // Login form state
  const [email, setEmail] = useState('admin@novaworks.example');
  const [password, setPassword] = useState('Demo123!');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const loadData = async () => {
    if (!token || !user) return;
    try {
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        const res = await fetch(`${API_BASE}/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProjects(data.projects || []);
      }
      if (user.role === 'AGENT') {
        const res = await fetch(`${API_BASE}/projects/my-tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMyTasks(data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, token]);

  const handleTranscriptSubmit = async () => {
    if (!transcript.trim()) return;
    setProcessing(true);
    setAiMessage('');
    try {
      const res = await fetch(`${API_BASE}/transcript/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ transcript })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process');
      setAiMessage(`Success: Created ${data.projectsCreated} projects and ${data.tasksCreated} tasks!`);
      loadData();
    } catch (err) {
      setAiMessage(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div style={{ fontFamily: 'Segoe UI, sans-serif', maxWidth: 450, margin: '80px auto', padding: 25, border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, color: '#1e293b' }}>NovaWorks CRM Login</h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>The Infinity Hack '26 Demo Accounts</p>
        {loginError && <p style={{ color: '#ef4444', background: '#fee2e2', padding: 8, borderRadius: 4 }}>{loginError}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 5 }}>Demo Email</label>
            <input 
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1' }}
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 5 }}>Password</label>
            <input 
              type="password"
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1' }}
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>
            Sign In
          </button>
        </form>
        <div style={{ marginTop: 20, fontSize: 12, color: '#64748b', background: '#f8fafc', padding: 10, borderRadius: 4 }}>
          <strong>Quick Demo Users (Password: Demo123!):</strong><br/>
          • Admin: <code>admin@novaworks.example</code><br/>
          • Web PM: <code>ayesha@novaworks.example</code><br/>
          • Mobile PM: <code>bilal@novaworks.example</code><br/>
          • Full-Stack Agent: <code>ali@novaworks.example</code><br/>
          • Backend Agent: <code>hamza@novaworks.example</code>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', maxWidth: 1000, margin: '20px auto', padding: 20 }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: 15 }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>NovaWorks CRM</h2>
          <span style={{ fontSize: 14, color: '#64748b' }}>
            Logged in as: <strong>{user.name}</strong> ({user.role} - {user.specialization})
          </span>
        </div>
        <button onClick={handleLogout} style={{ padding: '6px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      {/* ADMIN VIEW */}
      {user.role === 'ADMIN' && (
        <div style={{ marginTop: 20 }}>
          <section style={{ background: '#f1f5f9', padding: 15, borderRadius: 6, marginBottom: 25 }}>
            <h3 style={{ marginTop: 0 }}>Create Projects from Meeting Transcript</h3>
            <textarea
              rows={6}
              style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #cbd5e1', fontFamily: 'monospace' }}
              placeholder="Paste meeting transcript here..."
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
            />
            <div style={{ marginTop: 10 }}>
              <button 
                onClick={handleTranscriptSubmit} 
                disabled={processing || !transcript.trim()}
                style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
              >
                {processing ? 'Processing & Saving Records...' : 'Create from Transcript'}
              </button>
            </div>
            {aiMessage && <p style={{ marginTop: 10, fontWeight: 'bold' }}>{aiMessage}</p>}
          </section>

          <h3>All Projects ({projects.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 15 }}>
            {projects.map(p => (
              <div key={p.id} style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: 15, background: '#fff' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>{p.name}</h4>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Client: <strong>{p.client_name}</strong></div>
                <div style={{ fontSize: 13, marginBottom: 5 }}>Manager: {p.manager_name}</div>
                <div style={{ fontSize: 13, marginBottom: 5 }}>Deadline: <strong>{p.deadline?.slice(0, 10)}</strong></div>
                <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold' }}>Tasks: {p.task_count} | Hours: {p.total_hours}h</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANAGER VIEW */}
      {user.role === 'MANAGER' && (
        <div style={{ marginTop: 20 }}>
          <h3>My Managed Projects ({projects.length})</h3>
          {projects.length === 0 ? <p style={{ color: '#64748b' }}>No projects assigned yet.</p> : null}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 15 }}>
            {projects.map(p => (
              <div key={p.id} style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: 15, background: '#fff' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>{p.name}</h4>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Client: <strong>{p.client_name}</strong></div>
                <div style={{ fontSize: 13, marginBottom: 5 }}>Deadline: <strong>{p.deadline?.slice(0, 10)}</strong></div>
                <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold' }}>Tasks: {p.task_count} | Hours: {p.total_hours}h</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AGENT VIEW */}
      {user.role === 'AGENT' && (
        <div style={{ marginTop: 20 }}>
          <h3>My Assigned Tasks ({myTasks.length})</h3>
          {myTasks.length === 0 ? <p style={{ color: '#64748b' }}>No tasks assigned yet.</p> : null}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {myTasks.map(t => (
              <div key={t.id} style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: 15, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, color: '#1e293b' }}>{t.title}</h4>
                  <span style={{ fontSize: 13, background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 4, fontWeight: 'bold' }}>
                    {t.estimated_hours} hrs
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#475569', margin: '6px 0' }}>{t.description}</p>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  Project: <strong>{t.project_name}</strong> ({t.client_name}) | Deadline: <strong>{t.deadline?.slice(0, 10)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
