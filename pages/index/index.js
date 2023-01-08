const app = getApp()
import GullVirtualList from '../../utils/gull-virtual-list'
import { throttle } from '../../utils/util'
let virtualList = null
Page({
  data: {
    twoList: [],
    listId: 'gull-list',
    pageNum: 0,
    virtualList: null
  },
  onLoad() {
    let that = this
    let originData = that.init()
    virtualList = new GullVirtualList({
      list: originData,
      pageNum: that.data.pageNum,
      segmentNum: 10,
      onComplete: that.handleComplete,
      listId: 'gull-list'
    })
    that.setData({
      twoList: virtualList.segmentList()
    })
    virtualList.setHeight()
  },
  init() {
    let i = 0
    let arr = []
    while (i < 100) {
      if (i > 10 && i < 20) {
        arr.push({ name: 'Milan', age: 18, id: i })
      } else if (i > 20 && i < 30) {
        arr.push({ name: '-------', age: 18, id: i })
      } else {
        arr.push({ name: 'Mike', age: 12, id: i })
      }
      i++
    }
    return arr
  },
  handleComplete() {
    // console.log('my complete----------------')
  },
  renderNext() {
    this.setData({
      twoList: virtualList.renderNext()
    })
  },
  onScroll: throttle(function () {
    console.log('scroll-------------------')
    this.setData({
      twoList: virtualList.getTwoList()
    })
    console.log('%c [ twoList ]-54', 'font-size:13px; background:#67deda; color:#abffff;', this.data.twoList)
  }, 600)
})
