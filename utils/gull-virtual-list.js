export default class GullVirtualList {
  constructor(props) {
    this.props = {
      screenNum: 0.5,
      list: [],
      ...props
    }
    const { pageNum, segmentNum, listId } = props
    this.pageNum = pageNum || 0
    this.segmentNum = segmentNum || 10
    this.listId = listId || 'gull-list'
    this.currentPage = getCurrentPages()[0]
    this.windowHeight = 0 // 当前屏幕的高度

    try {
      const res = wx.getSystemInfoSync()
      this.windowHeight = res.windowHeight
    } catch (e) {
      console.error('系统信息获取失败')
    }

    this.initData()
  }
  initData() {
    this.initList = []
    this.pageHeightArr = []
    this.state = {
      wholePageIndex: 0,
      twoList: [],
      isComplete: false,
      innerScrollTop: 0
    }
  }
  segmentList(list = this.props.list) {
    this.initData()

    let arr = []
    const _list = []
    while (list.length > 0) {
      arr = list.splice(0, this.segmentNum)
      _list.push(arr)
    }
    this.handleComplete()
    this.initList = _list
    this.state.twoList = this.initList.slice(0, 1)
    // return this.initList
    return this.state.twoList
  }
  handleComplete() {
    const { onComplete } = this.props
    this.state.isComplete = true
    onComplete && onComplete()
  }
  setHeight(list = this.initList) {
    const that = this
    const { wholePageIndex } = this.state

    const query = wx.createSelectorQuery()
    query.select(`#${that.listId} .wrap_${wholePageIndex}`).boundingClientRect()
    query.exec(function (res) {
      if (res && list && list.length) {
        that.pageHeightArr.push(res[0].height || 0)
      }
    })
    that.miniObserve()
  }
  miniObserve() {
    const that = this
    const { wholePageIndex } = that.state
    const { scrollViewProps, listId, screenNum } = that.props
    const scrollHeight = that.windowHeight
    wx.createIntersectionObserver(that.currentPage)
      .relativeToViewport({
        top: screenNum * scrollHeight,
        bottom: screenNum * scrollHeight
      })
      .observe(`#${that.listId} .wrap_${wholePageIndex}`, (res) => {
        const { twoList } = that.state
        if (res && res.intersectionRatio <= 0) {
          twoList[wholePageIndex] = {
            height: that.pageHeightArr[wholePageIndex]
          }
        } else if (res && res.intersectionRatio > 0) {
          twoList[wholePageIndex] = that.initList[wholePageIndex]
        }
        that.state.twoList = twoList
      })
  }
  getTwoList() {
    return this.state.twoList
  }
  renderNext() {
    if (this.state.wholePageIndex >= this.initList.length - 1) {
      console.log('无下一页')
      return this.state.twoList
    }
    this.state.wholePageIndex++
    let wholePageIndex = this.state.wholePageIndex
    this.state.twoList[wholePageIndex] = this.initList[wholePageIndex]
    setTimeout(() => {
      this.setHeight()
    }, 0)
    return this.state.twoList
  }
}
