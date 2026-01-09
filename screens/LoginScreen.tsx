
import React, { useState } from 'react';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

// Fixed the global window declaration to match the expected AIStudio interface.
// Modifiers must be identical across all declarations of the same property.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Removed the readonly modifier to resolve conflicts with other environment declarations 
    // that might not have the readonly modifier for this specific global.
    aistudio: AIStudio;
  }
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    try {
      // Per instructions: check if key is selected. If not, open selector.
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }

      // We assume the key selection was successful and proceed to the app
      // to mitigate the race condition where hasSelectedApiKey() might not update immediately.
      
      const mockNames = ["Mohammad Al-Fares", "Sara Ahmed", "Omar Khaled", "Layla Hassan"];
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      
      onLogin({
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: randomName.toLowerCase().replace(' ', '.') + '@gmail.com',
        displayName: randomName,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomName}`,
        isPremium: false
      });
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600/20 text-indigo-500 rounded-3xl mb-6 shadow-2xl shadow-indigo-500/20">
            <i className="fa-solid fa-robot text-4xl"></i>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Besoo host</h1>
          <p className="text-slate-400 text-lg">Deploy Python bots in seconds.</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">Cloud Authentication</h2>
              <p className="text-sm text-slate-500">Connect your Google account and API Key</p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 px-6 rounded-2xl hover:bg-slate-100 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl"
            >
              {isConnecting ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-slate-500 font-medium">Safe & Secure</span>
              </div>
            </div>

            <p className="text-xs text-center text-slate-500 leading-relaxed">
              Required: A valid API Key from a paid GCP project. <br/>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">View Billing Documentation</a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Powered by Docker & Gemini API</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
