Ext.ControllerManager = new Ext.AbstractManager({
    register: function(id, options) {
        options.id = id;
        
        var controller = new Ext.Controller(options);
        if (controller.init) {
            controller.init();
        }
        
        this.all.add(controller);
        
        return controller;
    }
});

Ext.regController = function() {
    return Ext.ControllerManager.register.apply(Ext.ControllerManager, arguments);
};