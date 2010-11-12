drib.views.UserInfo = Ext.extend(Ext.form.FormPanel, {
    centered: true,
    floating: true,
    modal: true,
    width: 210,
    height: 135,
    
    initComponent: function() {
        var nameInput = new Ext.form.Text({
            name: 'username',
            label: 'Username'
        });
        
        var submitButton = new Ext.Button({
            text: 'Submit',
            ui: 'round',
            scope: this,
            handler: function() {
                var username = nameInput.getValue();
                this.displayList.onSubmit(username);
                this.hide();
            }
        });
        
        this.items = [nameInput, {xtype: 'spacer', height: 5}, submitButton];
        
        drib.views.UserInfo.superclass.initComponent.call(this);
    }

});