import React from 'react';
import { TrashIcon } from './Icons';
import { translations } from '../i18n';

type Translation = typeof translations.it;

export interface HistoryItem {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  timestamp: number;
}

interface HistorySidebarProps {
  isOpen: boolean;
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
  t: Translation;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  history,
  onSelectItem,
  onDeleteItem,
  onClearHistory,
  onClose,
  t
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-80 flex flex-col bg-gray-800/95 backdrop-blur-sm border-r border-gray-700 transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-shrink-0 p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-200">{t.historyTitle}</h2>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 p-4 italic">
              {t.noHistory}
            </div>
          ) : (
            <ul>
              {history.map((item) => (
                <li key={item.id} className="mx-2 my-1">
                  <button
                    onClick={() => onSelectItem(item)}
                    className="w-full text-left p-2.5 rounded-md group hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 overflow-hidden">
                          <p className="text-sm text-gray-200 font-medium truncate">
                              {item.originalPrompt}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                              {new Date(item.timestamp).toLocaleString()}
                          </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="ml-2 p-1 rounded-full text-gray-500 hover:text-red-400 hover:bg-gray-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                        aria-label={t.deleteItem}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onClearHistory}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-700 text-sm font-medium rounded-md shadow-sm text-red-300 bg-red-900/50 hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              {t.clearAllHistory}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};