$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + 'mm' + ':' + 'ss' 
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象,将来请求数据的时候,需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值,默认请求第一页的数据
        pagesize: 2 ,//每页显示几条数据,默认两条
        cate_id: '',//文章分类的id
        state: '',//文章的发布状态
    }

    initTable()
    initCate()

    //获取文章数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取分类数据失败!')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                //通过layui重新渲染页面结构
                form.render()
            }
        })
    }

    //为筛选表单 绑定 submit 事件
    $('#form-search').on('submit',function(e) {
        e.preventDefault()
        //获取表单中选择项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件,重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用 laypage.render() 方法来渲染分页
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            limits: [2,3,4,5,10],
            curr: q.pagenum, //默认选中哪一页
            //自定义
            layout: ['count','limit','prev','page','next','skip'],
            //分页发生切换时触发
            //触发 jump 回调函数的方法有两种
            //1.点击页码的时候,会触发 jump 回调
            //2.只要调用 laypage.render 就会一直调用
            jump: function(obj,first) {
                //把最新的页码值,赋值到 q 的参数里面
                q.pagenum = obj.curr
                //把最新的条目数赋值到 q 的参数里面
                q.pagesize = obj.limit
                //根据最新 q 获取最新数据,并渲染列表
                //initTable()
                if (!first) {
                    initTable()
                }
            }
          });
    }

    //通过代理的形式,为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function() {
        var len = $('.btn-delete').length
        //获取文章的 id
        var id = $(this).attr('data-id')
        //询问是否删除数据
        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //当数据删除完成后,需要判断当前页面是否还有剩余的数据
                    //如果没有剩余的数据,则让页码值 -1 之后,再重新调用 initTable方法
                    if(len === 1) {
                        //如果 len 的值等于1,证明删除完成后没有数据了
                        //页码值最小只能是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})