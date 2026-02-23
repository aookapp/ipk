/*
百度地图去广告 - Loon 整合脚本
兼容原 QuantumultX jq 逻辑
*/

if (!$response.body) $done({});

let url = $request.url;
let obj = JSON.parse($response.body);

// 1. 首页底部推荐 (rich_content)
if (url.includes("rich_content")) {
    if (obj.data && obj.data.posts) {
        obj.data.posts.content = [];
    }
}

// 2. DNS 处理 (httpdns)
if (url.includes("httpdns.baidubce.com")) {
    if (obj.data) {
        obj.data["newclient.map.baidu.com"] = {};
    }
}

// 3. 个人中心页面 (mine/page)
if (url.includes("usercenter/mine/page")) {
    if (obj.data) {
        delete obj.data.sport_card;
        delete obj.data.gold;
        delete obj.data.gold_coin_card;
        delete obj.data.shop;
    }
}

// 4. 周边搜索填词 (hot-words)
if (url.includes("living/nearby/hot-words")) {
    if (obj.Result) {
        obj.Result.data = [];
    }
}

$done({ body: JSON.stringify(obj) });