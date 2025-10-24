import React, { useState, useCallback, useEffect, useRef } from 'react';
import { enhancePrompt, DEFAULT_SYSTEM_INSTRUCTION } from './services/geminiService';
import { SparklesIcon, CopyIcon, CheckIcon, MenuIcon, PlusIcon, PencilIcon, TrashIcon, SettingsIcon } from './components/Icons';
import { HistorySidebar, HistoryItem } from './components/HistorySidebar';
import { initialTemplates, PromptTemplate } from './templates';
import { TemplateModal } from './components/TemplateModal';
import { SettingsModal, AppSettings } from './components/SettingsModal';
import { translations } from './i18n';

const Loader: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
  </div>
);

const HISTORY_KEY = 'gemini-prompt-enhancer-history';
const TEMPLATES_KEY = 'gemini-prompt-enhancer-templates';
const SETTINGS_KEY = 'gemini-prompt-enhancer-settings';

const App: React.FC = () => {
  const [originalPrompt, setOriginalPrompt] = useState<string>('');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false); 
  
  // Open sidebar by default on large screens on initial load
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsHistoryOpen(true);
    }
  }, []);


  // Template State
  const [templates, setTemplates] = useState<PromptTemplate[]>(() => {
    try {
      const storedTemplates = localStorage.getItem(TEMPLATES_KEY);
      return storedTemplates ? JSON.parse(storedTemplates) : initialTemplates;
    } catch (error) {
      console.error("Failed to load templates from localStorage", error);
      return initialTemplates;
    }
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);

  // Settings State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
      try {
          const storedSettings = localStorage.getItem(SETTINGS_KEY);
          if (storedSettings) {
              return JSON.parse(storedSettings);
          }
      } catch (error) {
          console.error("Failed to load settings from localStorage", error);
      }
      return {
          geminiModel: 'gemini-2.5-pro',
          systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
          language: 'it',
      };
  });
  
  const t = translations[settings.language];


  // Effect for History
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  // Effect for Templates
  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error("Failed to save templates to localStorage", error);
    }
  }, [templates]);

  // Effect for Settings
  useEffect(() => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  const handleEnhance = useCallback(async () => {
    if (!originalPrompt.trim()) {
      return;
    }
    setIsLoading(true);
    setError(null);
    setEnhancedPrompt('');
    setIsCopied(false);

    try {
      const result = await enhancePrompt(originalPrompt, settings.geminiModel, settings.systemInstruction);
      setEnhancedPrompt(result);
      const newHistoryItem: HistoryItem = {
        id: self.crypto.randomUUID(),
        originalPrompt,
        enhancedPrompt: result,
        timestamp: Date.now(),
      };
      setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      setEnhancedPrompt('');
    } finally {
      setIsLoading(false);
    }
  }, [originalPrompt, settings]);

  const handleCopy = useCallback(() => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [enhancedPrompt]);
  
  const handleSelectItem = useCallback((item: HistoryItem) => {
    setOriginalPrompt(item.originalPrompt);
    setEnhancedPrompt(item.enhancedPrompt);
    setError(null);
    setIsCopied(false);
    setSelectedTemplateId('');
    if (window.innerWidth < 1024) {
      setIsHistoryOpen(false);
    }
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const selected = templates.find(t => t.id === id);
    setSelectedTemplateId(id);
    if (selected) {
      setOriginalPrompt(selected.prompt);
    } else {
        setOriginalPrompt('');
    }
  };
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOriginalPrompt(e.target.value);
    if (selectedTemplateId) {
      setSelectedTemplateId('');
    }
  };

  const handleOpenModalForAdd = () => {
    setEditingTemplate(null);
    setIsTemplateModalOpen(true);
  };
  
  const handleOpenModalForEdit = () => {
    const templateToEdit = templates.find(t => t.id === selectedTemplateId);
    if (templateToEdit) {
      setEditingTemplate(templateToEdit);
      setIsTemplateModalOpen(true);
    }
  };
  
  const handleDeleteTemplate = () => {
    if (selectedTemplateId && window.confirm(t.deleteTemplateConfirm)) {
      setTemplates(prev => prev.filter(t => t.id !== selectedTemplateId));
      setSelectedTemplateId('');
      setOriginalPrompt('');
    }
  };

  const handleSaveTemplate = (template: PromptTemplate) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates(prev => [...prev, template]);
      setSelectedTemplateId(template.id);
      setOriginalPrompt(template.prompt);
    }
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setIsSettingsModalOpen(false);
  };

  const handleExportData = () => {
    try {
      const dataToExport = {
        history,
        templates,
        settings,
      };
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prompt-enhancer-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export data", err);
      setError(t.exportError);
    }
  };

  const handleTriggerImport = () => {
    importFileRef.current?.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File content is not readable text.");
        }
        const importedData = JSON.parse(text);

        if (window.confirm(t.importConfirm)) {
          // Basic validation
          if (Array.isArray(importedData.history)) {
            setHistory(importedData.history);
          }
          if (Array.isArray(importedData.templates)) {
            setTemplates(importedData.templates);
          }
           if (typeof importedData.settings === 'object' && importedData.settings !== null) {
            setSettings(importedData.settings);
          }
          alert(t.importSuccess);
        }
      } catch (err) {
        console.error("Failed to import data", err);
        setError(t.importError);
      } finally {
        // Reset the input value to allow importing the same file again
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.onerror = () => {
       setError(t.importReadError);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
      <HistorySidebar
        isOpen={isHistoryOpen}
        history={history}
        onSelectItem={handleSelectItem}
        onDeleteItem={handleDeleteItem}
        onClearHistory={handleClearHistory}
        onClose={() => setIsHistoryOpen(false)}
        t={t}
      />
      <main
        className={`flex-1 flex flex-col items-center p-4 transition-all duration-300 ease-in-out min-w-0 ${
          isHistoryOpen ? 'lg:ml-80' : 'ml-0'
        }`}
      >
        <div className="w-full max-w-4xl mx-auto">
          <header className="flex items-center justify-between gap-4 text-center mb-6 sm:mb-8 w-full py-4">
              <button
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="p-2 rounded-md hover:bg-gray-700 transition-colors"
                  aria-label={t.toggleHistory}
              >
                  <MenuIcon className="w-6 h-6 text-gray-400" />
              </button>
              
              <div className='flex-1 min-w-0'>
                  <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight whitespace-nowrap">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                          {t.appTitle}
                      </span>
                  </h1>
                  <p className="hidden sm:block mt-1 text-sm text-gray-400">
                      {t.appSubtitle}
                  </p>
              </div>

              <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 rounded-md hover:bg-gray-700 transition-colors"
                  aria-label={t.openSettings}
              >
                  <SettingsIcon className="w-6 h-6 text-gray-400" />
              </button>
          </header>

          <div className="space-y-6">
            {/* Input Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-4 sm:p-6">
              <div className="mb-4">
                <label htmlFor="template-select" className="block text-sm font-medium text-gray-300 mb-2">
                  {t.chooseOrManageTemplate}
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    id="template-select"
                    className="flex-grow bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    onChange={handleTemplateChange}
                    value={selectedTemplateId}
                  >
                    <option value="" disabled>{t.selectTemplatePlaceholder}</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.title}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={handleOpenModalForAdd} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors" aria-label={t.addNewTemplate}><PlusIcon className="w-5 h-5"/></button>
                    <button onClick={handleOpenModalForEdit} disabled={!selectedTemplateId} className="p-3 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label={t.editSelectedTemplate}><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={handleDeleteTemplate} disabled={!selectedTemplateId} className="p-3 bg-red-800 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label={t.deleteSelectedTemplate}><TrashIcon className="w-5 h-5"/></button>
                  </div>
                </div>
              </div>

              <label htmlFor="original-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                {t.initialPromptLabel}
              </label>
              <div className="relative">
                <textarea
                  id="original-prompt"
                  rows={8}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y"
                  placeholder={t.initialPromptPlaceholder}
                  value={originalPrompt}
                  onChange={handlePromptChange}
                />
              </div>
              <div className="mt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                 <button
                  onClick={() => {
                      setOriginalPrompt('');
                      setSelectedTemplateId('');
                  }}
                  disabled={!originalPrompt.trim() || isLoading}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {t.clear}
                </button>
                <button
                  onClick={handleEnhance}
                  disabled={isLoading || !originalPrompt.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                      t.enhancing
                  ) : (
                      <>
                          <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
                          {t.enhance}
                      </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Section */}
            {isLoading && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-10 flex justify-center items-center">
                  <Loader />
              </div>
            )}
            
            {error && !isLoading && (
              <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 text-red-300">
                  <p><strong>{t.errorPrefix}</strong> {error}</p>
              </div>
            )}

            {enhancedPrompt && !isLoading && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg relative">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-200">
                    {t.enhancedPromptTitle}
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
                  >
                    {isCopied ? (
                      <>
                          <CheckIcon className="w-4 h-4 mr-2 text-green-400" />
                          {t.copied}
                      </>
                    ) : (
                      <>
                          <CopyIcon className="w-4 h-4 mr-2" />
                          {t.copy}
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6 overflow-x-auto">
                  <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {enhancedPrompt}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <footer className="text-center mt-8 sm:mt-12 text-gray-500 text-sm">
              <p>{t.poweredBy}</p>
          </footer>
        </div>
      </main>
       <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
        template={editingTemplate}
        t={t}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        onExport={handleExportData}
        onImport={handleTriggerImport}
        defaultSystemInstruction={DEFAULT_SYSTEM_INSTRUCTION}
        t={t}
      />
       <input
        type="file"
        ref={importFileRef}
        className="hidden"
        accept=".json"
        onChange={handleImportData}
      />
    </div>
  );
};

export default App;