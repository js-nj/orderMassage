<template>
  <div class="main">
    <div>
      <h3 class="title">预约按摩</h3>
      <mt-navbar v-model="tabselected">
        <mt-tab-item id="1">系统设置</mt-tab-item>
        <mt-tab-item id="2">设置预约</mt-tab-item>
        <mt-tab-item id="3">查看预约</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="tabselected">
        <mt-tab-container-item id="1">
            <mt-field label="日限制次数" placeholder="请输入次数" v-model="dayMaxTime"></mt-field>
            <mt-field label="周限制次数" placeholder="请输入次数" v-model="weekMaxTime"></mt-field>
            <mt-field label="月限制次数" placeholder="请输入次数" v-model="monthMaxTime"></mt-field>
            <mt-field label="每次时长" placeholder="请输入时长" v-model="keepTime"></mt-field>
            <!-- <mt-field label="时间段" placeholder="请输入时间段" v-model="systimeFiled"></mt-field> -->
            <div>
              <mt-field label="时间段" placeholder="请添加时间" type="text" v-model="timeSlotsValue"></mt-field>
              <div v-on:click="addTimeSlot" style="padding-left: 9px;">
                <mt-button type="primary" size="small">添加时间段</mt-button>
              </div>
              <mt-popup
                v-model="timeSlotVisible"
                position="bottom" style="width: 100%;">
                <div class="" style="font-size:14px;">
                  <span class="" @click="cancelTimeSlot" style="float:left;display:inline-block;padding: 4px 16px;">取消</span>
                  <span class="" @click="okTimeSlot" style="float:right;color:#26a2ff;display:inline-block;padding: 4px 16px;">确定</span>
                  <div class="" style="clear:both;"></div>
                </div>
                <mt-picker :slots="timeSlotsArray" @change="onTimetimeSlotsValueChange"></mt-picker>
              </mt-popup>
            </div>
            
            <div class="" style="color:#999;padding:12px 12px;font-size:14px;">
              <div>说明：</div>
              <p>1、时间段支持手动收入,栗子:12:00-14:00,18:00-20:00</p>
              <!-- <p>2、多个时间段之间用英文半角","隔开</p> -->
              <p>2、每次时长要求可以被每个时间段的时长整除</p>
            </div>
            <mt-button type="primary" size="large" v-on:click="submitSysConfig" class="om-button">提交</mt-button>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div style="height:580px;overflow:auto;">
            <mt-radio
              title="选择地点"
              v-model="stationValue"
              :options="[{
                      label: '金智园区',
                      value: '0',
                      checked:true
                    },
                    {
                      label: '牛首园区',
                      value: '1'
                    }]" class="om-2-radio" >
            </mt-radio>
            <calendar :view="view" :decorate="decorate" :sub="sub" :selected="selected" :current-view="currentView" :start-date="startDate" :indicator="indicator" :start-monday="false" @prev="prev" @next="next" @today="today" @onPropsChange="change" :mainFrom="2" :statusDatas="statusDatas" @selectDate="selectDate">
                <div class="actions" slot="action">
                  <div class="action" @click="changeView">{{viewName}}</div>
                  <!-- <div class="action" @click="addEvent">加</div> -->
                </div>
            </calendar>
            <div v-if="hasOrderedConfig">
              <div style="padding:16px;">
                  <label style="font-weight:600;display:inline-block;padding-bottom:8px;">已发布的设置</label>
                  <div v-for="item in orderedConfigDatas" style="padding:8px 0;">
                    <label>时间段：<span v-text="item.time"></span></label>
                    <label style="display:inline-block;padding-left:8px;">床位数：<span v-text="item.number"></span></label>
                  </div>
              </div>
            </div>
            <div v-else >
              <om-checklist
                title="设置时间段"
                v-model="timeFiledValue"
                :options="options">
              </om-checklist> 
            </div>
          </div>
          <div class="om-2-buttom-container" style="" v-show="!hasOrderedConfig">
            <mt-button v-if="saveTag" type="primary" @click="saveHealthManage('add')" class="om-2-buttom-item" style="width:100%;" size="large">保存</mt-button>
            <mt-button v-else type="primary" @click="saveHealthManage('update')" class="om-2-buttom-item" size="large">更新</mt-button>
            <mt-button v-show="!saveTag" type="danger" @click="saveHealthManage('release')" class="om-2-buttom-item" size="large">发布</mt-button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <calendar :view="view" :decorate="decorate" :sub="sub" :selected="selectedQuery" :current-view="currentView" :start-date="startDate" :indicator="indicator" :start-monday="false" @prev="prev" @next="next" @today="today" @onPropsChange="change" :mainFrom="3" @selectDate="findSelectDate">
            <div class="actions" slot="action">
              <div class="action" @click="changeView">{{viewName}}</div>
              <!-- <div class="action" @click="addEvent">加</div> -->
            </div>
          </calendar>
          <div>
            <div class="om-pv-8 om-ph-8">
              <table style="width:100%;text-align:center;" >
                <thead>
                  <tr>
                    <!-- <td>预约编号</td> -->
                    <td style="width:20%;">日期</td>
        
                    <td style="width:20%;">地点</td>
                    <td style="width:20%;">时间</td>
                    <td>姓名</td>
                    <td>员工号</td>
                    
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in orderedInfo" style="height:24px;font-size:14px;line-height:26px;" class="">
                    <!-- <td v-text="item.id"></td> -->
                    <td v-text="item.dayTime"></td>
                    <td v-text="item.station"></td>
                    <td v-text="item.timeSlot"></td>
                    
                    <td v-text="item.employeeName"></td>
                    <td v-text="item.employeeId"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
      
    </div>
  </div>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  body {
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0;
    font-size: 16px;
    font-family: 'Hiragino Sans GB', 'Microsoft Yahei', SimSun, Tahoma, Arial, Helvetica, STHeiti;
  }
  .title {
    text-align: center;
    padding: 10px;
    color: #26a2ff;
  }
  .action {
    display: inline-block;
    padding: 5px;
    border-radius: 2px;
    background: #26a2ff;
    color: #fff;
  }
  .om-pv-8 {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .om-ph-8 {
    padding-left: 8px;
    padding-right: 8px;
  }
  .mint-button--small {
    padding: 5px 8px;
  }
  .om-button {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
  .mint-tab-item-label {
    font-size:16px;
    font-weight: 600;
  }
  .mint-tab-container {
    margin-top: 8px;
  }
  .mint-navbar .mint-tab-item.is-selected {
    border-bottom: 3px solid #26a2ff;
    color: #26a2ff;
    margin-bottom: 0px;
  }
  .mint-button--primary {
    background-color:#26a2ff;
  }
  .mint-cell-wrapper {
        font-size: 15px;
        padding: 0 36px;
  }
  .mint-checklist-title,.mint-radiolist-title {
    font-size: 15px !important;
    color: #333 !important;
    font-weight: 600;
  }
  .om-2-buttom-container {
    overflow:auto;position:fixed;bottom:0;width:100%;
  }
  .om-2-buttom-item {
    width:50%;float:left;
  }
  .calendar__indicator-detail {
    color:#26a2ff !important;
  }
  .om-2-radio .mint-radiolist-title{
    display: inline-block;
    /* position: relative; */
    vertical-align: top;
    position: relative;
    top: 6px;
  }
  .om-2-radio .mint-cell {
    display: inline-block;
  }
  .mint-radio-input:checked + .mint-radio-core {
    background-color: #26a2ff;
    border-color:#26a2ff;
  }
</style>

<script>
  //import CalendarDemo from './calendar-demo.vue'
  import { Toast} from 'bh-mint-ui2';
  import moment from 'moment';
  import axios from 'axios';
  import api from '../../api.js';
  import omChecklist from '../checklist/checklist.vue';
  import Calendar from '../../calendar.vue';
  import lodash from 'lodash';
  export default {
      data(){
        return {
          tabselected:'1',
          view: 'month',
          decorate: {},
          sub: {
            '2016-12-22': {
              content: '休',
              color: '#31b29c'
            },
            '2016-12-27': {
              content: '班',
              color: '#eb4f04'
            }
          },
          currentView: {},
          indicator: {},
          startDate: new Date,
          selected: new Date(),
          selectedQuery: new Date(),
          orderedInfo:[],
          //username:'',
          stationValue:'0',
          //pickerValue:'',
          //timeFiled:'',
          //时间范围
          // popupTimeVisible:false,
          // timeslots:[
          //   {
          //     flex: 1,
          //     values: [],
          //     className: 'slot1',
          //     textAlign: 'center'
          //   }
          // ],
          //时长
          keepTime:'',
          //限制次数
          dayMaxTime:'',
          weekMaxTime:'',
          monthMaxTime:'',
          systimeFiled:'',
          flag1:'',
          hasOrderedConfig:false,
          options:[],
          timeFiledValue:[],
          orderNumber:'',
          orderedConfigDatas:[
            {
              timeslot:'12:00-12:30',
              number:'1'
            },{
              timeslot:'12:30-13:00',
              number:'2'
            }
          ],
          flagManage:'',
          statusDatas:[],
          saveTag:true,
          //1 选择时间
          timeSlotVisible:false,
          timeSlotsValue:'',
          timeSlotsValueTmp:'',
          timeSlotsArray:[
            {
              flex: 1,
              values:[],
              // values: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',],
              className: 'slot1',
              textAlign: 'right'
            },{
              flex: 1,
              values: [],
              className: 'slot2',
              textAlign: 'right'
            }, {
              divider: true,
              content: '-',
              className: 'slot3'
            },{
              flex: 1,
              values: [],
              className: 'slot4',
              textAlign: 'left'
            }, {
              flex: 1,
              values: [],
              className: 'slot5',
              textAlign: 'left'
            }
          ]
        }
      },
      computed: {
        viewName: {
          get() {
            if (this.view === 'week') {
              return '周'
            } else if (this.view === 'month') {
              return '日'
            }else if (this.view === 'month2') {
              return '月'
            }
          }
        }
      },
      watch: {
        startDate(startDate) {
          this.dealWithIndicator(startDate)
        },
        tabselected(tabselected){
          if (tabselected == 1) {
            this.getSysConfig();
          }else if (tabselected == 2) {
            //请求总状态
            this.getDayAll();
            this.getManageInfo();
            this.getTime();
          }else if (tabselected == 3) {
            this.getOrderInfoAll();
          }
          console.log('tabselected:------------------'+tabselected)
        },
        timeFiledValue(val,oldVal){
          console.log('val')
          console.log(val)
          console.log('oldVal')
          console.log(oldVal)
        },
        stationValue(val,oldVal){
          //请求总状态
          this.getDayAll();
          this.getManageInfo();
          this.getTime();
        }
      },
      methods: {
        change(propName,newVal,oldVal){
          this[propName]=newVal;
        },
        dealWithIndicator(startDate) {
          let indicator = {}
          if (startDate.getMonth() <= 6) {
            indicator.title = startDate.getFullYear();// + '上学期'
          } else {
            indicator.title = startDate.getFullYear();// + '下学期'
          }
          this.indicator = indicator
        },
        changeView() {
          //默认为日(month),点日切换为周(week),点周切换为月(month2),点月切换为日(month)
          if (this.view == 'month') {
            this.view = 'week'
          }else if (this.view === 'week') {
            this.view = 'month2'
          } else if (this.view === 'month2') {
            this.view = 'month'
          }
        },
        addEvent() {
          let flag = window.confirm('是否给明天添加一条事件')
          let today = new Date()
          if (flag) {
            this.decorate = Object.assign({}, this.decorate, {
              [moment(new Date()).add(1, 'day').format('YYYY-MM-DD')]: true
            })
          }
        },
        prev() {
          console.log('prev clicked')
        },
        next() {
          console.log('next clicked')
        },
        today() {
          console.log('today clicked')
        },
        addTimeSlot(){
          this.timeSlotVisible = true;
        },
        cancelTimeSlot(){
          this.timeSlotVisible = false;
        },
        okTimeSlot(val){
          var beforeArray = this.timeSlotsValueTmp.split('-')[0];
          var afterArray = this.timeSlotsValueTmp.split('-')[1];
          var beforeArrayHorse = Number(beforeArray.split(':')[0]);
          var beforeArrayMinute = Number(beforeArray.split(':')[1]);
          var afterArrayHorse = Number(afterArray.split(':')[0]);
          var afterArrayMinute = Number(afterArray.split(':')[1]);
          if ((afterArrayHorse < beforeArrayHorse) || (afterArrayHorse == beforeArrayHorse && afterArrayMinute<=beforeArrayMinute)) {
            Toast('结束时间应大于开始时间');
            return;
          }
          
          if (this.timeSlotsValue) {
            this.timeSlotsValue = this.timeSlotsValue+','+this.timeSlotsValueTmp;
          }else {
            this.timeSlotsValue = this.timeSlotsValueTmp;
          }
          this.timeSlotVisible = false;
        },
        onTimetimeSlotsValueChange(picker, valuesArr){
          console.log(valuesArr)
          if (!valuesArr[0]) {
            valuesArr[0] = '00';
          }
          if (!valuesArr[1]) {
            valuesArr[1] = '00';
          }
          if (!valuesArr[2]) {
            valuesArr[2] = '00';
          }
          if (!valuesArr[3]) {
            valuesArr[3] = '00';
          }
          this.timeSlotsValueTmp = valuesArr[0] +':'+ valuesArr[1] +'-'+ valuesArr[2] +':'+ valuesArr[3];
        },
        selectDate(date) {
          var that= this;
          if (this.tabselected == 2) {
            that.getManageInfo(date);
            that.getTime();
          }
          // else if (this.tabselected == 3){
          //   that.getOrderInfoAll();
          // }
        },
        getDayAll(){
          var that = this;
          axios({
              method:"POST",
              url:api.getDayAll,
              params:{
                station:that.stationValue
              }
          }).then(function(response){
            var responseData = response.data;
            if (responseData.rescode == 0) {
              that.statusDatas = responseData.resMessage;
            }else {
              Toast('获取每日设置状态信息失败');
            }
          }).catch(function(err){
            Toast(err);
          });
        },
        //包含发布与不发布的
        getManageInfo(date) {
          var that= this;
          that.timeFiledValue = [];
          if (date) {
            that.selected = date;
          }
          //保存的信息
          axios({
              method:"POST",
              url:api.getManageInfo,
              params:{
                day_time:that.formatDate(new Date(that.selected)),
                station:that.stationValue
              }
          }).then(function(response){
            var responseData = response.data;
            if (responseData.rescode == 0) {
              if (responseData.resMessage.length>0) {
                if (responseData.resMessage[0].status == 0) {
                  that.hasOrderedConfig = false;
                  JSON.parse(responseData.resMessage[0].timeSlot).forEach(function(item){
                    that.timeFiledValue.push(item.time);
                    console.log(document.querySelectorAll('.om-checklist-input[from="'+item.time+'"]')[0])
                    setTimeout(function(){
                      document.querySelectorAll('.om-checklist-input[from="'+item.time+'"]')[0].value = item.number;
                    },200);
                    that.saveTag = false;
                  });  
                }else if(responseData.resMessage[0].status == 1){
                  that.hasOrderedConfig = true;
                  that.orderedConfigDatas = JSON.parse(responseData.resMessage[0].timeSlot);
                }
              }else if (responseData.resMessage.length == 0) {
                that.hasOrderedConfig = false;
                that.saveTag = true;
              }
            }else {
              Toast('获取当日预约设置信息失败');
            }
          }).catch(function(err){
            Toast(err);
          });  
        },
        findSelectDate(date){
          var that = this;
          that.getOrderInfoAll(date);
        },
        submitSysConfig() {
          var that= this;
          //保存的信息
          axios({
              method:"POST",
              url:api.saveHealthConfig,
              params:{
                day_limit:that.dayMaxTime,
                week_limit:that.weekMaxTime,
                month_limit:that.monthMaxTime,
                duration:that.keepTime,
                time_slot:that.timeSlotsValue,
                flag:that.flag1
              }
          }).then(function(response){
            if (response.data.rescode == 0) {
              Toast('保存系统设置成功');
            }else {
              Toast('保存系统设置失败');
            }
          }).catch(function(err){
            Toast(err);
          });  
        },
        getSysConfig() {
          var that= this;
          //保存的信息
          axios({
              method:"POST",
              url:api.getConfig,
              params:{}
          }).then(function(response){
            var responseData = response.data;
            if (responseData.rescode == 0) {
              if (responseData.resMessage && responseData.resMessage.id) {
                that.flag1 = 1;
                that.dayMaxTime = responseData.resMessage.dayLimit;
                that.weekMaxTime = responseData.resMessage.weekLimit;
                that.monthMaxTime = responseData.resMessage.monthLimit;
                that.keepTime = responseData.resMessage.duration;
                that.timeSlotsValue = responseData.resMessage.timeSlot;
              }else {
                that.flag1 = 0;
              }
            }else {
              Toast('获取预约信息失败');
            }
          }).catch(function(err){
            Toast(err);
          });  
        },
        // clickStationRadio(){
        //   //请求总状态
        //   this.getDayAll();
        //   this.getManageInfo();
        //   this.getTime();
        // },
        getTime(){
          var that= this;
          that.options = [];
          //保存的信息
          axios({
              method:"POST",
              url:api.getTime,
              params:{}
          }).then(function(response){
            var responseData = response.data;
            if (responseData.rescode == 0) {
              if (responseData.resMessage) {
                responseData.resMessage.forEach(function(item){
                  var tmpObj = {};
                  tmpObj.label = item;
                  tmpObj.value = item;
                  that.options.push(tmpObj);
                });
              }
            }else {
              Toast('获取预约信息失败');
            }
          }).catch(function(err){
            Toast(err);
          });  
        },
        saveHealthManage(str){
          var that= this;
          var timeAndNumber = that.timeFiledValue.map(function(item){
            if (item) {
              var targetNumber = document.querySelectorAll('.om-checklist-input[from="'+item+'"]');
              return {
                time:item,
                number:targetNumber[0].value
              }
            }
          });
          var timeAndNumber = _.sortBy(timeAndNumber, 'time');
          console.log(timeAndNumber)
          var paramsObj = {
              method:"POST",
              url:api.saveHealthManage,
              params:{
                day_time:'',
                time_slot:JSON.stringify(timeAndNumber),
                station:that.stationValue,
                flag:str
              }
          };
          var fromatDate = that.fromatDateFunc(that.selected);
          paramsObj.params.day_time = fromatDate;
          //保存的信息
          axios(paramsObj).then(function(response){
            var responseData = response.data;
            if (responseData.rescode == 0) {
              if (str == 'release') {
                that.getDayAll();
                that.getManageInfo();
              }
              if (str == 'add') {
                that.saveTag = false;
                that.getDayAll();
              }
            }else {
              Toast('获取预约信息失败');
            }
          }).catch(function(err){
            Toast(err);
          });  
        },
        fromatDateFunc(date){
          var that = this;
          
          //通过某日获取本周除周六周日的其他五天日期
          var getWeekDaysExceptWeekend = function(date){
            console.log(date)
              var now = new Date(date); 
              var nowTime = now.getTime(); 
              var day = now.getDay();
              var oneDayLong = 24*60*60*1000 ;
              var targetWeekArray = [];
              for (var i = 0; i <= 6; i++) {
                var targetTime = nowTime + (i - day)*oneDayLong;
                var newDay = new Date(targetTime).getDay();
                if (newDay != 0 && newDay != 6) {
                  var targetDate = that.formatDate(new Date(targetTime));
                  targetWeekArray.push(targetDate);
                } 
              }
              console.log(targetWeekArray)
              return targetWeekArray;
          };
          //通过某日获取本月除周六周日的其他日期
          var getMonthDaysExceptWeekend = function(date){
            console.log(date)
              var now = new Date(date); 
              var nowTime = now.getTime(); 
              var day = now.getDate();
              var oneDayLong = 24*60*60*1000 ;
              var targetMonthArray = [];
              var monthCountLength = getCountDays(date);
              for (var i = 1; i <= monthCountLength; i++) {
                var targetTime = nowTime + (i - day)*oneDayLong;
                var newDay = new Date(targetTime).getDay();
                if (newDay != 0 && newDay != 6) {
                  var targetDate = that.formatDate(new Date(targetTime));
                  targetMonthArray.push(targetDate);
                } 
              }
              console.log(targetMonthArray)
              return targetMonthArray;
          };
          //获取每月天数
          var getCountDays = function(date){
              var curDate = new Date(date);
              /* 获取当前月份 */
              var curMonth = curDate.getMonth();
             /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
             curDate.setMonth(curMonth + 1);
             /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
             curDate.setDate(0);
             /* 返回当月的天数 */
             return curDate.getDate();
          };
          
          switch(that.view){
            case 'month':
              return that.formatDate(date);
              break;
            case 'week':
              return getWeekDaysExceptWeekend(date).join(',');
              break;
            case 'month2':
              return getMonthDaysExceptWeekend(date).join(',');
              break;
          }
        },
        getOrderInfoAll(date) {
          var that= this;
          that.orderedInfo = [];
          if (date) {
            that.selectedQuery = date
          }
          var now = new Date(that.selectedQuery); //当前日期 
          var nowDayOfWeek = now.getDay(); //今天本周的第几天 
          var nowDay = now.getDate(); //当前日 
          var nowMonth = now.getMonth(); //当前月 
          var nowYear = now.getYear(); //当前年 
          nowYear += (nowYear < 2000) ? 1900 : 0; //
          //获得本周的开始日期 
          function getWeekStartDate() { 
          var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek); 
          return that.formatDate(weekStartDate); 
          } 

          //获得本周的结束日期 
          function getWeekEndDate() { 
          var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)); 
          return that.formatDate(weekEndDate); 
          } 

          //获得本月的开始日期 
          function getMonthStartDate(){ 
          var monthStartDate = new Date(nowYear, nowMonth, 1); 
          return that.formatDate(monthStartDate); 
          } 

          //获得本月的结束日期 
          function getMonthEndDate(){ 
          var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth)); 
          return that.formatDate(monthEndDate); 
          }

          //获得某月的天数 
          function getMonthDays(myMonth){ 
            var monthStartDate = new Date(nowYear, myMonth, 1); 
            var monthEndDate = new Date(nowYear, myMonth + 1, 1); 
            var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); 
            return days; 
          }
          var paramsObj = {
              method:"POST",
              url:api.getOrderInfoAll,
              params:{}
          };
          switch(that.view){
            case 'month':
              paramsObj.params.day_time = that.formatDate(that.selected);
              //paramsObj.params.day_time = '2017-08-14,2017-08-16';
              break;
            case 'week':
              paramsObj.params.day_time = getWeekStartDate()+','+getWeekEndDate();
              break;
            case 'month2':
              paramsObj.params.day_time = getMonthStartDate()+','+getMonthEndDate();
              break;
          }
          //保存的信息
          axios(paramsObj).then(function(response){
            var responseData = response.data;
            if (responseData.rescode == 0) {
              if (responseData.resMessage) {
                responseData.resMessage.forEach(function(item){
                  item.dayTime = that.formatDate(new Date(item.dayTime));
                  if (item.station == '0') {
                    item.station = '金智园区';
                  }
                  if (item.station == '1') {
                    item.station = '牛首园区';
                  }
                  that.orderedInfo.push(item);
                });
              }
            }else {
              Toast('获取员工已经预约信息失败');
            }
          }).catch(function(err){
            Toast(err);
          }); 
        },
        //格局化日期：yyyy-MM-dd 
        formatDate: function(date) { 
            var myyear = date.getFullYear(); 
            var mymonth = date.getMonth()+1; 
            var myweekday = date.getDate(); 

            if(mymonth < 10){ 
            mymonth = "0" + mymonth; 
            } 
            if(myweekday < 10){ 
            myweekday = "0" + myweekday; 
            } 
            return (myyear + "-" + mymonth + "-" + myweekday); 
        },
        setNumberArray(total){
          var numberArray = [];
          for (var i = 0; i < total; i++) {
            var number = i;
            if (number <  10) {
              number = '0' + String(number);
            }
            numberArray.push(number);
          }
          return numberArray;
          console.log(numberArray)
        }
      },
      created() {
        this.dealWithIndicator(this.startDate);
        this.getSysConfig();
        this.timeSlotsArray[0].values = this.setNumberArray(24);
        this.timeSlotsArray[1].values = this.setNumberArray(60);
        this.timeSlotsArray[3].values = this.setNumberArray(24);
        this.timeSlotsArray[4].values = this.setNumberArray(60);
      },
      components: {
        [Toast.name]: Toast,
        Calendar,
        omChecklist
      }
  }
</script>

