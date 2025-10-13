# Analytics Dashboard Template

A beautiful, modern Flask dashboard template with a Bauhaus-inspired design system. Ready to customize for any project.

## Features

- **Modern UI**: Clean, professional design with Space Grotesk typography
- **Responsive**: Works on desktop, tablet, and mobile
- **Chart.js Integration**: Beautiful, interactive charts out of the box
- **Multiple Views**: Overview, Analytics, Data, and Settings pages
- **Easy Customization**: Well-organized CSS variables and modular JavaScript

## Quick Start

### Installation

```bash
# From your project root
pip install -e ".[dashboard]"
```

This installs Flask and other dashboard dependencies defined in `pyproject.toml`.

### Running the Dashboard

```bash
# Using the Makefile (recommended)
make dashboard

# Or manually
python dashboard/main.py
```

Visit **http://localhost:5050** in your browser.

## Customization Guide

### 1. Update Branding

Edit `templates/dashboard.html`:
- Change the title (line 6): `<title>Your App Name</title>`
- Update the logo text (line 23): `<span>Your App</span>`
- Modify navigation items (lines 27-62) to match your views

### 2. Customize Colors

Edit `static/css/style.css` (lines 1-19):

```css
:root {
    --color-accent: #E63946;        /* Primary brand color */
    --color-secondary: #1D3557;     /* Secondary brand color */
    --color-chart-1: #E63946;       /* Chart color 1 */
    --color-chart-2: #1D3557;       /* Chart color 2 */
    --color-chart-3: #457B9D;       /* Chart color 3 */
}
```

### 3. Add Your Data

Edit `main.py` and replace the placeholder endpoints:

```python
@app.route("/api/overview")
def overview_endpoint() -> Response:
    # Replace with your actual data source
    data = fetch_your_overview_data()
    return jsonify(data)
```

### 4. Customize Charts

Edit `static/js/dashboard.js`:

- Update `initCharts()` to match your data structure
- Modify chart types (bar, line, doughnut, pie, etc.)
- Add new charts by following the existing patterns

### 5. Add New Views

1. Add navigation item in `templates/dashboard.html`:
```html
<button class="nav-item" data-view="newview">
    <svg><!-- icon --></svg>
    <span>New View</span>
</button>
```

2. Add view container:
```html
<div class="view-container hidden" id="newview-view">
    <!-- Your content here -->
</div>
```

3. Update `initNavigation()` in `dashboard.js`:
```javascript
const titles = {
    'newview': 'New View Title',
    // ... other views
};
```

## API Endpoints

The template includes these placeholder endpoints:

- `GET /` - Dashboard UI
- `GET /api/overview` - Overview metrics and chart data
- `GET /api/timeseries` - Time series data for charts
- `GET /api/details` - Detailed tabular data
- `GET /api/healthz` - Health check

Replace these with your actual data sources.

## Design System

### Typography
- **Font**: Space Grotesk (loaded from Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Colors
- **Primary**: Red (#E63946)
- **Secondary**: Navy (#1D3557)
- **Accent**: Steel Blue (#457B9D)
- **Success**: Teal (#06D6A0)
- **Background**: Light Gray (#F8F9FA)
- **Surface**: White (#FFFFFF)

### Components
- Metric cards with large values
- Multi-view navigation sidebar
- Responsive chart containers
- Data tables with hover states
- Toggle button groups
- Action buttons (primary/secondary)

## Project Structure

```
dashboard/
├── main.py                 # Flask application
├── README.md              # This file
├── static/
│   ├── css/
│   │   └── style.css      # All styles (CSS variables at top)
│   └── js/
│       └── dashboard.js   # Chart initialization and data loading
└── templates/
    └── dashboard.html     # Main HTML template
```

## Tips

1. **Keep it simple**: Start with the overview view and gradually add complexity
2. **Use CSS variables**: All colors are defined in `:root` for easy theming
3. **Chart.js docs**: https://www.chartjs.org/docs/latest/
4. **Mobile-first**: Test on mobile early and often
5. **API structure**: Keep your API responses simple and consistent

## Example Integration

```python
# In your main.py, connect to your actual data:

from your_project import get_metrics, get_timeseries

@app.route("/api/overview")
def overview_endpoint() -> Response:
    metrics = get_metrics()
    return jsonify({
        "metrics": {
            "metric_1": metrics.total_users,
            "metric_2": metrics.conversion_rate,
            "metric_3": metrics.revenue,
            "metric_4": metrics.active_sessions,
        },
        "chart_data": {
            "labels": metrics.categories,
            "values": metrics.category_values,
        }
    })
```

## License

This template is part of your project and inherits your project's license.
