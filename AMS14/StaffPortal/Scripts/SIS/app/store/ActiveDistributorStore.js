/*
 * File: app/store/ActiveDistributorStore.js
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

Ext.define('SIS.store.ActiveDistributorStore', {
    extend: 'Ext.data.Store',

    requires: [
        'SIS.model.DistributorModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'SIS.model.DistributorModel',
            storeId: 'ActiveDistributorStore',
            proxy: {
                type: 'ajax',
                type: 'jsonajax',
                url: '/Home/GetActiveDistributors',
                reader: {
                    type: 'json',
                    root: 'root',
                    totalProperty: 'count'
                }
            }
        }, cfg)]);
    }
});