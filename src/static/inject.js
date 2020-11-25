console.log('injected')

function addAxios() {
  let scriptNode = document.createElement('script')
  scriptNode.type = 'text/javascript'
  scriptNode.src = '/static/axios.min.js'
  document.querySelector('head').appendChild(scriptNode)
}

function addLogoutBtn() {
  const asideUls = document.querySelectorAll('aside>ul')
  if (asideUls && asideUls.length > 0) {
    console.log(asideUls)
    let li = document.createElement('li')
    li.innerHTML = '<a id="logout-btn" href="#">退出登录</a>'
    asideUls[asideUls.length - 1].appendChild(li)
    const logoutBtn = document.querySelector('#logout-btn')
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault()
      axios
        .delete('/logout')
        .then((res) => {
          if (res.data && res.data.code === 0) {
            console.log('登出成功')
            location.href = '/login'
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => console.log(err))
    })
  }
}

addAxios()
addLogoutBtn()
