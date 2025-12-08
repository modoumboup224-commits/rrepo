import dash
from dash import dcc, html
import pandas as pd
import requests
import plotly.express as px

# === CONNEXION À L'API EXPRESS ===
url = "http://localhost:6300/api/producteurs"

try:
    response = requests.get(url)
    data = response.json()
    df = pd.DataFrame(data)
except:
    df = pd.DataFrame(columns=['nom', 'region', 'latitude', 'longitude'])
    print("⚠️ Impossible de récupérer les données depuis l'API. Utilisation de données vides.")

# === INITIALISATION DASH ===
app = dash.Dash(__name__)
app.title = "Tableau de bord Producteurs"

# === LAYOUT DASH ===
app.layout = html.Div([
    html.H1("Tableau de bord - Producteurs", style={'textAlign': 'center'}),

    dcc.Graph(
        id='graph-region',
        figure=px.histogram(df, x='localisation', title="Nombre de producteurs par région")
    ),

    dcc.Graph(
        id='map-producteurs',
        figure=px.scatter_map(
            df,
            lat=df['localisation'].apply(lambda x: float(x.split(',')[0]) if ',' in x else 0),
            lon=df['localisation'].apply(lambda x: float(x.split(',')[1]) if ',' in x else 0),
            hover_name="nom",
            hover_data=["localisation"],
            zoom=4,
            height=500
        ).update_layout(title="Localisation des producteurs")
    )
])

# === LANCEMENT SERVEUR ===
if __name__ == '__main__':
    app.run(debug=True, port=8050)
