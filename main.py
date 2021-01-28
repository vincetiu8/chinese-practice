import flask
from flask import request, jsonify
from google.cloud import translate_v2 as translate
from flask_cors import CORS

credentials_location = ""  # specify credentials location here or in environment variables

app = flask.Flask(__name__)
cors = CORS(app)
app.config["DEBUG"] = True
translate_client = translate.Client.from_service_account_json(credentials_location)
target = "en"


@app.route('/', methods=['POST'])
def translate_text():
    terms = request.json.get('terms')

    if len(terms) == 0:
        result = {"error": "bad request, terms not found"}

    else:
        result = translate_client.translate(terms, target_language=target)

    return jsonify(result)


app.run()
