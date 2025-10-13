const COLORS = {
    primary: '#E63946',
    secondary: '#1D3557',
    tertiary: '#457B9D',
    background: '#F8F9FA',
    text: '#1D1D1F'
};

const CHART_CONFIG = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                font: { family: 'Space Grotesk', size: 12, weight: '500' },
                color: '#6E6E73',
                padding: 16,
                usePointStyle: true,
                pointStyle: 'rect'
            }
        }
    },
    scales: {
        x: {
            grid: { display: false, drawBorder: false },
            ticks: {
                font: { family: 'Space Grotesk', size: 11 },
                color: '#86868B'
            }
        },
        y: {
            grid: { color: '#E1E4E8', drawBorder: false },
            ticks: {
                font: { family: 'Space Grotesk', size: 11 },
                color: '#86868B'
            }
        }
    }
};

let charts = {};
let currentData = {};

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-container');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.getAttribute('data-view');
            
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            views.forEach(v => v.classList.add('hidden'));
            document.getElementById(`${viewName}-view`).classList.remove('hidden');
            
            // Update page title based on view
            const titles = {
                'overview': 'Dashboard Overview',
                'analytics': 'Analytics',
                'data': 'Data View',
                'settings': 'Settings'
            };
            document.querySelector('.page-title').textContent = titles[viewName] || 'Dashboard';
        });
    });
}

function initCharts() {
    // Initialize Overview Charts
    const chart1Ctx = document.getElementById('chart-1')?.getContext('2d');
    if (chart1Ctx) {
        charts.chart1 = new Chart(chart1Ctx, {
            type: 'bar',
            data: {
                labels: ['A', 'B', 'C'],
                datasets: [{
                    label: 'Dataset 1',
                    data: [0, 0, 0],
                    backgroundColor: [COLORS.primary, COLORS.secondary, COLORS.tertiary]
                }]
            },
            options: {
                ...CHART_CONFIG,
                aspectRatio: 1.8,
                plugins: {
                    ...CHART_CONFIG.plugins,
                    legend: { display: false }
                }
            }
        });
    }
    
    const chart2Ctx = document.getElementById('chart-2')?.getContext('2d');
    if (chart2Ctx) {
        charts.chart2 = new Chart(chart2Ctx, {
            type: 'doughnut',
            data: {
                labels: ['Category 1', 'Category 2', 'Category 3'],
                datasets: [{
                    data: [33.3, 33.3, 33.3],
                    backgroundColor: [COLORS.primary, COLORS.secondary, COLORS.tertiary],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.8,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Space Grotesk', size: 12, weight: '500' },
                            color: '#6E6E73',
                            padding: 16,
                            usePointStyle: true,
                            pointStyle: 'rect'
                        }
                    }
                }
            }
        });
    }
    
    // Initialize Time Series Chart
    const timeseriesCtx = document.getElementById('timeseries-chart')?.getContext('2d');
    if (timeseriesCtx) {
        charts.timeseries = new Chart(timeseriesCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: CHART_CONFIG
        });
    }
}

function updateTimeSeriesChart(data, seriesKeys) {
    const chart = charts.timeseries;
    if (!chart) return;
    
    const datasets = seriesKeys.map((key, idx) => {
        const colors = [COLORS.primary, COLORS.secondary, COLORS.tertiary];
        return {
            label: key,
            data: data[key],
            borderColor: colors[idx % colors.length],
            backgroundColor: colors[idx % colors.length],
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0
        };
    });
    
    chart.data.labels = data.rounds || [];
    chart.data.datasets = datasets;
    chart.update();
}

function loadOverviewData() {
    fetch('/api/overview')
        .then(r => r.json())
        .then(data => {
            // Update metric cards
            const metrics = data.metrics || {};
            Object.keys(metrics).forEach((key, idx) => {
                const elem = document.getElementById(`metric-${idx + 1}`);
                if (elem) elem.textContent = metrics[key];
            });
            
            // Update charts if data available
            if (data.chart_data && charts.chart2) {
                charts.chart2.data.datasets[0].data = data.chart_data.values;
                charts.chart2.update();
            }
        })
        .catch(err => console.error('Failed to load overview data:', err));
}

function loadTimeSeriesData() {
    fetch('/api/timeseries')
        .then(r => r.json())
        .then(data => {
            currentData.timeseries = data;
            const seriesKeys = Object.keys(data).filter(k => k !== 'rounds');
            updateTimeSeriesChart(data, seriesKeys);
        })
        .catch(err => console.error('Failed to load timeseries data:', err));
}

function loadDetailsData() {
    fetch('/api/details')
        .then(r => r.json())
        .then(data => {
            const tbody = document.getElementById('details-table-body');
            if (!tbody) return;
            
            if (data.items && data.items.length > 0) {
                tbody.innerHTML = data.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.value}</td>
                        <td>${item.metric?.toFixed(2) || 'N/A'}</td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="3" class="loading">No data available</td></tr>';
            }
        })
        .catch(err => console.error('Failed to load details data:', err));
}

function initToggleButtons() {
    document.querySelectorAll('.toggle-group').forEach(group => {
        const buttons = group.querySelectorAll('.toggle-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Handle toggle logic here
                const series = btn.getAttribute('data-series');
                console.log('Toggled to:', series);
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCharts();
    initToggleButtons();
    
    // Load initial data
    loadOverviewData();
    loadTimeSeriesData();
    loadDetailsData();
    
    // Setup refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadOverviewData();
            loadTimeSeriesData();
            loadDetailsData();
        });
    }
});

