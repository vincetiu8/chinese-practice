import os
import flask
from flask import request, jsonify
from google.cloud import translate_v2 as translate
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

application_credentials = "GOOGLE_APPLICATION_CREDENTIALS"
json_path = os.environ[application_credentials]

translate_client = translate.Client.from_service_account_json(json_path)
target = "en"

app = flask.Flask(__name__)
cors = CORS(app)


@app.route('/', methods=['POST'])
def translate_text():
    terms = request.json.get('terms')

    if len(terms) == 0:
        result = {"error": "bad request, terms not found"}

    else:
        result = translate_client.translate(terms, target_language=target)

    return jsonify(result)


app.run(port=5000) # hardcoded as to avoid confusion
