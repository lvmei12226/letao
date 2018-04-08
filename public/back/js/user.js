$(function(){
    //当前页
    var currentPage=1;
    //一页多少条
    var pageSize=5;

    //1.一进入页面，进行渲染
    render();

    function render(){
        //发送请求，获取表格渲染的数据
        $.ajax({
            type:'get',
            url:'/user/queryUser',
            data:{
                pageSize:pageSize,
                page:currentPage
            },
            success:function(info){
                console.log(info);
                $('.lt_content tbody').html(template("tmp",info));

                //配置分页
                $('#paginator').bootstrapPaginator({
                    //指定bootstrap版本,默认2
                    bootstrapMajorVersion:3,
                    //当前页
                    currentPage:info.page,
                    //总页数
                    totalPages:Math.ceil(info.total/info.size),

                    //当页面被点击时触发
                    onPageClicked:function(a,b,c,page){
                       //page  当前点击的页码
                       currentPage=page;
                       //调用render重新渲染页面
                        render();
                    }
                })
            }
        });
    }

    //2.通过事件委托 给按钮注册点击事件
    $('.lt_content tbody').on('click','.btn',function(){
        //弹出模态框,bootstrap方法 .modal('show')
        $('#userModal').modal('show');

        //用户id
        var id=$(this).parent().data("id");
        //获取将来需要将用户设置成什么状态
        var isDelete=$(this).hasClass("btn-success")?1:0;
        console.log(id);
        console.log(isDelete);

        //先解绑，再绑定事件，可以保证只有一个事件绑定在按钮上
        $("#submitBtn").off('click').on('click',function(){
           $.ajax({
               type:'post',
               url:'/user/updateUser',
               data:{
                   id:id,
                   isDelete:isDelete
               },
               success:function(info){
                   console.log(info);
                   if(info.success){
                       //关闭模态框
                       $('#userModal').modal("hide");
                       //重新渲染
                       render();
                   }
               }
           });
        });
    });
});