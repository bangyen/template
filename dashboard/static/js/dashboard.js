/**
 * Template Dashboard JavaScript
 * 
 * Modern dashboard with improved error handling, loading states, and user feedback.
 * Features class-based architecture with proper cleanup and memory management.
 */

class TemplateDashboard {
    constructor() {
        this.apiBaseUrl = '/api';
        this.charts = {};
        this.currentData = {};
        
        // Store event listeners for cleanup
        this.eventListeners = [];
        
        this.init();
    }

    /**
     * Initialize the dashboard
     */
    init() {
        this.initNavigation();
        this.initCharts();
        this.bindEvents();
        this.loadInitialData();
    }

    /**
     * Add event listener with tracking for cleanup
     */
    addTrackedListener(element, event, handler, options = false) {
        if (!element) return;
        
        element.addEventListener(event, handler, options);
        this.eventListeners.push({ element, event, handler, options });
    }

    /**
     * Initialize navigation system
     */
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const views = document.querySelectorAll('.view-container');
        
        navItems.forEach(item => {
            const handler = () => {
                const viewName = item.getAttribute('data-view');
                
                // Update active nav item
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                
                // Show selected view
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
            };
            
            this.addTrackedListener(item, 'click', handler);
        });
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            this.addTrackedListener(refreshBtn, 'click', () => this.refreshAllData());
        }

        // Toggle buttons for analytics view
        this.initToggleButtons();
    }

    /**
     * Initialize toggle buttons for chart series
     */
    initToggleButtons() {
        document.querySelectorAll('.toggle-group').forEach(group => {
            const buttons = group.querySelectorAll('.toggle-btn');
            buttons.forEach(btn => {
                const handler = () => {
                    btn.classList.toggle('active');
                    
                    // Toggle series visibility in timeseries chart
                    if (this.charts.timeseries && this.currentData.timeseries) {
                        const activeButtons = Array.from(buttons).filter(b => b.classList.contains('active'));
                        // Map button names (series1, series2, series3) to API names (series_1, series_2, series_3)
                        const activeSeries = activeButtons.map(b => {
                            const seriesName = b.getAttribute('data-series');
                            return seriesName.replace(/(\d)/, '_$1');
                        });
                        
                        // Update chart with only active series (or all if none selected)
                        const seriesKeys = activeSeries.length > 0 ? activeSeries : ['series_1', 'series_2', 'series_3'];
                        this.updateTimeSeriesChart(this.currentData.timeseries, seriesKeys);
                    }
                };
                
                this.addTrackedListener(btn, 'click', handler);
            });
        });
    }

    /**
     * Initialize charts
     */
    initCharts() {
        // Initialize Overview Charts
        const chart1Ctx = document.getElementById('chart-1')?.getContext('2d');
        if (chart1Ctx) {
            this.charts.chart1 = new Chart(chart1Ctx, {
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
            this.charts.chart2 = new Chart(chart2Ctx, {
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
            this.charts.timeseries = new Chart(timeseriesCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                options: CHART_CONFIG
            });
        }
    }

    /**
     * Update time series chart with new data
     */
    updateTimeSeriesChart(data, seriesKeys) {
        const chart = this.charts.timeseries;
        if (!chart) return;
        
        const datasets = seriesKeys.map((key, idx) => {
            const colors = [COLORS.primary, COLORS.secondary, COLORS.tertiary];
            // Convert series_1 to "Series 1" for display
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return {
                label: label,
                data: data[key] || [],
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

    /**
     * Load initial data for all views
     */
    async loadInitialData() {
        try {
            await Promise.all([
                this.loadOverviewData(),
                this.loadTimeSeriesData(),
                this.loadDetailsData()
            ]);
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    /**
     * Refresh all data
     */
    async refreshAllData() {
        this.showLoading('Refreshing data...');
        try {
            await this.loadInitialData();
            this.showSuccess('Data refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh data:', error);
            this.showError('Failed to refresh data');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Load overview data
     */
    async loadOverviewData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/overview`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Update metric cards
            const metrics = data.metrics || {};
            Object.keys(metrics).forEach((key, idx) => {
                const elem = document.getElementById(`metric-${idx + 1}`);
                if (elem) elem.textContent = metrics[key];
            });
            
            // Update charts if data available
            if (data.chart_data) {
                if (this.charts.chart1) {
                    this.charts.chart1.data.labels = data.chart_data.labels;
                    this.charts.chart1.data.datasets[0].data = data.chart_data.values;
                    this.charts.chart1.update();
                }
                if (this.charts.chart2) {
                    this.charts.chart2.data.labels = data.chart_data.labels;
                    this.charts.chart2.data.datasets[0].data = data.chart_data.values;
                    this.charts.chart2.update();
                }
            }
        } catch (error) {
            console.error('Failed to load overview data:', error);
            throw error;
        }
    }

    /**
     * Load time series data
     */
    async loadTimeSeriesData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/timeseries`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.currentData.timeseries = data;
            
            // Default to showing all series initially
            const seriesKeys = ['series_1', 'series_2', 'series_3'];
            this.updateTimeSeriesChart(data, seriesKeys);
        } catch (error) {
            console.error('Failed to load timeseries data:', error);
            throw error;
        }
    }

    /**
     * Load details data
     */
    async loadDetailsData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/details`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
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
        } catch (error) {
            console.error('Failed to load details data:', error);
            throw error;
        }
    }

    /**
     * Show loading indicator
     */
    showLoading(message = 'Loading...') {
        const loader = document.getElementById('loading-indicator');
        const loaderText = document.getElementById('loading-text');
        if (loader) {
            loader.classList.remove('hidden');
            if (loaderText) {
                loaderText.textContent = message;
            }
        }
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.classList.add('hidden');
        }
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showToast(message, 'error');
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const container = document.getElementById('messages');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = type;
        
        const icon = type === 'success' ? 
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 8L8 4M8 12L8 12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/></svg>';
        
        toast.innerHTML = `${icon}<span>${message}</span>`;
        
        container.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    /**
     * Cleanup method to remove all event listeners
     */
    destroy() {
        // Remove all tracked event listeners
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            if (element && element.removeEventListener) {
                element.removeEventListener(event, handler, options);
            }
        });
        
        // Clear the array
        this.eventListeners = [];
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Chart configuration constants
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Clean up any existing instance
    if (window.dashboard && typeof window.dashboard.destroy === 'function') {
        window.dashboard.destroy();
    }
    
    window.dashboard = new TemplateDashboard();
});

// Clean up on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
    if (window.dashboard && typeof window.dashboard.destroy === 'function') {
        window.dashboard.destroy();
    }
});

