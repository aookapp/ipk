#!name = 百度地图去广告 (深度修复版)
#!desc = 针对百度地图广告回流、QUIC协议绕过进行深度优化，复刻 QX V1.0.6。
#!author = ddgksf2013 & AI适配
#!tag = 广告拦截
#!date = 2026-02-22

[MITM]
# 增加通配符，防止广告接口域名变动
hostname = 180.76.76.200, newclient.map.baidu.com, httpdns.baidubce.com, ugc.map.baidu.com, *.map.baidu.com

[Rule]
# 【关键】屏蔽百度地图的 QUIC 协议，强制其回退到 HTTPS 确保脚本生效
# 这种方式只会影响百度，不会导致其他 App 断网
IP-CIDR, 180.76.76.200/32, REJECT-UDP, no-error-if-not-match
DOMAIN, newclient.map.baidu.com, REJECT-UDP, no-error-if-not-match

[Rewrite]
# --- 静态拦截类 (QX reject-200 复刻) ---
# 搜索框下足记Tips & 搜索推广
^https?:\/\/newclient\.map\.baidu\.com\/client\/phpui.*qt=(rgc|hw) reject-200
# 开屏广告
^https?:\/\/newclient\.map\.baidu\.com\/client\/phpui2\/\?qt=ads reject-200
# 商业推广 & 动态 & 赏金
^https?:\/\/newclient\.map\.baidu\.com\/client\/(crossmarketing|usersystem\/home\/dynamic) reject-200
^https?:\/\/newclient\.map\.baidu\.com\/contributor-bus\/bounty\/tips reject-200

[Script]
# --- 动态修改类 (JS 处理) ---
http-response ^https?:\/\/.*map\.baidu\.com\/.*govui\/rich_content script-path=https://raw.githubusercontent.com/aookapp/ipk/main/BaiduMap_Fixed.plugin, requires-body=true, tag=BDMap_RichContent
http-response ^https?:\/\/httpdns\.baidubce\.com script-path=https://raw.githubusercontent.com/aookapp/ipk/main/BaiduMap_Fixed.plugin, requires-body=true, tag=BDMap_DNS
http-response ^https?:\/\/newclient\.map\.baidu\.com\/usercenter\/mine\/page script-path=https://raw.githubusercontent.com/aookapp/ipk/main/BaiduMap_Fixed.plugin, requires-body=true, tag=BDMap_MinePage
http-response ^https?:\/\/newclient\.map\.baidu\.com\/living\/nearby\/hot-words\? script-path=https://raw.githubusercontent.com/aookapp/ipk/main/BaiduMap_Fixed.plugin, requires-body=true, tag=BDMap_HotWords

/*
[JavaScript Logic]
*/

if (typeof $response !== "undefined") {
    let url = $request.url;
    let body = $response.body;

    if (!body) {
        $done({});
    } else {
        try {
            let obj = JSON.parse(body);

            // 1. 首页推荐
            if (url.includes("rich_content")) {
                if (obj.data?.posts) obj.data.posts.content = [];
            }
            // 2. DNS 处理
            else if (url.includes("httpdns")) {
                if (obj.data) obj.data["newclient.map.baidu.com"] = {};
            }
            // 3. 个人中心精简
            else if (url.includes("mine/page")) {
                if (obj.data) {
                    const keys = ["sport_card", "gold", "gold_coin_card", "shop"];
                    keys.forEach(k => delete obj.data[k]);
                }
            }
            // 4. 搜索热词
            else if (url.includes("hot-words")) {
                if (obj.Result) obj.Result.data = [];
            }

            $done({ body: JSON.stringify(obj) });
        } catch (e) {
            $done({});
        }
    }
} else {
    $done({});
}
