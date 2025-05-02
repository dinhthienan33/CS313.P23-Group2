import pickle


def load():
    with open(f"models/heating_AL.pkl", "rb") as f:
        heating = pickle.load(f)
    with open(f"models/cooling_AL.pkl", "rb") as f:
        cooling = pickle.load(f)
    models = {"heating": heating, "cooling": cooling}

    return models
