//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onShow () {
        getApp().tracker.log({
            tracktype: 'event',     // event 或pageview
            action: '__viewPage',
            page_id: 'indexPage'
        })
    }
})