import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUp, 
  Zap, 
  Siren, 
  KeyRound, 
  Sparkles 
} from 'lucide-react';

interface AnalysisDisplayProps {
  resultText: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ resultText }) => {
  
  // Helper to determine main color theme based on text content
  const getTheme = (text: string) => {
    if (text.includes("Très fort")) return { 
      level: "Très fort",
      color: "text-emerald-400", 
      borderColor: "border-emerald-500/30", 
      bgColor: "bg-emerald-500/10", 
      ringColor: "text-emerald-400", 
      shadow: "shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)]",
      icon: <ShieldCheck className="w-10 h-10 text-emerald-400" /> 
    };
    if (text.includes("Fort")) return { 
      level: "Fort",
      color: "text-green-400", 
      borderColor: "border-green-500/30", 
      bgColor: "bg-green-500/10", 
      ringColor: "text-green-400", 
      shadow: "shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]",
      icon: <CheckCircle className="w-10 h-10 text-green-400" /> 
    };
    if (text.includes("Moyen")) return { 
      level: "Moyen",
      color: "text-yellow-400", 
      borderColor: "border-yellow-500/30", 
      bgColor: "bg-yellow-500/10", 
      ringColor: "text-yellow-400", 
      shadow: "shadow-[0_0_30px_-5px_rgba(250,204,21,0.3)]",
      icon: <Shield className="w-10 h-10 text-yellow-400" /> 
    };
    if (text.includes("Faible")) return { 
      level: "Faible",
      color: "text-orange-400", 
      borderColor: "border-orange-500/30", 
      bgColor: "bg-orange-500/10", 
      ringColor: "text-orange-400", 
      shadow: "shadow-[0_0_30px_-5px_rgba(251,146,60,0.3)]",
      icon: <AlertTriangle className="w-10 h-10 text-orange-400" /> 
    };
    // Très faible / Default
    return { 
      level: "Très faible",
      color: "text-red-400", 
      borderColor: "border-red-500/30", 
      bgColor: "bg-red-500/10", 
      ringColor: "text-red-400", 
      shadow: "shadow-[0_0_30px_-5px_rgba(248,113,113,0.3)]",
      icon: <ShieldAlert className="w-10 h-10 text-red-400 animate-pulse" /> 
    };
  };

  // Helper for Suggestion Styles specifically (Actionable items)
  const getSuggestionStyle = (text: string) => {
    if (text.includes("Très faible") || text.includes("Faible")) {
      return {
        icon: <Siren className="w-5 h-5 text-red-400" />,
        containerBg: "bg-red-900/20",
        containerBorder: "border-red-500/20",
        textColor: "text-red-200"
      };
    }
    if (text.includes("Moyen")) {
      return {
        icon: <Zap className="w-5 h-5 text-yellow-400" />,
        containerBg: "bg-yellow-900/20",
        containerBorder: "border-yellow-500/20",
        textColor: "text-yellow-200"
      };
    }
    // Strong / Very Strong
    return {
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      containerBg: "bg-emerald-900/20",
      containerBorder: "border-emerald-500/20",
      textColor: "text-emerald-200"
    };
  };

  const theme = getTheme(resultText);
  const suggestionStyle = getSuggestionStyle(resultText);

  // Parse the raw text into sections
  const parseSection = (header: string): string[] => {
    const regex = new RegExp(`${header}\\s*:?\\n((?:- .+\\n?)+)`, 'i');
    const match = resultText.match(regex);
    if (match && match[1]) {
      return match[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim());
    }
    return [];
  };

  const scoreMatch = resultText.match(/Score\s*:\s*(\d+)/i);
  const targetScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
  
  const levelMatch = resultText.match(/Niveau de sécurité\s*:\s*(.+)/i);
  const level = levelMatch ? levelMatch[1].trim() : theme.level;

  const analysisPoints = parseSection("🧠 Analyse");
  const suggestions = parseSection("🚀 Suggestions d’amélioration");
  const tips = parseSection("🛡️ Conseils de sécurité");

  // Animation for score
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0); // Reset animation on new result
    const duration = 2000;
    const startTime = performance.now();
    const start = 0;
    const end = targetScore;

    if (end === 0) return;

    const animateScore = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedScore(Math.floor(start + (end - start) * ease));

      if (progress < 1) {
        requestAnimationFrame(animateScore);
      }
    };
    requestAnimationFrame(animateScore);
  }, [targetScore]);

  // SVG Circle calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={`mt-8 w-full max-w-3xl rounded-2xl border ${theme.borderColor} ${theme.bgColor} backdrop-blur-md p-6 md:p-8 shadow-2xl transition-all duration-700 animate-fade-in`}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 mb-8 gap-8 md:gap-0">
        
        {/* Left Info: Icon & Level */}
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-2xl bg-slate-900/60 border ${theme.borderColor} ${theme.shadow} transition-all duration-500`}>
            {theme.icon}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">Diagnostic Global</h2>
            <p className={`text-3xl font-bold ${theme.color} tracking-tight transition-colors duration-500`}>{level}</p>
          </div>
        </div>

        {/* Right Info: Animated Score Circle with Dynamic Frame */}
        <div className="relative group">
          {/* Background Glow */}
          <div className={`absolute -inset-4 bg-gradient-to-r from-transparent via-${theme.color.split('-')[1]}-500/20 to-transparent blur-xl opacity-30 transition-all duration-700`}></div>
          
          <div className={`relative w-32 h-32 flex items-center justify-center rounded-full border-4 ${theme.borderColor} bg-slate-950/80 ${theme.shadow} transition-all duration-700`}>
            <svg className="w-full h-full transform -rotate-90 p-1">
              {/* Background Track */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-slate-800/50"
              />
              {/* Animated Progress */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`${theme.ringColor} transition-all duration-100 ease-out drop-shadow-[0_0_4px_currentColor]`}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${theme.color} leading-none tracking-tighter transition-transform duration-300 group-hover:scale-110`}>
                {animatedScore}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                / 100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Analysis Column */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                <span className="text-xl">🧠</span> Analyse Technique
              </h3>
              <ul className="space-y-3">
                {analysisPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${theme.color} bg-current opacity-80`}></div>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
                {analysisPoints.length === 0 && <p className="text-slate-500 text-sm italic">Analyse détaillée non disponible.</p>}
              </ul>
            </div>

            {/* Suggestions Column */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
                <ArrowUp className="w-5 h-5 text-blue-400" /> Actions Recommandées
              </h3>
              <ul className="space-y-3">
                {suggestions.map((point, i) => (
                  <li key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${suggestionStyle.containerBg} ${suggestionStyle.containerBorder} animate-fade-in hover:bg-opacity-30 transition-colors`} style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="flex-shrink-0 mt-0.5">
                      {suggestionStyle.icon}
                    </div>
                    <span className={`text-sm font-medium ${suggestionStyle.textColor} leading-relaxed`}>{point}</span>
                  </li>
                ))}
                 {suggestions.length === 0 && <p className="text-slate-500 text-sm italic">Aucune suggestion spécifique.</p>}
              </ul>
            </div>
        </div>

        {/* Footer Tips */}
        <div className="pt-6 border-t border-white/5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200 mb-4">
            <KeyRound className="w-5 h-5 text-purple-400" /> Bonnes Pratiques de Sécurité
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tips.map((point, i) => (
                <div key={i} className="bg-slate-900/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-3 group">
                  <div className="p-2 bg-slate-900/50 w-fit rounded-lg text-slate-400 group-hover:text-blue-400 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{point}</p>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisDisplay;