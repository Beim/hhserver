const CONFIG = {
    'port': 22000,
    'room_id': 221,
    'MSG_DB': 'messages_db.txt',
    'GIFT_DB': 'gift_db.json',
    'MSG_LIST_DB': 'msg_list_db.json',
    'GIFT_ICON_DB': 'gift_icon_db.json',
    'START_TIME_DB': 'start_time_db.txt',
    'def_gift_list': ['辣条', '亿圆', '喵娘', '小电视', 'B坷垃', '自动铅笔', '神之记事本', '666', '233'],
    'idle_time': 1000 * 60 * 60, // 超过闲置时间没有请求则断开socket 服务
}

module.exports = CONFIG