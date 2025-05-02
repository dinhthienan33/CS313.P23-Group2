import pickle
import pandas as pd
import os

path = os.path.dirname(os.path.abspath(__file__)) + "/models"
print(path)


def scale(df):
    with open(f"models/col_transformer.pkl", "rb") as f:
        ct = pickle.load(f)

    scaled_df = ct.transform(df)

    return scaled_df
