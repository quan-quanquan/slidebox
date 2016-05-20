(function($){
$.fn.slideBox = function(){
    var settings={
        startIndex: 0,
        duration: 0.6,
        delay: 3,
        easing: 'swing'
    }
    //计算相关数据
    var wrapper = $(this), ul = wrapper.children('ul'), lis = ul.children('li'), 
        firstPic = lis.first().find('img');
    var li_width = lis.first().width(), num = lis.size();

    
    //如果没有要滚动的广告，则退出
    if(num<2)
    {
        return false;
    }
    //复制第一个列表项，实现轮番滚动
    lis.first().clone().appendTo(ul);
    num += 1;

    //首张图片加载完毕后执行初始化
    var imgLoader = new Image();
    imgLoader.src = firstPic.attr('src');
    imgLoader.onload = function(){
        imgLoader.onload = null;
        rolling();
    };
    //显示广告索引小图标
    var tips = $('<div class="tips"></div>').appendTo(wrapper);
    lis.each(function(i){
                var li = $(this), a = li.find('a'), text = a.attr('title'), style ='';
                i == settings.startIndex && (style = 'active');//初始化时显示第一张广告
                $('<span>').text(text).addClass(style).appendTo(tips);
    });
    var spans = wrapper.find('.tips').children('span');
    //新的列表项集合
    var new_lis = ul.children('li');

    var changeClass = function(object){
        object.addClass('active').siblings().removeClass('active');
    };

    //各种滚
    var rolling = function(){
        wrapper.data('over',0);

        $('span').mouseover(function(){
            wrapper.data('over',1);
            var self = $(this), index = spans.index(self);
            changeClass(new_lis.eq(index));
            skipToActive();//跳转到有active类的广告项
            changeClass(spans.eq(index));
        });

        //滚动广告
        startScrolling();

        //绑定按钮事件
        clickBtn();

        //鼠标经过事件
        wrapper.hover(function(){
            wrapper.data('over',1);
            stopScrolling();
        },function(){
            wrapper.data('over',0);
            startScrolling();
        });

    };

    var startScrolling = function(){
            var active = ul.find('li.active'), index = new_lis.index(active);
            param ={'left':index*li_width*-1 + 'px'};
            ul.stop().animate(param,settings.duration*1000,settings.easing,function(){
                if(index == num-1){
                    ul.css({top:0,left:0});
                    changeClass(new_lis.eq(1));
                    changeClass(spans.eq(0));
                }else{
                    changeClass(active.next());
                    changeClass(spans.eq(index));

                }
            });
            
            wrapper.data('over')==0 && wrapper.data('timeid',window.setTimeout(startScrolling,settings.delay*1000));   
    };

    var stopScrolling = function(){
            window.clearTimeout(wrapper.data('timeid'));
    };

    var clickBtn = function(){
            var prevBtn = wrapper.find('.prev'), nextBtn = wrapper.find('.next');
                wrapper.hover(function(){
                wrapper.data('over',1);
                prevBtn.addClass('hover');
                nextBtn.addClass('hover');
            },function(){
                wrapper.data('over',0);
                prevBtn.removeClass('hover');
                nextBtn.removeClass('hover');
            });
            prevBtn.click(function(){
                var active = ul.find('li.active'),index = new_lis.index(active);
                if(index == 1){
                    index = num-2;
                    ul.css({'left':index*li_width*-1});
                    changeClass(spans.eq(index));
                    changeClass(new_lis.eq(index+1));
                }else{
                    changeClass(new_lis.eq(index-2));
                    skipToActive();
                    changeClass(spans.eq(index-2));
                    changeClass(new_lis.eq(index-1));

                }
            });
            nextBtn.click(function(){
                var active = ul.find('li.active'),index = new_lis.index(active);
                if(index == num-1){
                    index = 0;
                    ul.css({'left':0});
                    changeClass(spans.eq(index));
                    changeClass(new_lis.eq(1));
                }else{
                    skipToActive();
                    changeClass(spans.eq(index));
                    changeClass(new_lis.eq(index+1));                    
                }
            });
    };

    var skipToActive = function(){
        var active = ul.find('li.active'), index = new_lis.index(active);
        param ={'left':index*li_width*-1 + 'px'}; 
        ul.stop().animate(param,100,settings.easing);

    };
};
})(jQuery);