const get = (url) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.responseType = "json"
        xhr.open('GET', url, true)
        xhr.onload = function (e) {
            if (this.status == 200 || this.status == 304) {
                resolve(this.response)
            }
            else {
                resolve(null)
            }
        }
        xhr.send()
    })
}