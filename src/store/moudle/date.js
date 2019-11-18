import Vue from 'vue'
import axios from 'axios'
import qs from 'qs';
import { Dialog } from 'vant'
const state={
	//账号协议checked
	checked: true,
	//账号
	account:{
		name:'',
		password:'',
		isLogin:0,
		user:{
			realname:'',
			tel: undefined,
			remark:"",				//备注
			idcardNo:undefined, 	//身份证号
		},
		clinicId: '',			//门诊id
		hospitalId: '',
		data:{},
	},
	// 详情页数据
	detail:{
		patientId : undefined,		//病人id
		realname : undefined,		//病人姓名
		clinicId : undefined,		//门诊id
		clinicName : undefined,		//门诊名称
		hospitalConfirmTime : undefined	,//医院确诊时间
		hospitalId	: undefined,	//医院id
		hospitalName : undefined,	//医院名称
		idcardNo : undefined,		//身份证号
		invoices : [],		//发票
		patientId :undefined,		//患者id
		pushTime : undefined,		//推送时间
		remark : undefined,			//备注
		tel : undefined,			//电话号码
		sickness : undefined		//病例
	},
	//筛选的弹窗显示值
	show: false,	
	//筛选数据
	Time:{
		look:'',
		noLook:'',
		confirmStart : '开始时间',
		confirmOver : '结束时间',
		pushStart : '开始时间',
		pushOver : '结束时间',
		postState : undefined,
	},
	search_userList:[],		//搜索页面的list列表
	// lable的dom节点
	labelDocument:['labelDocument','labelDocument2','labelDocument3','labelDocument4','labelDocument5','labelDocument6'],
	//label的button值
	dateStata : '',
	//显示半遮罩及其日期选择
	showTime : false,
	showData: '',
}
const getters={
	//账号协议checked
	checked: state => state.checked,
	// 详情页数据
	detail: state => state.detail,
	//账号登陆
	account : state => state.account,
	//筛选的弹窗显示值
	show : state => state.show,
	//筛选数据
	Time	: state => state.Time,
	// lable的dom节点
	labelDocument :state =>state.labelDocument,
	//显示半遮罩及其日期选择
	showTime : state => state.showTime,
	//搜索页面的list列表
	search_userList : state => state.search_userList,
}
const actions={
	//复选框的选择
	change({commit},_value){
		commit('changeFn',_value)
	}, 
	//登陆页面的表单验证
	submit({commit},landingState){
		// console.log(value)
		commit('submitFn',landingState)
		// this.$store.commit('submitFn','100') 
	},
	//选择框样式
	labelLabelFn({commit},obj){
		// console.log(obj);
		// console.log(ss)
		commit('labelLabelFn',obj);
	},
	//时间日期选择获取
	dateConfirm({commit},date){
		let time = date.slice(0,10);
		// console.log(date.slice(0,10));
		commit('dateConfirmFn',time);
	},
	//关闭半遮罩
	closeFn({commit}){
		commit('closeFn')
	},
	//筛选确定
	screeningSubmit({commit}){
		commit('screeningSubmitFn')
	},
	// 筛选重置
	screeningResult({commit}){
		commit('screeningResultFn')
	},
	// 确定选择的日期
	confirm({commit},_value){
		commit('confirmFn',_value)
	},
	//取消选择的日期
	cancel({commit},_value){
		commit('cancelFn',_value)
	},
	//hospital的个人信息提交
	hospitalSubmit({commit},_message){
		commit('hospitalSubmitFn',_message)
	}
}
const mutations={
	//登陆及其刷新请求
	submintGetData(_postUrl,_postRefresh,_isLogin,_url){
		// console.log(_postUrl);
		// console.log(_postRefresh);
		// console.log(_url);
		axios.post(_postUrl,qs.stringify({
				account : state.account.name,
				password : state.account.password
			}))
			.then( res =>{
				if(res.data.codeMsg == ""){
					state.account.isLogin = _isLogin;
					
					 axios.post(_postRefresh)
						.then( res =>{
							// console.log(Res);
							state.account.clinicId= res.data.data.clinic.clinicId;
							state.account.hospitalId= res.data.data.hospital.hospitalId;
							console.log(state.account.hospitalId)
							state.account.data = {};
							state.account.data = res.data;
							// console.log(state.account)
							// console.log(res)
							if(_isLogin == 200 || _isLogin == 100){
								window.location.href=_url;	
							}else{
								Dialog({ message: '正在开发中，敬请期待' });
							}
						})
						.catch((err)=>{
							console.log(err)
							Dialog({ message: '加载失败!' });
						})
				}else{
					Dialog({ message:  res.data.codeMsg});
				}
				// console.log(res.data.codeMsg)
			})
			.catch((err)=>{
				console.log(err)
				Dialog({ message: '加载失败!' });
			})	
	},
	//复选框的选择
	changeFn(state,_value){
		// console.log(state.checked)
		state.checked = _value.target.checked;
		// console.log(_value.target.checked)
	},
	
	//登陆页面的表单验证
	submitFn(state,landingState){
			// console.log(this.account.name+this.account.password)
			// Dialog({ message: '准备跳转主页面' });
		
		state.account.isLogin = landingState;
		// console.log(landingState)
		if(state.checked == true){
			switch (landingState){
				case '100':
				mutations.submintGetData('/hospital/login','/hospital/login-refresh',100,'#/hospital_index')
					break;
				case '200':
				// console.log('200')
				mutations.submintGetData('/clinic/login','/clinic/login-refresh',200,'#/outpatient_index')
					break;
				case '300':
				mutations.submintGetData('/manager/login','/manager/login-refresh',300,'#/outpatient_index')
					break;
				default:
					break;
			}
		}else{
			Dialog({ message: '请勾选同意条款' });
		}

	},
	//关闭半遮罩
	closeFn(state){
		// console.log(dialog)
		state.showTime = false;
	},
	// 确定选择的日期
	confirmFn(state,_value){
		// console.log(typeof _value)
		state.time = '';
		state.time = String(_value).slice(1,16).split(' ');
		console.log(state.dateStata);
		switch(state.time[1]){
			case 'Jan':
			state.time[1] = 2; break;
			case 'Feb':
			state.time[1] = 2; break;
			case 'Mar':
			state.time[1] = 3; break;
			case 'Apr':
			state.time[1] = 4; break;
			case 'May':
			state.time[1] = 5; break;
			case 'Jun':
			state.time[1] = 6; break;
			case 'Jul':
			state.time[1] = 7; break;
			case 'Aug':
			state.time[1] = 8; break;
			case 'Sep':
			state.time[1] = 9; break;
			case 'Oct':
			state.time[1] = 10; break;
			case 'Nov':
			state.time[1] = 11; break;
			case 'Dec':
			state.time[1] = 12; break;
			
		}
		state.time = state.time[3]+'/'+state.time[1]+'/'+state.time[2]+'';
		switch (state.dateStata){
			case 2:
			state.Time.confirmStart = '';
			state.Time.confirmStart = state.time; 
			break;
			case 3: 
			state.Time.confirmOver = '';
			state.Time.confirmOver = state.time; 		
			break;
			case 4: 
			state.Time.pushStart = '';
			state.Time.pushStart = state.time;		
			break;
			case 5: 
			state.Time.pushOver = '';
			state.Time.pushOver = state.time;
			break;
		}
		console.log(state.Time)
		// console.log(mutations.labelLabelFn._vlaue)
	},
	//取消选择的日期
	cancelFn(state,_value){
		console.log(_value)
	},
	//选择框样式
	labelLabelFn(state,obj){
		let _vlaue = obj[0];
		let _this = obj[1];
		// console.log(typeof _vlaue);
		// console.log(typeof _this);
		let buttonStyle = document.getElementById(state.labelDocument[_vlaue]);
		switch(_vlaue){
			case 0: 
			document.getElementById(state.labelDocument[0]).style.backgroundColor = "#EEEEEE";
			document.getElementById(state.labelDocument[1]).style.backgroundColor = "#EEEEEE";
			_this.target.style.backgroundColor = "#FFE1BE";
			state.dataStata = '';
			state.Time.look = "";
			state.Time.noLook = "";
			state.Time.look = '未就诊';
			state.dateStata=_vlaue;
			state.Time.postState = 1;
			// console.log(state.dateStata);
			
			break;
			case 1:
			document.getElementById(state.labelDocument[0]).style.backgroundColor = "#EEEEEE";
			document.getElementById(state.labelDocument[1]).style.backgroundColor = "#EEEEEE";
			_this.target.style.backgroundColor = "#FFE1BE";
			state.dataStata = '';
			state.Time.look = "";
			state.Time.noLook = "";
			state.Time.noLook = '已就诊';
			state.dateStata=_vlaue;
			state.Time.postState = 4;
			// console.log(state.dateStata);
			break;
			
			case 2:
			document.getElementById(state.labelDocument[2]).style.backgroundColor = "#EEEEEE";
			document.getElementById(state.labelDocument[3]).style.backgroundColor = "#EEEEEE";
			_this.target.style.backgroundColor = "#FFE1BE";
			state.dataStata = '';
			state.dateStata=_vlaue;
			// console.log(state.dateStata);
			state.Time.confirmStart = state.time;
			state.showTime = true;
			break;
			
			case 3:
			_this.target.style.backgroundColor = "#FFE1BE";
			state.dataStata = null;
			state.dateStata=_vlaue;
			// console.log(state.dateStata);
			state.Time.confirmOver = state.time; 
			state.showTime = true;
			break;
			
			case 4:
			_this.target.style.backgroundColor = "#FFE1BE";
			state.dataStata = '';
			state.dateStata = _vlaue;
			// console.log(state.dateStata);
			state.Time.pushStart = state.time; 
			state.showTime = true;
			break;
			
			case 5:
			_this.target.style.backgroundColor = "#FFE1BE";
			state.dataStata = '';
			state.dateStata=_vlaue;
			// console.log(state.dateStata);
			state.showTime = true;
			state.Time.pushOver = state.time;
			break;
		}
		return {_vlaue,_this};
	},
	// 筛选确定
	screeningSubmitFn(state){
		axios.post('/c2/patient/items',qs.stringify({
			clinicId : state.account.clinicId,
			// pushTimeStart : this.Time.pushStart,
			// pushTimeEnd : this.Time.pushOver,
			status : state.Time.postState,
			// hospitalConfirmTimeStart : this.Time.confirmStart,
			// hospitalConfirmTimeEnd : this.Time.confirmOver,
		}))
		.then(_d => {
			// console.log(_d.data.data.items)
			state.search_userList = _d.data.data.items
			for(var i in _d.data.data.items){
				if(_d.data.data.items[i].status == 1){
					_d.data.data.items[i].span = '未就诊'
					_d.data.data.items[i].imgUrl = '../../../../static/门诊端/iOS切图/weijiuzhen@2x.png'
				}else{
					_d.data.data.items[i].span = '已就诊'
					_d.data.data.items[i].imgUrl = '../../../../static/门诊端/iOS切图/yijiuzhen@2x.png'
				}
				// console.log(_d.data.data.items[i].status)
			}
					
		})
		.catch((err)=>{
			console.log(err);
			Dialog({ message: '加载失败!'});
		})
		window.location.href='/#/outpatient_search';
		state.show = false;
		
	},
	// 筛选重置
	screeningResultFn(state){
		// console.log("已重置");
		// for(let _a in state.dateStata.length){
		// 	console.log('ssss')
		// 	// document.getElementById(state.labelDocument[_a]).style.backgroundColor = "#EEEEEE";
		// }
		document.getElementById(state.labelDocument[0]).style.backgroundColor = "#EEEEEE";
		document.getElementById(state.labelDocument[1]).style.backgroundColor = "#EEEEEE";
		document.getElementById(state.labelDocument[2]).style.backgroundColor = "#EEEEEE";
		document.getElementById(state.labelDocument[3]).style.backgroundColor = "#EEEEEE";
		document.getElementById(state.labelDocument[4]).style.backgroundColor = "#EEEEEE";
		document.getElementById(state.labelDocument[5]).style.backgroundColor = "#EEEEEE";
		
		Vue.set(state.Time,'confirmStart',0);
		Vue.set(state.Time,'confirmOver',0);
		Vue.set(state.Time,'pushStart',0);
		Vue.set(state.Time,'pushOver',0);

		console.log(state.Time)
	},
	
	//hospital的个人信息提交
	hospitalSubmitFn(state,_message){
		// console.log(_message)
		console.log(state.account)
		axios.post('/c2/patient/itemadd',qs.stringify({
				clinicId : state.account.data.data.clinic.clinicId,
				hospitalId : state.account.data.data.hospital.hospitalId,
				password : state.account.user.password,
				realname : state.account.user.realname,
				tel	:  state.account.user.tel,
				remark : state.account.user.remark,
				idcardNo : state.account.user.idcardNo
			}))	
			.then( res =>{
				console.log(res);
				console.log(state.account)
				// console.log(res)
				if(res.data.codeMsg){
					Dialog({ message: res.data.codeMsg  });
				}else if(res.data.code == 0){
					//成功
					Dialog({ message: '提交成功' });
				}else{
					//失败
				}
			})
			.catch((err)=>{
				console.log(err)
				Dialog({ message: '加载失败!'});
			})	
	}
}
export default  {
	state,
	mutations,
	actions,
	getters,
}