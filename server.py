import json
from flask import Flask,render_template,jsonify,send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/catalogue/')
def catalogue():
    return render_template('catalogue.html')

@app.route('/order')
def order():
    return render_template('order.html')

@app.route('/catalogue/jinx')
def jinx():
    return render_template('jinx.html')

@app.route('/catalogue/blastx')
def blastx():
    return render_template('blastx.html')


@app.route('/api/data/<project>')
def file_data(project):
    try:
        return send_from_directory('static/data', f'{project}.json')
    except Exception as e:
        return jsonify({'error': f'Fehler: {str(e)}'}), 500
    
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')