# 第三方支付接口实现指南

## 1. 微信支付实现

### 1.1 基础配置

```javascript
// config/payment.js
export const wxPayConfig = {
  appId: 'your_app_id',
  mchId: 'your_mch_id',
  apiKey: 'your_api_key',
  notifyUrl: 'https://your-domain.com/api/payment/notify/wxpay'
}
```

### 1.2 支付工具类

```typescript
// utils/wxpay.ts
import { wxPayConfig } from '@/config/payment'
import crypto from 'crypto'

export class WxPayService {
  /**
   * 生成支付参数
   */
  static async createPayParams(orderInfo: OrderInfo): Promise<WxPayParams> {
    const params = {
      appid: wxPayConfig.appId,
      mch_id: wxPayConfig.mchId,
      nonce_str: this.generateNonceStr(),
      body: orderInfo.description,
      out_trade_no: orderInfo.orderNo,
      total_fee: Math.floor(orderInfo.amount * 100), // 转换为分
      spbill_create_ip: orderInfo.clientIp,
      notify_url: wxPayConfig.notifyUrl,
      trade_type: 'JSAPI', // 或 'APP', 'NATIVE' 等
      openid: orderInfo.openId // 仅 JSAPI 支付需要
    }

    // 签名
    params.sign = this.generateSign(params)

    // 调用统一下单接口
    const result = await this.unifiedOrder(params)

    // 返回支付参数
    return {
      appId: wxPayConfig.appId,
      timeStamp: String(Math.floor(Date.now() / 1000)),
      nonceStr: this.generateNonceStr(),
      package: `prepay_id=${result.prepay_id}`,
      signType: 'MD5'
    }
  }

  /**
   * 生成随机字符串
   */
  private static generateNonceStr(length = 32): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let str = ''
    for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return str
  }

  /**
   * 生成签名
   */
  private static generateSign(params: Record<string, any>): string {
    // 1. 参数名ASCII码从小到大排序
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        if (params[key] !== undefined && params[key] !== '') {
          result[key] = params[key]
        }
        return result
      }, {} as Record<string, any>)

    // 2. 拼接字符串
    let stringA = Object.keys(sortedParams)
      .map(key => `${key}=${sortedParams[key]}`)
      .join('&')

    // 3. 拼接商户密钥
    const stringSignTemp = `${stringA}&key=${wxPayConfig.apiKey}`

    // 4. MD5加密
    return crypto
      .createHash('md5')
      .update(stringSignTemp)
      .digest('hex')
      .toUpperCase()
  }

  /**
   * 统一下单接口
   */
  private static async unifiedOrder(params: any): Promise<any> {
    const url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
    const xml = this.objectToXml(params)

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: xml,
        headers: {
          'Content-Type': 'text/xml'
        }
      })

      const result = await response.text()
      return this.xmlToObject(result)
    } catch (error) {
      throw new Error('统一下单接口调用失败')
    }
  }

  /**
   * 对象转XML
   */
  private static objectToXml(obj: Record<string, any>): string {
    let xml = '<xml>'
    for (const key in obj) {
      xml += `<${key}>${obj[key]}</${key}>`
    }
    xml += '</xml>'
    return xml
  }

  /**
   * XML转对象
   */
  private static xmlToObject(xml: string): Record<string, any> {
    // 使用 xml2js 等库解析 XML
    // 这里省略具体实现
    return {}
  }
}

interface OrderInfo {
  description: string
  orderNo: string
  amount: number
  clientIp: string
  openId?: string
}

interface WxPayParams {
  appId: string
  timeStamp: string
  nonceStr: string
  package: string
  signType: string
}
```

### 1.3 支付组件

```vue
<!-- components/WxPay.vue -->
<template>
  <view class="pay-container">
    <button 
      class="pay-button" 
      :loading="loading"
      @tap="handlePay"
    >
      微信支付
    </button>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { WxPayService } from '@/utils/wxpay'

const props = defineProps<{
  orderInfo: {
    orderNo: string
    amount: number
    description: string
  }
}>()

const loading = ref(false)

const handlePay = async () => {
  try {
    loading.value = true
    
    // 1. 获取支付参数
    const payParams = await WxPayService.createPayParams({
      ...props.orderInfo,
      clientIp: await getClientIp()
    })
    
    // 2. 调起支付
    await new Promise((resolve, reject) => {
      uni.requestPayment({
        ...payParams,
        success: resolve,
        fail: reject
      })
    })
    
    // 3. 支付成功处理
    uni.showToast({
      title: '支付成功',
      icon: 'success'
    })
    
  } catch (error) {
    uni.showToast({
      title: '支付失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const getClientIp = async () => {
  // 获取客户端IP的实现
  return '127.0.0.1'
}
</script>

<style lang="scss" scoped>
.pay-container {
  padding: 20rpx;
  
  .pay-button {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #07c160;
    color: #fff;
    border-radius: 44rpx;
    font-size: 32rpx;
  }
}
</style>
```

## 2. 支付宝支付实现

### 2.1 基础配置

```javascript
// config/payment.js
export const aliPayConfig = {
  appId: 'your_app_id',
  privateKey: 'your_private_key',
  publicKey: 'alipay_public_key',
  notifyUrl: 'https://your-domain.com/api/payment/notify/alipay'
}
```

### 2.2 支付工具类

```typescript
// utils/alipay.ts
import { aliPayConfig } from '@/config/payment'
import crypto from 'crypto'

export class AliPayService {
  /**
   * 生成支付参数
   */
  static async createPayParams(orderInfo: OrderInfo): Promise<string> {
    const params = {
      app_id: aliPayConfig.appId,
      method: 'alipay.trade.app.pay',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: this.formatDate(new Date()),
      version: '1.0',
      notify_url: aliPayConfig.notifyUrl,
      biz_content: JSON.stringify({
        subject: orderInfo.description,
        out_trade_no: orderInfo.orderNo,
        total_amount: orderInfo.amount.toFixed(2),
        product_code: 'QUICK_MSECURITY_PAY'
      })
    }

    // 签名
    params.sign = this.generateSign(params)

    // 转换为查询字符串
    return Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
  }

  /**
   * 生成签名
   */
  private static generateSign(params: Record<string, any>): string {
    // 1. 参数名ASCII码从小到大排序
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        if (params[key] !== undefined && params[key] !== '') {
          result[key] = params[key]
        }
        return result
      }, {} as Record<string, any>)

    // 2. 拼接字符串
    const signContent = Object.keys(sortedParams)
      .map(key => `${key}=${sortedParams[key]}`)
      .join('&')

    // 3. RSA2签名
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(signContent)
    return sign.sign(aliPayConfig.privateKey, 'base64')
  }

  /**
   * 格式化日期
   */
  private static formatDate(date: Date): string {
    const pad = (n: number) => (n < 10 ? `0${n}` : n)
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }

  /**
   * 验证支付宝异步通知
   */
  static verifyNotify(params: Record<string, any>): boolean {
    const sign = params.sign
    const signType = params.sign_type
    delete params.sign
    delete params.sign_type

    // 1. 参数名ASCII码从小到大排序
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key]
        return result
      }, {} as Record<string, any>)

    // 2. 拼接字符串
    const signContent = Object.keys(sortedParams)
      .map(key => `${key}=${sortedParams[key]}`)
      .join('&')

    // 3. 验证签名
    const verify = crypto.createVerify('RSA-SHA256')
    verify.update(signContent)
    return verify.verify(aliPayConfig.publicKey, sign, 'base64')
  }
}

interface OrderInfo {
  description: string
  orderNo: string
  amount: number
}
```

### 2.3 支付组件

```vue
<!-- components/AliPay.vue -->
<template>
  <view class="pay-container">
    <button 
      class="pay-button" 
      :loading="loading"
      @tap="handlePay"
    >
      支付宝支付
    </button>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AliPayService } from '@/utils/alipay'

const props = defineProps<{
  orderInfo: {
    orderNo: string
    amount: number
    description: string
  }
}>()

const loading = ref(false)

const handlePay = async () => {
  try {
    loading.value = true
    
    // 1. 获取支付参数
    const payParams = await AliPayService.createPayParams(props.orderInfo)
    
    // 2. 调起支付
    await new Promise((resolve, reject) => {
      uni.requestPayment({
        provider: 'alipay',
        orderInfo: payParams,
        success: resolve,
        fail: reject
      })
    })
    
    // 3. 支付成功处理
    uni.showToast({
      title: '支付成功',
      icon: 'success'
    })
    
  } catch (error) {
    uni.showToast({
      title: '支付失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.pay-container {
  padding: 20rpx;
  
  .pay-button {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #1677ff;
    color: #fff;
    border-radius: 44rpx;
    font-size: 32rpx;
  }
}
</style>
```

## 3. 后端通知处理

### 3.1 微信支付通知

```typescript
// server/controllers/payment.ts
export class PaymentController {
  /**
   * 处理微信支付通知
   */
  static async handleWxPayNotify(ctx: Context) {
    const xml = ctx.request.body
    const result = await xml2js(xml)
    
    if (WxPayService.verifySign(result)) {
      if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
        // 1. 查询订单
        const order = await OrderService.findByOrderNo(result.out_trade_no)
        
        // 2. 验证金额
        if (order.amount * 100 === parseInt(result.total_fee)) {
          // 3. 更新订单状态
          await OrderService.updateStatus(order.id, 'PAID')
          
          // 4. 返回成功通知
          ctx.body = `<xml>
            <return_code><![CDATA[SUCCESS]]></return_code>
            <return_msg><![CDATA[OK]]></return_msg>
          </xml>`
        }
      }
    }
  }
}
```

### 3.2 支付宝支付通知

```typescript
// server/controllers/payment.ts
export class PaymentController {
  /**
   * 处理支付宝支付通知
   */
  static async handleAliPayNotify(ctx: Context) {
    const params = ctx.request.body
    
    if (AliPayService.verifyNotify(params)) {
      if (params.trade_status === 'TRADE_SUCCESS') {
        // 1. 查询订单
        const order = await OrderService.findByOrderNo(params.out_trade_no)
        
        // 2. 验证金额
        if (order.amount === parseFloat(params.total_amount)) {
          // 3. 更新订单状态
          await OrderService.updateStatus(order.id, 'PAID')
          
          // 4. 返回成功通知
          ctx.body = 'success'
        }
      }
    }
  }
}
```

## 4. 安全性考虑

1. **签名验证**
   - 所有请求必须验证签名
   - 使用安全的加密算法
   - 密钥妥善保管

2. **参数校验**
   - 验证订单金额
   - 验证订单状态
   - 防止重复处理

3. **日志记录**
   - 记录支付流程
   - 记录异常情况
   - 便于问题排查

## 5. 最佳实践

1. **错误处理**
   - 完善的错误提示
   - 支付失败重试机制
   - 异常情况处理

2. **订单管理**
   - 订单状态流转
   - 超时订单处理
   - 订单退款处理

3. **性能优化**
   - 使用缓存
   - 异步处理
   - 并发控制
