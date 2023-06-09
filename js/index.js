(async function () {
  // 验证是否有登录，如果没有登录，跳转到登录页，如果有登录，获取到登录的用户信息
  // 调当前登录的用户信息接口，看看返啥
  const resp = await API.profile();
  const user = resp.data;

  // 如果没有登录
  if (!user) {
    alert("未登录或登录到期，请重新登录");
    location.href("./login.html");
    return;
  }

  // 获取dom
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };

  // 确定是登录状态后干的事
  //设置用户信息
  setUserInfo();

  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  //注销登录事件
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };

  //加载历史记录
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }
  await loadHistory();

  /**
   * 根据消息对象，将其添加到页面中
   * @param {*} chatInfo
   */
  // content: "content";
  // createdAt: 1683782080095;
  // from: "哈哈哈hahaha";
  // to: null;
  // _id: "645c79c05393e37e7adcf728";
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }

    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }

  /**
   *将时间戳格式化，2022-04-29 14:18:13
   * @param {*} date 时间戳
   */
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  //让聊天区域的滚动条滚动到底
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  /**
   * 发送消息
   * @returns
   */
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }

    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });

    doms.txtMsg.value = "";

    scrollBottom();

    const resp = await API.sendChat(content);

    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });

    scrollBottom();
  }

  // 发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
})();
