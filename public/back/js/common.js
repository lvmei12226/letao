//配置禁用小圆环
NProgress.configure({showSpinner:false});

//开启进度条
//NProgress.start();

//setTimeout(function(){
//关闭进度条
// NProgress.done();
// },500);


//ajaxStart  所有的ajax开始调用
$(document).ajaxStart(function(){
    //开启进度条
    NProgress.start();
});

//ajaxStop 所有ajax结束调用
$(document).ajaxStop(function(){
    // 模拟网络延迟
    setTimeout(function(){
        NProgress.done();
    },500);
});