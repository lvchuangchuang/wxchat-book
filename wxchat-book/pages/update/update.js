const app = getApp();
const filter = require('../../utils/filter');
Page(filter.loginCheck({

	/**
	 * 页面的初始数据
	 */
	data: {
		userID: '',
		update: null,
		deptArray: [],
		deptIndex: 0,
		subjectArray: [],
		subjectIndex: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			userID: options.userid
		});
		let that = this;
		wx.request({
			url: `${app.globalData.apiUrl}/getContactWhenUpdate/${that.data.userID}`,
			data: {},
			method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			// header: {}, // 设置请求的 header
			success: function (res) {
				// success
				if (res.data.success) {
          // console.log(res.data.data)
					that.setData({
						update: res.data.data,
						deptArray: res.data.depts,
						subjectArray: res.data.subjects,
						deptIndex: that.getIndexOfObjectArray(res.data.depts, res.data.data.deptId),
						subjectIndex: that.getIndexOfObjectArray(res.data.subjects, res.data.data.subjectId)
					})
				}
			},
			fail: function () {
				// fail
			},
			complete: function () {
				// complete
			}
		})
  },

  uploadImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // console.log(res.tempFiles[0].path)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFiles[0].path;
        console.log(tempFilePaths)
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 2000
        })
        console.log(this.data.update)
        let oldData = this.data.update;
        oldData.avatar = tempFilePaths;
        this.setData({
          update: oldData
        });
        console.log(oldData)
        console.log(this.data.update)
      }
    });
  },
	bindNameInput: function (e) {
		let oldData = this.data.update;
		oldData.name = e.detail.value;
		this.setData({
			update: oldData
    });
    console.log(this.data.update)
	},
	bindPhoneInput: function (e) {
		let oldData = this.data.update;
		oldData.phone = e.detail.value;
		this.setData({
			update: oldData
		});
	},
	genderChange: function (e) {
		let oldData = this.data.update;
		oldData.gender = e.detail.value;
		this.setData({
			update: oldData
		});
	},
	bindDeptPickerChange: function (e) {
		this.setData({
			deptIndex: e.detail.value
		});
	},
	bindSubjectPickerChange: function (e) {
		this.setData({
			subjectIndex: e.detail.value
		});
	},
	getIndexOfObjectArray(objArray, objId) {
		for (let [idx, obj] of Object.entries(objArray)) {
			if (obj.id === objId) {
				return idx;
			}
		}
		return -1;
	},
	confirmUpdate: function (e) {
		wx.showLoading({
			mask: true
		})
		wx.request({
			url: `${app.globalData.apiUrl}/updateContact/${this.data.userID}`,
			data: {
        avatar: this.data.update.avatar,
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
									url: "/pages/user/user"
								});
							}, 1500)
						}
					})

				}
			},
			fail: function () {
				// fail
			},
			complete: function () {
				// complete
			}
		})
	}
}))