import React, { useState, useEffect } from 'react';
import { PromptTemplate } from '../templates';
import { XIcon } from './Icons';
import { translations } from '../i18n';

type Translation = typeof translations.it;

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: PromptTemplate) => void;
  template: PromptTemplate | null; // null for adding, object for editing
  t: Translation;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSave, template, t }) => {
  const [title, setTitle] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (template) {
        setTitle(template.title);
        setPromptContent(template.prompt);
      } else {
        setTitle('');
        setPromptContent('');
      }
      setError('');
    }
  }, [isOpen, template]);

  const handleSave = () => {
    if (!title.trim() || !promptContent.trim()) {
      setError(t.modalError);
      return;
    }

    onSave({
      id: template?.id || self.crypto.randomUUID(),
      title: title.trim(),
      prompt: promptContent,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{template ? t.editTemplateTitle : t.addTemplateTitle}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
            <XIcon className="w-6 h-6 text-gray-400" />
          </button>
        </header>
        
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label htmlFor="template-title" className="block text-sm font-medium text-gray-300 mb-1">
                {t.templateTitleLabel}
              </label>
              <input
                id="template-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t.templateTitlePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="template-content" className="block text-sm font-medium text-gray-300 mb-1">
                {t.promptContentLabel}
              </label>
              <textarea
                id="template-content"
                rows={15}
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                placeholder={t.promptContentPlaceholder}
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </main>

        <footer className="p-4 flex justify-end gap-3 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t.saveTemplate}
          </button>
        </footer>
      </div>
    </div>
  );
};