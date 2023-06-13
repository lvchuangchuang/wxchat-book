const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		phone: '',
		password: '',
		isError: false,
    errorText: '',
    userInfo: {},
    hasUserInfo: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 输入手机号（用户名）
	 */
	bindPhoneInput: function (e) {
		this.setData({
			phone: e.detail.value
		});
	},

	/**
	 * 输入密码
	 */
	bindPasswordInput: function (e) {
		this.setData({
			password: e.detail.value
		});
	},

	/**
	 * 点击登录按钮
	 */
	login: function (e) {
		if (this.data.phone === '' || this.data.password === '') {
			this.setData({
				isError: true,
				errorText: "手机号码或密码不能为空"
			});
			return;
		}
    let that = this;
    console.log(`${app.globalData.apiUrl}`)
		wx.request({
			url: `${app.globalData.apiUrl}/login`,
			data: {
				phone: this.data.phone,
				password: this.data.password
			},
			method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			// header: {}, // 设置请求的 header
			success: function (res) {
				// success
				if (res.data.success) {
					wx.setStorageSync('USERID', res.data.userID);
					wx.redirectTo({
						url: "/pages/department/department"
					});
				} else {
					that.setData({
						isError: true,
						errorText: "请输入正确的手机号或密码"
					});
				}
			},
			fail: function () {
				// fail
			},
			complete: function () {
				// complete
			}
		})
		// console.log(this.data.userName, this.data.password);
  },
  getUserInfo: function () {
    console.log("getUserInfo")
    wx.getUserProfile({
      desc: '登录验证',
      success: res => {
        console.log(res)
        wx.setStorage({ key: 'userInfo', data: res.userInfo })
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(res.userInfo)
        wx.setStorageSync('USERID', 3618028);
        wx.redirectTo({
          url: "/pages/department/department"
        });
      }
    })
  },
})


