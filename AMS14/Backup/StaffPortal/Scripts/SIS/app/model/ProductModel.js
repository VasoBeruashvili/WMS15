/*
 * File: app/model/ProductModel.js
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

Ext.define('SIS.model.ProductModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    fields: [
        {
            name: 'ID'
        },
        {
            name: 'Name'
        },
        {
            name: 'Deleted',
            type: 'boolean'
        },
        {
            name: 'OutputPrice',
            type: 'float'
        },
        {
            name: 'InputPrice',
            type: 'float'
        },
        {
            name: 'SizeUnitID'
        },
        {
            name: 'SizeUnitName'
        },
        {
            name: 'CurrentAmount',
            type: 'int'
        },
        {
            name: 'TotalPrice',
            type: 'float'
        },
        {
            name: 'ToChange',
            type: 'boolean'
        },
        {
            name: 'ToChangeDown',
            type: 'boolean'
        },
        {
            name: 'BalanceID',
            type: 'int'
        },
        {
            name: 'RealPrice',
            type: 'float'
        }
    ]
});