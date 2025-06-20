// Store multiple chart instances
const chartInstances = new Map();
const chartStats = new Map();

export function onLoad() {
    console.log('TradingView module loaded');
}

export function onUpdate() {
    console.log('TradingView module updated');
}

export function onDispose() {
    console.log('TradingView module disposed');
    // Clean up all instances
    chartInstances.forEach((widget, containerId) => {
        if (widget) {
            widget.remove();
            chartInstances.delete(containerId);
            chartStats.delete(containerId);
        }
    });
}

export function initializeChart(containerId, symbol) {
    console.log('Initializing chart for container:', containerId, 'and symbol:', symbol);

    // Check if TradingView is available
    if (typeof TradingView === 'undefined') {
        console.error('TradingView is undefined!');
        return false;
    }

    if (typeof TradingView.widget !== 'function') {
        console.error('TradingView.widget is not a function!', typeof TradingView.widget);
        return false;
    }

    // Try to find the container with retries
    let container = null;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!container && attempts < maxAttempts) {
        container = document.getElementById(containerId);
        if (!container) {
            attempts++;
            console.log(`Container not found, attempt ${attempts}/${maxAttempts}. Waiting...`);
            // Wait 100ms before next attempt
            const start = Date.now();
            while (Date.now() - start < 100) {
                // Busy wait
            }
        }
    }

    if (!container) {
        console.error('Container element not found for ID:', containerId, 'after', maxAttempts, 'attempts');
        console.log('Available elements with similar IDs:');
        document.querySelectorAll('[id*="tradingView"]').forEach(el => {
            console.log('-', el.id);
        });
        return false;
    }

    console.log('Container found:', container);

    try {
        // Remove existing instance if it exists
        if (chartInstances.has(containerId)) {
            console.log('Removing existing chart instance for:', containerId);
            chartInstances.get(containerId).remove();
            chartInstances.delete(containerId);
            chartStats.delete(containerId);
        }

        const startTime = performance.now();
        console.log('Creating TradingView widget with config:', {
            container_id: containerId,
            symbol: symbol,
            interval: "D",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "ru",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: false,
            height: "100%",
            width: "100%",
            studies: []
        });

        const widget = new TradingView.widget({
            container_id: containerId,
            symbol,
            interval: "D",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "ru",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: false,
            height: "100%",
            width: "100%",
            studies: []
        });

        console.log('Widget created successfully:', widget);

        // Store the widget instance
        chartInstances.set(containerId, widget);
        
        // Store chart statistics
        chartStats.set(containerId, {
            symbol: symbol,
            created: new Date(),
            loadTime: performance.now() - startTime,
            lastUpdate: new Date()
        });
        
        console.log('TradingView widget created successfully for container:', containerId);
        return true;
    } catch (error) {
        console.error('Error creating TradingView widget:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        return false;
    }
}

export function setSymbol(containerId, symbol) {
    console.log('Setting symbol:', symbol, 'for container:', containerId);
    const widget = chartInstances.get(containerId);
    if (widget) {
        try {
            widget.setSymbol(symbol, "D");
            
            // Update stats
            const stats = chartStats.get(containerId);
            if (stats) {
                stats.symbol = symbol;
                stats.lastUpdate = new Date();
            }
            console.log('Symbol set successfully:', symbol);
        } catch (error) {
            console.error('Error setting symbol:', error);
        }
    } else {
        console.error('No chart instance found for container:', containerId);
    }
}

export function disposeChart(containerId) {
    console.log('Disposing chart for container:', containerId);
    const widget = chartInstances.get(containerId);
    if (widget) {
        try {
            widget.remove();
            chartInstances.delete(containerId);
            chartStats.delete(containerId);
            console.log('Chart disposed successfully:', containerId);
        } catch (error) {
            console.error('Error disposing chart:', error);
        }
    } else {
        console.log('No chart instance found to dispose for:', containerId);
    }
}

export function getChartStats() {
    const stats = [];
    chartStats.forEach((stat, containerId) => {
        stats.push({
            containerId: containerId,
            symbol: stat.symbol,
            created: stat.created,
            loadTime: stat.loadTime,
            lastUpdate: stat.lastUpdate,
            uptime: new Date() - stat.created
        });
    });
    return stats;
}

export function getActiveChartCount() {
    return chartInstances.size;
}

export function getMemoryUsage() {
    if (performance.memory) {
        return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
        };
    }
    return null;
}

export function testTradingViewLibrary() {
    console.log('=== TradingView Library Test ===');
    
    // Check basic availability
    console.log('TradingView type:', typeof TradingView);
    console.log('TradingView.widget type:', typeof TradingView?.widget);
    
    // Check if it's a constructor
    if (typeof TradingView?.widget === 'function') {
        console.log('TradingView.widget is a function - GOOD');
        
        // Try to get the function name
        console.log('Widget function name:', TradingView.widget.name);
        
        // Check if it has expected properties
        console.log('TradingView object keys:', Object.keys(TradingView));
        
        return true;
    } else {
        console.error('TradingView.widget is not a function - BAD');
        return false;
    }
}

export function checkTradingViewAvailability() {
    const hasLibrary = typeof TradingView !== 'undefined';
    const hasWidget = hasLibrary && typeof TradingView.widget === 'function';
    const isReady = window.tradingViewReady === true;
    const loadAttempts = window.tradingViewLoadAttempts || 0;
    
    console.log('TradingView availability check:', { 
        hasLibrary, 
        hasWidget, 
        isReady, 
        loadAttempts,
        tradingViewType: typeof TradingView,
        widgetType: hasLibrary ? typeof TradingView.widget : 'undefined'
    });
    
    // If the library and widget are available, consider it ready even if the flag isn't set
    if (hasLibrary && hasWidget && !isReady) {
        console.log('TradingView library is available but flag not set, forcing ready state');
        window.tradingViewReady = true;
        return true;
    }
    
    return hasLibrary && hasWidget && isReady;
} 