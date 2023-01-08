export default class GullVirtualList {
  constructor(props) {
    this.props = {
      screenNum: 0.5,
      ...props
    }
    const { list, pageNum, segmentNum, listId } = props
    this.list = list || []
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

    this.initList = []
    this.pageHeightArr = []
    this.state = {
      wholePageIndex: 0,
      twoList: [],
      isComplete: false,
      innerScrollTop: 0
    }
  }
  segmentList(list = this.list) {
    let arr = []
    const _list = []
    while (list.length > 0) {
      arr = list.splice(0, this.segmentNum)
      _list.push(arr)
    }
    this.handleComplete()
    // this.setHeight(_list)
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

    if (wholePageIndex > that.initList.length - 1) {
      console.log('无下一页2')
      return
    }

    const query = wx.createSelectorQuery()
    query.select(`#${that.listId} .wrap_${wholePageIndex}`).boundingClientRect()
    query.exec(function (res) {
      if (res && list && list.length) {
        that.pageHeightArr.push(res[0].height || 0)
      }
      // console.log(that.pageHeightArr)
    })
    that.handleObserve()
  }
  handleObserve() {
    this.miniObserve()
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
        let _a = twoList[wholePageIndex]
        if (res && res.intersectionRatio <= 0) {
          twoList[wholePageIndex] = {
            height: that.pageHeightArr[wholePageIndex]
          }
        } else if (res && res.intersectionRatio > 0) {
          twoList[wholePageIndex] = that.initList[wholePageIndex]
        }
        that.state.twoList = twoList
        console.log(
          '%c [ `twoList` ]-83',
          'font-size:13px; background:#0cd4d6; color:#50ffff;',
          `#${that.listId} .wrap_${wholePageIndex}`
        )
        console.log(twoList)
      })
    return this.state.twoList
  }
  renderNext() {
    console.log('%c [ renderNext ]-102', 'font-size:13px; background:#bf512b; color:#ff956f;', 'renderNext')
    if (this.state.wholePageIndex >= this.initList.length - 1) {
      console.log('无下一页')
      return this.state.twoList
    }
    this.state.wholePageIndex++
    let wholePageIndex = this.state.wholePageIndex
    this.state.twoList[wholePageIndex] = this.initList[wholePageIndex]
    return this.state.twoList
  }
}