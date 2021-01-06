import {Http} from "./http";

class Paging {

    //保存状态，new Paging

    start
    count
    req
    locker = false
    url
    moreData = true
    accumulator = []


    constructor(req, count = 10, start = 0) {
        this.start = start
        this.count = count
        this.req = req
        this.url = req.url
    }

    //实现目的所提供的函数   生成器
    async getMoreData() {
        if(!this.moreData){
            return
        }
        if(!this._getLocker()){
            return
        }
        const data =await this._actualGetData()
        this._releaseLocker()
        return data
    }


    //真正的发请求
    async _actualGetData() {
        const req = this._getCurrentReq()
        let paging = await Http.request(req)  //paging为服务器返回的json对象，包裹当前页码，总共页码，当前页码数据
        if(!paging){
            return null
        }
        if(paging.total === 0){ //一条数据都没有
            return {
                empty:true,
                items:[],  //请求的数据
                moreData:false,
                accumulator:[]   //累加器
            }
        }

        this.moreData = Paging._moreData(paging.total_page, paging.page)
        if(this.moreData){
            this.start += this.count
        }
        this._accumulate(paging.items)   //累加器增量存放数据
        return {  //返回请求数据
            empty:false,
            items: paging.items,
            moreData:this.moreData,
            accumulator:this.accumulator
        }
    }

    _accumulate(items){
        this.accumulator = this.accumulator.concat(items)
    }

    static _moreData(totalPage, pageNum) {
        return pageNum < totalPage-1
    }

    _getCurrentReq() {
        let url = this.url
        const params = `start=${this.start}&count=${this.count}`
        if(url.includes('?')){
            url += '&' + params
            // contains
        }
        else{
            url += '?' + params
        }
        this.req.url  = url
        return this.req
    }

    _getLocker() {
        if (this.locker) {
            return false
        }
        this.locker = true
        return true
    }

    _releaseLocker() {
        this.locker = false
    }

}

export {
    Paging
}
