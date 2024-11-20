import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Load pre-trained style transfer model
def load_style_transfer_model():
    # This is a placeholder - you'd replace with an actual loaded model
    # Example: model = tf.keras.models.load_model('style_transfer_model.h5')
    return None

# Preprocess image for model input
def preprocess_image(image_base64):
    # Decode base64 image
    image_data = base64.b64decode(image_base64.split(',')[1])
    image = Image.open(io.BytesIO(image_data))
    
    # Resize and normalize image
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    
    return image_array

# Style transfer function
def apply_style_transfer(content_image, style_image, model):
    try:
        # Placeholder for actual style transfer logic
        # In a real implementation, you'd use a neural style transfer algorithm
        stylized_image = content_image  # Dummy return for demonstration
        
        # Convert back to base64
        stylized_array = (stylized_image[0] * 255).astype(np.uint8)
        stylized_pil = Image.fromarray(stylized_array)
        
        buffered = io.BytesIO()
        stylized_pil.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        print(f"Style transfer error: {e}")
        return None

@app.route('/transfer-style', methods=['POST'])
def transfer_style():
    try:
        # Get images from request
        data = request.json
        content_image_base64 = data.get('contentImage')
        style_image_base64 = data.get('styleImage')
        
        # Validate input
        if not content_image_base64 or not style_image_base64:
            return jsonify({'error': 'Missing image data'}), 400
        
        # Preprocess images
        content_image = preprocess_image(content_image_base64)
        style_image = preprocess_image(style_image_base64)
        
        # Load model (if not already loaded)
        model = load_style_transfer_model()
        
        # Apply style transfer
        result_image = apply_style_transfer(content_image, style_image, model)
        
        if result_image:
            return jsonify({
                'stylizedImage': result_image,
                'message': 'Style transfer successful'
            })
        else:
            return jsonify({'error': 'Style transfer failed'}), 500
    
    except Exception as e:
        print(f"Error in style transfer: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Additional error handling routes
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)