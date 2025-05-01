import pickle 
import pandas as pd 

def scale(df):
    with open('models/col_transformer.pkl', 'rb') as f:
        ct = pickle.load(f)

    scaled_df = ct.transform(df)

    return scaled_df
