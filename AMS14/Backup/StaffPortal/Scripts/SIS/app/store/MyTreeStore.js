/*
 * File: app/store/MyTreeStore.js
 *
 * This file was generated by Sencha Architect version 3.0.1.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('SIS.store.MyTreeStore', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'SIS.model.TreeModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'SIS.model.TreeModel',
            storeId: 'MyTreeStore',
            proxy: {
                type: 'ajax',
                url: '/Home/GetTree',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});