import { routing } from "../../utils/routing"

const shareLocationKey = "share_location"
// pages/lock/lock.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shareLocation: false,
        avatarURL: '',
    },
    onLoad(opt: Record<'car_id', string>) {
        const o: routing.LockOpts = opt
        console.log('unlocking car', o.car_id)
        this.setData({
            shareLocation: wx.getStorageSync(shareLocationKey) || false,
        })
    },
    onChooseAvatar(e: any) {
        console.log(e.detail.avatarUrl)
        const userAvatar = e.detail.avatarUrl
        wx.setStorageSync("avatarURLKey", userAvatar)
        wx.setStorageSync(shareLocationKey, true)
        this.setData({
            avatarURL: userAvatar,
            shareLocation: true,
        })
    },
    onShareLocation(e: any) {
        this.data.shareLocation = e.detail.value
        wx.setStorageSync(shareLocationKey, this.data.shareLocation)
        if (e.detail.value === false) {
            wx.setStorageSync("avatarURLKey", "")
        } else {
            wx.setStorageSync("avatarURLKey", this.data.avatarURL)
        }
    },
    onUnlockTap() {
        wx.getFuzzyLocation({
            type: 'gcj02',
            success: loc => {
                console.log('starting a trip', {
                    location: {
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                    },
                    avatarURL: this.data.shareLocation ? this.data.avatarURL : '',
                })
                const tripID = 'trip456'
                wx.showLoading({
                    title: "开锁中",
                    mask: true,
                })
                setTimeout(() => {
                    wx.redirectTo({
                        url: routing.driving({
                            trip_id: tripID,
                        }),
                        complete: () => {
                            wx.hideLoading()
                        }
                    })
                }, 2000)
            },
            fail: () => {
                wx.showToast({
                    icon: "none",
                    title: "请前往设置页授权位置信息"
                })
            }
        })
    }
})