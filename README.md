# Building Energy Efficiency Prediction System

## Project Overview
This project is a comprehensive system for predicting building energy efficiency based on architectural parameters. Using machine learning models, the system predicts heating and cooling loads required to maintain comfortable indoor conditions, helping architects and building designers create more energy-efficient buildings.

## 🎓 Course Information
- **Course**: CS311.P23 - Data Mining
- **Institution**: University of Information Technology (UIT)
- **Semester**: Spring 2024

## 👥 Team Members
- Huỳnh Trọng Nghĩa (22520003) - Group 2
- Đinh Thiên Ân (22520010)
- Nguyễn Ân (22520019)
- Nguyễn Hoàng Gia An (22520021)
- Phạm Nguyên Anh (22520069)
- Nguyễn Gia Bảo (22520109)

## 📚 Project Description
The system analyzes building characteristics to predict the necessary heating and cooling loads. By inputting parameters such as relative compactness, surface area, wall area, roof area, overall height, orientation, glazing area, and glazing area distribution, architects and engineers can estimate a building's energy requirements during the design phase.

### Key Features
- **Energy Load Prediction**: Accurate prediction of heating and cooling loads
- **Multiple ML Models**: Implementation of various algorithms (Linear Regression, Decision Tree, Random Forest, SVM, XGBoost, KNN)
- **Interactive Web Interfaces**: Both Streamlit and React frontends for accessible predictions
- **API Backend**: Flask-based REST API for model deployment
- **Dockerized Deployment**: Containerized setup for easy deployment
- **Practical Applications**: Additional calculations for HVAC sizing, cost estimation, CO₂ emissions, and solar panel recommendations

## 🔧 Technology Stack
- **Data Processing**: Python, Pandas, NumPy
- **Machine Learning**: Scikit-learn, XGBoost
- **Visualization**: Matplotlib, Seaborn
- **Frontend**: Streamlit, React
- **Backend**: Flask API
- **Deployment**: Docker, Docker Compose

## 📊 Dataset
The project uses the Energy Efficiency Dataset from the UCI Machine Learning Repository, containing 768 building samples with 8 input features and 2 output variables (heating and cooling load). The dataset was created by simulating 12 different building shapes in Ecotect with various configurations of glazing area, orientation, and other parameters.

## 🏗️ Project Structure
```
├── backend/                  # Flask API server 
│   ├── models/               # Trained ML models
│   ├── app.py                # API implementation
│   └── requirements.txt      # Backend dependencies
├── streamlit_app/            # Streamlit frontend application
│   ├── models/               # Trained models for Streamlit
│   ├── app1.py               # Main Streamlit app
│   └── tab.py                # Additional UI components
├── src/                      # Source code
│   ├── data/                 # Raw and processed data
│   └── notebooks/            # Jupyter notebooks for analysis
├── docker-compose.yml        # Container orchestration
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Docker and Docker Compose (for containerized deployment)
- Required Python packages (see requirements.txt files)

### Installation and Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd energy-efficiency-prediction
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Run the Streamlit app**
   ```bash
   cd streamlit_app
   pip install -r requirements.txt
   streamlit run app1.py
   ```

4. **Deploy with Docker (optional)**
   ```bash
   docker-compose up -d
   ```

## 📝 Usage
1. Input your building parameters in the web interface
2. Select a machine learning model for prediction
3. Receive predictions for heating and cooling loads
4. View additional derived metrics like HVAC capacity, cost estimation, and environmental impact

## 🔍 Results
Our models achieve high prediction accuracy with the Random Forest model performing best with:
- R² scores of 0.99+ for both heating and cooling load predictions
- Low error metrics (MAE, RMSE)
- Strong performance across different building configurations

## 📄 Report and Slides
- [Project Report](https://github.com/your-username/energy-efficiency-prediction/blob/main/report/CS311_P23_Final_Report.pdf) - Detailed technical report covering methodology, experiments, and results
- [Presentation Slides](https://github.com/your-username/energy-efficiency-prediction/blob/main/slides/CS311_P23_Presentation.pdf) - Slides used for the final project presentation

## 🔗 References
1. Tsanas, A., & Xifara, A. (2012). Accurate quantitative estimation of energy performance of residential buildings using statistical machine learning tools. Energy and Buildings, 49, 560-567.
2. UCI Machine Learning Repository: Energy Efficiency Dataset [https://archive.ics.uci.edu/ml/datasets/Energy+efficiency](https://archive.ics.uci.edu/ml/datasets/Energy+efficiency)
3. Moayedi, H., et al. (2019). Predicting Heating Load in Energy-Efficient Buildings Through Machine Learning Techniques. Applied Sciences, 9(20), 4338.

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🖥️ Frontend Features

The project features a user-friendly Streamlit application that provides an intuitive interface for building energy efficiency prediction. 

### Main Application Features:

1. **Energy Efficiency Prediction Interface**
   - Input form for building parameters (Relative Compactness, Wall Area, Roof Area, Overall Height, etc.)
   - Model selection dropdown for choosing different machine learning algorithms
   - Data scaling and preprocessing visualization
   - Clear prediction results display for heating and cooling loads

2. **HVAC System Capacity Calculation**
   - Automatic calculation of required heating and cooling power in kW
   - Sizing recommendations based on building specifications
   - Visual representation of capacity requirements

3. **Cost Estimation Module**
   - Annual energy consumption calculation
   - Energy cost projections based on local electricity rates
   - Financial analysis for building operation

4. **Carbon Footprint Analysis**
   - CO₂ emissions calculation based on energy consumption
   - Environmental impact assessment
   - Comparison with industry standards

5. **Solar Panel Recommendations**
   - Estimation of required solar panels to offset energy consumption
   - Integration with building energy needs
   - Sustainable energy alternative visualization

The Streamlit app provides a complete end-to-end solution from building design parameter input to comprehensive energy analysis, helping architects and engineers make informed decisions about building design choices from an energy efficiency perspective.

### Application UI and Workflow:

The application interface is built with a modern, clean design featuring:

- **Navigation sidebar** with multiple functionality options:
  - 🏠 Energy Prediction
  - 🔧 HVAC Capacity Calculation
  - 💵 Cost Estimation
  - 🌱 CO₂ Emissions Calculation
  - ☀️ Solar Panel Recommendations

- **Input form** with carefully designed numeric inputs for:
  - Relative Compactness (0.0-1.0)
  - Wall Area (m²)
  - Roof Area (m²)
  - Overall Height (m)
  - Glazing Area (ratio 0.0-1.0)
  - Glazing Area Distribution (0-5)

- **Data processing visualization** showing:
  - Original dataframe with input parameters
  - Scaled dataframe after preprocessing

- **Model selection** with support for multiple algorithms:
  - Linear Regression
  - Decision Tree
  - Random Forest
  - SVM
  - XGBoost
  - K-Nearest Neighbors

- **Results display** presenting:
  - Predicted heating load value
  - Predicted cooling load value
  - Confidence metrics

- **Practical application tabs** calculating:
  - HVAC system capacity (kW) based on floor area and predicted loads
  - Annual energy costs based on Vietnamese electricity rates
  - CO₂ emissions (kg CO₂/year) with environmental impact assessment
  - Required number of solar panels based on energy consumption
  - Building efficiency rating (A/B/C scale)

The blue-themed interface with a professional background provides an intuitive user experience for architects, engineers, and building designers, allowing them to iterate quickly through different building design parameters to optimize for energy efficiency.

*To see the application in action, run the Streamlit app following the instructions in the Getting Started section.*
