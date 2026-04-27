import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Invitation } from '../types';

type StatusFilter = 'all' | 'pending_payment' | 'pending_approval' | 'approved';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment:  { label: 'Pret Pagesën',  color: 'bg-gray-100 text-gray-600' },
  pending_approval: { label: 'Pret Aprovimin', color: 'bg-yellow-100 text-yellow-700' },
  approved:         { label: 'Aprovuar',        color: 'bg-green-100 text-green-700' },
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [approving, setApproving] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');

  const fetchInvitations = async (key: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/admin/invitations', { params: { adminKey: key } });
      setInvitations(res.data);
      setAdminKey(key);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        setLoginError('Çelësi i adminit është gabim. Provo sërish.');
      } else {
        setError('Gabim gjatë ngarkimit të ftesave.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!inputKey.trim()) {
      setLoginError('Shkruaj çelësin e adminit.');
      return;
    }
    fetchInvitations(inputKey.trim());
  };

  const handleApprove = async (id: string) => {
    setApproving(id);
    try {
      await axios.post(`/api/admin/invitations/${id}/approve`, {}, {
        params: { adminKey },
      });
      setInvitations(prev =>
        prev.map(inv => inv.id === id ? { ...inv, status: 'approved', approvedAt: new Date().toISOString() } : inv)
      );
    } catch {
      alert('Gabim gjatë aprovimit. Provo sërish.');
    } finally {
      setApproving(null);
    }
  };

  const filtered = invitations.filter(inv =>
    filter === 'all' ? true : inv.status === filter
  );

  const counts = {
    all: invitations.length,
    pending_payment: invitations.filter(i => i.status === 'pending_payment').length,
    pending_approval: invitations.filter(i => i.status === 'pending_approval').length,
    approved: invitations.filter(i => i.status === 'approved').length,
  };

  // If not logged in, show login form
  if (!adminKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
            <p className="text-gray-500 text-sm mt-1">FtesaAI — Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Çelësi i Adminit</label>
              <input
                type="password"
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                className="input-field"
                placeholder="Shkruaj çelësin sekret..."
                autoFocus
              />
            </div>
            {loginError && (
              <p className="text-red-600 text-sm">⚠️ {loginError}</p>
            )}
            <button type="submit" className="btn-primary w-full">
              🔓 Hyr
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">
              ← Kthehu në faqe kryesore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl">💍</span>
              <span className="font-bold text-gray-900">FtesaAI</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 text-sm font-medium">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchInvitations(adminKey)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              disabled={loading}
            >
              🔄 Rifresko
            </button>
            <button
              onClick={() => setAdminKey('')}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Dil
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {([
            { key: 'all', label: 'Gjithsej', icon: '📊' },
            { key: 'pending_payment', label: 'Pret Pagesën', icon: '💳' },
            { key: 'pending_approval', label: 'Pret Aprovimin', icon: '⏳' },
            { key: 'approved', label: 'Aprovuar', icon: '✅' },
          ] as const).map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`card text-left transition-all ${filter === s.key ? 'ring-2 ring-rose-500' : 'hover:shadow-lg'}`}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{counts[s.key]}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl animate-pulse mb-4">💍</div>
            <p className="text-gray-500">Duke ngarkuar...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500">Nuk ka ftesa për këtë filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Çifti</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Data</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Pagesa</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Statusi</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Krijuar</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Veprime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900">
                          {inv.brideNameAlb} &amp; {inv.groomNameAlb}
                        </div>
                        {inv.brideNameEng && (
                          <div className="text-xs text-gray-400">
                            {inv.brideNameEng} &amp; {inv.groomNameEng}
                          </div>
                        )}
                        {inv.venue && (
                          <div className="text-xs text-gray-400">{inv.venue}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-600 hidden md:table-cell">
                        {inv.weddingDate || '—'}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        {inv.payerName ? (
                          <div>
                            <div className="font-medium text-gray-700">{inv.payerName}</div>
                            <div className="text-xs text-gray-400">{inv.payerEmail}</div>
                            <div className="text-xs text-gray-400">Ref: {inv.transactionRef}</div>
                            {inv.proofFilePath && (
                              <a
                                href={`/uploads/${inv.proofFilePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 underline"
                              >
                                📎 Shiko provën
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_LABELS[inv.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[inv.status]?.label || inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-xs hidden md:table-cell">
                        {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('sq-AL') : '—'}
                        {inv.approvedAt && (
                          <div className="text-green-500">
                            ✅ {new Date(inv.approvedAt).toLocaleDateString('sq-AL')}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/preview/${inv.id}`}
                            target="_blank"
                            className="text-xs text-blue-500 hover:text-blue-700 underline"
                          >
                            👁️ Shiko
                          </Link>
                          {inv.status === 'pending_approval' && (
                            <button
                              onClick={() => handleApprove(inv.id)}
                              disabled={approving === inv.id}
                              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-semibold transition-colors disabled:opacity-50"
                            >
                              {approving === inv.id ? '⏳...' : '✅ Aprovo'}
                            </button>
                          )}
                          {inv.status === 'approved' && (
                            <span className="text-xs text-green-600 font-medium">✓ Aprovuar</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
