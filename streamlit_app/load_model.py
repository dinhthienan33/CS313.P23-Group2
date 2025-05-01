import pickle

def load(str):
    if str == 'heating':
        with open('models/heating.pkl', 'rb') as f:
            models = pickle.load(f)
    if str == 'cooling':
        with open('models/cooling.pkl', 'rb') as f:
            models = pickle.load(f)

    return models