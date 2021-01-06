// components/order-sku-panel/index.js

Component({
    /**
     * 组件的属性列表
     */
    externalClasses: ['l-class'],
    properties: {
        orderItem: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        specValuesText: null
    },

    observers: {
        'orderItem': function (orderItem) {
            // console.log(orderItem)
            const specValues = orderItem.title
            this.setData({
                specValuesText: specValues
            })
        }
    },

    attached() {
        // console.log(this.properties.orderItem)
    },

    /**
     * 组件的方法列表
     */
    methods: {}
})
