Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
  },
  observers: {
    list(newVal, oldVal) {
      if (Array.isArray(newVal) && newVal.length) {
        this.segmentList(newVal)
      }
    }
  },
  properties: {
    list: {
      type: Array,
      value: []
    },
    pageNum: {
      type: Number,
      value: 0
    },
    segmentNum: {
      type: Number,
      value: 10
    },
    listId: {
      type: String,
      value: 'gull-list'
    }
  },
  data: {
    initList: [],
    state: {
      wholePageIndex: 0,
      twoList: [],
      isComplete: false,
      innerScrollTop: 0
    },
    pageHeightArr: []
  },
  lifetimes: {
    attached() {}
  },
  pageLifetimes: {
    show() {}
  },
  methods: {
    segmentList(list = []) {
      const { segmentNum } = this.data
      let arr = []
      const _list = []
      while (list.length > 0) {
        arr = list.splice(0, segmentNum)
        _list.push(arr)
      }
      console.log(_list)
      this.setData({
        initList: _list
      })
      if (_list.length <= 1) {
      }
      this.handleComplete()
      this.setHeight(_list)
    },
    handleComplete() {
      this.setData({
        'state.isComplete': true
      })
      this.triggerEvent('complete', this.data.initList)
    },
    setHeight(list = []) {
      const that = this
      const { wholePageIndex } = this.data.state
      const { listId, pageHeightArr } = this.data
      const query = wx.createSelectorQuery().in(this)
      console.log('%c [ `#${listId} .wrap_${wholePageIndex}` ]-76', 'font-size:13px; background:#8152bf; color:#c596ff;', `#${listId} .wrap_${wholePageIndex}`)
      query.select(`#${listId}`).boundingClientRect()
      query.exec(function (res) {
        console.log(res)
        if (list && list.length) {
          pageHeightArr.push(res.height || 0)
        }
        that.setData({
          pageHeightArr
        })
        console.log(pageHeightArr)
      })
    }
  }
})
