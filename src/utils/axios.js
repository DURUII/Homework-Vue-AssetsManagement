import axios from 'axios'; //引入axios
//下面的两个不一定要引入，看项目在拦截时需要做什么操作，一般都是需要引入store的，因为可以拿到用户的登录信息
import store from '@/store/store'; //引入store
import router from '@/router'; //引入router
import {
    Message,
    Loading,
    Notification
} from 'element-ui'

axios.defaults.withCredentials = true; //让ajax携带cookie

let instance = axios.create({
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

let loadId = null;

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // console.log("token:"+store.getters.getToken)
    // 在发送请求之前做些什么
    if (store.getters.getToken) {
        config.headers["token"] = store.getters.getToken
    }
    // 请求网络，打开loading
    loadId = Loading.service({
        fullscreen: true
    })

    return config;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {

    loadId.close();
    //如果接口返回token，替换本地旧token
    if (response.headers.token) {
        sessionStorage.setItem("token", response.headers.token);
    }
    if (response.data.code == 403) { // 未登录或登录超时  
        Message.error({
            message: '没有权限对此操作！',
            duration: 2000,
            offset: 100
        });
        // return Promise.reject(new Error('登录超时'));
    }
    //自定义设置后台返回code对应的响应方式
    else if (response.data.code == 408) { // 未登录或登录超时  
        Notification.error({
            message: '连接超时，请联系管理员',
            duration: 2000,
            offset: 100
        });
        router.push({
            path: '/login'
        });
        // return Promise.reject(new Error('登录超时'));
    }
    //自定义设置后台返回code对应的响应方式
    else if (response.data.code == 401) { // 未登录或登录超时  
        Message.error({
            message: '未登陆或登陆以超时',
            duration: 2000,
            offset: 100
        });
        router.push({
            path: '/login'
        });
        // return Promise.reject(new Error('登录超时'));
    } else { //接口正常，返回数据
        return response;
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance