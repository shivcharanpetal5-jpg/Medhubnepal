
import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, ScanLine, AlertCircle } from 'lucide-react';
import { analyzeXrayImage } from '../services/geminiService';
import { XrayAnalysisResult } from '../types';

const XrayAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<XrayAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    const base64Data = image.split(',')[1];
    try {
      const data = await analyzeXrayImage(base64Data);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">X-Ray Analysis</h2>
        <p className="text-slate-500">AI interpretation of fractures, chest scans, and bone health.</p>
        <div className="inline-block bg-slate-800 text-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
           For Educational Purpose Only
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            className={`relative group border-2 border-dashed rounded-2xl h-96 flex flex-col items-center justify-center transition-all overflow-hidden bg-black ${image ? 'border-slate-600' : 'border-slate-700 hover:border-slate-500'}`}
          >
            {image ? (
              <>
                <img src={image} alt="Xray" className="h-full w-full object-contain p-2 opacity-90" style={{ filter: 'contrast(1.2)' }} />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] absolute animate-scan top-0"></div>
                    <Loader2 className="animate-spin text-cyan-400 mb-2" size={48} />
                    <span className="text-cyan-400 font-mono text-sm">SCANNING...</span>
                  </div>
                )}
                <button 
                  onClick={reset}
                  className="absolute top-4 right-4 bg-slate-800 p-2 rounded-full text-white hover:bg-red-600 transition-colors z-20"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div 
                className="text-center space-y-4 p-6 cursor-pointer w-full h-full flex flex-col items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-slate-800 p-5 rounded-full text-slate-400 animate-pulse">
                  <ScanLine size={48} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-300">Upload X-Ray</p>
                  <p className="text-sm text-slate-500 mt-1">Supports JPEG/PNG scans</p>
                </div>
              </div>
            )}
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || isAnalyzing}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-2 ${
              !image || isAnalyzing 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-black shadow-slate-400/50'
            }`}
          >
            {isAnalyzing ? 'Processing Scan...' : 'Read X-Ray'}
          </button>
        </div>

        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 min-h-[400px]">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <ScanLine size={80} className="text-slate-300" />
              <p className="text-slate-500 font-medium">Scan results will appear here</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in font-sans">
              <div className="border-b border-slate-100 pb-4">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Body Region</h3>
                 <p className="text-2xl font-bold text-slate-900">{result.bodyPart}</p>
              </div>

              <div className={`p-4 rounded-xl border-l-4 ${result.abnormalityDetected ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                 <h4 className={`font-bold text-sm mb-1 ${result.abnormalityDetected ? 'text-red-800' : 'text-green-800'}`}>
                    {result.abnormalityDetected ? 'Abnormality Detected' : 'No Obvious Abnormalities'}
                 </h4>
                 <p className="text-slate-700 text-sm">{result.findings}</p>
              </div>

              <div>
                 <h4 className="font-bold text-slate-800 mb-2">Impression</h4>
                 <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {result.impression}
                 </p>
              </div>

              <div className="flex items-start bg-slate-800 text-slate-200 p-4 rounded-xl text-sm">
                 <AlertCircle size={18} className="mr-3 flex-shrink-0 mt-0.5 text-yellow-400" />
                 <div>
                    <span className="font-bold text-yellow-400 block mb-1">Radiologist Note</span>
                    {result.advice}
                 </div>
              </div>

              <button onClick={reset} className="w-full mt-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                Analyze Another X-Ray
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XrayAnalyzer;
