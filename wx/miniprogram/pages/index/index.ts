import { routing } from "../../utils/routing"

Page({
    isPageShowing: false,
    data: {
        avatarURL: "",
        setting: {
            skew: 0,
            rotate: 0,
            showLocation: true,
            showScale: true,
            subKey: '',
            // layerStyle: -1,
            enableZoom: true,
            enableScroll: true,
            enableRotate: false,
            showCompass: false,
            enable3D: false,
            enableOverlooking: false,
            enableSatellite: false,
            enableTraffic: false,
        },
        location: {
            latitude: 23.099994,
            longitude: 113.324520,
        },
        scale: 10,
        markers: [
            {
                iconPath: "/resources/car.png",
                id: 0,
                latitude: 23.099994,
                longitude: 113.324520,
                width: 50,
                height: 50,
            },
            {
                iconPath: "/resources/car.png",
                id: 1,
                latitude: 23.099994,
                longitude: 114.324520,
                width: 50,
                height: 50,
            },
        ],
        showCancel: true,
        showModal: true,
    },
    onLoad() {

    },
    onMyLocationTap() {
        wx.getFuzzyLocation({
            type: 'gcj02',
            success: res => {
                console.log(res.latitude, res.longitude)
                this.setData({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude,
                    },
                })
            },
            fail: () => {
                wx.showToast({
                    icon: "none",
                    title: "请前往设置页授权"
                })
            }
        })
    },

    onScanTap() {
        wx.scanCode({
            success: async () => {
                await this.selectComponent('#licModal').showModal()
                // TODO: get car id from scan result
                const carID = 'car123'
                const redirectURL = routing.lock({
                    car_id: carID,
                })
                wx.navigateTo({
                    url: routing.register({
                        redirectURL: redirectURL,
                    })
                })
            },
            fail: console.error,
        })
    },
    onShow() {
        if (wx.getStorageSync("avatarURLKey")) {
            this.setData({
                avatarURL: wx.getStorageSync("avatarURLKey")
            })
        }
    },

    dest: {
        latitude: 23.099994,
        longitude: 113.324520,
    },
    onMyTripsTap() {
        wx.navigateTo({
            url: routing.mytrips(),
        })
    },
    moveCars() {
        const map = wx.createMapContext("map")
        const moveCar = () => {
            this.dest.latitude += 0.1
            this.dest.longitude += 0.1
            map.translateMarker({
                destination: {
                    latitude: this.dest.latitude,
                    longitude: this.dest.longitude,
                },
                markerId: 0,
                autoRotate: false,
                rotate: 0,
                duration: 5000,
                animationEnd: () => {
                    if (this.isPageShowing) {
                        moveCar()
                    }
                }
            })
        }
        moveCar()
    },

    onModalOk() {
        console.log('ok clicked')
    },

})
