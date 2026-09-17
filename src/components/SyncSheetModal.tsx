import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { parseStudentsFromCSV } from '../utils/csvParser';
import {
  X,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  RotateCcw,
} from 'lucide-react';

interface SyncSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudents: (students: StudentProfile[]) => void;
  onResetDefault: () => void;
  currentCount: number;
}

export const SyncSheetModal: React.FC<SyncSheetModalProps> = ({
  isOpen,
  onClose,
  onUpdateStudents,
  onResetDefault,
  currentCount,
}) => {
  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem('uppseekers_saved_sheet_url') || '';
  });
  const [csvPasteText, setCsvPasteText] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'paste'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanUrl = sheetUrl.trim();
    if (!cleanUrl) {
      setError('Please enter a valid Google Sheet or CSV URL.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/sheets/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl: cleanUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.csvText) {
        throw new Error(data.error || 'Failed to fetch spreadsheet. Please ensure it is accessible.');
      }

      const parsedStudents = parseStudentsFromCSV(data.csvText);
      if (parsedStudents.length === 0) {
        throw new Error('No valid student profiles could be parsed from this spreadsheet.');
      }

      // Save preference & apply
      localStorage.setItem('uppseekers_saved_sheet_url', cleanUrl);
      onUpdateStudents(parsedStudents);
      setSuccessMsg(`Successfully imported ${parsedStudents.length} student profiles from Google Sheets!`);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while fetching the sheet.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPastedCsv = () => {
    setError(null);
    setSuccessMsg(null);

    const cleanText = csvPasteText.trim();
    if (!cleanText) {
      setError('Please paste your CSV data.');
      return;
    }

    try {
      const parsedStudents = parseStudentsFromCSV(cleanText);
      if (parsedStudents.length === 0) {
        setError('No valid student records found in the pasted data. Please check header column format.');
        return;
      }

      onUpdateStudents(parsedStudents);
      setSuccessMsg(`Successfully updated database with ${parsedStudents.length} student profiles!`);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse CSV.';
      setError(msg);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('File is empty');
        const parsed = parseStudentsFromCSV(text);
        if (parsed.length === 0) {
          throw new Error('No student rows could be parsed from this file.');
        }
        onUpdateStudents(parsed);
        setSuccessMsg(`Imported ${parsed.length} student profiles from ${file.name}!`);
        setTimeout(() => {
          onClose();
        }, 1400);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to read file.';
        setError(msg);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Update Student Dataset</h3>
              <p className="text-xs text-slate-500">Currently active: {currentCount} student dossiers</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 text-xs font-semibold px-2 border-b-2 transition-colors ${
              activeTab === 'url'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Google Sheet URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 text-xs font-semibold px-2 border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paste CSV or Upload File
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {activeTab === 'url' ? (
            <form onSubmit={handleFetchSheet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Google Sheet Link
                </label>
                <input
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => {
                    setSheetUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Make sure your Google Sheet is shared with <strong>"Anyone with the link can view"</strong> (or published to web as CSV via File &rarr; Share &rarr; Publish to web).
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>{isLoading ? 'Fetching & Parsing...' : 'Sync / Refresh from Sheet'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Paste Raw CSV Data
                </label>
                <textarea
                  rows={5}
                  value={csvPasteText}
                  onChange={(e) => {
                    setCsvPasteText(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Paste comma-separated rows or exported table text here..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyPastedCsv}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all cursor-pointer text-center"
                >
                  Apply Pasted Text
                </button>

                <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all cursor-pointer">
                  <UploadCloud className="w-4 h-4 text-slate-500" />
                  <span>Upload .CSV File</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Reset to initial built-in dataset */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need to revert changes?</span>
            <button
              type="button"
              onClick={() => {
                onResetDefault();
                setSuccessMsg('Reverted to default built-in dataset.');
                setTimeout(() => onClose(), 1000);
              }}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
