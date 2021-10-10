$(function() {
    //调用获取基本信息
    getUserInfo()

    var layer = layui.layer

    //点击按钮实现退出功能
    $('#btnLogout').on('click',function() {
        //提示用户是否退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            //1.清空本地存储的token
            localStorage.removeItem('token')
            //2.跳转登录页
            location.href = '/login.html'

            //关闭confirm 询问框
            layer.close(index);
          });
    })
})




//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers就是请求头配置对象
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            //调用函数渲染用户头像
            renderAvatar(res.data)
        },
        //不论成功还是失败,都会调用 complete 回调函数
    })
}

//渲染用户头像
function renderAvatar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username
    //2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3.按需渲染用户头像
    if (user.user_pic !== null) {
        //3.1渲染图片头像
        $('.lay-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}

//