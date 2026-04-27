import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Template1 from '../components/templates/Template1';
import Template2 from '../components/templates/Template2';
import { CreateFormData } from '../types';

const INITIAL_FORM: CreateFormData = {
  brideNameAlb: '',
  groomNameAlb: '',
  brideNameEng: '',
  groomNameEng: '',
  weddingDate: '',
  weddingTime: '',
  venue: '',
  venueAddress: '',
  rsvpPhone: '',
  rsvpEmail: '',
  customMessage: '',
  templateId: 'template1',
};

const TEMPLATES = [
  { id: 'template1', label: 'Rozë Elegante', desc: 'Ngjyra të buta, stil klasik romantik', emoji: '🌹' },
  { id: 'template2', label: 'Ari & Errësirë', desc: 'Stil luksoz, elegancë e thellë', emoji: '✨' },
];

export default function Create() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateFormData>(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedAlb, setGeneratedAlb] = useState('');
  const [generatedEng, setGeneratedEng] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTemplate = (id: string) => {
    setForm(prev => ({ ...prev, templateId: id }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const generateAI = async () => {
    if (!form.brideNameAlb || !form.groomNameAlb || !form.weddingDate) {
      setError('Plotëso emrat dhe datën para se të gjenerosh tekstin.');
      return;
    }
    setError('');
    setGenerating(true);
    try {
      // Create a temporary invitation to get AI text
      const res = await axios.post('/api/invitations', {
        ...form,
        templateId: form.templateId || 'template1',
      });
      const invId = res.data.id;
      const genRes = await axios.post(`/api/invitations/${invId}/generate`);
      setGeneratedAlb(genRes.data.generatedTextAlb || '');
      setGeneratedEng(genRes.data.generatedTextEng || '');
      // Store the id in session so we can continue with it
      sessionStorage.setItem('ftesaai_draft_id', invId);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Gabim gjatë gjenerimit të tekstit. Provo sërish.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.brideNameAlb || !form.groomNameAlb || !form.weddingDate || !form.templateId) {
      setError('Plotëso të gjitha fushat e detyrueshme.');
      return;
    }

    setCreating(true);
    try {
      // If we already generated text (draft id exists), navigate there directly
      const existingId = sessionStorage.getItem('ftesaai_draft_id');
      let invId = existingId;

      if (!invId) {
        // Create new invitation
        const res = await axios.post('/api/invitations', { ...form });
        invId = res.data.id;
      }

      sessionStorage.removeItem('ftesaai_draft_id');
      navigate(`/preview/${invId}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Gabim gjatë krijimit të ftesës. Provo sërish.');
    } finally {
      setCreating(false);
    }
  };

  const previewInvitation = {
    ...form,
    generatedTextAlb: generatedAlb,
    generatedTextEng: generatedEng,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="font-bold text-xl text-gray-900">FtesaAI</span>
          </Link>
          <span className="text-sm text-gray-500">Hapi {step} / 2</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Krijo Ftesën Tënde</h1>
          <p className="text-gray-500">Plotëso të dhënat — AI do të gjenerojë tekstin dygjuhësh</p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="space-y-6">
              {/* Names */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>👰🤵</span> Emrat e Çiftit
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Nusja (Shqip) *</label>
                      <input name="brideNameAlb" value={form.brideNameAlb} onChange={handleChange} className="input-field" placeholder="p.sh. Arta" required />
                    </div>
                    <div>
                      <label className="label">Nusja (Anglisht)</label>
                      <input name="brideNameEng" value={form.brideNameEng} onChange={handleChange} className="input-field" placeholder="p.sh. Arta" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Dhëndri (Shqip) *</label>
                      <input name="groomNameAlb" value={form.groomNameAlb} onChange={handleChange} className="input-field" placeholder="p.sh. Blerim" required />
                    </div>
                    <div>
                      <label className="label">Dhëndri (Anglisht)</label>
                      <input name="groomNameEng" value={form.groomNameEng} onChange={handleChange} className="input-field" placeholder="p.sh. Blerim" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date, Time, Venue */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📅</span> Data, Koha dhe Vendi
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Data e dasmës *</label>
                      <input type="date" name="weddingDate" value={form.weddingDate} onChange={handleChange} className="input-field" required />
                    </div>
                    <div>
                      <label className="label">Ora</label>
                      <input type="time" name="weddingTime" value={form.weddingTime} onChange={handleChange} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Emri i sallës / restorantit</label>
                    <input name="venue" value={form.venue} onChange={handleChange} className="input-field" placeholder="p.sh. Hotel Grand Prishtina" />
                  </div>
                  <div>
                    <label className="label">Adresa / Qyteti, Shteti</label>
                    <input name="venueAddress" value={form.venueAddress} onChange={handleChange} className="input-field" placeholder="p.sh. Prishtinë, Kosovë" />
                  </div>
                </div>
              </div>

              {/* RSVP */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📞</span> RSVP — Konfirmimi i Pranisë
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Numri i telefonit</label>
                    <input name="rsvpPhone" value={form.rsvpPhone} onChange={handleChange} className="input-field" placeholder="+383 44 123 456" />
                  </div>
                  <div>
                    <label className="label">Email-i për RSVP</label>
                    <input type="email" name="rsvpEmail" value={form.rsvpEmail} onChange={handleChange} className="input-field" placeholder="ftesa@example.com" />
                  </div>
                </div>
              </div>

              {/* Custom message */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>💬</span> Mesazhi Personal (opsional)
                </h2>
                <textarea
                  name="customMessage"
                  value={form.customMessage}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Shkruaj një mesazh personal për të ftuarit (AI do ta përfshijë)..."
                />
              </div>

              {/* Image upload */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📷</span> Foto (opsionale)
                </h2>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-rose-300 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  {imageFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">✅</span>
                      <span className="text-sm text-gray-700">{imageFile.name}</span>
                      <button
                        type="button"
                        className="text-xs text-red-500 underline"
                        onClick={e => { e.stopPropagation(); setImageFile(null); }}
                      >
                        Hiq
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="text-sm text-gray-500">Kliko për të ngarkuar një foto (opsionale)</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 5MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Template selection */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎨</span> Zgjidh Template-n
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTemplate(t.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        form.templateId === t.id
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{t.emoji}</div>
                      <div className="font-medium text-sm text-gray-900">{t.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Generate button */}
              <div className="card bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100">
                <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>🤖</span> AI Tekst Dygjuhësh
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Kliko dhe AI do të gjenerojë automatikisht tekstin e ftesës në shqip dhe anglisht.
                </p>
                <button
                  type="button"
                  onClick={generateAI}
                  disabled={generating}
                  className="btn-primary w-full"
                >
                  {generating ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Duke gjeneruar...
                    </>
                  ) : (
                    '✨ Gjenero Tekstin me AI'
                  )}
                </button>

                {(generatedAlb || generatedEng) && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-rose-100">
                      <p className="text-xs font-semibold text-rose-600 uppercase mb-1">🇦🇱 Shqip</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap">{generatedAlb}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-rose-100">
                      <p className="text-xs font-semibold text-blue-600 uppercase mb-1">🇬🇧 English</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap">{generatedEng}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={creating}
                className="btn-primary w-full text-lg py-4"
              >
                {creating ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Duke krijuar...
                  </>
                ) : (
                  '🎊 Shiko Preview-n & Paguaj'
                )}
              </button>
            </div>

            {/* Right: Preview */}
            <div className="hidden lg:block">
              <div className="sticky top-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>👁️</span> Preview Live
                </h2>
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  {form.templateId === 'template2' ? (
                    <Template2 invitation={previewInvitation} showBoth={true} />
                  ) : (
                    <Template1 invitation={previewInvitation} showBoth={true} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
