demos.isSimulatorEnabled = false;

demos.Simulator = new Ext.Panel({
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    items: [{
        xtype: 'button',
        ui: 'confirm',
        text: 'Enable Simulator (Experimental)',
        recorderEvents: ['touchstart', 'touchmove', 'touchend', 'mousedown', 'mousemove', 'mouseend', 'click'],
        handler: function() {
            if (!demos.isSimulatorEnabled) {
                demos.isSimulatorEnabled = true;
                this.setText('Disable Simulator');
                this.el.addCls('x-button-decline').removeCls('x-button-confirm');
                this.showToolbar();
            } else {
                demos.isSimulatorEnabled = false;
                this.setText('Enable Simulator (Experimental)');
                this.el.removeCls('x-button-decline').addCls('x-button-confirm');
                this.hideToolbar();
                this.eraseRecorder();
            }
        },
        doRecord: function(e) {
            var target = e.target;

            if (target.nodeType == 3)
            target = target.parentNode;

            if (Ext.get(target).hasCls('x-button-label')) {
                target = target.parentNode;
            }

            if (!Ext.get(target).hasCls('recorderButton')) {
                this.getRecorder().record('main', e);
            }
        },
        getRecorder: function() {
            if (!this.recorder) {
                this.recorder = new Ext.util.EventRecorder();
            }

            return this.recorder;
        },
        startRecorder: function() {
            var me = this;

            if (!this.doRecordWrap) {
                this.doRecordWrap = Ext.createDelegate(me.doRecord, me);
            }

            this.getRecorder().start('main');
            this.recorderEvents.forEach(function(name) {
                document.addEventListener(name, me.doRecordWrap, true);
            });
        },
        stopRecorder: function() {
            var me = this;

            if (!this.doRecordWrap) {
                this.doRecordWrap = Ext.createDelegate(me.doRecord, me);
            }

            this.recorderEvents.forEach(function(name) {
                document.removeEventListener(name, me.doRecordWrap, true);
            });
        },
        eraseRecorder: function() {
            this.getRecorder().erase('main');
        },
        replayRecorder: function() {
            this.stopRecorder();
            this.getRecorder().replay('main');
        },
        showToolbar: function() {
            sink.Main.ui.addDocked(this.getToolbar());
        },
        hideToolbar: function() {
            sink.Main.ui.removeDocked(this.getToolbar(), false);
        },
        getToolbar: function() {
            if (!this.toolbar) {

                this.toolbar = new Ext.Toolbar({
                    docked: 'bottom',
                    items: [
                    {
                        xtype: 'button',
                        ui: 'confirm',
                        cls: 'recorderButton',
                        text: 'Start',
                        handler: Ext.createDelegate(this.startRecorder, this)
                    },
                    {
                        xtype: 'button',
                        text: 'Stop',
                        ui: 'decline',
                        cls: 'recorderButton',
                        handler: Ext.createDelegate(this.stopRecorder, this)
                    },
                    {
                        xtype: 'button',
                        text: 'Erase',
                        ui: 'action',
                        cls: 'recorderButton',
                        handler: Ext.createDelegate(this.eraseRecorder, this)
                    },
                    {
                        xtype: 'button',
                        ui: 'forward',
                        text: 'Playback',
                        cls: 'recorderButton',
                        handler: Ext.createDelegate(this.replayRecorder, this)
                    }
                    ]
                });

            }

            return this.toolbar;
        }
    }]
});
