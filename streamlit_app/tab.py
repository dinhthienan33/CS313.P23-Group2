import streamlit as st
import pandas as pd
from preprocess import scale

def hvac(area, heating_load, cooling_load):    
    st.markdown("### 🔧 Công suất hệ thống HVAC đề xuất")
    hours_per_year = 1000

    heating_power_kw = float((heating_load * area) / hours_per_year)
    cooling_power_kw = float((cooling_load * area) / hours_per_year)

    st.write(f"- **Công suất sưởi yêu cầu**: {heating_power_kw:.2f} kW")
    st.write(f"- **Công suất làm mát yêu cầu**: {cooling_power_kw:.2f} kW")

def pred_energy(area, heating_load, cooling_load):
    st.markdown("### 💵 Ước tính chi phí năng lượng hàng năm")
    price_per_kwh = 3000  # VND/kWh
    total_energy = float((heating_load + cooling_load) * area)
    estimated_cost = float(total_energy * price_per_kwh)
    st.write(f"- Tổng năng lượng tiêu thụ: {total_energy:.2f} kWh/năm")
    st.write(f"- **Chi phí ước tính**: {estimated_cost:,.0f} VND/năm")

def cal_co2(area, heating_load, cooling_load):
    st.markdown("### 🌱 Phát thải CO₂ ước tính")
    total_energy = float((heating_load + cooling_load) * area)
    emission_factor = 0.5  # kg CO₂ / kWh
    total_emission = float(total_energy * emission_factor)
    st.write(f"- **Phát thải CO₂**: {total_emission:,.0f} kg CO₂/năm")

def cal_panel(area, heating_load, cooling_load):
    st.markdown("### ☀️ Gợi ý hệ thống điện mặt trời")
    solar_panel_output = 350  # kWh/năm/panel
    total_energy = float((heating_load + cooling_load) * area)
    required_panels = float(total_energy / solar_panel_output)
    st.write(f"- **Số tấm pin mặt trời cần thiết**: {required_panels:.0f} tấm")

def energy_efficiency(heating_load, cooling_load):
    st.markdown("### 🏷️ Phân loại hiệu suất công trình")
    if heating_load < 10 and cooling_load < 10:
        rating = "A (Hiệu quả cao)"
    elif heating_load < 15 and cooling_load < 15:
        rating = "B (Trung bình)"
    else:
        rating = "C (Hiệu suất thấp)"
    st.write(f"- **Xếp loại hiệu suất**: {rating}")

def run(tab, model_names, models_cooling, models_heating=None):
    # st.markdown("# 🏡 Energy Efficiency Prediction")
    # st.markdown(
    #     """
    #     ## Dự đoán hiệu quả năng lượng từ các thông số kiến trúc.
    #     Chọn model và nhập các thông số bên dưới để nhận dự đoán từ các mô hình.
    #     """
    # )

    if 'submitted' not in st.session_state:
        st.session_state.submitted = False

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

    if st.session_state.submitted:
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

        try:
            scaled_df = scale(df)
            st.success("✅ Dữ liệu đã được scale!")
            st.dataframe(scaled_df, use_container_width=True)
        except Exception as e:
            st.error(f"⚠️ Lỗi khi scale dữ liệu: {e}")
            st.stop()

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

                # st.success(f"🎯 Kết quả dự đoán heating load : {heating_load:.4f}")
                # st.success(f"🎯 Kết quả dự đoán cooling load : {cooling_load:.4f}")
                st.markdown(
                    f"""
                    <div style="background-color: #f0f2f6; padding: 20px; border-radius: 10px; text-align: center;">
                        <h2 style="color: #1a73e8;">🎯 Kết quả dự đoán ({selected_model_name})</h2>
                        <p style="font-size: 24px; color: #e65100;"><strong>Heating Load:</strong> {heating_load:.2f} kWh/m²</p>
                        <p style="font-size: 24px; color: #0277bd;"><strong>Cooling Load:</strong> {cooling_load:.2f} kWh/m²</p>
                    </div>
                    """,
                    unsafe_allow_html=True
                )

            except Exception as e:
                st.error(f"⚠️ Lỗi khi dự đoán: {e}")


            area = wall_area + roof_area
            
            if tab == 'hvac':
                hvac(area, heating_load, cooling_load)
            if tab =='predict energy':
                pred_energy(area, heating_load, cooling_load)
            if tab == 'co2 calculation':
                cal_co2(area, heating_load, cooling_load)
            if tab == 'solar panel calculation':
                cal_panel(area, heating_load, cooling_load)
            if tab == 'energy efficiency':
                energy_efficiency(heating_load, cooling_load)
