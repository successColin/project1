import type { Component } from "vue"

export const getTextWidth = (text: string, fontSize: number) => {
    const span = document.createElement('span')
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.style.top = '-9999px'
    span.style.whiteSpace = 'nowrap'
    span.style.fontSize = fontSize + 'px'
    span.innerText = text
    document.body.appendChild(span)
    const width = span.offsetWidth + fontSize
    document.body.removeChild(span)
    return width
}

interface Item {
    prop?: string
    label: string
    is?: string | Component
    width?: string | number
}

export const getMaxWidth = <V extends Item, L>(value: V, list: Record<string, L>[], adaptive: boolean, minWidth: number = 0, padding: number = 12, fontSize: number = 14) => {
    const { prop, label, is, width } = value
    if (prop && !is && adaptive) {
        const contentWidths = list.map(v => {
            const value = v[prop] as string
            const textWidth = getTextWidth(value, fontSize)
            return textWidth + padding
        })
        const maxWidth = Math.max(...contentWidths)
        minWidth = getTextWidth(label, fontSize) + padding
        return Math.max((width as number) || minWidth, maxWidth)
    }
    return width || ''
}