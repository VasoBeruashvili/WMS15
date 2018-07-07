/*
 * File: app/model/ExcelProductModel.js
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

Ext.define('SIS.model.ExcelProductModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field',
        'Ext.data.association.HasMany'
    ],
    uses: [
        'SIS.model.OutcomeProductModel'
    ],

    fields: [
        {
            name: 'ID',
            type: 'int'
        },
        {
            name: 'Name',
            type: 'string'
        },
        {
            name: 'CurrentUserID'
        }
    ],

    hasMany: {
        associationKey: 'ExcelNode',
        model: 'SIS.model.OutcomeProductModel',
        name: 'ExcelNode'
    }
});