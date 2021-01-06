import {OrderStatus} from "../core/enum";

class OrderStatusText {

    static setOrderStatusText(status){
        switch (status) {
            case OrderStatus.FINISHED:
                return '已完成';
            case OrderStatus.UNPAID:
                return '待支付'
            case OrderStatus.PAID:
                return '待发货'
            case OrderStatus.DELIVERED:
                return '待收货'
            case OrderStatus.CANCELED:
                return '已取消'
        }
    }
}

export {
    OrderStatusText
}