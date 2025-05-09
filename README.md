<!-- Banner -->
<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin" style="border: none;">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>

<!-- Title -->
<h1 align="center"><b>Data Mining and Application</b></h1>

<!-- Main -->
# Building Energy Efficiency Prediction System

## Project Overview
This project is a comprehensive system for predicting building energy efficiency based on architectural parameters. Using machine learning models, the system predicts heating and cooling loads required to maintain comfortable indoor conditions, helping architects and building designers create more energy-efficient buildings.

##  Course Information
- **Course**: CS311.P23 - Data Mining
- **Institution**: University of Information Technology (UIT)
- **Semester**: Spring 2024

## 👥 Team Members - Group 2

| STT    | Studnet ID          | Full name              |Role    | Email                   |
| ------ |:-------------:| ----------------------:|----------:|-------------------------:
| 1      | 22520003      | Huỳnh Trọng Nghĩa         |Member|22520003@gm.uit.edu.vn   |
| 2      | 22520010      | Đinh Thiên Ân        |Member |22520010@gm.uit.edu.vn   |
| 3      | 22520019      | Nguyễn Ân        |Member |22520019@gm.uit.edu.vn   |
| 4      | 22520021      | Nguyễn Hoàng Gia An        |Member |22520021@gm.uit.edu.vn   |
| 5      | 22520069      | Phạm Nguyên Anh        |Member |22520069@gm.uit.edu.vn   |
| 6      | 22520109      | Nguyễn Gia Bảo        |Member |22520109@gm.uit.edu.vn   |

<!-- ## 📚 Project Description
The system analyzes building characteristics to predict the necessary heating and cooling loads. By inputting parameters such as relative compactness, surface area, wall area, roof area, overall height, orientation, glazing area, and glazing area distribution, architects and engineers can estimate a building's energy requirements during the design phase. -->

### Key Features
- **Energy Load Prediction**: Accurate prediction of heating and cooling loads
- **Multiple ML Models**: Implementation of various algorithms (Linear Regression, Decision Tree, Random Forest, SVM, XGBoost, KNN)
- **Interactive Web Interfaces**: Both Streamlit and React frontends for accessible predictions
- **API Backend**: Flask-based REST API for model deployment
- **Dockerized Deployment**: Containerized setup for easy deployment
- **Practical Applications**: Additional calculations for HVAC sizing, cost estimation, CO₂ emissions, and solar panel recommendations

## Technology Stack
- **Data Processing**: Python, Pandas, NumPy
- **Machine Learning**: Scikit-learn, XGBoost
- **Visualization**: Matplotlib, Seaborn
- **Frontend**: Streamlit, React
- **Backend**: Flask API
- **Deployment**: Docker, Docker Compose

## 📊 Dataset
The project uses the Energy Efficiency Dataset from the UCI Machine Learning Repository, containing 768 building samples with 8 input features and 2 output variables (heating and cooling load). The dataset was created by simulating 12 different building shapes in Ecotect with various configurations of glazing area, orientation, and other parameters.

## Project Structure
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

## Getting Started

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
3. **Run the frontend**
   ```bash
   cd frontend
   npm install
   npm start
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

## Results
Our models achieve high prediction accuracy with the Random Forest model performing best with:
- R² scores of 0.99+ for both heating and cooling load predictions
- Low error metrics (MAE, RMSE)
- Strong performance across different building configurations

## Report and Slides
- [Project Report](report/CS311_report.pdf) - Detailed technical report covering methodology, experiments, and results
- [Presentation Slides](slides/CS311_slide.pdf) - Slides used for the final project presentation

## References
1. Tsanas, A., & Xifara, A. (2012). Accurate quantitative estimation of energy performance of residential buildings using statistical machine learning tools. Energy and Buildings, 49, 560-567.
2. UCI Machine Learning Repository: Energy Efficiency Dataset [https://archive.ics.uci.edu/ml/datasets/Energy+efficiency](https://archive.ics.uci.edu/ml/datasets/Energy+efficiency)
3. Moayedi, H., et al. (2019). Predicting Heating Load in Energy-Efficient Buildings Through Machine Learning Techniques. Applied Sciences, 9(20), 4338.

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

*To see the application in action,go to frontend folder and run the commands in the Getting Started section.*

<p align='center'>Copyright © 2025 - Group 2</p>