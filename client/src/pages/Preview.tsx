import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Template1 from '../components/templates/Template1';
import Template2 from '../components/templates/Template2';
import { Invitation } from '../types';

type PaymentStep = 'info' | 'confirm' | 'submitted';

const IBAN = 'XK05 1212 0123 4567 8901';
const BANK_NAME = 'Banka për Biznes';
const ACCOUNT_HOLDER = 'FtesaAI';
const AMOUNT = '9€';

export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('info');
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`/api/invitations/${id}`)
      .then(res => {
        setInvitation(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Ftesa nuk u gjet.');
        setLoading(false);
      });
  }, [id]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!payerName || !payerEmail || !transactionRef) {
      setSubmitError('Plotëso të gjitha fushat e detyrueshme.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('payerName', payerName);
      formData.append('payerEmail', payerEmail);
      formData.append('transactionRef', transactionRef);
      if (proofFile) formData.append('proof', proofFile);

      await axios.post(`/api/invitations/${id}/payment-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPaymentStep('submitted');
      setInvitation(prev => prev ? { ...prev, status: 'pending_approval' } : prev);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setSubmitError(msg || 'Gabim gjatë dërgimit. Provo sërish.');
    } finally {
      setSubmitting(false);
    }
  };

  const exportPDF = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`ftesa-${invitation?.brideNameAlb || 'dasma'}.pdf`);
    } catch {
      alert('Gabim gjatë eksportimit të PDF. Provo sërish.');
    } finally {
      setExporting(false);
    }
  };

  const exportPNG = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `ftesa-${invitation?.brideNameAlb || 'dasma'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Gabim gjatë eksportimit të PNG. Provo sërish.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">💍</div>
          <p className="text-gray-500">Duke ngarkuar ftesën...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <p className="text-gray-700 font-semibold mb-2">Ftesa nuk u gjet</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link to="/create" className="btn-primary">Krijo Ftesë të Re</Link>
        </div>
      </div>
    );
  }

  const TemplateComponent = invitation.templateId === 'template2' ? Template2 : Template1;
  const isApproved = invitation.status === 'approved';
  const isPendingApproval = invitation.status === 'pending_approval';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="font-bold text-xl text-gray-900">FtesaAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isApproved ? 'bg-green-100 text-green-700' :
              isPendingApproval ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {isApproved ? '✅ Aprovuar' : isPendingApproval ? '⏳ Duke pritur aprovim' : '📋 Draft'}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invitation preview */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Ftesa Jote</h1>
              {isApproved && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportPNG}
                    disabled={exporting}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    {exporting ? '⏳' : '🖼️'} Shkarko PNG
                  </button>
                  <button
                    onClick={exportPDF}
                    disabled={exporting}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    {exporting ? '⏳' : '📄'} Shkarko PDF
                  </button>
                </div>
              )}
            </div>

            <div
              ref={previewRef}
              className="rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white"
            >
              <TemplateComponent invitation={invitation} showBoth={true} />
            </div>

            {!isApproved && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Shkarkimi bëhet aktiv pas aprovimit të pagesës
              </p>
            )}
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {/* Invitation details */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">📋 Detajet</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nusja:</span>
                  <span className="font-medium">{invitation.brideNameAlb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dhëndri:</span>
                  <span className="font-medium">{invitation.groomNameAlb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data:</span>
                  <span className="font-medium">{invitation.weddingDate}</span>
                </div>
                {invitation.venue && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vendi:</span>
                    <span className="font-medium text-right max-w-[60%]">{invitation.venue}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Template:</span>
                  <span className="font-medium capitalize">{invitation.templateId === 'template2' ? 'Ari & Errësirë' : 'Rozë Elegante'}</span>
                </div>
              </div>
            </div>

            {/* Payment / approval status panel */}
            {isApproved ? (
              <div className="card border-2 border-green-500 bg-green-50">
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="font-bold text-green-800 text-lg mb-2">Ftesa Aprovuar!</h3>
                  <p className="text-green-700 text-sm mb-6">
                    Tani mund ta shkarkosh ftesën tënde si PDF dhe PNG.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={exportPDF}
                      disabled={exporting}
                      className="btn-primary w-full"
                    >
                      📄 Shkarko PDF
                    </button>
                    <button
                      onClick={exportPNG}
                      disabled={exporting}
                      className="btn-secondary w-full"
                    >
                      🖼️ Shkarko PNG
                    </button>
                  </div>
                </div>
              </div>
            ) : isPendingApproval || paymentStep === 'submitted' ? (
              <div className="card border-2 border-yellow-400 bg-yellow-50">
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">⏳</div>
                  <h3 className="font-bold text-yellow-800 text-lg mb-2">Duke pritur aprovimin</h3>
                  <p className="text-yellow-700 text-sm">
                    Kërkesa juaj është dërguar. Administratori do të verifikojë pagesën dhe do të aktivizojë shkarkimin.
                  </p>
                  {invitation.payerEmail && (
                    <p className="text-yellow-600 text-xs mt-3">
                      Do të njoftoheni në: <strong>{invitation.payerEmail}</strong>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Payment flow */
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">💳 Pagesa</h2>

                {paymentStep === 'info' && (
                  <div>
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-rose-800 mb-3">Transfertë Bankare</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Banka:</span>
                          <span className="font-medium ml-2">{BANK_NAME}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Llogaria:</span>
                          <span className="font-medium ml-2">{ACCOUNT_HOLDER}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">IBAN:</span>
                          <span className="font-mono font-semibold text-rose-700">{IBAN}</span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(IBAN)}
                            className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-0.5 rounded"
                          >
                            Kopjo
                          </button>
                        </div>
                        <div>
                          <span className="text-gray-500">Shuma:</span>
                          <span className="font-bold text-rose-700 ml-2 text-lg">{AMOUNT}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Referenca:</span>
                          <span className="font-mono ml-2 text-xs">FTESA-{id?.slice(0, 8).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                      Pas kryerjes së transfertës, klikoni butonin më poshtë dhe plotësoni të dhënat e pagesës.
                    </p>
                    <button
                      onClick={() => setPaymentStep('confirm')}
                      className="btn-primary w-full"
                    >
                      ✅ Kam Paguar — Konfirmo
                    </button>
                  </div>
                )}

                {paymentStep === 'confirm' && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="label">Emri i plotë *</label>
                      <input
                        value={payerName}
                        onChange={e => setPayerName(e.target.value)}
                        className="input-field"
                        placeholder="Emri mbiemri"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input
                        type="email"
                        value={payerEmail}
                        onChange={e => setPayerEmail(e.target.value)}
                        className="input-field"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Referenca e transfertës *</label>
                      <input
                        value={transactionRef}
                        onChange={e => setTransactionRef(e.target.value)}
                        className="input-field"
                        placeholder="p.sh. TRF-2025-001"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Screenshot i pagesës (opsionale)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={e => setProofFile(e.target.files?.[0] || null)}
                        className="input-field text-sm"
                      />
                    </div>

                    {submitError && (
                      <p className="text-red-600 text-sm">⚠️ {submitError}</p>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentStep('info')}
                        className="btn-secondary flex-1 text-sm py-2"
                      >
                        ← Kthehu
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary flex-1 text-sm py-2"
                      >
                        {submitting ? '⏳ Duke dërguar...' : '📨 Dërgo Kërkesën'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Share section */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-3">📤 Shpërnda</h2>
              <p className="text-sm text-gray-500 mb-3">
                Shpërnda linkun e ftesës me të afërmit:
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`${window.location.origin}/preview/${id}`}
                  className="input-field text-xs"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/preview/${id}`)}
                  className="btn-secondary text-xs py-2 px-3 whitespace-nowrap"
                >
                  Kopjo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
