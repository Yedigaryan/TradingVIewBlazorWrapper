window.tradingViewInterop = {
    widget: null,

    initializeChart: function (containerId) {
        const container = document.getElementById(containerId);
        
        this.widget = new TradingView.widget({
            container_id: containerId,
            symbol: "NASDAQ:AAPL",
            interval: "D",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            save_image: false,
            height: "500",
            width: "100%",
            studies: []
        });

        return true;
    },

    setSymbol: function(symbol) {
        if (this.widget) {
            this.widget.setSymbol(symbol, "D");
        }
    }
}; 