const solutionBgList = [
    'linear-gradient(360deg, #8293AD 0%, rgba(130, 148, 174, 0.92) 58.33%, rgba(130, 148, 174, 0) 100%)',
    'linear-gradient(360deg, #AD9982 0%, rgba(174, 154, 130, 0.8) 58.33%, rgba(174, 154, 130, 0) 100%)',
    'linear-gradient(360deg, #598897 0%, rgba(90, 137, 151, 0.8) 58.33%, rgba(90, 136, 151, 0) 100%)',
];
const solutions = [{
        baseUrl: "./public/appnew/1.png",
        imgsAndBgcolor: [{
                src: "./public/appnew/1.png",
                bgColor: solutionBgList[1],
            },
            {
                src: "./public/appnew/2.png",
                bgColor: solutionBgList[2],
            },
            {
                src: "./public/appnew/3.png",
                bgColor: solutionBgList[0],
            },
            {
                src: "./public/appnew/4.png",
                bgColor: solutionBgList[0],
            },
        ],
        title: "应用",
        listText: [
            "获客测试",
            "素材测试",
            "创意形式",
            "热点研究"
        ],

    },
    {
        baseUrl: "./public/gamenew/1.png",
        imgsAndBgcolor: [{
                src: "./public/gamenew/1.png",
                bgColor: solutionBgList[2],
            },
            {
                src: "./public/gamenew/2.png",
                bgColor: solutionBgList[0],
            },
            {
                src: "./public/gamenew/3.png",
                bgColor: solutionBgList[1],
            },
            {
                src: "./public/gamenew/4.png",
                bgColor: solutionBgList[1],
            },
        ],
        title: "游戏",
        listText: [
            "各国游戏玩家偏好",
            "游戏创意方向优化",
            "不同受众定位预算分配",
            "素材相关度把控"
        ]

    },
    {
        baseUrl: "./public/ecommerce/1.png",
        imgsAndBgcolor: [{
                src: "./public/ecommerce/1.png",
                bgColor: solutionBgList[0],
            },
            {
                src: "./public/ecommerce/2.png",
                bgColor: solutionBgList[1],
            },
            {
                src: "./public/ecommerce/3.png",
                bgColor: solutionBgList[0],
            },
            {
                src: "./public/ecommerce/4.png",
                bgColor: solutionBgList[0],
            },
        ],
        title: "电商",
        listText: [
            "平台优化",
            "素材优化",
            "创意优化",
            "选品优化"
        ]

    }
]


let handler = {
    get(target, key) { //target就是obj key就是要取obj里面的哪个属性
        return Reflect.get(target, key)
    },
    set(target, key, value) {
        Reflect.set(target, key, value)
    }
}
let currentItemInfo = new Proxy({
    //每个node的li索引值
    list: [-1, -1, -1],
    //上一个node的索引值
    nodeIndex: 1,
    //li元素具有active的的index
    liActiveIndex: 0
}, handler)

//定义HTML模板字符串的函数
function addHtmlTemplate(solutionParm) {
    let htmlStr = '';
    solutionParm.forEach((item) => {
        let listTextAll = "";
        item.listText.forEach(text => {
            listTextAll += `
                <li class="solution-card__item-menu__list-item">
                        <a>${text}</a>
                </li>
                `
        })
        const htmlTemplate = `
            <div class="solution-card__item" data-custom="self" style="background-image: url(${item.baseUrl});"> 
            <div class="solution-card__item-menu">
                <div class="solution-card__item-menu__text">
                    ${item.title}
                </div>
                <ul class="solution-card__item-menu__list" >
                    ${listTextAll}                      
                </ul>
    
            </div>
        </div>
            `
        htmlStr += htmlTemplate;
    })
    return htmlStr
}
//定义计时器管理图片函数
function timesImg(node, indexNode, currentIndex = 0) {
    let index = 0; //循环播放图片的索引，默认从第一个开始
    //获取ul
    let ulCurrentNode = node.children[0].children[1];

    node.className += " active";
    //让动画每次开始都是从上次停止时的索引开始
    if (currentIndex !== -1) {
        index = currentIndex;
    }

    //定时器开始
    let timesInner = setInterval(function () {
        //更新背景图
        node.style.backgroundImage = `url(${solutions[indexNode].imgsAndBgcolor[index].src})`;
        //更新背景色
        node.children[0].style.background = `${solutions[indexNode].imgsAndBgcolor[index].bgColor}`
        //更新文字类，给textList动态添加类
        if (timesInner) {
            if (index === 0) {
                ulCurrentNode.children[solutions[indexNode].listText.length - 1].className = "solution-card__item-menu__list-item"
                ulCurrentNode.children[index].className = "solution-card__item-menu__list-item active";
                currentItemInfo.liActiveIndex = index;
            } else {
                ulCurrentNode.children[index - 1].className = "solution-card__item-menu__list-item"
                ulCurrentNode.children[index].className = "solution-card__item-menu__list-item active";
                currentItemInfo.liActiveIndex = index;
            }
        }
        //更新currentIndex
        currentItemInfo.list[indexNode] = index;
        index += 1; //找下一张图片
        if (index === solutions[indexNode].imgsAndBgcolor.length) { //如果到了图片最后，赋值1，重新开始
            index = 0;
        }

    }, 1000);
    //返回定时器ID
    return timesInner
}

//定义图片轮播的函数
function showLunbo(bcArray) {

    //定义三个item的setInterval的ID值
    let timeIDs = [];

    //默认中间
    let defaultTime = timesImg(bcArray[1], 1);
    timeIDs.push(defaultTime)
    let times = null; //定时器的ID值

    //定义li的定时器ID
    let litimes;
    bcArray.forEach((node, indexNode) => {
        //保存当前动画进行到的索引位置;
        node.onmouseenter = () => {
            //只要触发了任意一个omousemove就去掉默认
            if (defaultTime) {
                //先清除默认的node
                clearInterval(defaultTime)
                defaultTime = null;
                //然后清除对应的class
                bcArray[1].className = node.className.replace("active", '');
                //去除timeIDs中的默认
                timeIDs.shift()
            }

            //实现循环放映，如果未进行循环，进入条件
            if (!times) {
                times = timesImg(node, indexNode, currentItemInfo.list[indexNode]);
                timeIDs.push(times);
                if (timeIDs.length > 1) { //防止同一个node重复添加times
                    let pretimes = timeIDs.shift();
                    clearInterval(pretimes);
                }

            }
            //如果是移动到了别的Item上,
            if (currentItemInfo.nodeIndex != indexNode) {
                //去除上一个node的样式
                bcArray[currentItemInfo.nodeIndex].className = "solution-card__item ";
                //去除上一个的li的样式
                bcArray[currentItemInfo.nodeIndex].children[0].children[1].children[currentItemInfo.liActiveIndex].className = "solution-card__item-menu__list-item";
                currentItemInfo.list[indexNode] = currentItemInfo.liActiveIndex;
                clearInterval(litimes);
                litimes = null;

            }
            currentItemInfo.nodeIndex = indexNode;
            //给每个li添加mousemove事件

            Array.from(node.children[0].children[1].children).forEach((liItem, liIndex) => {
                liItem.style.cursor = "pointer";
                liItem.onmouseenter = () => {
                    //去除上一个li的active类
                    liItem.parentNode.children[currentItemInfo.list[indexNode]].className = "solution-card__item-menu__list-item";
                    //更新背景图
                    node.style.backgroundImage = `url(${solutions[indexNode].imgsAndBgcolor[liIndex].src})`;
                    //更新背景色
                    node.children[0].style.background = `${solutions[indexNode].imgsAndBgcolor[liIndex].bgColor}`

                    currentItemInfo.liActiveIndex = liIndex;

                    liItem.className = "solution-card__item-menu__list-item active";
                    currentItemInfo.list[indexNode] = liIndex;
                    if (times) {
                        clearInterval(times);
                        times = null;
                    }
                    if (litimes) {
                        clearInterval(litimes);
                        litimes = null;
                    }

                    litimes = timesImg(node, indexNode, currentItemInfo.list[indexNode]);
                }
            })

        }
        //鼠标移开时重置本Node的times
        node.onmouseleave = () => {
            times = null;
        }
    })
}
window.onload = () => {
    const cardRoot = document.getElementById("card")
    cardRoot.innerHTML = addHtmlTemplate(solutions);
    const bcArray = document.querySelectorAll("div[data-custom]")
    //展示轮播图
    showLunbo(bcArray)

}