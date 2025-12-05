
import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, FlaskConical, AlertCircle, FileText, RefreshCcw, Baby } from 'lucide-react';
import { analyzeUrineImage } from '../services/geminiService';
import { UrineAnalysisResult } from '../types';

const UrineAnalyzer: React.FC = () => {
  const [testType, setTestType] = useState<'standard' | 'pregnancy'>('standard');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<UrineAnalysisResult[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    const base64Data = image.split(',')[1];
    try {
      const data = await analyzeUrineImage(base64Data, testType);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'normal': return 'bg-green-100 text-green-700';
      case 'trace': return 'bg-yellow-100 text-yellow-700';
      case 'moderate': return 'bg-orange-100 text-orange-700';
      case 'high': return 'bg-red-100 text-red-700';
      case 'positive': return 'bg-green-100 text-green-700'; // Positive pregnancy is usually 'good' or at least 'result found'
      case 'negative': return 'bg-slate-100 text-slate-700';
      case 'invalid': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
       <div className="text-center space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Urine Test Analysis</h2>
          <p className="text-slate-500">Upload a photo of a dipstick strip or lab report.</p>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex justify-center">
           <div className="bg-slate-100 p-1 rounded-xl inline-flex shadow-inner">
              <button 
                onClick={() => { setTestType('standard'); reset(); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center ${testType === 'standard' ? 'bg-white text-medical-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <FlaskConical size={16} className="mr-2"/> Urinalysis
              </button>
              <button 
                onClick={() => { setTestType('pregnancy'); reset(); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center ${testType === 'pregnancy' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Baby size={16} className="mr-2"/> Pregnancy (HCG)
              </button>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Upload Area */}
        <div className="space-y-6">
          <div 
            className={`relative group border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${image ? (testType === 'pregnancy' ? 'border-pink-500 bg-pink-50' : 'border-yellow-500 bg-slate-50') : 'border-slate-300 hover:border-slate-400 bg-white'}`}
          >
            {image ? (
              <>
                 <img src={image} alt="Test" className="h-full w-full object-contain p-2" />
                 {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[2px]">
                       <Loader2 className={`animate-spin ${testType === 'pregnancy' ? 'text-pink-600' : 'text-yellow-600'}`} size={48} />
                    </div>
                 )}
                 <button 
                  onClick={reset}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors z-20"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div 
                className="text-center space-y-4 p-6 cursor-pointer w-full h-full flex flex-col items-center justify-center transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                 <div className={`p-5 rounded-full animate-pulse ${testType === 'pregnancy' ? 'bg-pink-100 text-pink-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {testType === 'pregnancy' ? <Baby size={48} /> : <FlaskConical size={48} />}
                 </div>
                 <div>
                    <p className="text-xl font-bold text-slate-700">Upload {testType === 'pregnancy' ? 'HCG Strip' : 'Dipstick/Report'}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {testType === 'pregnancy' ? 'AI checks 1 vs 2 lines' : 'AI checks pH, Glucose, etc.'}
                    </p>
                 </div>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || isAnalyzing}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${
              !image || isAnalyzing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : testType === 'pregnancy' ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200' : 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-yellow-200'
            }`}
          >
             {isAnalyzing ? <span>Analyzing...</span> : <span>Check Result</span>}
          </button>
        </div>

        {/* Results Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 relative min-h-[400px]">
           {!results ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
               <FileText size={80} className="text-slate-300" />
               <p className="text-slate-500 font-medium">Results will appear here</p>
             </div>
           ) : (
             <div className="space-y-6 animate-fade-in h-full overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                
                {testType === 'pregnancy' && results.length > 0 ? (
                  // Specialized Pregnancy Result Card
                  <div className={`rounded-xl p-8 border-2 text-center flex flex-col items-center justify-center min-h-[300px] ${results[0].finding.toLowerCase().includes('positive') ? 'bg-pink-50 border-pink-200' : 'bg-slate-50 border-slate-200'}`}>
                     <div className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-500">Test Result</div>
                     <div className={`text-5xl font-extrabold mb-4 ${results[0].finding.toLowerCase().includes('positive') ? 'text-pink-600' : 'text-slate-700'}`}>
                        {results[0].finding}
                     </div>
                     <p className="text-lg text-slate-600 font-medium mb-6">
                       {results[0].interpretation}
                     </p>
                     <div className="bg-white p-4 rounded-lg text-sm text-slate-500 border border-slate-100 shadow-sm">
                       <AlertCircle size={16} className="inline mr-1 -mt-0.5" /> 
                       {results[0].advice}
                     </div>
                  </div>
                ) : (
                  // Standard List View
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-800 text-lg">Lab Report</h3>
                      <span className="text-xs font-mono text-slate-400">{new Date().toLocaleDateString()}</span>
                    </div>
                    {results.map((res, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-800">{res.parameter}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${getSeverityColor(res.severity)}`}>
                               {res.severity}
                            </span>
                         </div>
                         <div className="text-sm font-mono text-slate-600 mb-2">Finding: {res.finding}</div>
                         <p className="text-sm text-slate-600 mb-2">{res.interpretation}</p>
                         <div className="flex items-start text-xs text-slate-500 bg-white p-2 rounded-lg">
                            <AlertCircle size={14} className="mr-1 mt-0.5 flex-shrink-0 text-blue-500" />
                            {res.advice}
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={reset} className="w-full mt-4 py-3 text-sm font-medium text-slate-500 hover:text-medical-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center border border-transparent hover:border-slate-200">
                  <RefreshCcw size={14} className="mr-2" /> Check Another Sample
                </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default UrineAnalyzer;
