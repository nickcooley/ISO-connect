Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {
        
        Ext.regModel('User', {
            fields: [
                {name: 'name',     type: 'string'},
                {name: 'password', type: 'password'},
                {name: 'email',    type: 'string'},
                {name: 'url',      type: 'string'},
                {name: 'rank',     type: 'string'},
                {name: 'value',    type: 'int'},
                {name: 'enable',   type: 'boolean'},
                {name: 'cool',     type: 'boolean'},
                {name: 'color',    type: 'string'},
                {name: 'team',     type: 'string'},
                {name: 'secret',   type: 'boolean'}
            ]
        });
        
         Ext.regModel('Ranks', {
            fields: [
                {name: 'rank',     type: 'string'},
                {name: 'title',    type: 'string'}
            ]
         });
        
        var ranksStore = new Ext.data.JsonStore({
           data : [
                { rank : 'master',  title : 'Master'},
                { rank : 'padawan', title : 'Student'},
                { rank : 'teacher', title : 'Instructor'},
                { rank : 'aid',     title : 'Assistant'}
           ],
           model : 'Ranks',
           autoLoad : true,
           autoDestroy : true
        });
        
        var formBase = {
            scroll: 'vertical',
            url   : 'postUser.php',
            standardSubmit : false,
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Personal Info',
                    instructions: 'Please enter the information above.',
                    defaults: {
                        required: true,
                        labelAlign: 'left'
                    },
                    items: [
                    {
                        xtype: 'textfield',
                        name : 'name',
                        label: 'Name',
                        useClearIcon: true,
                        // labelAlign: 'right',
                        autoCapitalize : false
                    }, {
                        xtype: 'passwordfield',
//                        xtype: 'textfield',
                        name : 'password',
                        label: 'Password',
                        useClearIcon: false
                    }, {
                        xtype: 'textfield',
                        name : 'disabled',
                        label: 'Disabled',
                        disabled: true,
                        useClearIcon: true
                    }, {
                        xtype: 'emailfield',
                        name : 'email',
                        label: 'Email',
                        placeHolder: 'you@domain.com',
                        useClearIcon: true
                    }, {
                        xtype: 'urlfield',
                        name : 'url',
                        label: 'Url',
                        placeHolder: 'http://google.com',
                        useClearIcon: true
                    }, {
                        xtype: 'checkboxfield',
                        name : 'cool',
                        label: 'Cool',
                        value: 'cool'
                    }, {
                        xtype: 'spinnerfield',
                        name : 'spinner',
                        label: 'Spinner'
                    }, {
                        xtype: 'selectfield',
                        name : 'rank',
                        label: 'Rank',
                        valueField : 'rank',
                        displayField : 'title',
                        store : ranksStore
                    }, {
                        xtype: 'hiddenfield',
                        name : 'secret',
                        value: false
                    }, {
                        xtype : 'textareafield',
                        name  : 'bio',
                        label : 'Bio',
                        maxLength : 60,
                        maxRows : 10
                    }, {
                        xtype: 'slider',
                        name : 'height',
                        label: 'Height'
                    }, {
                        xtype: 'togglefield',
                        name : 'enable',
                        label: 'Security Mode'
                    }, {
                        xtype: 'radiofield',
                        name: 'team',
                        label: 'Red Team',
                        inputValue : 'redteam'
                    }, {
                        xtype: 'radiofield',
                        name: 'team',
                        label: 'Blue Team',
                        inputValue: 'blueteam'
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Favorite color',
                    defaults: { xtype: 'radiofield' },
                    items: [
                        { name : 'color', label: 'Red', inputValue : 'red' },
                        { name : 'color', label: 'Blue' , inputValue : 'blue'},
                        { name : 'color', label: 'Green' , checked : true, inputValue : 'green'},
                        { name : 'color', label: 'Purple' , inputValue : 'purple'}
                    ]
                }, {
                    xtype: 'fieldset',
                    title: 'HTML5',
                    items: [{
                        xtype: 'numberfield',
                        name: 'number',
                        label: 'Number',
                        maxValue : 20,
                        minValue : 2
                    }, {
                        xtype: 'emailfield',
                        name: 'email',
                        label: 'Email',
                        useClearIcon: true
                    }, {
                        xtype: 'urlfield',
                        name: 'url',
                        label: 'URL',
                        useClearIcon: true
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Single Select (in fieldset)',
                    items: [{
                        xtype: 'selectfield',
                        name: 'options',
                        options: [
                            {text: 'This is just a big select',  value: '1'},
                            {text: '2', value: '2'}
                        ]
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Single Text (in fieldset)',
                    items: [{
                        xtype: 'textfield',
                        name: 'single_text',
                        useClearIcon: true
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Single Toggle (in fieldset)',
                    items: [{
                        xtype: 'togglefield',
                        name: 'single_toggle',
                        value : 1
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Single Slider (in fieldset)',
                    items: [{
                        xtype: 'slider',
                        name: 'single_slider',
                        value : 60
                    }]
                }
            ],
            listeners : {
                submit : function(form, result){
                    console.log('success', Ext.toArray(arguments));
                },
                exception : function(form, result){
                    console.log('failure', Ext.toArray(arguments));
                }
            },
        
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            text: 'Load Model',
                            ui: 'round',
                            handler: function() {
                                formBase.user = Ext.ModelMgr.create({
                                    'name'    : 'Akura',
                                    'password': 'secret',
                                    'email'   : 'saru@extjs.com',
                                    'url'     : 'http://extjs.com',
                                    'single_slider': 20,
                                    'enable'  : 1,
                                    'cool'    : true,
                                    'team'    : 'redteam',
                                    'color'   : 'blue',
                                    'rank'    : 'padawan',
                                    'secret'  : true,
                                    'bio'     : 'Learned the hard way !'
                                }, 'User');
        
                                form.loadModel(formBase.user);
                            }
                        },
                        {xtype: 'spacer'},
                        {
                            text: 'Reset',
                            handler: function() {
                                form.reset();
                            }
                        },
                        {
                            text: 'Save',
                            ui: 'confirm',
                            handler: function() {
                                if(formBase.user){
                                    form.updateRecord(formBase.user, true);
                                }
                                form.submit({
                                    waitMsg : {message:'Submitting', cls : 'demos-loading'}
                                });
                            }
                        }
                    ]
                }
            ]
        };
        
        if (Ext.is.AndroidOS) {
            formBase.items.unshift({
                xtype: 'component',
                styleHtmlContent: true,
                html: '<span style="color: red">Forms on Android are currently under development. We are working hard to improve this in upcoming releases.</span>'
            });
        }
        
        if (Ext.is.Phone) {
            formBase.fullscreen = true;
        } else {
            Ext.apply(formBase, {
                autoRender: true,
                floating: true,
                modal: true,
                centered: true,
                hideOnMaskTap: false,
                height: 385,
                width: 480
            });
        }
        
        form = new Ext.form.FormPanel(formBase);
        form.show();
    }
});