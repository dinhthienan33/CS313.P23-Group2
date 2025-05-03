from app import app, load_models

# Load models on startup
load_models()
 
if __name__ == "__main__":
    app.run() 