const app = getApp()
import GullVirtualList from '../../utils/gull-virtual-list'
import { throttle } from '../../utils/util'
Page({
  data: {
    items: [],
    twoList: [],
    listId: 'gull-list',
    pageNum: 0,
    virtualList: null
  },
  onLoad() {
    let that = this
    that.init()
    const virtualList = new GullVirtualList({
      list: that.data.items,
      pageNum: that.data.pageNum,
      segmentNum: 10,
      onComplete: that.handleComplete,
      listId: 'gull-list'
    })
    that.setData({
      virtualList,
      twoList: virtualList.segmentList()
    })
    virtualList.setHeight()
  },
  init() {
    let i = 0
    let arr = []
    while (i < 10000) {
      if (i > 10 && i < 20) {
        arr.push({ name: 'Milan', age: 18 })
      } else if (i > 20 && i < 30) {
        arr.push({ name: '-------', age: 18 })
      } else {
        arr.push({ name: 'Mike', age: 12 })
      }
      i++
    }
    this.setData({
      items: arr
    })
  },
  handleComplete() {
    // console.log('my complete----------------')
  },
  renderNext() {
    this.setData({
      twoList: this.data.virtualList.renderNext()
    })
    this.data.virtualList.setHeight()
  },
  onScroll: throttle(function () {
    console.log('scroll-------------------')
    this.setData({
      twoList: this.data.virtualList.miniObserve()
    })
    // this.data.virtualList.setHeight()
  }, 300)
})
