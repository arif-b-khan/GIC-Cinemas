import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from api import api
from models import db

app = Flask(__name__, static_url_path='')
# Configure Flask to be more permissive with trailing slashes
app.url_map.strict_slashes = False

# Get allowed origins from environment or use default with fallback to localhost
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:8080,http://127.0.0.1:8080')
origins = allowed_origins.split(',')

# Comprehensive CORS configuration
CORS(app, 
     resources={r"/*": {"origins": origins}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With", 
                   "Access-Control-Allow-Headers", "Origin", "Accept"],
     expose_headers=["Content-Type", "Authorization"],
     max_age=1800)  # Cache preflight request results for 30 minutes

@app.after_request
def after_request(response):
    """Ensure CORS headers are set properly on all responses"""
    # Allow specific origin or origins from the environment variable
    origin = request.headers.get('Origin')
    if origin and origin in origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
    
    # Add CORS headers for all responses (not just OPTIONS)
    response.headers.add('Access-Control-Allow-Headers', 
                        'Content-Type, Authorization, X-Requested-With, Origin, Accept')
    response.headers.add('Access-Control-Allow-Methods', 
                        'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    
    return response

# Add a route to debug CORS issues
@app.route('/cors-debug', methods=['GET', 'OPTIONS'])
def cors_debug():
    """Endpoint for debugging CORS issues"""
    if request.method == 'OPTIONS':
        return '', 204
    
    debug_info = {
        'request_headers': dict(request.headers),
        'origin': request.headers.get('Origin'),
        'method': request.method,
        'allowed_origins': origins,
        'flask_env': os.environ.get('FLASK_ENV', 'not set')
    }
    
    app.logger.info(f"CORS Debug: {debug_info}")
    return jsonify(debug_info)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mysql://cinema_user:cinema_password@db/cinema_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
api.init_app(app)

# Create database tables if they don't exist
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_ENV', 'production') != 'production'
    app.run(debug=debug_mode, host='0.0.0.0')
