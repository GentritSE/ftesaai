import React from 'react';
import { Invitation } from '../../types';

interface Props {
  invitation: Partial<Invitation>;
  showBoth?: boolean;
}

export default function Template1({ invitation, showBoth = true }: Props) {
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
    <div className="font-serif bg-white" style={{ width: '100%', maxWidth: 680 }}>
      {/* Albanian side */}
      <div
        id="template1-alb"
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 40%, #fff 100%)',
          padding: '48px 40px',
          borderBottom: showBoth ? '2px dashed #fda4af' : 'none',
        }}
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-16 h-16" style={{ borderTop: '4px solid #e11d48', borderLeft: '4px solid #e11d48' }} />
        <div className="absolute top-0 right-0 w-16 h-16" style={{ borderTop: '4px solid #e11d48', borderRight: '4px solid #e11d48' }} />
        <div className="absolute bottom-0 left-0 w-16 h-16" style={{ borderBottom: '4px solid #e11d48', borderLeft: '4px solid #e11d48' }} />
        <div className="absolute bottom-0 right-0 w-16 h-16" style={{ borderBottom: '4px solid #e11d48', borderRight: '4px solid #e11d48' }} />

        {/* Rose decoration */}
        <div className="text-center mb-4">
          <span style={{ fontSize: 32 }}>🌹</span>
          <span style={{ fontSize: 32 }}>💍</span>
          <span style={{ fontSize: 32 }}>🌹</span>
        </div>

        <div className="text-center">
          <p className="text-rose-600 text-sm font-semibold tracking-widest uppercase mb-4">
            Ftesë Martese
          </p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {brideNameAlb || 'Emri i Nuses'}
          </h1>
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-px w-16 bg-rose-300" />
            <span className="text-rose-500 text-xl">&amp;</span>
            <div className="h-px w-16 bg-rose-300" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            {groomNameAlb || 'Emri i Dhëndrit'}
          </h1>

          {generatedTextAlb ? (
            <p className="text-gray-600 text-sm leading-relaxed mb-6 mx-auto" style={{ maxWidth: 480, whiteSpace: 'pre-wrap' }}>
              {generatedTextAlb}
            </p>
          ) : (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Me gëzim të madh, familjet tona ju ftojnë të ndani gëzimin e martesës.
            </p>
          )}

          <div className="bg-white bg-opacity-70 rounded-lg p-4 inline-block mb-4">
            <p className="text-gray-800 font-semibold text-base">
              📅 {formatDate(weddingDate) || 'Data e Dasmës'}
              {weddingTime && <span className="ml-2">⏰ {weddingTime}</span>}
            </p>
            {venue && (
              <p className="text-gray-700 text-sm mt-1">
                📍 {venue}{venueAddress ? `, ${venueAddress}` : ''}
              </p>
            )}
          </div>

          {(rsvpPhone || rsvpEmail) && (
            <div className="mt-4 pt-4 border-t border-rose-200">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Konfirmoni praninë</p>
              {rsvpPhone && <p className="text-gray-700 text-sm">📞 {rsvpPhone}</p>}
              {rsvpEmail && <p className="text-gray-700 text-sm">✉️ {rsvpEmail}</p>}
            </div>
          )}
        </div>
      </div>

      {/* English side */}
      {showBoth && (
        <div
          id="template1-eng"
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 40%, #fff 100%)',
            padding: '48px 40px',
          }}
        >
          <div className="absolute top-0 left-0 w-16 h-16" style={{ borderTop: '4px solid #ca8a04', borderLeft: '4px solid #ca8a04' }} />
          <div className="absolute top-0 right-0 w-16 h-16" style={{ borderTop: '4px solid #ca8a04', borderRight: '4px solid #ca8a04' }} />
          <div className="absolute bottom-0 left-0 w-16 h-16" style={{ borderBottom: '4px solid #ca8a04', borderLeft: '4px solid #ca8a04' }} />
          <div className="absolute bottom-0 right-0 w-16 h-16" style={{ borderBottom: '4px solid #ca8a04', borderRight: '4px solid #ca8a04' }} />

          <div className="text-center mb-4">
            <span style={{ fontSize: 32 }}>🌸</span>
            <span style={{ fontSize: 32 }}>💍</span>
            <span style={{ fontSize: 32 }}>🌸</span>
          </div>

          <div className="text-center">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-4">
              Wedding Invitation
            </p>
            <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {brideNameEng || 'Bride Name'}
            </h1>
            <div className="flex items-center justify-center gap-3 my-3">
              <div className="h-px w-16 bg-yellow-400" />
              <span className="text-yellow-500 text-xl">&amp;</span>
              <div className="h-px w-16 bg-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {groomNameEng || 'Groom Name'}
            </h1>

            {generatedTextEng ? (
              <p className="text-gray-600 text-sm leading-relaxed mb-6 mx-auto" style={{ maxWidth: 480, whiteSpace: 'pre-wrap' }}>
                {generatedTextEng}
              </p>
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                With great joy, our families invite you to share in the celebration of their marriage.
              </p>
            )}

            <div className="bg-white bg-opacity-70 rounded-lg p-4 inline-block mb-4">
              <p className="text-gray-800 font-semibold text-base">
                📅 {formatDateEn(weddingDate) || 'Wedding Date'}
                {weddingTime && <span className="ml-2">⏰ {weddingTime}</span>}
              </p>
              {venue && (
                <p className="text-gray-700 text-sm mt-1">
                  📍 {venue}{venueAddress ? `, ${venueAddress}` : ''}
                </p>
              )}
            </div>

            {(rsvpPhone || rsvpEmail) && (
              <div className="mt-4 pt-4 border-t border-yellow-200">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">RSVP</p>
                {rsvpPhone && <p className="text-gray-700 text-sm">📞 {rsvpPhone}</p>}
                {rsvpEmail && <p className="text-gray-700 text-sm">✉️ {rsvpEmail}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
