
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Hand, AlertTriangle, ShieldAlert } from 'lucide-react';
import { analyzeSkinImage } from '../services/geminiService';
import { SkinAnalysisResult } from '../types';

const SkinAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
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
      const data = await analyzeSkinImage(base64Data);
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
        <h2 className="text-3xl font-bold text-slate-900">Skin Health Check</h2>
        <p className="text-slate-500">Analyze rashes, lesions, or spots using AI.</p>
        <div className="inline-block bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold border border-orange-100">
          ⚠️ Not a Medical Diagnosis. Consult a Dermatologist.
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            className={`relative group border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center transition-all overflow-hidden ${image ? 'border-orange-400 bg-orange-50/30' : 'border-slate-300 hover:border-orange-300 bg-white'}`}
          >
            {image ? (
              <>
                <img src={image} alt="Skin" className="h-full w-full object-contain p-2 rounded-xl" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                    <Loader2 className="animate-spin text-orange-600" size={48} />
                  </div>
                )}
                <button 
                  onClick={reset}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-slate-500 hover:text-red-500 z-20"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div 
                className="text-center space-y-4 p-6 cursor-pointer w-full h-full flex flex-col items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-orange-100 p-5 rounded-full text-orange-600 animate-pulse">
                  <Hand size={48} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-700">Upload Skin Photo</p>
                  <p className="text-sm text-slate-400 mt-1">Clear photo of the affected area</p>
                </div>
              </div>
            )}
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || isAnalyzing}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${
              !image || isAnalyzing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200'
            }`}
          >
            {isAnalyzing ? 'Analyzing Skin...' : 'Analyze Condition'}
          </button>
        </div>

        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 min-h-[400px]">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <ShieldAlert size={80} className="text-slate-300" />
              <p className="text-slate-500 font-medium">Upload photo to see results</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Potential Issue</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  result.probability > 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {result.probability}% Confidence
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-2">{result.condition}</h3>
                <div className="inline-flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-lg">
                   <span className="text-xs font-bold text-slate-500 uppercase">Severity:</span>
                   <span className={`text-sm font-bold ${result.severity === 'Severe' ? 'text-red-600' : 'text-slate-700'}`}>{result.severity}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                 <h4 className="font-bold text-slate-700 mb-2 text-sm">Visual Description</h4>
                 <p className="text-slate-600 text-sm leading-relaxed">{result.description}</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start">
                 <AlertTriangle size={20} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                 <div>
                    <h5 className="font-bold text-blue-800 text-sm mb-1">Recommendation</h5>
                    <p className="text-blue-700 text-sm">{result.recommendation}</p>
                 </div>
              </div>

              <button onClick={reset} className="w-full mt-4 py-3 text-sm font-medium text-slate-500 hover:text-orange-600 hover:bg-slate-50 rounded-lg transition-colors">
                Analyze Another Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkinAnalyzer;
