const app = getApp();
const filter = require('../../utils/filter');
Page(filter.loginCheck({

	/**
	 * 页面的初始数据
	 */
	data: {
    userID: '',
		keyword: '',
		isLoading: false,
		isNoMore: false,
		page: 1,
		pageNum: 20,
		dataType: 1,
		dataId: 0,
		cardsData: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    this.setData({
			userID: wx.getStorageSync('USERID')
    });
    
		console.log('type0', options);
		let type = options.type ? parseInt(options.type) : 1,
			keyword = type === 3 ? options.title : '';
		console.log('type', type);
		this.setData({
			dataType: type,
			dataId: options.id ? parseInt(options.id) : 0,
			keyword: keyword
		});
    console.log('this.data: ', this.data);
    console.log("this.data.userID: " + this.data.userID)
		wx.setNavigationBarTitle({
			title: type === 3 ? `${keyword}的搜索结果` : options.title
		});
		console.log('type2', type);
    this.fetchCardList();
    let that = this
    wx.request({
      url: `${app.globalData.apiUrl}/delete/${this.data.userID}`,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      data: {},
      fail: function () {
      // fail
      console.log("失败")
      },
      complete: function () {
      // complete
      console.log("完成")
      }
      })
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

		if (!this.data.isNoMore) {
			this.setData({
				isLoading: true,
				page: this.data.page + 1
			});
			this.fetchCardList();
		}
  },
  
  deleteUser: function () {
    console.log(this.data.userID)
    wx.showModal({
      title: '是否删除',
      icon: 'success',      
      duration: 2000,
      success: function (res) {
        if (res.confirm) {
          console.log(this.data.userID)
          wx.request({
            url: `${app.globalData.apiUrl}/delete/${this.data.userID}`,
            // url: `${app.globalData.apiUrl}/updateContact/${this.data.userID}`,
            data: {
              name: this.data.update.name,
              gender: this.data.update.gender,
              phone: this.data.update.phone,
              deptID: this.data.deptArray[this.data.deptIndex].id,
              subjectID: this.data.subjectArray[this.data.subjectIndex].id
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              // success
              wx.hideLoading();
              if (res.data.success) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  success: function () {
                    setTimeout(() => {
                      wx.switchTab({
                        url: "/pages/department/department"
                      });
                    }, 1500)
                  }
                })
              }
            },
          })
				}
			}
    })
  },

	fetchCardList: function () {
		let api = app.globalData.apiUrl,
			url = '',
			that = this;
		if (this.data.dataType === 1) {
			url = `${api}/getContactsByDeptID/${that.data.dataId}`;
		}
		if (this.data.dataType === 2) {
			url = `${api}/getContactsBySubjectID/${that.data.dataId}`;
		}
		if (this.data.dataType === 3) {
			url = `${api}/searchByKeyword/${that.data.keyword}`;
		}
		wx.request({
			url: `${url}?page=${that.data.page}`,
			data: {},
			method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			// header: {}, // 设置请求的 header
			success: function (res) {
				// success
				if (res.data.success) {
					let isHasNoMore = false;
					if (res.data.data.length < that.data.pageNum) {
						isHasNoMore = true;
					}
					that.setData({
						cardsData: that.data.cardsData.concat(res.data.data),
						isLoading: false,
						isNoMore: isHasNoMore
					});
				}
			},
			fail: function () {
				// fail
			},
			complete: function () {
				// complete
			}
		});
	},

	/**
	 * 输入关键字
	 */
	bindKeywordInput: function (e) {
		this.setData({
			keyword: e.detail.value
		});
	},

	/**
	 * 搜索
	 */
	search: function (e) {
		wx.navigateTo({
			url: '/pages/card/card?id=0&type=3&title=' + this.data.keyword
		})
	},

	callPhone: function (e) {
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.phone
		})
	},

	showDeptTel: function (e) {
		let phone = e.currentTarget.dataset.tel;
		wx.showModal({
			title: '部门电话',
			content: phone,
			confirmText: '拨打',
			success: function (res) {
				if (res.confirm) {
					wx.makePhoneCall({
						phoneNumber: phone
					})
				}
			}
		})
	}
}))