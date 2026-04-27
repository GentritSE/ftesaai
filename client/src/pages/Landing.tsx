import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💍</span>
          <span className="font-bold text-xl text-gray-900">FtesaAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-700">Admin</Link>
          <Link to="/create" className="btn-primary text-sm py-2 px-4">
            Krijo Ftesën
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <span>🎊</span>
          <span>Dygjuhësh Shqip + Anglisht</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Ftesa e dasmës suaj —<br />
          <span className="text-rose-600">shqip dhe anglisht,</span><br />
          gati në 2 minuta
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Për çiftet shqiptare kudo në botë. Dizajn elegant, dygjuhësh, gati për print dhe WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link to="/create" className="btn-primary text-lg py-4 px-8 w-full sm:w-auto">
            🎊 Krijo ftesën tënde — 9€
          </Link>
          <a href="#features" className="btn-secondary text-lg py-4 px-8 w-full sm:w-auto">
            Shih si funksionon
          </a>
        </div>

        <p className="text-sm text-gray-500">
          ✓ Pa subscription &nbsp;·&nbsp; ✓ Pagesa me transfertë bankare &nbsp;·&nbsp; ✓ Gati për WhatsApp & print
        </p>
      </section>

      {/* Preview/Demo Templates */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Template-t tona elegante
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Zgjedh stilin tënd — dy gjuhë, një ftesë e përkryer
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Template 1 Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div
                className="h-64 flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)' }}
              >
                <div className="absolute top-0 left-0 w-8 h-8" style={{ borderTop: '3px solid #e11d48', borderLeft: '3px solid #e11d48' }} />
                <div className="absolute top-0 right-0 w-8 h-8" style={{ borderTop: '3px solid #e11d48', borderRight: '3px solid #e11d48' }} />
                <div className="absolute bottom-0 left-0 w-8 h-8" style={{ borderBottom: '3px solid #e11d48', borderLeft: '3px solid #e11d48' }} />
                <div className="absolute bottom-0 right-0 w-8 h-8" style={{ borderBottom: '3px solid #e11d48', borderRight: '3px solid #e11d48' }} />
                <div className="text-center px-6">
                  <div className="text-2xl mb-2">🌹💍🌹</div>
                  <p className="text-rose-600 text-xs uppercase tracking-widest mb-2">Ftesë Martese</p>
                  <p className="font-serif text-2xl font-bold text-gray-800">Arta &amp; Blerim</p>
                  <p className="text-gray-500 text-xs mt-2">12 Korrik 2025 · Prishtinë</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">Template Rozë Elegante</h3>
                <p className="text-sm text-gray-500">Ngjyra të buta, stil klasik romantik</p>
              </div>
            </div>

            {/* Template 2 Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div
                className="h-64 flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #1a0a0f 0%, #3b0d1e 100%)' }}
              >
                <div className="absolute top-3 left-3 text-yellow-400 text-base">✦</div>
                <div className="absolute top-3 right-3 text-yellow-400 text-base">✦</div>
                <div className="absolute bottom-3 left-3 text-yellow-400 text-base">✦</div>
                <div className="absolute bottom-3 right-3 text-yellow-400 text-base">✦</div>
                <div className="text-center px-6">
                  <p className="text-yellow-400 text-xs uppercase tracking-widest mb-2">✦ Wedding Invitation ✦</p>
                  <p className="font-serif text-2xl font-bold text-white">Arta &amp; Blerim</p>
                  <div className="flex items-center justify-center gap-2 my-2">
                    <div className="h-px w-10 bg-yellow-500" />
                    <span className="text-yellow-400">❧</span>
                    <div className="h-px w-10 bg-yellow-500" />
                  </div>
                  <p className="text-gray-300 text-xs mt-1">July 12, 2025 · Pristina</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">Template Ari &amp; Errësirë</h3>
                <p className="text-sm text-gray-500">Stil luksoz, elegancë e thellë</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Si funksionon?
        </h2>
        <p className="text-center text-gray-500 mb-12">4 hapa të thjeshtë</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '1', icon: '📝', title: 'Plotëso formën', desc: 'Emrat, data, vendi, numri i të ftuar' },
            { step: '2', icon: '🤖', title: 'AI gjeneron tekstin', desc: 'Groq/Llama shkruan mesazhin dygjuhësh shqip + anglisht' },
            { step: '3', icon: '💳', title: 'Paguaj me transfertë', desc: 'IBAN-i ynë, transfertë bankare — simpël dhe i sigurt' },
            { step: '4', icon: '⬇️', title: 'Shkarko PDF + PNG', desc: 'Pasi aprovimit, shkarko direkt dhe dërgoi miqve' },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-rose-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Çmimi i thjeshtë</h2>
          <p className="text-gray-500 mb-12">Pa subscription. Pa surpriza. Paguaj njëherë.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="text-4xl font-bold text-gray-900 mb-1">9€</div>
              <div className="text-gray-500 text-sm mb-6">1 ftesë</div>
              <ul className="text-left space-y-3 mb-8">
                {['✓ 2 template elegante', '✓ Dygjuhësh Shqip + Anglisht', '✓ PDF + PNG download', '✓ AI tekst personalizues'].map(f => (
                  <li key={f} className="text-sm text-gray-700">{f}</li>
                ))}
              </ul>
              <Link to="/create" className="btn-primary w-full justify-center">
                Fillo tani
              </Link>
            </div>

            <div className="bg-rose-600 rounded-2xl p-8 shadow-md text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                POPULLAR
              </div>
              <div className="text-4xl font-bold mb-1">15€</div>
              <div className="text-rose-200 text-sm mb-6">1 ftesë, të gjitha template-t</div>
              <ul className="text-left space-y-3 mb-8">
                {['✓ Të gjitha template-t', '✓ Dygjuhësh Shqip + Anglisht', '✓ PDF + PNG download', '✓ AI tekst personalizues', '✓ Prioritet aprovimi'].map(f => (
                  <li key={f} className="text-sm text-rose-100">{f}</li>
                ))}
              </ul>
              <Link to="/create" className="bg-white text-rose-600 hover:bg-rose-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center w-full">
                Fillo tani
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Unique selling point */}
      <section className="py-16 max-w-6xl mx-auto px-6 text-center">
        <div className="bg-gray-900 rounded-3xl p-10 text-white">
          <div className="text-4xl mb-4">🌍</div>
          <h2 className="text-3xl font-bold mb-4">
            Vetëm FtesaAI e bën dygjuhësh
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Canva nuk e bën. Zola nuk e bën. Ne jemi i vetmi tool që gjeneron ftesë martese
            dygjuhësh shqip + anglisht — perfekt për diasporën shqiptare kudo në botë.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">💍</span>
            <span className="font-semibold text-gray-700">FtesaAI</span>
          </div>
          <p>© {new Date().getFullYear()} FtesaAI. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </footer>
    </div>
  );
}
