/**
 * WEBPACK_CONIFG_HOST的值，在webpack.config.js中更改
 * 开发环境时 = "http://amptest.wisedu.com/xsfwfw/"
 * 发布环境时 = location.origin + location.pathname.substring(0, location.pathname.indexOf("/", 1)) + "/"
 */

export default {
	getWechatSign: 'http://res.wisedu.com:9090/checkSign',
	saveHealthConfig: WEBPACK_CONIFG_HOST + '/health/saveHealthConfig',
	getConfig: WEBPACK_CONIFG_HOST + '/health/getConfig',
	getTime: WEBPACK_CONIFG_HOST + '/health/getTime',
	saveHealthManage: WEBPACK_CONIFG_HOST + '/health/saveHealthManage',
	getManageInfo: WEBPACK_CONIFG_HOST + '/health/getManageInfo', //获取全部
	getDayAll: WEBPACK_CONIFG_HOST + '/health/getDayAll',
	getOrderInfoAll: WEBPACK_CONIFG_HOST + '/health/getOrderInfoAll'
}