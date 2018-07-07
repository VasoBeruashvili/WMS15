


Ext.Ajax.disableCaching = false;

Ext.tip.QuickTipManager.init();

Ext.override(Ext.MessageBox, {
    //buttonText: { yes: "დიახ", no: "არა", cancel: "გაუქმება", ok: "<img src='/Content/Resources/home.png' /> დასტური" }
    animateTarget: 'btnEdit'
});

//Ext.util.JSON.encodeDate = function (o) {
//    return o.format('U');
//}
//y-m-d h:m:s
Ext.JSON.encodeDate = function (d) {
    if (d === null || d === undefined) {
        return null;
    }
    else {
        return Ext.Date.format(d, '"Y-m-d H:i:s"');
    }
    
};

Ext.define('DataFieldExtension', {
    override: 'Ext.data.Field',

    serialize: function (v, rec) {

        if (v === null || v === undefined) {
            return null;
        }
        else {
            return v;
        }
    },
    dateFormat: 'Y-m-d H:i:s'

});

//TODO default root

Ext.override(Ext.data.HasOneAssociation, {
    createSetter: function () {
        var me = this,
        foreignKey = me.foreignKey,
        instanceName = me.instanceName;

        //'this' refers to the Model instance inside this function
        return function (value, options, scope) {
            var setByRecord = value && value.isModel,
            valueToSet = setByRecord ? value.getId() : value;

            if (setByRecord) {
                this[instanceName] = value;
            }
            else if (this[instanceName] instanceof Ext.data.Model && this.get(foreignKey) !== valueToSet) {
                /*
                * It means we are updating only the value of the field, 
                * thus we have to delete the previous associated record instance reference.
                */
                delete this[instanceName];
            }

            this.set(foreignKey, valueToSet);

            if (Ext.isFunction(options)) {
                options = {
                    callback: options,
                    scope: scope || this
                };
            }

            if (Ext.isObject(options)) {
                return this.save(options);
            }
        };
    }
});


Ext.define('ModelExtension', {
    override: 'Ext.data.Model',
    //for self referencing models
    serializeToJson: function (seenKeys, depth) {
        var me = this,
            associations = me.associations.items,
            associationCount = associations.length,
            associationData = {},
            // We keep 3 lists at the same index instead of using an array of objects.
            // The reasoning behind this is that this method gets called a lot
            // So we want to minimize the amount of objects we create for GC.
            toRead = [],
            toReadKey = [],
            toReadIndex = [],
            associatedStore, associatedRecords, associatedRecord, o, index, result, seenDepth,
            associationId, associatedRecordCount, association, i, j, type, name;
        for (i = 0; i < associationCount; i++) {
            association = associations[i];
            associationId = association.associationId;
            seenDepth = seenKeys[associationId];
            if (seenDepth && seenDepth !== depth) {
                //continue;
            }
            seenKeys[associationId] = depth;
            type = association.type;
            name = association.name;
            if (type == 'hasMany') {
                //this is the hasMany store filled with the associated data
                associatedStore = me[association.storeName];
                //we will use this to contain each associated record's data
                associationData[name] = [];
                //if it's loaded, put it into the association data
                if (associatedStore && associatedStore.getCount() > 0) {
                    associatedRecords = associatedStore.data.items;
                    associatedRecordCount = associatedRecords.length;
                    //now we're finally iterating over the records in the association. Get
                    // all the records so we can process them
                    for (j = 0; j < associatedRecordCount; j++) {
                        associatedRecord = associatedRecords[j];
                        associationData[name][j] = associatedRecord.getData();
                        toRead.push(associatedRecord);
                        toReadKey.push(name);
                        toReadIndex.push(j);
                    }
                }
            } else if (type == 'belongsTo' || type == 'hasOne') {
                associatedRecord = me[association.instanceName];
                // If we have a record, put it onto our list
                if (associatedRecord !== undefined) {
                    associationData[name] = associatedRecord.getData();
                    toRead.push(associatedRecord);
                    toReadKey.push(name);
                    toReadIndex.push(-1);
                }
            }
        }
        for (i = 0, associatedRecordCount = toRead.length; i < associatedRecordCount; ++i) {
            associatedRecord = toRead[i];
            o = associationData[toReadKey[i]];
            index = toReadIndex[i];
            result = associatedRecord.serializeToJson(seenKeys, depth + 1);
            if (index === -1) {
                Ext.apply(o, result);
            } else {
                Ext.apply(o[index], result);
            }
        }
        return associationData;
    }


});



Ext.define('StoreExtension', {
    override: 'Ext.data.Store',


    getRecords: function () {
        var items = [];
        var st = this;

        st.each(function (item, index) {
            items.push(item);

            return true;
        });

        return items;
    },

    getNotDeletedRecords: function () {

        var items = [];
        var st = this;

        st.each(function (item, index) {
            if (!item.get('Deleted')) {
                items.push(item);
            }

            return true;
        });

        return items;
    },


    containsKey: function (key, value) {
        var store = this;

        return store.findExact(key, value) != -1;

    },

    stoplLoad: function () {
        Ext.Ajax.abort(this.proxy.activeRequest);
    },

    addExtraParams: function (extraParams) {
        if (extraParams === null || extraParams === undefined) return null;
        if (this.proxy.extraParams !== null) {
            var tmpParams = Ext.apply(this.proxy.extraParams, extraParams);//changed applyIf to apply
            this.proxy.extraParams = tmpParams;
        }
        else {
            this.proxy.extraParams = extraParams;
        }
    },

    clearExtraParams: function () {
        this.proxy.extraParams = null;
    }
});



Ext.define('ControllerSuspendEventBugFix', {
    override: 'Ext.app.EventDomain',
    dispatch: function (target, ev, args) {
        if (target.eventsSuspended) {

            return true;
        }
        return this.callParent(arguments);
    }
});



Ext.define('GridExtension', {
    override: 'Ext.grid.Panel',

    initComponent: function () {
        if (this.storeClassName != null) {
            this.store = Ext.create(this.storeClassName, {

            });
        }

        this.columnLines = true;

        this.callParent(arguments);

        if (this.down('pagingtoolbar') != null) {
            this.down('pagingtoolbar').store = this.store;
        }




    },

    loadRecords: function (modelArray) {
        if (this.store != null) {
            var store = this.store;
            store.loadRecords(modelArray);
        }

    },

    cleanUp: function () {
        if (this.store != null) {
            this.store.removeAll();
        }
    },


    selectRecord: function (model) {
        var grid = this;
        if (model != null) {
            grid.getSelectionModel().select(model);
        }

    },

    //deleteModel: function (model) {
    //    if (this.store != null) {
    //        var store = this.store;
    //        SetDelete(model);
    //        store.remove(model);
    //    }
    //},

    //TODO gasakaetebelia
    getRecordIndex: function (model) {
        var store = this.store;

        return store.indexOf(model);

    },
    singleRecordSelected: function () {
        var selection = this.getSelectionModel().getSelection();

        return selection.length == 1;
    },
    recordSelected: function () {
        var selection = this.getSelectionModel().getSelection();

        return selection.length > 0;
    },

    getSelectedRecord: function () {
        if (this.recordSelected()) {
            return this.getSelectionModel().getSelection()[0];
        }
    },
    getSelectedRecords: function () {
        if (this.recordSelected()) {
            return this.getSelectionModel().getSelection();
        }
    },

});

Ext.define('GridViewExtension', {
    override: 'Ext.grid.View',

    initComponent: function () {

        this.enableTextSelection = true;

        this.callParent(arguments);
    }
});
/*
Ext.define('CheckboxSelectionModelExtension', {
    override: 'Ext.grid.CheckboxSelectionModel',

    //hideCheckbox: function () {
    //    var cm = this.grid.getColumnModel();
    //    var idx = cm.getIndexById(this.id);
    //    cm.setHidden(idx, true);
    //},
    //showCheckbox: function () {
    //    var cm = this.grid.getColumnModel();
    //    var idx = cm.getIndexById(this.id);
    //    cm.setHidden(idx, false);
    //}
    hideCheckbox: function () {
        var cm = this.grid.getColumnModel();
        console.log('----------------------------------');
        console.log(cm);
        if (Ext.getClassName(cm) == 'Ext.selection.CheckboxModel') {
            var idx = cm.getIndexById(this.id);
            cm.setHidden(idx, true);
        }
    },
    showCheckbox: function () {
        var cm = this.grid.getColumnModel();
        console.log('----------------------------------');
        console.log(cm);
        if (Ext.getClassName(cm) == 'Ext.selection.CheckboxModel') {
            var idx = cm.getIndexById(this.id);
            cm.setHidden(idx, true);
        }
    }
});
*/
var FNKEY = ['ctrl', 'alt', 'shift'];

//binding: {
//    ctrl: true,
//    btnItemId: '#myButton',
//    fn: function(){},
//    key: 'S'
//}


Ext.define('WindowExtension', {
    override: 'Ext.window.Window',
    resizable: false,

    initComponent: function () {
        //this.callParent(arguments);
        var me = this;


        me.listeners = {
            show: function () {
                if (me.keyMapConfig != null) {

                    var map = new Ext.util.KeyMap({
                        target: me.getEl(),
                        //ignoreInputFields: true
                    });

                    var defaultBinding = { /*ctrl: true*,*/ defaultEventAction: 'stopEvent' };

                    Ext.each(me.keyMapConfig.bindings, function (binding) {
                        //map.addBinding({
                        //    ctrl: true,
                        //    //shift: true,
                        //    key: 83,
                        //    fn: function () { console.log('llll'); return false; },
                        //    defaultEventAction: 'stopEvent'//stopEvent'
                        //});

                        //return false;

                        Ext.applyIf(binding, defaultBinding);
                        if (binding.btnItemId != null) {
                            binding.fn = function () {
                                var btn = me.down('#' + binding.btnItemId);

                                if (!btn.isDisabled()) {

                                    if (btn.handler != null) {
                                        btn.handler(btn);
                                    }
                                    else {
                                        btn.fireEvent('click', btn);
                                    }
                                }

                                return false;
                            }
                        }
                        map.addBinding(binding);

                        return true;
                    });
                }
            }
        };


        this.callParent(arguments);




    }
});





//
Ext.define('PanelExtension', {
    override: 'Ext.panel.Panel',
    resizable: false,

    initComponent: function () {
        //this.callParent(arguments);
        var me = this;


        me.listeners = {
            afterrender: function () {
                if (me.keyMapConfig != null) {

                    var map = new Ext.util.KeyMap({
                        target: me.getEl(),
                        //ignoreInputFields: true
                    });

                    var defaultBinding = { /*ctrl: true*,*/ defaultEventAction: 'stopEvent' };

                    Ext.each(me.keyMapConfig.bindings, function (binding) {
                        //map.addBinding({
                        //    ctrl: true,
                        //    //shift: true,
                        //    key: 83,
                        //    fn: function () { console.log('llll'); return false; },
                        //    defaultEventAction: 'stopEvent'//stopEvent'
                        //});

                        //return false;

                        Ext.applyIf(binding, defaultBinding);
                        if (binding.btnItemId != null) {
                            binding.fn = function () {
                                var btn = me.down('#' + binding.btnItemId);

                                if (!btn.isDisabled()) {

                                    if (btn.handler != null) {
                                        btn.handler(btn);
                                    }
                                    else {
                                        btn.fireEvent('click', btn);
                                    }
                                }

                                return false;
                            }
                        }
                        map.addBinding(binding);

                        return true;
                    });
                }
            }
        };


        this.callParent(arguments);




    }
});
//







Ext.define('SIS.view.override.OrgUnitsCombo', {
    override: 'SIS.view.OrgUnitsCombo',
    editable: false,
    displayField: 'Name',
    store: 'OrganizationalUnitsStore',
    valueField: 'ID',
    initComponent: function () {
        this.ParentID = OrganizationalUnitsDictionary[this.ParentCode];
        var me = this;
        me.callParent(arguments);
    }
});

Ext.define('ComboExtension', {
    override: 'Ext.form.field.ComboBox',

    forceSelection: true,

    initComponent: function () {



        if (this.storeClassName != null) {
            this.store = Ext.create(this.storeClassName, {

            });
        }

        if (this.dictionaryID != null && this.store != null && this.store.proxy != null) {
            this.store.addExtraParams({ dictionaryID: this.dictionaryID });
        }
        if (this.StatusTypeID != null && this.store != null && this.store.proxy != null) {
            this.store.addExtraParams({ StatusTypeID: this.StatusTypeID });
        }
        if (this.ParentID != null && this.store != null && this.store.proxy != null) {
            this.store.addExtraParams({ ParentID: this.ParentID });
        }

        if (this.relationTypeGroupID != null && this.store != null && this.store.proxy != null) {
            this.store.addExtraParams({ relationTypeGroupID: this.relationTypeGroupID });
        }


        if (this.AttributeGroupID != null && this.store != null && this.store.proxy != null) {
            this.store.addExtraParams({ AttributeGroupID: this.AttributeGroupID });
        }

        if (this.tpl != null) {
            this.tpl = new Ext.XTemplate(this.tpl);
        }

        if (this.displayTpl != null) {
            this.displayTpl = new Ext.XTemplate(this.displayTpl);
        }

        if (this.onlyActive != null) {
            this.store.addExtraParams({ OnlyActive: this.onlyActive });
        }

        this.callParent(arguments);




    },
    //shemocmeba tu araferi araris shemocmebuli
    valueNotEmpty: function () {
        if (this.getValue() !== undefined && this.getValue() !== null && this.getValue().length != 0)
            return true;
        else
            return false;
    },
    //combos recordis ageba - Jaginoff

    getSelectedRecord: function () {
        if (this.store !== null && this.store !== undefined) {
            if (this.valueNotEmpty()) {
                var ValueFieldValue = this.getValue();
                var RecordIndex = this.getStore().find(this.valueField, ValueFieldValue);
                if (RecordIndex !== null && RecordIndex !== undefined && RecordIndex != -1) {
                    return this.getStore().getAt(RecordIndex);
                }
                else {
                    return null;
                }
            }
        }
    },

    getSelectedRecords: function () {
        if (this.valueNotEmpty()) {
            //TODO 22.03.14 sheicvala adre yoveltvis maisv abrunebda exla mxolod tu  combo multiselect aris
            var values = this.getValue();

            var recmas = new Array();

            if (Ext.isArray(values)) {
            for (var i = 0; i < values.length; i++) {
                var ValueFieldValue = values[i];
                var RecordIndex = this.getStore().find(this.valueField, ValueFieldValue);
                if (RecordIndex !== null && RecordIndex !== undefined && RecordIndex != -1) {
                    recmas.push(this.getStore().getAt(RecordIndex));
                }
            }
            }
            else {
                var ValueFieldValue1 = values;
                var RecordIndex1 = this.getStore().find(this.valueField, ValueFieldValue1);
                if (RecordIndex1 !== null && RecordIndex1 !== undefined && RecordIndex1 != -1) {
                    recmas.push(this.getStore().getAt(RecordIndex1));
                }
            return recmas;
            }
            //Ext.each(values, function (item) {

            //},this,false);
        }
    },
    getSelectionCount: function () {
        var values = this.getValue();
        return values.length;
    },
    //setValueSafe: function (value) {
    //    var combo = this;
    //    if (this.store != null) {
    //        this.store.load({
    //            callback: function () {
    //                combo.setValue(value);
    //            }
    //        });
    //    }
    //}

    //addExtraParams: function (extraParams) {
    //    if (extraParams === null || extraParams === undefined) return null;
    //    if (this.store !== null) {
    //        if (this.store.proxy.extraParams !== null) {
    //            var tmpParams = Ext.applyIf(this.store.proxy.extraParams, extraParams);
    //            this.store.proxy.extraParams = tmpParams;
    //        }
    //        else {
    //            this.store.proxy.extraParams = extraParams;
    //        }
    //    }
    //},

    //clearExtraParams: function () {
    //    if (this.store !== null) {
    //        this.store.proxy.extraParams = null;
    //    }
    //},

    setValueSafe: function (value, filter, afterSet, markInvalidText) {
        var combo = this;
        var onlyActive = filter || false;

        if (this.store != null) {
            this.store.addExtraParams({ OnlyActive: onlyActive });
            this.store.load({
                callback: function () {
                    if (!Ext.isArray(value)) {
                    if (onlyActive && value > 0) {
                        if (this.containsKey('ID', value)) {
                            combo.setValue(value);
                        }
                        else {
                            if (markInvalidText != null && markInvalidText != undefined) {
                                combo.markInvalid(markInvalidText);
                            }
                            else {
                                combo.markInvalid('მნიშვნელობა აღარ არის აქტიური, აირჩეთ სხვა მნიშვნელობა!');
                            }
                            if (afterSet != null && afterSet != undefined)
                                afterSet();
                            throw new Error('No such model with status Active!');
                        }
                    }
                    else {
                        combo.setValue(value);
                    }
                    }
                    else {
                        var error = false;
                        for (i = 0; i < value.length; i++) {
                            if (onlyActive && value[i] > 0) {
                                if (!this.containsKey('ID', value[i])) {
                                    combo.markInvalid('მნიშვნელობა აღარ არის აქტიური, აირჩეთ სხვა მნიშვნელობა!');
                                    combo.reset();
                                    console.log('No such model with status Active!');
                                    error = true;
                                    break;
                                }
                            }
                        };
                        if (!error)
                            combo.setValue(value);
                    }
                    if (afterSet != null && afterSet != undefined)
                        afterSet();
                }
            });
        }
    },

    setDefaultValueSafe: function () {

    },

    addExtraParams: function (extraParams) {
        this.store.addExtraParams(extraParams);
    }


});



Ext.define('NumberFieldExtension', {
    override: 'Ext.form.field.Number',
    initComponent: function () {
        this.minText = 'მინიმალური დასაშვები მნიშვნელობა არის {0}';
        this.maxText = 'მაქსიმალური დასაშვები მნიშვნელობა არის {0}';
        //this.blankText = 'ველის შევსება აუცილებელია';
        this.regexText = 'არაკორექტული მნიშვნელობა';
        this.callParent(arguments);
    }
});


Ext.define('TextFieldExtension', {
    override: 'Ext.form.field.Text',
    initComponent: function () {
        this.blankText = 'ველის შევსება აუცილებელია &nbsp';
        this.regexText = 'არაკორექტული მნიშვნელობა';
        this.minLengthText = 'სიმბოლოების მინიმალური რაოდნეობა უნდა იყოს {0}';
        this.enforceMaxLength = true;


        (function () {
            /**
             * @class Ext.ux.form.field.ClearButton
             *
             * Plugin for text components that shows a "clear" button over the text field.
             * When the button is clicked the text field is set empty.
             * Icon image and positioning can be controlled using CSS.
             * Works with Ext.form.field.Text, Ext.form.field.TextArea, Ext.form.field.ComboBox and Ext.form.field.Date.
             *
             * Plugin alias is 'clearbutton' (use "plugins: 'clearbutton'" in GridPanel config).
             *
             * @author <a href="mailto:stephen.friedrich@fortis-it.de">Stephen Friedrich</a>
             * @author <a href="mailto:fabian.urban@fortis-it.de">Fabian Urban</a>
             *
             * @copyright (c) 2011 Fortis IT Services GmbH
             * @license Ext.ux.form.field.ClearButton is released under the
             * <a target="_blank" href="http://www.apache.org/licenses/LICENSE-2.0">Apache License, Version 2.0</a>.
             *
             */
            Ext.define('Ext.ux.form.field.ClearButton', {
                alias: 'plugin.clearbutton',

                /**
                 * @cfg {Boolean} Hide the clear button when the field is empty (default: true).
                 */
                hideClearButtonWhenEmpty: true,

                /**
                 * @cfg {Boolean} Hide the clear button until the mouse is over the field (default: true).
                 */
                hideClearButtonWhenMouseOut: true,

                /**
                 * @cfg {Boolean} When the clear buttons is hidden/shown, this will animate the button to its new state (using opacity) (default: true).
                 */
                animateClearButton: true,

                /**
                 * @cfg {Boolean} Empty the text field when ESC is pressed while the text field is focused.
                 */
                clearOnEscape: true,

                /**
                 * @cfg {String} CSS class used for the button div.
                 * Also used as a prefix for other classes (suffixes: '-mouse-over-input', '-mouse-over-button', '-mouse-down', '-on', '-off')
                 */
                clearButtonCls: 'ext-ux-clearbutton',

                /**
                 * The text field (or text area, combo box, date field) that we are attached to
                 */
                textField: null,

                /**
                 * Will be set to true if animateClearButton is true and the browser supports CSS 3 transitions
                 * @private
                 */
                animateWithCss3: false,

                /////////////////////////////////////////////////////////////////////////////////////////////////////
                //
                // Set up and tear down
                //
                /////////////////////////////////////////////////////////////////////////////////////////////////////

                constructor: function (cfg) {
                    Ext.apply(this, cfg);

                    this.callParent(arguments);
                },

                /**
                 * Called by plug-in system to initialize the plugin for a specific text field (or text area, combo box, date field).
                 * Most all the setup is delayed until the component is rendered.
                 */
                init: function (textField) {
                    this.textField = textField;
                    if (!textField.rendered) {
                        textField.on('afterrender', this.handleAfterRender, this);
                    }
                    else {
                        // probably an existing input element transformed to extjs field
                        this.handleAfterRender();
                    }
                },

                /**
                 * After the field has been rendered sets up the plugin (create the Element for the clear button, attach listeners).
                 * @private
                 */
                handleAfterRender: function (textField) {
                    this.isTextArea = (this.textField.inputEl.dom.type.toLowerCase() == 'textarea');

                    this.createClearButtonEl();
                    this.addListeners();

                    this.repositionClearButton();
                    this.updateClearButtonVisibility();

                    this.addEscListener();
                },

                /**
                 * Creates the Element and DOM for the clear button
                 */
                createClearButtonEl: function () {
                    var animateWithClass = this.animateClearButton && this.animateWithCss3;
                    this.clearButtonEl = this.textField.bodyEl.createChild({
                        tag: 'div',
                        cls: this.clearButtonCls
                    });
                    if (this.animateClearButton) {
                        this.animateWithCss3 = this.supportsCssTransition(this.clearButtonEl);
                    }
                    if (this.animateWithCss3) {
                        this.clearButtonEl.addCls(this.clearButtonCls + '-off');
                    }
                    else {
                        this.clearButtonEl.setStyle('visibility', 'hidden');
                    }
                },

                /**
                 * Returns true iff the browser supports CSS 3 transitions
                 * @param el an element that is checked for support of the "transition" CSS property (considering any
                 *           vendor prefixes)
                 */
                supportsCssTransition: function (el) {
                    var styles = ['transitionProperty', 'WebkitTransitionProperty', 'MozTransitionProperty',
                                  'OTransitionProperty', 'msTransitionProperty', 'KhtmlTransitionProperty'];

                    var style = el.dom.style;
                    for (var i = 0, length = styles.length; i < length; ++i) {
                        if (style[styles[i]] !== 'undefined') {
                            // Supported property will result in empty string
                            return true;
                        }
                    }
                    return false;
                },

                /**
                 * If config option "clearOnEscape" is true, then add a key listener that will clear this field
                 */
                addEscListener: function () {
                    if (!this.clearOnEscape) {
                        return;
                    }

                    // Using a KeyMap did not work: ESC is swallowed by combo box and date field before it reaches our own KeyMap
                    this.textField.inputEl.on('keydown',
                        function (e) {
                            if (e.getKey() == Ext.EventObject.ESC) {
                                if (this.textField.isExpanded) {
                                    // Let combo box or date field first remove the popup
                                    return;
                                }
                                // No idea why the defer is necessary, but otherwise the call to setValue('') is ignored
                                Ext.Function.defer(this.textField.setValue, 1, this.textField, ['']);
                                e.stopEvent();
                            }
                        },
                        this);
                },

                /**
                 * Adds listeners to the field, its input element and the clear button to handle resizing, mouse over/out events, click events etc.
                 */
                addListeners: function () {
                    // listeners on input element (DOM/El level)
                    var textField = this.textField;
                    var bodyEl = textField.bodyEl;
                    bodyEl.on('mouseover', this.handleMouseOverInputField, this);
                    bodyEl.on('mouseout', this.handleMouseOutOfInputField, this);

                    // listeners on text field (component level)
                    textField.on('destroy', this.handleDestroy, this);
                    textField.on('resize', this.repositionClearButton, this);
                    textField.on('change', function () {
                        this.repositionClearButton();
                        this.updateClearButtonVisibility();
                    }, this);

                    // listeners on clear button (DOM/El level)
                    var clearButtonEl = this.clearButtonEl;
                    clearButtonEl.on('mouseover', this.handleMouseOverClearButton, this);
                    clearButtonEl.on('mouseout', this.handleMouseOutOfClearButton, this);
                    clearButtonEl.on('mousedown', this.handleMouseDownOnClearButton, this);
                    clearButtonEl.on('mouseup', this.handleMouseUpOnClearButton, this);
                    clearButtonEl.on('click', this.handleMouseClickOnClearButton, this);
                },

                /**
                 * When the field is destroyed, we also need to destroy the clear button Element to prevent memory leaks.
                 */
                handleDestroy: function () {
                    this.clearButtonEl.destroy();
                },

                /////////////////////////////////////////////////////////////////////////////////////////////////////
                //
                // Mouse event handlers
                //
                /////////////////////////////////////////////////////////////////////////////////////////////////////

                /**
                 * Tada - the real action: If user left clicked on the clear button, then empty the field
                 */
                handleMouseClickOnClearButton: function (event, htmlElement, object) {
                    if (!this.isLeftButton(event)) {
                        return;
                    }
                    this.textField.setValue('');
                    this.textField.focus();
                },

                handleMouseOverInputField: function (event, htmlElement, object) {
                    this.clearButtonEl.addCls(this.clearButtonCls + '-mouse-over-input');
                    if (event.getRelatedTarget() == this.clearButtonEl.dom) {
                        // Moused moved to clear button and will generate another mouse event there.
                        // Handle it here to avoid duplicate updates (else animation will break)
                        this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-over-button');
                        this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-down');
                    }
                    this.updateClearButtonVisibility();
                },

                handleMouseOutOfInputField: function (event, htmlElement, object) {
                    this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-over-input');
                    if (event.getRelatedTarget() == this.clearButtonEl.dom) {
                        // Moused moved from clear button and will generate another mouse event there.
                        // Handle it here to avoid duplicate updates (else animation will break)
                        this.clearButtonEl.addCls(this.clearButtonCls + '-mouse-over-button');
                    }
                    this.updateClearButtonVisibility();
                },

                handleMouseOverClearButton: function (event, htmlElement, object) {
                    event.stopEvent();
                    if (this.textField.bodyEl.contains(event.getRelatedTarget())) {
                        // has been handled in handleMouseOutOfInputField() to prevent double update
                        return;
                    }
                    this.clearButtonEl.addCls(this.clearButtonCls + '-mouse-over-button');
                    this.updateClearButtonVisibility();
                },

                handleMouseOutOfClearButton: function (event, htmlElement, object) {
                    event.stopEvent();
                    if (this.textField.bodyEl.contains(event.getRelatedTarget())) {
                        // will be handled in handleMouseOverInputField() to prevent double update
                        return;
                    }
                    this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-over-button');
                    this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-down');
                    this.updateClearButtonVisibility();
                },

                handleMouseDownOnClearButton: function (event, htmlElement, object) {
                    if (!this.isLeftButton(event)) {
                        return;
                    }
                    this.clearButtonEl.addCls(this.clearButtonCls + '-mouse-down');
                },

                handleMouseUpOnClearButton: function (event, htmlElement, object) {
                    if (!this.isLeftButton(event)) {
                        return;
                    }
                    this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-down');
                },

                /////////////////////////////////////////////////////////////////////////////////////////////////////
                //
                // Utility methods
                //
                /////////////////////////////////////////////////////////////////////////////////////////////////////

                /**
                 * Repositions the clear button element based on the textfield.inputEl element
                 * @private
                 */
                repositionClearButton: function () {
                    var clearButtonEl = this.clearButtonEl;
                    if (!clearButtonEl) {
                        return;
                    }
                    var clearButtonPosition = this.calculateClearButtonPosition(this.textField);
                    clearButtonEl.dom.style.right = clearButtonPosition.right + 'px';
                    clearButtonEl.dom.style.top = clearButtonPosition.top + 'px';
                },

                /**
                 * Calculates the position of the clear button based on the textfield.inputEl element
                 * @private
                 */
                calculateClearButtonPosition: function (textField) {
                    var positions = textField.inputEl.getBox(true, true);
                    var top = positions.y;
                    var right = positions.x;
                    if (this.fieldHasScrollBar()) {
                        right += Ext.getScrollBarWidth();
                    }
                    if (this.textField.triggerWrap) {
                        right += this.textField.getTriggerWidth();
                    }
                    return {
                        right: right,
                        top: top
                    };
                },

                /**
                 * Checks if the field we are attached to currently has a scrollbar
                 */
                fieldHasScrollBar: function () {
                    if (!this.isTextArea) {
                        return false;
                    }

                    var inputEl = this.textField.inputEl;
                    var overflowY = inputEl.getStyle('overflow-y');
                    if (overflowY == 'hidden' || overflowY == 'visible') {
                        return false;
                    }
                    if (overflowY == 'scroll') {
                        return true;
                    }
                    //noinspection RedundantIfStatementJS
                    if (inputEl.dom.scrollHeight <= inputEl.dom.clientHeight) {
                        return false;
                    }
                    return true;
                },


                /**
                 * Small wrapper around clearButtonEl.isVisible() to handle setVisible animation that may still be in progress.
                 */
                isButtonCurrentlyVisible: function () {
                    if (this.animateClearButton && this.animateWithCss3) {
                        return this.clearButtonEl.hasCls(this.clearButtonCls + '-on');
                    }

                    // This should not be necessary (see Element.setVisible/isVisible), but else there is confusion about visibility
                    // when moving the mouse out and _quickly_ over then input again.
                    var cachedVisible = Ext.core.Element.data(this.clearButtonEl.dom, 'isVisible');
                    if (typeof (cachedVisible) == 'boolean') {
                        return cachedVisible;
                    }
                    return this.clearButtonEl.isVisible();
                },

                /**
                 * Checks config options and current mouse status to determine if the clear button should be visible.
                 */
                shouldButtonBeVisible: function () {
                    if (this.hideClearButtonWhenEmpty && Ext.isEmpty(this.textField.getValue())) {
                        return false;
                    }

                    var clearButtonEl = this.clearButtonEl;
                    //noinspection RedundantIfStatementJS
                    if (this.hideClearButtonWhenMouseOut
                        && !clearButtonEl.hasCls(this.clearButtonCls + '-mouse-over-button')
                        && !clearButtonEl.hasCls(this.clearButtonCls + '-mouse-over-input')) {
                        return false;
                    }

                    return true;
                },

                /**
                 * Called after any event that may influence the clear button visibility.
                 */
                updateClearButtonVisibility: function () {
                    var oldVisible = this.isButtonCurrentlyVisible();
                    var newVisible = this.shouldButtonBeVisible();

                    var clearButtonEl = this.clearButtonEl;
                    if (oldVisible != newVisible) {
                        if (this.animateClearButton && this.animateWithCss3) {
                            this.clearButtonEl.removeCls(this.clearButtonCls + (oldVisible ? '-on' : '-off'));
                            clearButtonEl.addCls(this.clearButtonCls + (newVisible ? '-on' : '-off'));
                        }
                        else {
                            clearButtonEl.stopAnimation();
                            clearButtonEl.setVisible(newVisible, this.animateClearButton);
                        }

                        // Set background-color of clearButton to same as field's background-color (for those browsers/cases
                        // where the padding-right (see below) does not work)
                        clearButtonEl.setStyle('background-color', this.textField.inputEl.getStyle('background-color'));

                        // Adjust padding-right of the input tag to make room for the button
                        // IE (up to v9) just ignores this and Gecko handles padding incorrectly with  textarea scrollbars
                        if (!(this.isTextArea && Ext.isGecko) && !Ext.isIE) {
                            // See https://bugzilla.mozilla.org/show_bug.cgi?id=157846
                            var deltaPaddingRight = clearButtonEl.getWidth() - this.clearButtonEl.getMargin('l');
                            var currentPaddingRight = this.textField.inputEl.getPadding('r');
                            var factor = (newVisible ? +1 : -1);
                            this.textField.inputEl.dom.style.paddingRight = (currentPaddingRight + factor * deltaPaddingRight) + 'px';
                        }
                    }
                },

                isLeftButton: function (event) {
                    return event.button === 0;
                }

            });

        })();


        this.callParent(arguments);
    }
});




Ext.define('TriggerFieldExtension', {
    override: 'Ext.form.field.Trigger',
    //listeners: {
    //    render: function (component, e) {
    //        if (!IsNullOrEmpty(component.isTriggerField) && component.isTriggerField)
    //        {
    //            component.getEl().on('click', function (event, el) {
    //                component.fireEvent('ontriggerclick', this);
    //                //component.onTriggerClick();

    //            });
    //        }
    //    }
    //},
    initComponent: function () {
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        // Non-editable allows opening the picker by clicking the field
        if (!me.editable && me.isTriggerField === true) {
            me.mon(me.inputEl, 'click', me.onTriggerClick, me);
        }
    }
});




Ext.define("Ext.locale.ge.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "სორტირება ზრდადობით",
    sortDescText: "სორტირება კლებადობით",
    columnsText: "სვეტები"
});

Ext.define("Ext.locale.ge.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "იტვირთება..."
});

Ext.define('Ext.ux.data.proxy.JsonAjaxProxy', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.jsonajax',

    actionMethods: {
        create: "POST",
        read: "POST",
        update: "POST",
        destroy: "POST"
    },

    buildRequest: function (operation) {
        var request = this.callParent(arguments);

        // For documentation on jsonData see Ext.Ajax.request
        request.jsonData = request.params;
        request.params = {};

        return request;
    },

    /*
	 * @override
	 * Inherit docs. We don't apply any encoding here because
	 * all of the direct requests go out as jsonData
	 */
    applyEncoding: function (value) {
        return value;
    }

});


