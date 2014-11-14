/*
 * jQuery.minPicsScroll  v0.0.1
 * Copyright (c) 2014-11-14 13:32 Jensen
 * 功能：多图片切换展示
 * 修复：
 */

var ie  = $.browser.msie;
var ie6 = $.browser.msie && $.browser.version < 7;

$(function(){

    /* 图片轮换效果一无限左右移动切换(无线循环) ,右下角同步数字显示张数并左右翻页*/
    picsPageScrolling = function(options){
        var opts = $.extend({
            scrollId: options.scrollId,   //滑动字体父节点
            scrollSmallId: options.scrollSmallId,   //滑动字体下面父节点
            lMoveId: options.lMoveId,    //左边切换按钮
            rMoveId: options.rMoveId,    //右边切换按钮
            autoPlay: options.autoPlay || true,    //是否自动播放
            speed: options.speed || 3,   //播放速度/秒
            contBomLeft: options.contBomLeft,      //右下角向左节点
            contBomRight: options.contBomRight,      //右下角向右节点
            showNumberId: options.showNumberId      //分页的数字显示
        },options)
        var len = $(opts.scrollId+' li').length;
        if(len < 2){
            $(opts.contBomLeft+','+ opts.contBomRight).hide();
            return false;
        }
        var wid = $(opts.scrollId+' li').width();
        $(opts.scrollId).css('width',wid*len+100);    //设置滚动大图的长度
        var minWid = $(opts.scrollSmallId+' li').width() + 11;
        $(opts.scrollSmallId+' li').eq(0).addClass('select');
        //console.log(minWid);
        var _scrollTimeObj;
        var s = 0;     //记录自动播放时的页数
        var midnum = 3;    //下面图片的中间值
        var midAll = 5;    //下面图片显示的张数
        var mts = 1;
        var mls = 1;
        var mr = len - midAll + 1;

        $('.venue-pics-pcb').hover(function() {
            $(opts.lMoveId+','+opts.rMoveId).show();
        }, function() {
            $(opts.lMoveId+','+opts.rMoveId).hide();
        });

        //键盘向右点击
        // $(document).keydown(function(e){
        // var e = e || event;
        // if(e.keyCode == 39){
        // $(opts.contBomRight).trigger('click');
        // }
        // if(e.keyCode == 37){
        // $(opts.contBomLeft).trigger('click');
        // }
        // })

        // $(document).keyup(function(e){
        // var e = e || event;
        // if(e.keyCode == 39){
        // play();
        // }
        // if(e.keyCode == 37){
        // play();
        // }
        // })


        $(opts.scrollId+' li').each(function(i){
            $(this).attr('rel',i);
        });

        $(opts.scrollSmallId+' li').each(function(i){
            $(this).attr('rel',i);
        });

        var scrollIdUiHtml = $(opts.scrollId).html();

        //点击小图对应显示大图
        $(opts.scrollSmallId+' li').click(function(i){
            var _rel = parseInt($(this).attr('rel'));
            $(opts.scrollId).html('').append(scrollIdUiHtml);
            $(opts.scrollId).animate({'marginLeft':-wid*_rel+'px'},opts.speed*100);
            s = _rel;
            showNum(_rel);
            //var n = Math.abs(_rel-s-1);
            //pageTo(n);
            //$(opts.scrollId+' li').hide().eq(_rel).show();
        });

        //左边按钮效果,左下角左边按钮效果
        $(opts.lMoveId+','+opts.contBomLeft).bind('click', function(){
            if($(opts.scrollSmallId).is(":animated")==false){
                //开始未滚动前向左点击，下面图片移动位置修改
                var trues1 = $(opts.scrollSmallId +' li:first').attr('class') == 'select';
                if(trues1){
                    return false;
                    $(opts.scrollSmallId).css({'marginLeft':-minWid*mr+'px'});
                    $(opts.contBomLeft).addClass('venue-pics-left1');
                }
                pageTo(-1);    //上面大图移动
                var leftLen = parseInt($(opts.scrollSmallId).css('marginLeft').replace('px',''));
                //if(leftLen < 0){
                //$(opts.scrollSmallId).animate({'marginLeft':leftLen+minWid+'px'},opts.speed*100);
                //}
                //向右点击到头再向左点击后，再往右点击修复移动
                var trues2 = $(opts.scrollSmallId +' li').eq(midAll-1).attr('class') == 'select';
                if(trues2){
                    mts = 1;
                }
                var trues3 = $(opts.scrollSmallId +' li').eq(1).attr('class') == 'select';
                if(trues3){
                    $(opts.scrollSmallId).css({'marginLeft':'0px'});
                }
            }
        });

        //右边按钮效果,右下角右边按钮效果
        $(opts.rMoveId+','+opts.contBomRight).bind('click',function(){
            pageTo(1);
        })

        var pageTo = function(n){    //分页自动切换样式显示
            $(opts.scrollId+' li').show();
            if($(opts.scrollId).is(":animated")==false){
                s += n;
                if(s != -1 && s != len){    //向右滑动
                    $(opts.scrollId).animate({'marginLeft':-wid*s+'px'},opts.speed*100);
                    //console.log(s);
                    var rel = $(opts.scrollId+' li').eq(s).attr('rel');
                    showNum(rel);
                }else if(s == -1){   //向左滑动
                    s = len-1;
                    for(var i=len-1;i>0;i--){
                        $(opts.scrollId+' li:last').prependTo($(opts.scrollId));
                    }
                    $(opts.scrollId).css({'marginLeft':-wid*s+'px'});
                    $(opts.scrollId).animate({'marginLeft':-wid*(s-1)+'px'},opts.speed*100);
                    s = len-1-1;
                    var rel = $(opts.scrollId+' li').eq(s).attr('rel');
                    showNum(rel);
                }else if(s == len){    //向左滑动到最大值时转变
                    s = 1;    //修复s的值
                    $(opts.scrollId).css({'marginLeft':0+'px'});    //将列表图片滑动到初始位置
                    for(var i=len-1;i>0;i--){    //将列表图片位置按图片rel切换0 1 2 3 （3为当前显示的图片） ==>3 0 1 2 （3为当前显示的图片）
                        $(opts.scrollId).append($(opts.scrollId+' li:first'));
                    }
                    $(opts.scrollId).animate({'marginLeft':-wid+'px'},opts.speed*100);
                    var rel = $(opts.scrollId+' li').eq(s).attr('rel');
                    showNum(rel);
                }
            }
            var trues = $(opts.scrollSmallId +' li:last').attr('class') == 'select';
            var trues1 = $(opts.scrollSmallId +' li:first').attr('class') == 'select';
            if(trues){
                $(opts.contBomRight).addClass('venue-pics-right1');
            }else if(!trues1){
                $(opts.contBomLeft).addClass('venue-pics-left1');
                $(opts.contBomRight).removeClass('venue-pics-right1');
            }
        }
        var showNum = function(j){
            var showNub = parseInt(j) + 1;
            //console.log(showNub);
            $(opts.showNumberId).html(showNub);
            $(opts.scrollSmallId+' li').removeClass().eq(j).addClass('select');
            if(parseInt(j) + 1 > midnum && mts < mr){
                $(opts.scrollSmallId).animate({'marginLeft':-minWid*mts+'px'},opts.speed*100);
                mts++;
            }else if(showNub == 1){
                $(opts.scrollSmallId).css({'marginLeft':'0px'});
                $(opts.contBomRight).removeClass('venue-pics-right1');
                $(opts.contBomLeft).removeClass('venue-pics-left1');
                mts = 1;
            }
        }
        var play = function(){    //播放
            _scrollTimeObj = setInterval(function(){
                pageTo(1)
            },opts.speed*1000)
        };
        var stop = function(){    //停止
            clearInterval(_scrollTimeObj)
        }
        if(opts.autoPlay && len > 1){play()};  //是否自动播放

        $(
                opts.scrollSmallId+','+
                opts.lMoveId+','+		//大图左侧按钮鼠标划入停止滚动，移开继续移动
                opts.rMoveId+','+		//大图右侧按钮
                opts.contBomLeft+','+	//小图左侧按钮
                opts.contBomRight+','+	//小图右侧按钮
                opts.scrollId+' li'		//大图里面的图片
        ).bind('mouseover',function(){stop()})
            .bind('mouseout',function(){play()});
    }
})