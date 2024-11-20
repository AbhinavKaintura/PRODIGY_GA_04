import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  ImagePlus, 
  Palette, 
  Wand2, 
  Loader2, 
  XCircle, 
  Download 
} from 'lucide-react';

const NeuralStyleTransfer = () => {
  // State Management
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Refs for file inputs
  const contentInputRef = useRef(null);
  const styleInputRef = useRef(null);

  // Image Upload Handler
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // File size check (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'content') {
        setContentImage(reader.result);
      } else {
        setStyleImage(reader.result);
      }
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Style Transfer Method
  const performStyleTransfer = async () => {
    // Validation
    if (!contentImage || !styleImage) {
      setError('Please upload both content and style images');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulated API call (replace with actual backend endpoint)
      const response = await axios.post('http://localhost:5000/transfer-style', {
        contentImage,
        styleImage
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });

      setResultImage(response.data.stylizedImage);
    } catch (err) {
      console.error('Style transfer error:', err);
      setError(err.response?.data?.error || 'Style transfer failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Image Download Handler
  const downloadImage = () => {
    if (!resultImage) return;

    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'stylized-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset Functionality
  const resetTransfer = () => {
    setContentImage(null);
    setStyleImage(null);
    setResultImage(null);
    setError(null);
    
    // Reset file inputs
    if (contentInputRef.current) contentInputRef.current.value = "";
    if (styleInputRef.current) styleInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-5xl">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          Neural Style Transfer
        </h1>

        {/* Image Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Content Image Upload */}
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              ref={contentInputRef}
              onChange={(e) => handleImageUpload(e, 'content')}
              className="hidden" 
            />
            <div 
              onClick={() => contentInputRef.current.click()}
              className="cursor-pointer border-2 border-dashed rounded-lg p-4 hover:border-purple-300 transition h-96 flex flex-col items-center justify-center"
            >
              {contentImage ? (
                <img 
                  src={contentImage} 
                  alt="Content" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              ) : (
                <>
                  <ImagePlus size={48} className="text-purple-500 mb-4"/>
                  <p className="text-gray-600 text-center">Upload Content Image</p>
                </>
              )}
              {contentImage && (
                <XCircle 
                  onClick={(e) => {
                    e.stopPropagation();
                    setContentImage(null);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                />
              )}
            </div>
          </div>

          {/* Style Image Upload */}
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              ref={styleInputRef}
              onChange={(e) => handleImageUpload(e, 'style')}
              className="hidden" 
            />
            <div 
              onClick={() => styleInputRef.current.click()}
              className="cursor-pointer border-2 border-dashed rounded-lg p-4 hover:border-blue-300 transition h-96 flex flex-col items-center justify-center"
            >
              {styleImage ? (
                <img 
                  src={styleImage} 
                  alt="Style" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              ) : (
                <>
                  <Palette size={48} className="text-blue-500 mb-4"/>
                  <p className="text-gray-600 text-center">Upload Style Image</p>
                </>
              )}
              {styleImage && (
                <XCircle 
                  onClick={(e) => {
                    e.stopPropagation();
                    setStyleImage(null);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                />
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <XCircle className="mr-2"/>
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={performStyleTransfer}
            disabled={isProcessing || !contentImage || !styleImage}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 animate-spin"/> Processing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2"/> Transfer Style
              </>
            )}
          </button>
          <button 
            onClick={resetTransfer}
            className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>

        {/* Result Display */}
        {resultImage && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Stylized Image
            </h3>
            <div className="flex flex-col items-center">
              <img 
                src={resultImage} 
                alt="Stylized Result" 
                className="max-h-[500px] rounded-lg shadow-lg mb-4" 
              />
              <button 
                onClick={downloadImage}
                className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-green-600 transition"
              >
                <Download className="mr-2"/> Download Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeuralStyleTransfer;