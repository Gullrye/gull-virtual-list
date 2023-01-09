import GullVirtualList from '../../utils/gull-virtual-list'
import { throttle } from '../../utils/util'
Page({
  data: {
    twoList: [],
    listId: 'gull-list',
    pageNum: 0,
    scrollTop: -1
  },
  onLoad() {
    let that = this
    let originData = that.getOriginData()
    that.virtualList = new GullVirtualList({
      list: originData,
      pageNum: that.data.pageNum,
      segmentNum: 10,
      onComplete: that.handleComplete,
      listId: 'gull-list'
    })
    that.setData({
      twoList: that.virtualList.segmentList()
    })
  },
  getOriginData() {
    let i = 0
    let arr = []
    while (i < 100) {
      if (i >= 10 && i < 20) {
        arr.push({ name: 'Milan', age: 18, id: i })
      } else if (i >= 20 && i < 40) {
        arr.push({ name: '-------', age: 18, id: i })
      } else {
        arr.push({ name: 'Mike', age: 12, id: i })
      }
      i++
    }
    return arr
  },
  handleComplete() {
    wx.showToast({
      title: '列表加载完成',
      icon: 'success'
    })
  },
  renderNext: throttle(function () {
    let nextList = this.virtualList.renderNext()
    this.setData({
      twoList: [...nextList]
    })
  }, 300),
  onScroll: throttle(function () {
    let newList = this.virtualList.getTwoList()
    if (JSON.stringify(newList) !== JSON.stringify(this.data.twoList)) {
      this.setData({
        twoList: [...newList]
      })
    }
  }, 300),
  search(e) {
    let keyword = e.detail.value
    let originData = this.getOriginData()
    let searchResult = originData.filter((item) => item.name.includes(keyword))
    this.setData({
      twoList: this.virtualList.segmentList(searchResult),
      scrollTop: 0
    })
  }
})
