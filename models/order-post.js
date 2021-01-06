class OrderPost {
    total_price
    order_type
    phone
    remark
    total_count
    snap_title
    snap_img
    sku_info_list=[]
    address = {}

    constructor(totalPrice, orderType, phone, remark, totalCount, sku_info_list, address,snapImg,snapTitle) {
        this.total_price = totalPrice
        this.order_type = orderType
        this.phone = phone
        this.remark = remark
        this.total_count = totalCount
        this.sku_info_list = sku_info_list
        this._fillAddress(address)
        this.snap_img=snapImg
        this.snap_title=snapTitle
    }

    _fillAddress(address) {
        if (address !== '') {
            this.address.user_name = address.userName
            this.address.national_code = address.nationalCode
            this.address.postal_code = address.postalCode
            this.address.city = address.cityName
            this.address.province = address.provinceName
            this.address.county = address.countyName
            this.address.detail = address.detailInfo
            this.address.mobile = address.telNumber
        }
    }
}

export {
    OrderPost
}