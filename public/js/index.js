const state = {
    table_option: {}, // 渲染表格的参数，即礼物和数量
    run_status: false, // 运行状态
    gift_list: [], // 可供选择的礼物列表
    node: {
        gift_tbody: null,
        start_action_btn: null,
        new_gift_dropdown_menu_btn: null,
        new_gift_dropdown_menu_ul: null,
        // new_gift_goal_input: null,
        modify_gift_modal_jqnode: null,
        modify_gift_goal_input: null,
        start_action_modal_jqnode: null,
        start_action_input: null,
        // new_gift_reward_input: null,
        modify_gift_reward_input: null,
    },
    new_gift: {
        gift_name: '',
        goal: 0,
        reward: '',
    },
    modify_gift: {
        gift_name: '',
        goal: 0,
        reward: '',
    },
    room_id: 221,
}

const init_state = async () => {
    state.node.gift_tbody = document.getElementById('gift-tbody')
    state.node.start_action_btn = document.getElementById('start-action')
    state.node.new_gift_dropdown_menu_btn = document.getElementById('new-gift-dropdown-menu-btn')
    state.node.new_gift_dropdown_menu_ul = document.getElementById('new-gift-dropdown-menu-ul')
    // state.node.new_gift_goal_input = document.getElementById('new-gift-goal-input')
    state.node.modify_gift_modal_jqnode = $('#modify-gift-modal')
    state.node.modify_gift_goal_input = document.getElementById('modify-gift-goal-input')
    state.node.start_action_modal_jqnode = $('#start-action-modal')
    state.node.start_action_input = document.getElementById('start-action-input')
    // state.node.new_gift_reward_input = document.getElementById('new-gift-reward-input')
    state.node.modify_gift_reward_input = document.getElementById('modify-gift-reward-input')
    

    promises = []
    promises.push(await get('/api/get'))
    promises.push(await get('/api/get/state'))
    promises.push(await get('/api/get/giftlist'))
    let res = await Promise.all(promises)
    state['table_option'] = res[0] !== null ? res[0] : {}
    state['run_status'] = res[1] !== null ? res[1].data : false
    state['gift_list'] = res[2] != null ? res[2] : []
}

const refresh = () => {
    window.location.href = '/index.html'
}

const clear_count = async (gift_name) => {
    let res = await get(`/api/set/${gift_name}/count?num=0`)
    if (res && res.ok === 1) {
        refresh()
    }
    else {
        alert('网络异常')
    }
}

// 将数组中的某个元素移动到数组的开头
const move_front = (arr, item) => {
    let idx = arr.indexOf(item)
    if (idx < 0) return
    arr.splice(idx, 1)
    arr.splice(0, 0, item)
}

const start_action_handler = async () => {
    // 正在运行,执行的动作是停止
    if (state.run_status) {
        await get('/api/stop')
        refresh()
    }
    // 停止运行，执行的动作是打开模态框
    else {
        render_all()
        state.node.start_action_modal_jqnode.modal()
    }
}

// new_gift_dropdown_menu 里面下拉菜单的点击事件
const choose_new_gift_handler = (text) => {
    state.new_gift.gift_name = btn_text
    move_front(state.gift_list, text)
    render_all()
}

// new_gift_dropdown_menu 里面礼物目标输入框的onchange
const new_gift_goal_input_onchange_handler = (ctx) => {
    let value = ctx.value
    if (!isNaN(value) && parseInt(value) > 0) {
        state.new_gift.goal = parseInt(value)
    }
    else {
        ctx.value = ''
        state.new_gift.goal = 0
    }
}

// new_gift_dropdown_menu 里面达成奖励输入框的onchange
const new_gift_reward_input_onchange_handler = (ctx) => {
    state.new_gift.reward = ctx.value
}

// new_gift_dropdown_menu 里面提交按钮的点击事件
const submit_new_gift_handler = async () => {
    let { gift_name, goal, reward } = state.new_gift
    if (goal <= 0 || gift_name === '') return
    await get(`/api/set/${gift_name}/goal?num=${goal}&&reward=${reward}`)
    refresh()
}

// 某个礼物栏的修改按钮点击事件
const modify_gift_handler = async (gift_name) => {
    let [count, goal, reward] = state.table_option[gift_name]
    state.modify_gift.gift_name = gift_name
    state.modify_gift.goal = goal
    state.modify_gift.reward = reward
    render_all()
    state.node.modify_gift_modal_jqnode.modal()
}

// modify_gift_modal 里面的目标输入框onchange
const modify_gift_goal_input_onchange_handler = (ctx) => {
    let value = ctx.value
    if (!isNaN(value) && parseInt(value) > 0) {
        state.modify_gift.goal = parseInt(value)
    }
    else {
        render_all()
    }
}

// modify_gift_modal 里面的达成奖励输入框onchange
const modify_gift_reward_input_onchange_handler = (ctx) => {
    state.modify_gift.reward = ctx.value
    render_all()
}

// modify_gift_modal 里面的删除按钮点击事件
const delete_modify_gift_handler = async () => {
    let { gift_name } = state.modify_gift
    await get(`/api/del/${gift_name}`)
    refresh()
}

// modify_gift_modal 里面的提交按钮的点击事件
const submit_modify_gift_handler = async () => {
    let { gift_name, goal, reward } = state.modify_gift
    if (goal <= 0 || gift_name === '') return
    await get(`/api/set/${gift_name}/goal?num=${goal}&&reward=${reward}`)
    refresh()
}

// start_action_modal 里面输入框（room id）的onchange事件
const start_action_input_onchange_handler = (ctx) => {
    let value = ctx.value
    if (!isNaN(value) && parseInt(value) > 0) {
        state.room_id = parseInt(value)
    }
    else {
        render_all()
    }
}

// start_action_modal 里面提交运行按钮的点击事件
const submit_start_action_handler = async () => {
    let room_id = state.room_id
    await get(`/api/start/${room_id}`)
    refresh()
}

// 跳转到展示页面
const show_page_handler = () => {
    window.open('/liveicon.html')
}

// 渲染开始运行的模态框
const render_start_action_modal = (start_action_input, room_id) => {
    start_action_input.value = room_id
}

// 渲染修改礼物的模态框
const render_modify_gift_modal = (modify_gift_goal_input, modify_gift_reward_input, goal, reward) => {
    modify_gift_goal_input.value = goal
    modify_gift_reward_input.value = reward
}

// 渲染礼物列表
const render_tbody = (tbody, table_option) => {
    const clear_tbody = (tbody) => {
        while (tbody.childNodes.length > 0)
            tbody.removeChild(tbody.firstChild)
    }
    const get_table_tr = (item) => {
        // item = {gift_name: '辣条', value: [0, 1000, '心跳']}
        let tr = document.createElement('tr')
        let td_gift_name = document.createElement('td')
        let td_value = document.createElement('td')
        let td_reward = document.createElement('td')
        let td_action = document.createElement('td')

        td_gift_name.innerText = item.gift_name
        td_value.innerText = `${item.value[0]} / ${item.value[1]}`
        td_reward.innerText = item.value[2]
        td_action.innerHTML = `
            <button onClick="modify_gift_handler('${item.gift_name}')" type="button" class="btn btn-primary btn-xs">修改</button>
            <button onClick="clear_count('${item.gift_name}')" type="button" class="btn btn-primary btn-xs">清空</button>
        `
        tr.appendChild(td_gift_name)
        tr.appendChild(td_value)
        tr.appendChild(td_reward)
        tr.appendChild(td_action)
        return tr
    }
    clear_tbody(tbody)
    let items = []
    for (let gift_name in table_option) {
        items.push(get_table_tr({ gift_name, value: table_option[gift_name] }))
    }
    for (let item of items) {
        tbody.appendChild(item)
    }
}

// 渲染开始按钮(运行或者停止)
const render_start_action_btn = (btn, status) => {
    // 停止状态
    if (status === false) {
        btn.innerText = '运行'
        btn.setAttribute('class', 'btn btn-success')
    }
    // 正在运行状态
    else {
        btn.innerText = '停止'
        btn.setAttribute('class', 'btn btn-warning')
    }
}

// 渲染添加礼物时的下拉菜单
const render_new_gift_dropdown_menu = (dropdown_menu_btn, dropdown_menu_ul, gift_list, table_option, new_gift) => {
    let gift_list_show = gift_list.filter(g => !table_option[g])
    // 没有更多可选的礼物
    if (gift_list_show.length === 0) return
    btn_text = gift_list_show[0]
    ul_texts = gift_list_show.slice(1)
    dropdown_menu_btn.innerHTML = `
        ${btn_text}
        <span class="caret"></span> 
    `
    dropdown_menu_ul.innerHTML = ul_texts.map((text) => {
        return `
            <li role="presentation">
                <a role="menuitem" tabindex="-1" href="#" onClick="choose_new_gift_handler('${text}')">${text}</a>
            </li>
        `
    })
    new_gift.gift_name = btn_text
}

const render_all = () => {
    render_tbody(state.node.gift_tbody, state.table_option)
    render_start_action_btn(state.node.start_action_btn, state.run_status)
    render_new_gift_dropdown_menu(state.node.new_gift_dropdown_menu_btn, state.node.new_gift_dropdown_menu_ul,
        state.gift_list, state.table_option, state.new_gift)
    render_modify_gift_modal(state.node.modify_gift_goal_input, state.node.modify_gift_reward_input, state.modify_gift.goal, state.modify_gift.reward)
    render_start_action_modal(state.node.start_action_input, state.room_id)
}

const ready_func = async () => {
    await init_state()
    render_all()

    setInterval(async () => {
        let res = await get('/api/get')
        state['table_option'] = res !== null ? res : {}
        render_all()
    }, 2000);
}
$(() => ready_func())
