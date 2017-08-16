import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import Mint from 'bh-mint-ui2';
import {
  Toast,
  MessageBox
} from 'bh-mint-ui2';
import route from './router';
import * as utils from './utils'
import api from './api'
import 'bh-mint-ui2/lib/style.css'
import init from 'bh-mixin-sdk'
import axios from 'axios'


Vue.use(Mint);
Vue.use(VueRouter);
const router = new VueRouter(route);
console.log('process.env.NODE_ENV:' + process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
  global.employeeId = '';
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
      App
    }
  });
} else {
  console.log('api.getSignature:' + api.getSignature);
  axios.post(api.getSignature, {
    sign_url: window.location.href.replace(/#(\S+)?/, ''),
    flag: 0
  }).then(function({
    data
  }) {
    if (data.code === 0) {
      dd.config({
        agentId: data.agentId, // 必填，微应用ID
        corpId: data.corpId, //必填，企业ID
        timeStamp: data.timeStamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi。不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
        jsApiList: ['biz.user.get',
            'device.geolocation.get',
            'runtime.info',
            'biz.contact.choose',
            'device.notification.confirm',
            'device.notification.alert',
            'device.notification.prompt',
            'biz.ding.post',
            'biz.util.openLink'
          ] // 必填，需要使用的jsapi列表，注意：不要带dd。
      });
      dd.ready(function() {
        dd.biz.user.get({
          onSuccess: function(resp) {
            console.log('resp:``````````````````');
            console.log(resp);
            global.employeeId = resp.emplId;
            new Vue({
              el: '#app',
              router,
              template: '<App/>',
              components: {
                App
              }
            });
          }
        });
      });
      dd.error(function(err) {
        dd.device.notification.alert({
          "message": JSON.stringify(err),
          "title": "提示",
          "buttonName": "确定"
        })
        new Vue({
          el: '#app',
          router,
          template: '<App/>',
          components: {
            App
          }
        });
      });
    } else {
      dd.device.notification.alert({
        "message": "获取签名失败",
        "title": "提示",
        "buttonName": "确定"
      });
    }
  }).catch(function() {
    dd.device.notification.alert({
      "message": "网络或服务器错误",
      "title": "提示",
      "buttonName": "确定"
    });
  });
}