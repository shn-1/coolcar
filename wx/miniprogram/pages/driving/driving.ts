import { routing } from "../../utils/routing"

const centPerSec = 0.7

function formatDuration(sec: number) {
    const padString = (n: number) => n < 10 ? '0' + n.toFixed(0) : n.toFixed(0)
    const h = Math.floor(sec / 3600)
    sec -= h * 3600
    const m = Math.floor(sec / 60)
    sec -= m * 60
    const s = Math.floor(sec)
    return `${padString(h)}:${padString(m)}:${padString(s)}`
}

function formatFee(cents: number) {
    return (cents / 100).toFixed(2)
}

Page({
    timer: undefined as number | undefined,

    data: {

        location: {
            latitude: 35.9478,
            longitude: 119.39,
        },
        scale: 14,
        elapsed: "00:00:00",
        fee: "0.00"
    },

    onLoad(opt: Record<'trip_id', string>) {
        const o: routing.DrivingOpts = opt
        console.log('current trip', o.trip_id)
        this.setupTimer()
    },

    onUnload() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    },

    setupTimer() {
        let elapsedSec = 0
        let cents = 0
        this.timer = setInterval(() => {
            elapsedSec++
            cents += centPerSec
            this.setData({
                elapsed: formatDuration(elapsedSec),
                fee: formatFee(cents)
            })
        }, 1000)
    },
    onEndTripTap() {
        wx.redirectTo({
            url: routing.mytrips(),
        })
    },
})
