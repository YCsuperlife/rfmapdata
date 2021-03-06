var map;
$(document).ready(function(){
        var map = new BMap.Map('map');
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件

        map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
        map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
        function showInfo(e){
        //alert(e.point.lng + ", " + e.point.lat);
        $( "#dialog-form" ).dialog( "open" );
        $("#lat").val(e.point.lat);
        $("#lon").val(e.point.lng);
        }
        map.addEventListener("click", showInfo);

        // 定义一个控件类,即function
        function ZoomControl(){
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
        this.defaultOffset = new BMap.Size(10, 10);
        }

        // 通过JavaScript的prototype属性继承于BMap.Control
        ZoomControl.prototype = new BMap.Control();

        // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
        // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
        ZoomControl.prototype.initialize = function(map){
            // 创建一个DOM元素
            var div = document.createElement("div");
            // 添加文字说明
            div.appendChild(document.createTextNode("添加您的位置标注"));
            // 设置样式
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "white";
            // 绑定事件,点击一次放大两级
            div.onclick = function(e){
                //map.setZoom(map.getZoom() + 2);
                //改变鼠标样式
                map.setDefaultCursor("pointer"); 


            }
            // 添加DOM元素到地图中
            map.getContainer().appendChild(div);
            // 将DOM元素返回
            return div;
        }
        // 创建控件
        var myZoomCtrl = new ZoomControl();
        // 添加到地图当中
        map.addControl(myZoomCtrl);

        //添加刷新类
        // 定义一个控件类,即function
        function RefreshOverlay(){
            // 默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 50);
        }

        // 通过JavaScript的prototype属性继承于BMap.Control
        RefreshOverlay.prototype = new BMap.Control();

        // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
        // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
        RefreshOverlay.prototype.initialize = function(map){
            // 创建一个DOM元素
            var div = document.createElement("div");
            // 添加文字说明
            div.appendChild(document.createTextNode("刷新图层"));
            // 设置样式
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "white";
            // 绑定事件,点击一次放大两级
            div.onclick = function(e){
                //map.setZoom(map.getZoom() + 2);
                //改变鼠标样式
                map.setDefaultCursor("pointer"); 
                refreshdata();

            }
            // 添加DOM元素到地图中
            map.getContainer().appendChild(div);
            // 将DOM元素返回
            return div;
        }
        var myrefreshOverlay = new RefreshOverlay();
        map.addControl(myrefreshOverlay);

        var refreshdata=function()
        {
            map.clearOverlays();
            $.getJSON("/mapdata",function(data){
                    $.each(data,function(k,v) {
                        var pt = new BMap.Point(v["lon"],v["lat"]);
                        var marker= new BMap.Marker(pt);  // 创建标注
                        map.addOverlay(marker);              // 将标注添加到地图中
                        })

                    });

        }


$( "#dialog-form" ).dialog({
            autoOpen: false,
            height: 450,
            width: 350,
            modal: true,
            buttons: {
                "添加": function() {
                    var bValid = true;
                    if ( bValid ) {
                        $( this ).dialog( "close" );
                    }

                $.ajax({
                  type: 'POST',
                  url: "/mapdata",
                  data: {id:$("#id").val(),name:$("#name").val(),dep:$("#dep").val(),lon:$("#lon").val(),lat:$("#lat").val()},
                  success: function  (data) {
                  alert(data);
                  refreshdata();
                  }
                });



                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            },
            close: function() {
            }
        }); 


     //添加默认标注
     refreshdata();

});







