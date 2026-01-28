import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Activity, Shield, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { analyzePasswordWithGemini } from './services/geminiService';
import AnalysisDisplay from './components/AnalysisDisplay';

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [strength, setStrength] = useState(0);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength(0);
      return;
    }
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(score);
  }, [password]);

  const getStrengthStyles = (s: number) => {
    if (s === 0) return { width: '0%', color: 'bg-transparent', label: '' };
    if (s <= 1) return { width: '20%', color: 'bg-red-500', shadow: 'shadow-red-500/50', label: 'Très faible' };
    if (s === 2) return { width: '40%', color: 'bg-orange-500', shadow: 'shadow-orange-500/50', label: 'Faible' };
    if (s === 3) return { width: '60%', color: 'bg-yellow-400', shadow: 'shadow-yellow-400/50', label: 'Moyen' };
    if (s === 4) return { width: '80%', color: 'bg-blue-400', shadow: 'shadow-blue-400/50', label: 'Fort' };
    return { width: '100%', color: 'bg-emerald-400', shadow: 'shadow-emerald-400/50', label: 'Très fort' };
  };

  const strengthStyle = getStrengthStyles(strength);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !hasConsented) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisText = await analyzePasswordWithGemini(password);
      setResult(analysisText);
    } catch (err) {
      setError("Une erreur est survenue lors de l'analyse. Veuillez vérifier votre connexion ou réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setPassword('');
    setResult(null);
    setError(null);
    setHasConsented(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 flex flex-col items-center p-4 md:p-8">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col items-center mb-8 animate-fade-in-down">
        {/* Animated Logo */}
        <div className="relative mb-6 group cursor-default">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-[pulse_3s_ease-in-out_infinite] transition-all duration-500 group-hover:bg-blue-400/30 group-hover:blur-2xl"></div>
          <div className="relative p-4 bg-blue-500/10 rounded-full border border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] backdrop-blur-sm transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
            <Shield className="w-12 h-12 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          </div>
        </div>

        {/* Enhanced Gradient Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400 drop-shadow-sm mb-4 tracking-tight py-1">
          PassSecurity
        </h1>

        <p className="text-slate-400 text-center max-w-lg text-lg">
          Analysez la robustesse de vos mots de passe avec l'expertise de l'Intelligence Artificielle.
        </p>

        {/* Animated Status Badge */}
        <div className="flex items-center gap-2 mt-4 text-xs font-mono text-emerald-500/80 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-900/50 hover:border-emerald-500/30 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Système Sécurisé & Anonyme
        </div>
      </header>

      {/* Main Input Section */}
      <main className="w-full max-w-2xl flex flex-col items-center gap-6 z-10">
        
        {/* Security Warning Box */}
        <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200/80 leading-relaxed">
            <strong className="text-amber-400 block mb-1">Principe de précaution</strong>
            Ne saisissez jamais vos mots de passe réels actifs (banque, email, etc.). Utilisez cet outil pour tester des variantes ou comprendre la structure d'un mot de passe fort.
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-full bg-slate-900 border border-white/10 hover:border-blue-400/30 focus-within:border-emerald-400/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all duration-300 rounded-2xl p-2 md:p-3 flex items-center shadow-2xl z-20">
            <div className="pl-4 pr-3 text-slate-500">
              <Lock className="w-6 h-6" />
            </div>
            
            <input
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez un mot de passe fictif à tester..."
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-lg md:text-xl text-white placeholder-slate-600 font-mono tracking-wider py-3"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              data-form-type="other"
            />

            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="p-3 mr-1 text-slate-500 hover:text-[#80B3FF] transition-colors rounded-lg hover:bg-slate-800/50 flex items-center justify-center"
              title={isVisible ? "Masquer" : "Afficher"}
            >
              {isVisible ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
            </button>

            <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>

            <button
              type="submit"
              disabled={isLoading || !password || !hasConsented}
              className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 
                ${isLoading || !password || !hasConsented
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)]'
                }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyse...</span>
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  <span>Scanner</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Strength Indicator */}
          <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex transition-all duration-300 relative">
             <div 
               className={`h-full rounded-full transition-all duration-500 ease-out ${strengthStyle.color} ${strength > 0 ? strengthStyle.shadow : ''} shadow-[0_0_10px_currentColor]`}
               style={{ width: strengthStyle.width }}
             ></div>
          </div>
          <div className="flex justify-end mt-1 mb-4">
             <span className={`text-xs font-medium transition-colors duration-300 ${strengthStyle.color.replace('bg-', 'text-')}`}>
               {strength > 0 && strengthStyle.label}
             </span>
          </div>

          {/* Mandatory Consent Checkbox */}
          <div className="flex items-start gap-3 px-1 mt-4">
            <div className="relative flex items-center mt-0.5">
              <input
                type="checkbox"
                id="consent"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-600 bg-slate-900/50 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-slate-500"
              />
              <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 scale-50 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100" strokeWidth={3} />
            </div>
            <label htmlFor="consent" className="text-sm text-slate-400 cursor-pointer select-none leading-tight">
              Je certifie que ce mot de passe est un <span className="text-blue-400 font-medium">test</span> et ne correspond à aucun de mes comptes réels critiques.
            </label>
          </div>

          {/* Mobile Button */}
          <button
              type="submit"
              disabled={isLoading || !password || !hasConsented}
              className={`mt-6 w-full md:hidden flex justify-center items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 
                ${isLoading || !password || !hasConsented
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-70' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  <span>Lancer l'analyse de sécurité</span>
                </>
              )}
            </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="w-full bg-red-950/30 border border-red-500/30 p-4 rounded-xl text-red-400 flex items-center gap-3 animate-fade-in">
            <Shield className="w-6 h-6 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="w-full flex flex-col items-center animate-fade-in-up">
            <AnalysisDisplay resultText={result} />
            
            <button 
              onClick={clearAll}
              className="mt-8 text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm border-b border-transparent hover:border-white/20 pb-1"
            >
              <RefreshCw className="w-4 h-4" />
              Effectuer une nouvelle analyse
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto pt-16 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} PassSecurity. Sécurité & Pédagogie.</p>
      </footer>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default App;