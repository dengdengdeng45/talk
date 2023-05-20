// 创建对账号的验证规则
const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "账号不能为空";
  }
});

// 创建对密码的验证规则
var loginPwdValidator = new FieldValidator("txtLoginPwd", async function (val) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  //阻止默认事件发生
  e.preventDefault();
  console.log("表单正在提交");
  const result = await FieldValidator.validate([
    loginIdValidator,
    loginPwdValidator,
  ]);
  console.log(result);
  if (!result) {
    return;
  }

  //   const data = {
  //     loginId: loginIdValidator.input.value,
  //     nickname: nicknameValidator.input.value,
  //     loginPwd: loginPwdValidator.input.value,
  //   };
  //   console.log(data);

  //传入表单dom，得到表单数据对象
  const formData = new FormData(form);
  console.log(formData.entries());
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功，点击确定，跳转到首页");
    location.href = "./index.html";
  } else {
    loginIdValidator.p.innerText = "登陆失败，请检查账号和密码";
    loginPwdValidator.input.value = "";
  }
};
