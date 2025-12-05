import React, { useState, useRef } from 'react';
import { Camera, Upload, X, AlertCircle, CheckCircle, Loader2, RefreshCcw } from 'lucide-react';
import { analyzeBloodSlide } from '../services/geminiService';
import { BloodAnalysisResult } from '../types';

const BloodGroupAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BloodAnalysisResult | null>(null);
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
    // Strip base64 prefix for API
    const base64Data = image.split(',')[1];
    
    try {
      const data = await analyzeBloodSlide(base64Data);
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Blood Group Checker</h2>
        <p className="text-slate-500">Upload a slide test photo for an AI-powered educational analysis.</p>
        <div className="inline-block bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold border border-orange-100">
           ⚠️ Educational Use Only - Not for Clinical Diagnosis
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            className={`relative group border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${image ? 'border-medical-500 bg-slate-50' : 'border-slate-300 hover:border-medical-400 bg-white'}`}
          >
            {image ? (
              <>
                <div className="relative w-full h-full">
                  <img src={image} alt="Slide Preview" className="h-full w-full object-contain rounded-xl p-2" />
                  
                  {/* Scanning Animation Layer */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
                      <div className="w-full h-1 bg-medical-500 shadow-[0_0_20px_rgba(14,165,233,1)] absolute animate-scan opacity-90 z-20"></div>
                      <div className="absolute inset-0 bg-medical-500/10 animate-pulse z-10"></div>
                      {/* Grid overlay for 'analysis' effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={reset}
                  disabled={isAnalyzing}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors z-30"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div 
                className="text-center space-y-4 p-6 cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-slate-50/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="relative">
                  <div className="bg-medical-50 p-5 rounded-full inline-block text-medical-600 animate-bounce-slow">
                    <Camera size={48} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    <Upload size={16} className="text-medical-500" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-700">Upload Slide Image</p>
                  <p className="text-sm text-slate-400 mt-1">Take a clear photo of your agglutination card</p>
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
                : 'bg-medical-600 text-white hover:bg-medical-700 shadow-medical-200'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Running Analysis...</span>
              </>
            ) : (
              <>
                <MicroscopeIcon size={20} />
                <span>Analyze Pattern</span>
              </>
            )}
          </button>
        </div>

        {/* Result Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 flex flex-col relative overflow-hidden min-h-[400px]">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-slate-400 opacity-60">
              <MicroscopeVisual size={140} />
              <div className="space-y-1">
                <p className="font-semibold text-slate-500">Waiting for upload...</p>
                <p className="text-sm max-w-xs mx-auto">Upload a clear image of your slide test. AI will detect agglutination (clumping).</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in relative z-10">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Analysis Result</span>
                  <h3 className="text-5xl font-extrabold text-slate-900 mt-1">{result.bloodGroup}</h3>
                </div>
                <div className="text-right">
                   <div className="text-xs text-slate-500 font-bold uppercase">Confidence</div>
                   <div className={`text-3xl font-bold ${result.confidence > 80 ? 'text-green-600' : 'text-amber-500'}`}>
                     {result.confidence}%
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-medical-500">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center text-sm">
                    <CheckCircle size={16} className="mr-2 text-medical-600" />
                    Observed Pattern
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {result.agglutinationDetails}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 p-3 rounded-xl">
                      <h5 className="text-xs font-semibold text-slate-500 uppercase mb-1">Antibodies</h5>
                      <p className="text-sm font-medium text-slate-800">{result.antibodies}</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-xl">
                      <h5 className="text-xs font-semibold text-slate-500 uppercase mb-1">Antigens</h5>
                      <p className="text-sm font-medium text-slate-800">
                         {result.bloodGroup.replace(/[^A-B]/g, '') || 'None'}
                      </p>
                   </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mt-auto">
                <div className="flex items-start">
                  <AlertCircle size={20} className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h5 className="text-blue-800 font-bold text-sm">Clinical Note</h5>
                    <p className="text-blue-700 text-sm mt-1">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              </div>
              
              <button onClick={reset} className="w-full mt-4 py-3 text-sm font-medium text-slate-500 hover:text-medical-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center">
                <RefreshCcw size={14} className="mr-2" /> Analyze Another Image
              </button>
            </div>
          )}
          
          {/* Decorative background element for result card */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none rotate-12">
            <MicroscopeVisual size={300} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Icon for buttons
const MicroscopeIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0 0-14h-1" />
    <path d="M9 14h2" />
    <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
    <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
  </svg>
);

// Detailed Visual for empty states
const MicroscopeVisual = ({ size = 100 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="text-medical-600"
  >
    {/* Base */}
    <path d="M10 21h4" strokeWidth="1.5" />
    <path d="M7 21a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2" strokeWidth="1.5" />
    
    {/* Arm */}
    <path d="M12 19v-4" />
    <path d="M12 15a3 3 0 0 1-3-3V7" />
    
    {/* Stage */}
    <path d="M9 13h6" strokeWidth="1.5" />
    <rect x="8" y="12.5" width="8" height="1" fill="currentColor" className="opacity-10" />
    
    {/* Objective Lenses */}
    <path d="M10 7l-1 2" />
    <path d="M14 7l1 2" />
    <path d="M12 7v3" />
    
    {/* Tube / Body */}
    <path d="M8 7h8" />
    <path d="M12 7V3" />
    <rect x="10" y="2" width="4" height="2" rx="1" />
    
    {/* Eyepieces */}
    <path d="M10 2l-2-2" />
    <path d="M14 2l2-2" />
    
    {/* Focus Knobs */}
    <circle cx="12" cy="15" r="1.5" />
    <circle cx="12" cy="15" r="0.5" fill="currentColor" />
  </svg>
);

export default BloodGroupAnalyzer;