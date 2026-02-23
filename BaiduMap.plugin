/*
百度地图去广告 - Loon 增强适配版
*/

const url = $request.url;

// --- 1. 模拟 QX 的 reject-200 逻辑 ---
// 这些 URL 需要直接返回空数据，且状态码必须是 200
const needReject200 = [
    "qt=rgc", 
    "qt=hw", 
    "qt=ads", 
    "crossmarketing", 
    "home/dynamic", 
    "bounty/tips"
];

if (needReject200.some(path => url.includes(path))) {
    $done({ status: 200, body: "{}" });
}

// --- 2. 修改 JSON 响应逻辑 ---
if (!$response || !$response.body) $done({});

let obj;
try {
    obj = JSON.parse($response.body);
} catch (e) {
    $done({});
}

// 首页底部推荐
if (url.includes("rich_content")) {
    if (obj.data?.posts) obj.data.posts.content = [];
}

// DNS 处理
if (url.includes("httpdns.baidubce.com")) {
    if (obj.data) obj.data["newclient.map.baidu.com"] = {};
}

// 个人中心页面
if (url.includes("usercenter/mine/page")) {
    if (obj.data) {
        delete obj.data.sport_card;
        delete obj.data.gold;
        delete obj.data.gold_coin_card;
        delete obj.data.shop;
    }
}

// 周边搜索填词
if (url.includes("living/nearby/hot-words")) {
    if (obj.Result) obj.Result.data = [];
}

$done({ body: JSON.stringify(obj) });
