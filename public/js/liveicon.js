state = {
    gift_option: {},
    gift_icon: {},
    node: {
        text_wrapper: null,
    }
}

const init_state = async () => {
    state['gift_option'] = await get('/api/get')
    state['gift_icon'] = await get('/api/get/iconid')

    state.node.text_wrapper = document.getElementById('text-wrapper')
    
}

/*
亿圆(3) [4, 233, "玩水"]
小电视
:
(3) [0, 1000, "喵喵喵"]
辣条
:
(3) [367, 666, "心跳"]
*/

const render_text = () => {
    const get_gift_item = (gift_name, gift_count, gift_goal, award) => {
        let span = `
            <img src="https://static.hdslb.com/live-static/live-room/images/gift-section/gift-${state['gift_icon'][gift_name]}.png"  alt="" />
            <span>${gift_name}</span>
            <span>${gift_count}/${gift_goal}</span>
            <span>${award}</span>
        `
        if (gift_count >= gift_goal)
            span += `<span>[已达成]</span>`
        return `
            <div>
                ${span}
            </div>
        `  
    }
    let text = ''
    console.log(111)
    for (let gift_name in state['gift_option']) {
        let value = state['gift_option'][gift_name]
        text += get_gift_item(gift_name, parseInt(value[0]), parseInt(value[1]), value[2])
    }
    state.node.text_wrapper.innerHTML = text
    
}

const render_all = () => {
    render_text()
}


const ready_func = async () => {
    await init_state()
    render_all()

    setInterval(async () => {
        await init_state()
        render_all()
    }, 2000)
    
}
$(() => ready_func())
