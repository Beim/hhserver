const ResMsg = (ok, msg, data=undefined) => {
    let ret = data !== undefined ? {data} : {}
    Object.assign(ret, {ok, msg})
    return ret
}

module.exports = ResMsg