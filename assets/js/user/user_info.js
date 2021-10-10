$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if(value.length > 6) {
                return '昵称长度必须在1 ~ 6 个字符之间'
            }
        }
    })

    initUserInfo()

    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                //调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    //重置表单数据
    $('#btnReset').on('click',function(e) {
        //阻止表单默认的清空行为
        e.preventDefault()
        //调用函数直接回到当前
        initUserInfo()
    })

    //更新用户信息
    $('.layui-form').on('submit',function(e) {
        //阻止表单的默认行为
        e.preventDefault()
        //发起 ajax 请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                //调用父页面的方法,重新渲染头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })
})