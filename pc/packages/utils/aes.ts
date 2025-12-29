import CryptoJS from 'crypto-js'

const KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_KEY)

const IV = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_IV)

/**
 * crypto-js加密
 * @param data
 * @returns
 */
export const aesEncrypt = <T>(data: T) =>
    CryptoJS.AES.encrypt(data, KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    }).toString()

/**
 * crypto-js解密
 * @param data
 * @returns
 */
export const aesDecrypt = <T>(data: T) =>
    CryptoJS.AES.decrypt(data, KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    })
        .toString(CryptoJS.enc.Utf8)
        .toString()
