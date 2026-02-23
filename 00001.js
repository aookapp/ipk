#!name = 百度地图去广告 (精修版)
#!desc = 1:1 复刻墨鱼 QX 脚本 V1.0.6 逻辑，修正断网问题。
#!author = ddgksf2013 & AI适配
#!tag = 广告拦截
#!date = 2026-02-22

[MITM]
# 严格遵循原脚本 Hostname
hostname = 180.76.76.200, newclient.map.baidu.com, httpdns.baidubce.com, ugc.map.baidu.com

[Rewrite]
# --- 以下对应原脚本 [rewrite_local] 中的 reject-200 部分 ---

# > 搜索框下足记Tips (原脚本默认注释，如需开启请去掉前面的 #)
# ^https?:\/\/newclient\.map\.baidu\.com\/client\/phpui.*qt=rgc reject-200

# > 搜索推广
^https?:\/\/newclient\.map\.baidu\.com\/client\/phpui.*qt=hw reject-200

# > 开屏广告|首页左上角广告
^https?:\/\/newclient\.map\.baidu\.com\/client\/phpui2\/\?qt=ads reject-200

# > 各种商业推广
^https?:\/\/newclient\.map\.baidu\.com\/client\/crossmarketing reject-200

# > 我的页面地图动态
^https?:\/\/newclient\.map\.baidu\.com\/client\/usersystem\/home\/dynamic reject-200

# > TIPS
^https?:\/\/newclient\.map\.baidu\.com\/contributor-bus\/bounty\/tips reject-200

[Script]
# --- 以下对应原脚本中需要修改 JSON Body 的部分 ---

# > 首页底部推荐 & DNS处理 & 我页面 & 周边搜索填词
http-response ^https?:\/\/.*map\.baidu\.com\/.*govui\/rich_content script-path=https://raw.githubusercontent.com/aookapp/ipk/main/BaiduMap_Fixed.plugin, requires-body=true, tag=BDMap_RichContent
http-response ^https?:\/\/httpdns\.baidubce\.com script-path=https://raw.githubusercontent.com/aookapp/ipk/main/BaiduMap_Fixed.plugin, requires-body=true, tag=BDMap_DNS
http-response ^https?:\/\/newclient\.map\.baidu\.com\/usercenter\/mine\/page script-path=https://raw.githubusercontent.com/aookapp/ipk/main/BaiduMap_Fixed.plugin, requires-body=true, tag=BDMap_MinePage
http-response ^https?:\/\/newclient\.map\.baidu\.com\/living\/nearby\/hot-words\? script-path=https://raw.githubusercontent.com/aookapp/ipk/main/BaiduMap_Fixed.plugin, requires-body=true, tag=BDMap_HotWords

/*
[JavaScript Logic]
*/

if (typeof $response !== "undefined") {
    let url = $request.url;
    let obj = JSON.parse($response.body);

    // 1. 首页底部推荐: .data.posts.content=[]
    if (url.includes("rich_content")) {
        if (obj.data && obj.data.posts) obj.data.posts.content = [];
    }

    // 2. DNS处理: .data["newclient.map.baidu.com"]={}
    if (url.includes("httpdns.baidubce.com")) {
        if (obj.data) obj.data["newclient.map.baidu.com"] = {};
    }

    // 3. 我页面: del(.data.sport_card, .data.gold, .data.gold_coin_card, .data.shop)
    if (url.includes("usercenter/mine/page")) {
        if (obj.data) {
            delete obj.data.sport_card;
            delete obj.data.gold;
            delete obj.data.gold_coin_card;
            delete obj.data.shop;
        }
    }

    // 4. 周边搜索填词: .Result.data=[]
    if (url.includes("living/nearby/hot-words")) {
        if (obj.Result) obj.Result.data = [];
    }

    $done({ body: JSON.stringify(obj) });
} else {
    // 容错处理：非响应阶段直接返回，防止流量挂起
    $done({});
}
