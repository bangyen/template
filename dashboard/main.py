"""Flask application serving an analytics dashboard.

This is a template dashboard that can be customized for any project.
Replace the placeholder API endpoints with your own data sources.
"""

import logging

from flask import Flask, Response, jsonify, render_template

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)


@app.route("/")
def dashboard() -> str:
    """Render the main dashboard interface."""
    return str(render_template("dashboard.html"))


@app.route("/api/overview")
def overview_endpoint() -> Response:
    """Return overview metrics for the dashboard.

    Replace this with your own data source.
    """
    # Example data structure
    data = {
        "metrics": {
            "metric_1": 42,
            "metric_2": 3.14,
            "metric_3": 100,
            "metric_4": 7.5,
        },
        "chart_data": {
            "labels": ["Category A", "Category B", "Category C"],
            "values": [30, 50, 20],
        },
    }
    return jsonify(data)


@app.route("/api/timeseries")
def timeseries_endpoint() -> Response:
    """Return time series data for visualizations.

    Replace this with your own data source.
    """
    # Example time series structure
    data = {
        "rounds": list(range(50)),
        "series_1": [i * 1.2 for i in range(50)],
        "series_2": [i * 0.8 for i in range(50)],
        "series_3": [i * 1.5 for i in range(50)],
    }
    return jsonify(data)


@app.route("/api/details")
def details_endpoint() -> Response:
    """Return detailed data for the metrics view.

    Replace this with your own data source.
    """
    # Example detailed data
    data = {
        "items": [
            {"name": "Item 1", "value": 100, "metric": 0.85},
            {"name": "Item 2", "value": 200, "metric": 0.92},
            {"name": "Item 3", "value": 150, "metric": 0.78},
        ]
    }
    return jsonify(data)


@app.route("/api/healthz")
def health_check() -> Response:
    """Health check endpoint."""
    return jsonify({"status": "healthy"})


if __name__ == "__main__":
    app.run(debug=True, port=5050)
