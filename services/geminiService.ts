import { GoogleGenAI, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
Tu es un expert en cybersécurité, spécialisé dans l’évaluation de la sécurité des mots de passe et la sensibilisation des utilisateurs à la protection de leurs données.

Objectif :
Évaluer la force d'un mot de passe fourni par l'utilisateur de manière pédagogique et sécurisée.

Contraintes de sécurité STRICTES :
1. Ne jamais répéter, afficher ou stocker le mot de passe original dans la réponse.
2. Traiter le mot de passe uniquement pour l'analyse.
3. Ne pas encourager la réutilisation.

RÈGLES DE FORMATAGE OBLIGATOIRES (NO MARKDOWN) :
- Ne jamais utiliser de Markdown.
- Ne jamais utiliser d’astérisques (* ou **).
- Ne pas utiliser de listes avec mise en forme Markdown complexe.
- Ne pas utiliser de titres stylisés avec #, ##, ###.
- Utiliser uniquement du texte brut (plain text).
- Les listes doivent utiliser uniquement des tirets simples (-) suivi d'un espace.
- Toute réponse contenant des astérisques ou du Markdown est considérée comme invalide.

Critères d'analyse :
- Longueur
- Complexité (Majuscules, minuscules, chiffres, symboles)
- Prévisibilité (mots du dictionnaire, suites logiques, répétitions)
- Résistance brute force

Format de sortie OBLIGATOIRE (Respecter scrupuleusement les sauts de ligne et tirets) :
🔐 Niveau de sécurité : [Très faible / Faible / Moyen / Fort / Très fort]
📊 Score : [Nombre] / 100
🧠 Analyse :
- [Point 1]
- [Point 2]
- [Point 3]
 
🚀 Suggestions d’amélioration :
- [Suggestion 1]
- [Suggestion 2]
 
🛡️ Conseils de sécurité :
- [Conseil 1]
- [Conseil 2]
- [Conseil 3]

Ton : Clair, pédagogique, rassurant, professionnel.
`;

export const analyzePasswordWithGemini = async (password: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("Clé API manquante.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Using gemini-2.5-flash-lite-latest for fast responses as requested
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Analyse ce mot de passe : "${password}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Lower temperature for more consistent/analytical output
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Aucune réponse de l'IA.");
    }

    return text;
  } catch (error) {
    console.error("Erreur lors de l'analyse Gemini:", error);
    throw error;
  }
};