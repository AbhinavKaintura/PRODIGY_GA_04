# Neural Style Transfer Web Application

## Overview
This application allows users to transfer artistic styles between images using neural networks.

## Prerequisites
- Python 3.8+
- Node.js 14+
- pip
- npm

## Backend Setup
1. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

2. Install dependencies
```bash
pip install flask flask-cors tensorflow numpy pillow
```

3. Run the backend
```bash
python backend.py
```

## Frontend Setup
1. Install dependencies
```bash
npm install axios react-dom @heroicons/react tailwindcss
```

2. Run the frontend
```bash
npm start
```

## Technologies Used
- Backend: Flask, TensorFlow
- Frontend: React, Tailwind CSS
- State Management: React Hooks
- HTTP Requests: Axios

## Features
- Drag and drop image uploads
- Real-time style transfer
- Responsive design
- Error handling
- Preview of original and stylized images

## Roadmap
- Add more style transfer models
- Implement advanced style blending
- Add download functionality for stylized images

## Troubleshooting
- Ensure CORS is properly configured
- Check image sizes and formats
- Verify TensorFlow installation
