import React from 'react';
import { Invitation } from '../../types';

interface Props {
  invitation: Partial<Invitation>;
  showBoth?: boolean;
}

export default function Template2({ invitation, showBoth = true }: Props) {
  const {
    brideNameAlb, groomNameAlb, brideNameEng, groomNameEng,
    weddingDate, weddingTime, venue, venueAddress,
    rsvpPhone, rsvpEmail,
    generatedTextAlb, generatedTextEng,
  } = invitation;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('sq-AL', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateEn = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="font-serif" style={{ width: '100%', maxWidth: 680 }}>
      {/* Albanian side — Dark Elegant */}
      <div
        id="template2-alb"
        className="relative"
        style={{
          background: 'linear-gradient(160deg, #1a0a0f 0%, #3b0d1e 50%, #1a0a0f 100%)',
          padding: '52px 44px',
          borderBottom: showBoth ? '3px solid #eab308' : 'none',
          color: '#fff',
        }}
      >
        {/* Gold corner ornaments */}
        <div className="absolute top-4 left-4 text-yellow-400" style={{ fontSize: 24 }}>✦</div>
        <div className="absolute top-4 right-4 text-yellow-400" style={{ fontSize: 24 }}>✦</div>
        <div className="absolute bottom-4 left-4 text-yellow-400" style={{ fontSize: 24 }}>✦</div>
        <div className="absolute bottom-4 right-4 text-yellow-400" style={{ fontSize: 24 }}>✦</div>

        {/* Top gold border line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #eab308, transparent)', marginBottom: 32 }} />

        <div className="text-center">
          <p className="text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-6">
            ✦ Ftesë Martese ✦
          </p>

          <div className="mb-6">
            <p className="text-yellow-100 text-sm uppercase tracking-widest mb-2">Me kënaqësi të madhe</p>
            <h1 className="text-5xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {brideNameAlb || 'Emri i Nuses'}
            </h1>
            <div className="flex items-center justify-center gap-4 my-4">
              <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, #eab308)' }} />
              <span className="text-yellow-400 text-2xl">❧</span>
              <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, #eab308, transparent)' }} />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {groomNameAlb || 'Emri i Dhëndrit'}
            </h1>
            <p className="text-yellow-200 text-sm mb-6">bashkohen në martesë</p>
          </div>

          {generatedTextAlb ? (
            <p className="text-gray-200 text-sm leading-relaxed mb-8 mx-auto" style={{ maxWidth: 500, whiteSpace: 'pre-wrap' }}>
              {generatedTextAlb}
            </p>
          ) : (
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Me gëzim të madh, familjet tona ju ftojnë të ndani gëzimin e martesës.
            </p>
          )}

          <div
            className="inline-block px-6 py-4 mb-6 rounded"
            style={{ border: '1px solid rgba(234,179,8,0.4)', background: 'rgba(234,179,8,0.08)' }}
          >
            <p className="text-yellow-300 font-semibold text-base">
              {formatDate(weddingDate) || 'Data e Dasmës'}
              {weddingTime && <span className="ml-3 text-yellow-100">{weddingTime}</span>}
            </p>
            {venue && (
              <p className="text-gray-300 text-sm mt-2">
                {venue}{venueAddress ? ` — ${venueAddress}` : ''}
              </p>
            )}
          </div>

          {(rsvpPhone || rsvpEmail) && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(234,179,8,0.2)' }}>
              <p className="text-yellow-500 text-xs uppercase tracking-widest mb-2">Konfirmoni Praninë</p>
              {rsvpPhone && <p className="text-gray-300 text-sm">📞 {rsvpPhone}</p>}
              {rsvpEmail && <p className="text-gray-300 text-sm">✉️ {rsvpEmail}</p>}
            </div>
          )}
        </div>

        {/* Bottom gold border line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #eab308, transparent)', marginTop: 32 }} />
      </div>

      {/* English side — Ivory Elegant */}
      {showBoth && (
        <div
          id="template2-eng"
          className="relative"
          style={{
            background: 'linear-gradient(160deg, #faf7f0 0%, #f5ede0 50%, #faf7f0 100%)',
            padding: '52px 44px',
          }}
        >
          <div className="absolute top-4 left-4 text-amber-700" style={{ fontSize: 24 }}>✦</div>
          <div className="absolute top-4 right-4 text-amber-700" style={{ fontSize: 24 }}>✦</div>
          <div className="absolute bottom-4 left-4 text-amber-700" style={{ fontSize: 24 }}>✦</div>
          <div className="absolute bottom-4 right-4 text-amber-700" style={{ fontSize: 24 }}>✦</div>

          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #92400e, transparent)', marginBottom: 32 }} />

          <div className="text-center">
            <p className="text-amber-700 text-xs font-semibold tracking-widest uppercase mb-6">
              ✦ Wedding Invitation ✦
            </p>

            <div className="mb-6">
              <p className="text-amber-800 text-sm uppercase tracking-widest mb-2">Together with their families</p>
              <h1 className="text-5xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                {brideNameEng || 'Bride Name'}
              </h1>
              <div className="flex items-center justify-center gap-4 my-4">
                <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, #92400e)' }} />
                <span className="text-amber-700 text-2xl">❧</span>
                <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, #92400e, transparent)' }} />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                {groomNameEng || 'Groom Name'}
              </h1>
              <p className="text-amber-700 text-sm mb-6">request the honour of your presence</p>
            </div>

            {generatedTextEng ? (
              <p className="text-gray-600 text-sm leading-relaxed mb-8 mx-auto" style={{ maxWidth: 500, whiteSpace: 'pre-wrap' }}>
                {generatedTextEng}
              </p>
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                With great joy, our families invite you to share in the celebration of their marriage.
              </p>
            )}

            <div
              className="inline-block px-6 py-4 mb-6 rounded"
              style={{ border: '1px solid rgba(146,64,14,0.3)', background: 'rgba(146,64,14,0.05)' }}
            >
              <p className="text-amber-800 font-semibold text-base">
                {formatDateEn(weddingDate) || 'Wedding Date'}
                {weddingTime && <span className="ml-3 text-amber-600">{weddingTime}</span>}
              </p>
              {venue && (
                <p className="text-gray-600 text-sm mt-2">
                  {venue}{venueAddress ? ` — ${venueAddress}` : ''}
                </p>
              )}
            </div>

            {(rsvpPhone || rsvpEmail) && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(146,64,14,0.2)' }}>
                <p className="text-amber-700 text-xs uppercase tracking-widest mb-2">RSVP</p>
                {rsvpPhone && <p className="text-gray-600 text-sm">📞 {rsvpPhone}</p>}
                {rsvpEmail && <p className="text-gray-600 text-sm">✉️ {rsvpEmail}</p>}
              </div>
            )}
          </div>

          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #92400e, transparent)', marginTop: 32 }} />
        </div>
      )}
    </div>
  );
}
