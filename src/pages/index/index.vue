<template>
  <div class="main">
    <div>
      <h1 class="title">预约按摩</h1>
      <mt-navbar v-model="selected">
        <mt-tab-item id="3">系统设置</mt-tab-item>
        <mt-tab-item id="1">设置预约</mt-tab-item>
        <mt-tab-item id="2">查看预约</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="3">
            <mt-field label="日限制次数" placeholder="请输入次数" v-model="dayMaxTime"></mt-field>
            <mt-field label="周限制次数" placeholder="请输入次数" v-model="weekMaxTime"></mt-field>
            <mt-field label="月限制次数" placeholder="请输入次数" v-model="monthMaxTime"></mt-field>
            <mt-field label="每次时长" placeholder="请输入时长" v-model="keepTime"></mt-field>
            <mt-field label="时间段" placeholder="请输入时间段" v-model="systimeFiled"></mt-field>
            <mt-button type="primary" v-on:click="submitSysConfig">提交</mt-button>
        </mt-tab-container-item>
        <mt-tab-container-item id="1">
          <calendar :view="view" :decorate="decorate" :sub="sub" :selected="selected1" :current-view="currentView" :start-date="startDate" :indicator="indicator" :start-monday="false" @prev="prev" @next="next" @today="today" @onPropsChange="change" :mainFrom="1" @selectDate="selectDate">
              <div class="actions" slot="action">
                <div class="action" @click="changeView">{{viewName}}</div>
                <!-- <div class="action" @click="addEvent">加</div> -->
              </div>
          </calendar>
          <div v-if="hasOrderedConfig">
            <div>展示已经有的</div>
          </div>
          <div v-else >
            <mt-checklist
              title="设置时间段"
              v-model="timeFiledValue"
              :options="options">
            </mt-checklist>
            <div v-on:click="addTimeFiled">
              <mt-field label="设置时间范围" placeholder="请输入时间" type="text" v-model="pickerValue" ></mt-field>
            </div>
            <mt-popup
              v-model="popupTimeVisible"
              position="bottom" style="width: 100%;">
              <mt-picker :slots="timeslots" @change="onTimeValuesChange"></mt-picker>
            </mt-popup>
            <mt-radio
              title="设置地点"
              v-model="stationValue"
              :options="[{
                      label: '金智园区',
                      value: '0'
                    },
                    {
                      label: '牛首园区',
                      value: '1'
                    }]">
            </mt-radio>
            <!-- <mt-field label="床位数" placeholder="请输入床位数" v-model="orderNumber"></mt-field> -->

            <mt-button type="primary" @click="saveHealthManage">保存</mt-button>
            <mt-button type="danger">发布</mt-button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <calendar :view="view" :decorate="decorate" :sub="sub" :selected="selected1" :current-view="currentView" :start-date="startDate" :indicator="indicator" :start-monday="false" @prev="prev" @next="next" @today="today" @onPropsChange="change" :mainFrom="2" @selectDate="selectDate">
            <div class="actions" slot="action">
              <div class="action" @click="changeView">{{viewName}}</div>
              <!-- <div class="action" @click="addEvent">加</div> -->
            </div>
          </calendar>
          <div>
            <div v-for="item in orderedInfo" class="om-pv-8">
              <table>
                <thead>
                  <tr>
                    <td>日期</td>
                    <td>时间</td>
                    <td>地点</td>
                    <td>员工号</td>
                    <td>姓名</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>item.DayTime</td>
                    <td>item.timeSlot</td>
                    <td>item.Station</td>
                    <td>item.EmployeeNum</td>
                    <td>item.EmployeeName</td>
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
    color: #31b29c;
  }
  .action {
    display: inline-block;
    padding: 5px;
    border-radius: 2px;
    background: #31b29c;
    color: #fff;
  }
  .om-pv-8 {
    padding-top: 8px;
    padding-bottom: 8px;
  }
</style>

<script>
  //import CalendarDemo from './calendar-demo.vue'
  import { Toast} from 'bh-mint-ui2';
  import moment from 'moment';
  import axios from 'axios';
  import api from '../../api.js';
  import Calendar from '../../calendar.vue';
  export default {
      data(){
        return {
          selected:'3',
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
          selected1: new Date,
          orderedInfo:[],
          username:'',
          stationValue:'',
          pickerValue:'',
          timeFiled:'',
          //时间范围
          popupTimeVisible:false,
          timeslots:[
            {
              flex: 1,
              values: [],
              className: 'slot1',
              textAlign: 'center'
            }
          ],
          //时长
          keepTime:'',
          //限制次数
          dayMaxTime:'',
          weekMaxTime:'',
          monthMaxTime:'',
          systimeFiled:'',
          flag1:'',
          hasOrderedConfig:'',
          options:[],
          timeFiledValue:[],
          orderNumber:'',
          flagManage:''
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
        },
        values:{
          get(){
            
          },
          set(){

          }
        }
      },
      watch: {
        startDate(startDate) {
          this.dealWithIndicator(startDate)
        },
        selected(selected){
          if (selected == 1) {
            this.getTime();
          }
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
        selectDate() {
          var that= this;
          if (this.selected == 2) {
            that.orderedInfo = [];
            //已经预约的信息
            axios({
                method:"POST",
                url:api.appsCount,
                params:{
                }
            }).then(function(response){
              var responseData = response.data.datas.appscount.rows;
              if (response.data.code == 0) {
                  if (responseData && responseData.length>0) {
                    responseData.map(function(item){
                      var itemObj = item;
                      itemObj.time='xxx';
                      itemObj.name = 'xxx';
                      that.orderedInfo.push(itemObj);
                    });
                  }
              }else {
                Toast('获取预约信息失败');
              }
            }).catch(function(err){
              Toast(err);
            });
          }
        },
        addTimeFiled() {
          this.popupTimeVisible = true;
          //this.$refs.datetimepicker.open();
        },
        handleConfirm(){

        },
        onTimeValuesChange(picker, values) {

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
                time_slot:that.systimeFiled,
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
                that.systimeFiled = responseData.resMessage.timeSlot;
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
        saveHealthManage(){
          var that= this;
          var paramsObj = {
              method:"POST",
              url:api.getTime,
              params:{
                day_time:'',
                time_slot:JSON.stringify([{time:'12:00-12:30',number:'2'}]),//that.timeFiledValue.join(',')
                station:that.stationValue,
                flagManage:'0'
              }
          };
          switch(that.view){
            case 'month':
              var fromatDate = that.fromatDateFunc(that.selected1);
              paramsObj.day_time = fromatDate;
              break;
            case 'week':
              paramsObj.day_time = that.selected1;
              break;
            case 'month2':
              paramsObj.day_time = that.selected1;
              break;
            }
          //保存的信息
          axios(paramsObj).then(function(response){
            var responseData = response.data;
            if (responseData.rescode == 0) {
              
            }else {
              Toast('获取预约信息失败');
            }
          }).catch(function(err){
            Toast(err);
          });  
        },
        getManageInfo(){

        },
        fromatDateFunc(date){
          return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
        }
      },
      created() {
        this.dealWithIndicator(this.startDate);
        this.getSysConfig();  
      },
      components: {
        [Toast.name]: Toast,
        // [Navbar.name]: Navbar,
        // [Field.name]: Field,
        // [Cell.name]: Cell,
        Calendar
      }
  }
</script>

