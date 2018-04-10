$(function(){
    //当前页
    var currentPage=1;
    // 每页多少条
    var pageSize=5;

    //1.一进入页面进行渲染
    render();
    function render(){
        $.ajax({
            url:'/category/querySecondCategoryPaging',
            type:'get',
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(info){
                console.log(info);
                $(".lt_content tbody").html(template("secondTmp",info));

                // 进行分页初始化
                $('#paginator').bootstrapPaginator({
                   //配置bootstrap版本,默认版本2
                   bootstrapMajorVersion:3,
                   //当前页
                   currentPage:info.page,
                   //总页数
                   totalPage:Math.ceil(info.total/info.size),
                   // 注册每个页码的点击事件
                    onPageClicked:function(a,b,c,page){
                       //重新渲染页面
                        currentPage=page;
                        render();
                    }
                })
            }
        });
    };

    //2.点击添加分类按钮，显示添加模态框
    $('#addBtn').click(function(){
        //bootstrap 模态框中提供的方法modal('show')
        $('#addModal').modal('show');

        //请求一级分类名称，渲染下拉菜单
        $.ajax({
            url:'/category/queryTopCategoryPaging',
            type:'get',
            //让它全部显示在下拉菜单中
            data:{

                page:1,
                pageSize:100
            },
            success:function(info){
                console.log(info);
                //将模板和数据相结合，渲染到下拉菜单中
                $('.dropdown-menu').html(template("dropdownTmp"),info);
            }
        });
    });

    //3.通过注册委托事件，给A添加点击事件
    $('.dropdown-menu').on('click','a',function(){
        //选中的文本
        var txt=$(this).text();
        var id=$(this).data("id");

        //修改文本内容
        $('dropdownText').text(txt);

        //将选中的id设置到input表单元素中
        $('[name="categoryId"]').val(id);

        // 需要将校验状态置成 VALID
        // 参数1: 字段
        // 参数2: 校验状态
        // 参数3: 配置规则, 来配置我们的提示文本

        $('#form').data("bootstrapValidator").updateStatus("categoryId","VALID");
    });

    // 4. 配置图片上传
        $('#fileupload').fileupload({
            // 指定数据类型为 json
            dataType:'json',
            // done, 当图片上传完成, 响应回来时调用
            done:function(e,data){
                console.log(data);
                // 获取上传成功的图片地址
                var picAddr=data.result.picAddr;
                /*result
                    :{picAddr: "/upload/brand/3e907710-3b8e-11e8-b151-2ffdf4b2a164.jpg"}*/

                //设置图片地址
                $('#imgBox img').attr("src",picAddr);

                //将图片地址存在隐藏域中
                $('[name="brandLogo"]').val(picAddr);

                //重置校验状态
                $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID");
            }
        });

        //5.配置表单校验
    $('#form').bootstrapValidator({
        //将默认的排除项  重置掉（默认会对：hidden,:disabled等进行排除）
        excluded:[],

        //配置图标
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //检验的字段
        fields:{
            //品牌名称（查看接口文档中的参数）
            brandName:{
                //检验规则
                validators:{
                    notEmpty:{
                        message:"请输入二级分类名称"
                    }
                }
            },
            //categoryId 一级分类id
            categoryId:{
                //检验规则
                validators:{
                    notEmpty:{
                        message:"请选择一级分类"
                    }
                }
            },

            //brandLogo 图片的地址
            brandLogo:{
                //检验规则
                validators:{
                    notEmpty:{
                        message:"请上传图片"
                    }
                }
            }
        }
    });

//6.注册校验成功事件，通过ajax进行添加
    $('#form').on('success.form.bv',function(e){
        //阻止默认的提交
        e.preventDefault();

        $.ajax({
            url:'/category/addSecondCategory',
            type:'post',
            data:$('#form').serialize(),
            success:function(info){
                console.log(info);

                //关闭模态框
                $('#addModal').modal('hide');
                //重置表单里面的内容和校验状态
                $('#form').data('bootstrapValidator').resetForm(true);

                //重新渲染第一页
                currentPage=1;
                render();

                // 找到下拉菜单文本重置
                $('#dropdownText').text('请选择1级分类');

                // 找到图片重置
                $('#imgBox img').attr('src','images/none.png');
            }
        });
    })
});