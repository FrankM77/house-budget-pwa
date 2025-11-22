import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, Trash2, AlertTriangle, ArrowLeft, CheckCircle, FileJson } from 'lucide-react';
import { useEnvelopeStore } from '../store/envelopeStore';

export const SettingsView: React.FC = () => {
  const navigate = useNavigate();
  const { envelopes, transactions, addEnvelope } = useEnvelopeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. EXPORT LOGIC
  const handleExport = () => {
    try {
      const dataToExport = {
        envelopes,
        transactions,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Backup downloaded successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create backup file.' });
    }
  };

  // 2. IMPORT LOGIC
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        // Simple Validation
        if (!Array.isArray(parsed.envelopes) || !Array.isArray(parsed.transactions)) {
          throw new Error('Invalid file format: Missing envelopes or transactions arrays.');
        }

        // Direct State Manipulation (Zustand)
        useEnvelopeStore.setState({
          envelopes: parsed.envelopes,
          transactions: parsed.transactions
        });

        setMessage({ type: 'success', text: 'Data restored successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Invalid backup file. restoration failed.' });
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again if needed
    event.target.value = '';
  };

  // 3. RESET LOGIC
  const handleReset = () => {
    if (window.confirm('Are you sure? This will delete ALL envelopes and transactions permanently.')) {
      useEnvelopeStore.setState({
        envelopes: [],
        transactions: []
      });
      setMessage({ type: 'success', text: 'All data has been cleared.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10 flex items-center shadow-sm">
        <button onClick={() => navigate('/')} className="mr-3 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Settings & Backup</h1>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-6">
        
        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Data Management Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Data Management</h2>
          
          {/* Export Card */}
          <div 
            onClick={handleExport}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Download size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Export Backup</h3>
              <p className="text-sm text-gray-500">Save your data to a JSON file</p>
            </div>
          </div>

          {/* Import Card */}
          <div 
            onClick={handleImportClick}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <Upload size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Import Backup</h3>
              <p className="text-sm text-gray-500">Restore from a JSON file</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4 pt-4">
          <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider ml-1">Danger Zone</h2>
          
          <div 
            onClick={handleReset}
            className="bg-red-50 p-5 rounded-xl shadow-sm border border-red-100 flex items-center gap-4 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="p-3 bg-white text-red-600 rounded-full shadow-sm">
              <Trash2 size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-700">Reset App Data</h3>
              <p className="text-sm text-red-500">Delete all envelopes and history</p>
            </div>
          </div>
        </section>

        {/* App Info */}
        <div className="text-center text-gray-400 text-sm pt-8">
          <p>Envelope Budget PWA</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </div>
  );
};
