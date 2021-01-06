import {Paging} from "../utils/paging";

class Search {
    static search(q){
        return new Paging({
            url: `/spu/search?q=${q}`
        })
    }
}

export {
    Search
}