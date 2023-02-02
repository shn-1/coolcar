import { routing } from "../../utils/routing"

interface Trip {
    id: string
    start: string
    end: string
    duration: string
    fee: string
    distance: string
    status: string
}

interface MainItem {
    id: string
    navId: string
    navScrollId: string
    data: Trip
}

interface NavItem {
    id: string
    mainId: string
    label: string
}
interface MainItemQueryResult {
    id: string,
    top: number,
    dataset: {
        navId: string
        navScrollId: string
    }
}

Page({
    scrollStates: {
        mainItems: [] as MainItemQueryResult[],
    },
    data: {
        avatarURL: "",
        indicatorDots: true,
        autoPlay: true,
        interval: 3000,
        duration: 500,
        circular: true,
        multiItemCount: 2,
        prevMargin: '',
        nextMargin: '',
        vertical: false,
        current: 0,
        imgUrls: [
            'https://img3.mukewang.com/63c4bb93000177ca17920764.jpg',
            'https://img3.mukewang.com/63c4bc2c0001e9e617920764.jpg',
            'https://img1.mukewang.com/63c0c2aa000104a117920764.jpg',
        ],
        mainItems: [] as MainItem[],
        mainScroll: '',
        navItems: [] as NavItem[],
        tripsHeight: 0,
        navCount: 0,
        navSel: '',
        navScroll: '',
    },

    onLoad() {
        this.populateTrips()
        if (wx.getStorageSync("avatarURLKey")) {
            console.log(wx.getStorageSync("avatarURLKey"))
            this.setData({
                avatarURL: wx.getStorageSync("avatarURLKey")
            })
        }
    },

    onReady() {
        wx.createSelectorQuery().select('#heading').boundingClientRect(
            rect => {
                const height = wx.getSystemInfoSync().windowHeight - rect.height
                this.setData({
                    tripsHeight: height,
                    navCount: Math.round(height / 50),
                })
            }).exec()
    },
    populateTrips() {
        const mainItems: MainItem[] = []
        const navItems: NavItem[] = []
        let navSel = ''
        let prevNav = ''
        for (let i = 0; i < 100; i++) {
            const mainId = 'main-' + i
            const navId = 'nav-' + i
            const tripId = (10001 + i).toString()
            if (!prevNav) {
                prevNav = navId
            }
            mainItems.push({
                id: mainId,
                navId: navId,
                navScrollId: prevNav,
                data: {
                    id: tripId,
                    start: "东方明珠",
                    end: "迪士尼",
                    distance: "27.0公里",
                    duration: "0时44分",
                    fee: "128.00元",
                    status: "已完成",
                }
            })
            navItems.push({
                id: navId,
                mainId: mainId,
                label: tripId,
            })
            if (i == 0) {
                navSel = navId
            }
            prevNav = navId
        }
        this.setData({
            mainItems: mainItems,
            navItems: navItems,
            navSel: navSel,
        }, () => {
            this.prepareScrollStates()
        })
    },
    prepareScrollStates() {
        wx.createSelectorQuery().selectAll(".main-item")
            .fields({
                id: true,
                dataset: true,
                rect: true,
            }).exec(res => {
                this.scrollStates.mainItems = res[0]
            })
    },
    onSwiperChange(e: any) {
        console.log(e)
    },
    onRegisterTap() {
        wx.navigateTo({
            url: routing.register(),
        })
    },
    onNavItemTap(e: any) {
        const mainId = e.currentTarget?.dataset?.mainId
        const navId = e.currentTarget?.id
        if (mainId && navId) {
            this.setData({
                mainScroll: mainId,
                navSel: navId,
            })
        }
    },
    onMainScroll(e: any) {
        const top: number = e.currentTarget?.offsetTop + e.detail?.scrollTop
        if (top == undefined) {
            return
        }
        const selItem = this.scrollStates.mainItems.find(v => {
            return v.top >= top
        })
        if (!selItem) {
            return
        }
        this.setData({
            navSel: selItem.dataset.navId,
            navScroll: selItem.dataset.navScrollId,
        })
    }

})