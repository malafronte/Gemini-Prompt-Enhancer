import React, { useState, useEffect } from 'react';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../services/geminiService';
import { XIcon, UploadIcon, DownloadIcon } from './Icons';
import { translations } from '../i18n';

type Translation = typeof translations.it;

export interface AppSettings {
  geminiModel: 'gemini-2.5-pro' | 'gemini-2.5-flash';
  systemInstruction: string;
  language: 'it' | 'en';
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  settings: AppSettings;
  onExport: () => void;
  onImport: () => void;
  defaultSystemInstruction: string;
  t: Translation;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  settings,
  onExport,
  onImport,
  defaultSystemInstruction,
  t,
}) => {
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setCurrentSettings(settings);
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    onSave(currentSettings);
  };

  const handleRestoreDefault = () => {
    setCurrentSettings(prev => ({ ...prev, systemInstruction: defaultSystemInstruction }));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{t.settingsTitle}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
            <XIcon className="w-6 h-6 text-gray-400" />
          </button>
        </header>
        
        <main className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Language Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">{t.language}</h3>
            <p className="text-sm text-gray-400 mb-3">{t.languageDescription}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center p-3 border border-gray-600 rounded-md bg-gray-900 has-[:checked]:bg-blue-900/50 has-[:checked]:border-blue-500 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="language"
                  value="it"
                  checked={currentSettings.language === 'it'}
                  onChange={(e) => setCurrentSettings(prev => ({ ...prev, language: e.target.value as AppSettings['language'] }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-200">Italiano</span>
              </label>
              <label className="flex items-center p-3 border border-gray-600 rounded-md bg-gray-900 has-[:checked]:bg-blue-900/50 has-[:checked]:border-blue-500 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={currentSettings.language === 'en'}
                  onChange={(e) => setCurrentSettings(prev => ({ ...prev, language: e.target.value as AppSettings['language'] }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-200">English</span>
              </label>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">{t.geminiModel}</h3>
            <p className="text-sm text-gray-400 mb-3">{t.geminiModelDescription}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center p-3 border border-gray-600 rounded-md bg-gray-900 has-[:checked]:bg-blue-900/50 has-[:checked]:border-blue-500 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="gemini-model"
                  value="gemini-2.5-pro"
                  checked={currentSettings.geminiModel === 'gemini-2.5-pro'}
                  onChange={(e) => setCurrentSettings(prev => ({ ...prev, geminiModel: e.target.value as AppSettings['geminiModel'] }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-200">Gemini 2.5 Pro</span>
              </label>
              <label className="flex items-center p-3 border border-gray-600 rounded-md bg-gray-900 has-[:checked]:bg-blue-900/50 has-[:checked]:border-blue-500 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="gemini-model"
                  value="gemini-2.5-flash"
                  checked={currentSettings.geminiModel === 'gemini-2.5-flash'}
                  onChange={(e) => setCurrentSettings(prev => ({ ...prev, geminiModel: e.target.value as AppSettings['geminiModel'] }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-200">Gemini 2.5 Flash</span>
              </label>
            </div>
          </div>

          {/* System Instruction */}
          <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="system-instruction" className="block text-lg font-semibold text-gray-200">
                    {t.systemInstruction}
                </label>
                <button 
                    onClick={handleRestoreDefault}
                    className="text-xs text-blue-400 hover:underline">
                    {t.restoreDefault}
                </button>
            </div>
             <p className="text-sm text-gray-400 mb-3">
              {t.systemInstructionDescription}
            </p>
            <textarea
              id="system-instruction"
              rows={10}
              value={currentSettings.systemInstruction}
              onChange={(e) => setCurrentSettings(prev => ({ ...prev, systemInstruction: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            />
          </div>

          {/* Data Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">{t.dataManagement}</h3>
             <p className="text-sm text-gray-400 mb-3">
              {t.dataManagementDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onImport}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
              >
                <UploadIcon className="w-5 h-5"/>
                {t.importData}
              </button>
              <button
                onClick={onExport}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
              >
                <DownloadIcon className="w-5 h-5"/>
                {t.exportData}
              </button>
            </div>
          </div>
        </main>

        <footer className="p-4 flex justify-end gap-3 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            {t.saveSettings}
          </button>
        </footer>
      </div>
    </div>
  );
};