import * as wechat from './utils'
import helper from '../helper'
import { Task } from '../core/Task'
import { Sender } from '../core/Sender'
import { WeChatCommonDataVender } from './CommonDataVendor'

export class WeChatSender implements Sender {
    url: string
    commonData: Object
    config: InilialzeConfig

    constructor (config: InilialzeConfig, commonData?: Object) {
        this.url = config.trackerHost
        this.config = config
        this.commonData = commonData
    }

    send (task: Task): Promise<Task> {
        let url = this.url
        let data = <TrackData>{
            ...this.commonData,
            ...task.data
        }
        if (this.config.attachActionToUrl) {
            const trackAction = data.action || ''
            url = /\/$/.test(this.url) ? `${this.url}${trackAction}` : `${this.url}/${trackAction}`
        }
        if (typeof this.config.beforeSend === 'function') {
            data = this.config.beforeSend(data)
        }
        helper.log('打点数据校验结果:', task, WeChatCommonDataVender.validate(data, this.config.dataScheme))
        return wechat.request({
            url,
            method: this.config.httpMethod,
            data
        }).then(() => {
            // 这一步肥肠重要，只需改变状态即可
            task.isSucceed()
            return Promise.resolve(task)
        }).catch(() => {
            task.isFailed()
            return Promise.resolve(task)
        })
    }
}
