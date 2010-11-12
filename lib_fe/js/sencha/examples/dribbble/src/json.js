drib.JSON = {
    request: function(cfg) {
        Ext.util.JSONP.request({
            url: cfg.url,
            callbackKey: 'callback',
            callback: cfg.callback,
            scope: cfg.scope || window
        });
    }
};
