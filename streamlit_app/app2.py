import streamlit as st
import pandas as pd

from preprocess import scale
from load_model import load
from tab import *

# Load models
# models_heating = load('heating')
models_cooling = load('cooling')
model_names = [
    "Linear Regression",
    "Decision Tree",
    "Random Forest",
    "SVM",
    "XGBoost",
    "K-Nearest Neighbors"
]

# --------- Cấu hình trang ----------
# st.set_page_config(
#     page_title="Energy Efficiency Prediction",
#     page_icon="🏠",
#     layout="centered"
# )
st.markdown(
    """
    <div style='
        background: linear-gradient(90deg, #1a73e8, #66bb6a);
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 30px;
    '>
        <h1 style='font-size: 42px; margin-bottom: 10px;'>🏡 Dự đoán hiệu quả năng lượng tòa nhà</h1>
        <h4 style='margin-top: 0;'>Nhập thông số kiến trúc và chọn mô hình để dự đoán Heating/Cooling Load</h4>
    </div>
    """,
    unsafe_allow_html=True
)

# ---------- Sidebar lựa chọn chức năng ----------
app_mode = st.sidebar.radio(
    "🔧 Chọn chức năng:",
    [
        "🔧 Tính công suất HVAC",
        "💵 Ước tính chi phí",
        "🌱 Tính phát thải CO₂",
        "☀️ Gợi ý số tấm pin mặt trời",
        "🏠 Phân loại hiệu suất",
    ]
)

# Chèn CSS để đặt ảnh nền
page_bg_img = '''
<style>
[data-testid="stAppViewContainer"] {
    background-image: url("https://i.pinimg.com/1200x/f2/9d/04/f29d04f03783d8a8eacdbae199c01f35.jpg");
    background-size: cover;
    background-attachment: fixed;  /* Cho phép cuộn ảnh nền */
    background-position: center center;
}

[data-testid="stHeader"] {
    background-color: rgba(0, 0, 0, 0) !important;  /* Trong suốt header */
}

[data-testid="stSidebar"] {
    background-color: rgba(0, 0, 0, 0) !important;  /* Trong suốt sidebar */
}
</style>
'''

st.markdown(page_bg_img, unsafe_allow_html=True)


# --------- Khởi tạo session_state nếu chưa có ----------
if 'submitted' not in st.session_state:
    st.session_state.submitted = False

# --------- Title & Description ----------
# st.markdown("# 🏡 Energy Efficiency Prediction")
# st.markdown(
#     """
#     ## Dự đoán hiệu quả năng lượng từ các thông số kiến trúc.
#     Chọn model và nhập các thông số bên dưới để nhận dự đoán từ các mô hình.
#     """
# )

if app_mode == "🔧 Tính công suất HVAC":
    run('hvac', model_names, models_cooling)

if app_mode == "💵 Ước tính chi phí":
    run('predict energy', model_names, models_cooling)

if app_mode == "🌱 Tính phát thải CO₂":
    run('co2 calculation', model_names, models_cooling)
    
if app_mode == "☀️ Gợi ý số tấm pin mặt trời":
    run('solar panel calculation', model_names, models_cooling)

if app_mode == "🏠 Phân loại hiệu suất":
    run('energy efficiency', model_names, models_cooling)
