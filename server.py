

import json
from flask import Flask, render_template, jsonify, send_from_directory
from pathlib import Path

app = Flask(__name__)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/catalogue/')
def catalogue():
    return render_template('catalogue.html')


@app.route('/order/')
def order():
    return render_template('order.html')


@app.route('/catalogue/<project>/')
def project(project):
    # if Path(f"static/data/{project}.json").exists():
    return render_template('project.html', data=project)
    # else:
    #    return render_template('404.html')


@app.route('/api/data/<project>/')
def file_data(project):
    try:
        return send_from_directory('static/data/projects', f'{project}.json')
    except Exception as e:
        return jsonify({'error': f'Fehler: {str(e)}'}), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        host='0.0.0.0',
        port=6005,
    )
