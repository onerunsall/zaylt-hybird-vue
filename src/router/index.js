import Vue from 'vue'
import Router from 'vue-router'
//登陆页面及其忘记密码
import landingPage from '@/components/landingPage.vue'
import retrievePassword from '@/components/retrievePassword.vue'
//门诊端页面及其组件
import outpatient_index from '@/components/outpatient/index.vue'
import outpatient_hospital from '@/components/outpatient/hospital.vue'
import outpatient_gene from '@/components/outpatient/gene.vue'
import outpatient_user from '@/components/outpatient/user.vue'
import outpatient_search from '@/components/outpatient/index/index_search.vue'
import outpatient_details from '@/components/outpatient/childPage/detailsPage.vue'
//医院端页面及其组件
import hospital_index from '@/components/hospital/index.vue'
import hospital_clinic from '@/components/hospital/clinic.vue'
import hospital_gene from '@/components/hospital/gene.vue'
import hospital_user from '@/components/hospital/user.vue'
import hospital_searchClinic from '@/components/hospital/childPage/search_clinic.vue'
//功能副插件

import store from '../store'
Vue.use(Router)

const router = new Router({
	// mode: 'history',
	routes: [
		{
			// 医院端主页
			path: '/hospital_index',
			name: 'hospital_index',
			component: hospital_index,
			// meta: {auth:true},
			
		},
		{
			// 医院端门诊主页
			path: '/hospital_clinic',
			name: 'hospital_clinic',
			component: hospital_clinic,
			// meta: {auth:true},
			
		},
		{
			// 医院端基因主页
			path: '/hospital_gene',
			name: 'hospital_gene',
			component: hospital_gene,
			// meta: {auth:true},
			
		},
		{
			// 医院端基因主页
			path: '/hospital_user',
			name: 'hospital_user',
			component: hospital_user,
			// meta: {auth:true},
			
		},
		{
			// 医院端门诊搜索页面
			path: '/hospital_searchClinic',
			name: 'hospital_searchClinic',
			component: hospital_searchClinic,
			// meta: {auth:true},
			
		},
		{
			// 门诊端主页
			path: '/outpatient_index',
			name: 'outpatient_index',
			component: outpatient_index,
			meta: {auth:true},
			
		},
		{
			// 门诊端的主页搜索
			path: '/outpatient_search',
			name: 'outpatient_search',
			component: outpatient_search,
			meta: {auth:true},
		},
		{
			// 门诊端的主页病人详情页
			path: '/outpatient_details',
			name: 'outpatient_details',
			component: outpatient_details,
			meta: {auth:true},
		},
		{
			//门诊端的医院主页
			path: '/outpatient_hospital',
			name: 'outpatient_hospital',
			meta: {auth:true},
			component: outpatient_hospital,
		},
		{
			//门诊端的基因主页
			path: '/outpatient_gene',
			name: 'outpatient_gene',
			meta: {auth:true},
			component: outpatient_gene,
		},
		{
			//用户主页
			path: '/outpatient_user',
			name: 'outpatient_user',
			meta: {auth:true},
			component: outpatient_user,
		},
		{
			// 登陆主页
			path: '/',
			name: 'landingPage',
			component: landingPage,
			alias:'/landingPage'
		},
		{
			//找回密码页面
			path: '/retrievePassword',
			name: 'retrievePassword',
			meta: {auth:true},
			component: retrievePassword,
		},
	],
})

router.beforeEach((to,from,next) => {
	// console.log(to)
	// console.log(to)
	// console.log(next)
	if(to.meta){
		if(to.meta.auth){
			// console.log(store.state.shop.account.isLogin)
			switch(store.state.shop.account.isLogin){
				case 100: 
				// console.log('暂未开放中');
				next({path : '/landingPage'});
				break;
				
				case 200: 
				next();
				break;
				
				case 300:
				// console.log('暂未开放中');
				next({path : '/landingPage'});
				break;
				
				default:next({path : '/landingPage'});
			}
		}else{
			next();
		}
	}else{
		next();
	}
	//识别路径初始化下body的背景色
	if(to.path == "/outpatient_user" || to.path == "/outpatient_index" || to.path == '/outpatient_search'
	 || to.path == '/outpatient_gene' ||to.path == "/outpatient_details" || to.path == '/hospital_clinic' 
	 || to.path == '/hospital_gene' || to.path == '/hospital_user'){
		document.getElementsByTagName("body")[0].style.backgroundColor = "#F5F5F5"
	}else{
		document.getElementsByTagName("body")[0].style.backgroundColor = "#FFFFFF"
	}
})
export default router
