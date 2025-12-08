import dash
from dash import dcc, html
import pandas as pd
import requests
import plotly.express as px

# === CONNEXION À L'API EXPRESS ===
url = "http://localhost:3000/api/producteurs"

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
        figure=px.histogram(df, x='region', title="Nombre de producteurs par région")
    ),

    dcc.Graph(
        id='map-producteurs',
        figure=px.scatter_mapbox(
            df,
            lat="latitude",
            lon="longitude",
            hover_name="nom",
            hover_data=["region"],
            zoom=4,
            height=500
        ).update_layout(mapbox_style="open-street-map", title="Localisation des producteurs")
    )
])

# === LANCEMENT SERVEUR ===
if __name__ == '__main__':
    app.run_server(debug=True)
