$(function() {
    //点击去注册账号的链接
    $('#link_reg').on('click',function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click',function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    //从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    //通过 form.verify() 函数自定义校验规则
    form.verify({
        //自定义了一个叫 pwd 校验规则
        pwd: [/^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'],
        //效验两次密码是否一致的规则
        repwd: function (value) {
            //通过形参拿到确认密码框的内容
            //拿到密码框的内容
            //进行比较
            //如果判断失败,则return一个提示消息
            var pwd = $('.reg-box [name=password]').val();
            if(pwd !== value) {
                return '两次密码不一致'
            }
        }
    })


    //监听注册表单的提交事件
    $('#form_reg').on('submit',function(e) {
        //阻止默认提交的行为
        e.preventDefault()
        //发起Ajax请求
        var data = {username:$('#form_reg [name=username]').val(),password: $('#form_reg [name=password]').val()}
        $.post('/api/reguser',data,function(res) {
            //用layui的弹出层提示
            if(res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录!');
            //模拟点击
            $('#link_login').click()
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败!')
                }
                layer.msg('登陆成功!')
                //将登陆成功的 token 字符串,保存到localStorage中
                localStorage.setItem('token',res.token)
                //跳转到后台
                location.href = '/index.html'
            }
        })

    })
})