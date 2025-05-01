import streamlit as st
import pandas as pd

from preprocess import scale
from load_model import load

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
st.set_page_config(
    page_title="Energy Efficiency Prediction",
    page_icon="🏠",
    layout="centered"
)

# ---------- Sidebar lựa chọn chức năng ----------
app_mode = st.sidebar.radio(
    "🔧 Chọn chức năng:",
    [
        "🏠 Dự đoán năng lượng",
        "🔧 Tính công suất HVAC",
        "💵 Ước tính chi phí",
        "🌱 Tính phát thải CO₂",
        "☀️ Gợi ý số tấm pin mặt trời"
    ]
)

# Chèn CSS để đặt ảnh nền
page_bg_img = '''
<style>
[data-testid="stAppViewContainer"] {
    background-image: url("https://png.pngtree.com/thumb_back/fh260/background/20220322/pngtree-background-biru-keren-dan-kosong-abstract-untuk-template-desain-powerpoint-ppt-image_1067979.jpg");
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
st.markdown("# 🏡 Energy Efficiency Prediction")
st.markdown(
    """
    ## Dự đoán hiệu quả năng lượng từ các thông số kiến trúc.
    Chọn model và nhập các thông số bên dưới để nhận dự đoán từ các mô hình.
    """
)

# --------- Form nhập liệu ----------
with st.form("input_form"):
    st.subheader("🔶 Nhập các thông số: ")
    relative_compactness = st.number_input("Relative Compactness", min_value=0.0, max_value=1.0, value=0.98, format="%.4f")
    wall_area = st.number_input("Wall Area (m²)", min_value=0.0, value=294.00, format="%.2f")
    roof_area = st.number_input("Roof Area (m²)", min_value=0.0, value=110.25, format="%.2f")
    overall_height = st.number_input("Overall Height (m)", min_value=0.0, value=7.00, format="%.2f")
    glazing_area = st.number_input("Glazing Area (tỉ lệ %)", min_value=0.0, max_value=1.0, format="%.2f")
    glazing_area_distribution = st.selectbox("Glazing Area Distribution (0-5)", options=[0, 1, 2, 3, 4, 5])
    
    submitted = st.form_submit_button("Tạo và Scale DataFrame")
    
    if submitted:
        st.session_state.submitted = True

# --------- Xử lý sau khi submit ----------
if st.session_state.submitted:
    # Tạo DataFrame
    data = {
        "Relative Compactness": [relative_compactness],
        "Wall Area": [wall_area],
        "Roof Area": [roof_area],
        "Overall Height": [overall_height],
        "Glazing Area": [glazing_area],
        "Glazing Area Distribution": [glazing_area_distribution]
    }
    df = pd.DataFrame(data)

    st.success("✅ Đã tạo DataFrame ban đầu!")
    st.dataframe(df, use_container_width=True)

    # Scale dữ liệu
    try:
        scaled_df = scale(df)
        st.success("✅ Dữ liệu đã được scale!")
        st.dataframe(scaled_df, use_container_width=True)
    except Exception as e:
        st.error(f"⚠️ Lỗi khi scale dữ liệu: {e}")
        st.stop()

    # Chọn model để dự đoán
    st.subheader("🔍 Chọn mô hình dự đoán")
    selected_model_name = st.selectbox("Chọn model", model_names, key="model_selection")
    predict_button = st.button("Dự đoán", key="predict_button")

    if predict_button:
        # Tìm model tương ứng
        # model_heating = dict(models_heating)[selected_model_name]
        model_cooling = dict(models_cooling)[selected_model_name]

        # Predict
        try:
            # heating_load = model_heating.predict(scaled_df)[0]
            heating_load = 20.0

            cooling_load = model_cooling.predict(scaled_df)[0]

            st.success(f"🎯 Kết quả dự đoán heating load : {heating_load:.4f}")
            st.success(f"🎯 Kết quả dự đoán cooling load : {cooling_load:.4f}")

            # Thêm nút download kết quả dự đoán
            prediction_df = pd.DataFrame({
                "Model": [selected_model_name],
                "Relative Compactness": [relative_compactness],
                "Wall Area": [wall_area],
                "Roof Area": [roof_area],
                "Overall Height": [overall_height],
                "Glazing Area": [glazing_area],
                "Glazing Area Distribution": [glazing_area_distribution],
                "Heating load": [heating_load],
                "Cooling load" : [cooling_load]
            })

            # st.download_button(
            #     label="Tải kết quả dự đoán (.csv)",
            #     data=prediction_df.to_csv(index=False),
            #     file_name="prediction_result.csv",
            #     mime="text/csv"
            # )

        except Exception as e:
            st.error(f"⚠️ Lỗi khi dự đoán: {e}")

        area = wall_area + roof_area  # Giả định đây là tổng diện tích sàn có thể chỉnh lại nếu có input riêng

        st.subheader("📊 Ứng dụng thực tế từ kết quả")

        # 1. Công suất HVAC đề xuất
        st.markdown("### 🔧 Công suất hệ thống HVAC đề xuất")
        hours_per_year = 1000

        heating_power_kw = float((heating_load * area) / hours_per_year)
        cooling_power_kw = float((cooling_load * area) / hours_per_year)

        st.write(f"- **Công suất sưởi yêu cầu**: {heating_power_kw:.2f} kW")
        st.write(f"- **Công suất làm mát yêu cầu**: {cooling_power_kw:.2f} kW")

        # 2. Chi phí năng lượng hàng năm
        st.markdown("### 💵 Ước tính chi phí năng lượng hàng năm")
        price_per_kwh = 3000  # VND/kWh
        total_energy = float((heating_load + cooling_load) * area)
        estimated_cost = float(total_energy * price_per_kwh)
        st.write(f"- Tổng năng lượng tiêu thụ: {total_energy:.2f} kWh/năm")
        st.write(f"- **Chi phí ước tính**: {estimated_cost:,.0f} VND/năm")

        # 3. Phát thải CO₂
        st.markdown("### 🌱 Phát thải CO₂ ước tính")
        emission_factor = 0.5  # kg CO₂ / kWh
        total_emission = float(total_energy * emission_factor)
        st.write(f"- **Phát thải CO₂**: {total_emission:,.0f} kg CO₂/năm")

        # 4. Gợi ý số tấm pin mặt trời
        st.markdown("### ☀️ Gợi ý hệ thống điện mặt trời")
        solar_panel_output = 350  # kWh/năm/panel
        required_panels = float(total_energy / solar_panel_output)
        st.write(f"- **Số tấm pin mặt trời cần thiết**: {required_panels:.0f} tấm")

        # 5. Phân loại hiệu suất
        st.markdown("### 🏷️ Phân loại hiệu suất công trình")
        if heating_load < 10 and cooling_load < 10:
            rating = "A (Hiệu quả cao)"
        elif heating_load < 15 and cooling_load < 15:
            rating = "B (Trung bình)"
        else:
            rating = "C (Hiệu suất thấp)"
        st.write(f"- **Xếp loại hiệu suất**: {rating}")
