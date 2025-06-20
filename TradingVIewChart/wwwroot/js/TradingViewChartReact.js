const { useEffect, useRef } = React;

function TradingViewChartReact({ containerId, symbol }) {
    const widgetRef = useRef(null);
    const chartDivRef = useRef(null);

    useEffect(() => {
        if (!window.TradingView || typeof window.TradingView.widget !== 'function') {
            console.error('TradingView.widget is not available!');
            return;
        }
        // Clean up any previous widget
        if (widgetRef.current) {
            widgetRef.current.remove();
            widgetRef.current = null;
        }
        // Create new widget
        widgetRef.current = new window.TradingView.widget({
            container_id: chartDivRef.current.id,
            symbol,
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: 'light',
            style: '1',
            locale: 'ru',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: false,
            height: '100%',
            width: '100%',
            studies: []
        });
        return () => {
            if (widgetRef.current) {
                widgetRef.current.remove();
                widgetRef.current = null;
            }
        };
    }, [symbol]);

    return React.createElement('div', {
        id: containerId,
        ref: chartDivRef,
        style: { width: '100%', height: '100%' }
    });
}

export function renderTradingViewChartReact(elementId, containerId, symbol) {
    ReactDOM.render(
        React.createElement(TradingViewChartReact, { containerId, symbol }),
        document.getElementById(elementId)
    );
} 