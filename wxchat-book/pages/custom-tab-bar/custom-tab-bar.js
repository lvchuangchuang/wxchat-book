Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#F7393F",
    "list": [
      {
        "pagePath": "pages/department/department",
        "iconPath": "/image/dept.png",
        "selectedIconPath": "/image/dept-active.png",
        "text": "部门"
      },
      {
        "pagePath": "pages/subject/subject",
        "iconPath": "/image/subject.png",
        "selectedIconPath": "/image/subject-active.png",
        "text": "学科"
      },
      {
        "pagePath": "pages/add/add",
        "iconPath": "/image/add.png",
        "selectedIconPath": "/image/add-active.png",
        "text": "添加"
      },
      {
        "pagePath": "pages/user/user",
        "iconPath": "/image/user.png",
        "selectedIconPath": "/image/user-active.png",
        "text": "我"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.pages
      })
    }
  }
})