// 创建对账号的验证规则
const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "账号不能为空";
  }

  const resp = await API.exists(val);
  if (resp.data) {
    //账号已存在
    return "该账号已被占用，请重新输入账号";
  }
});

//创建对昵称的验证规则
var nicknameValidator = new FieldValidator("txtNickname", async function (val) {
  if (!val) {
    return "请填写昵称";
  }
});

// 创建对密码的验证规则
var loginPwdValidator = new FieldValidator("txtLoginPwd", async function (val) {
  if (!val) {
    return "请填写密码";
  }
});

// 创建对确认密码的验证规则
var loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "两次密码不一致";
    }
  }
);

const form = $(".user-form");
form.onsubmit = async function (e) {
  //阻止默认事件发生
  e.preventDefault();
  console.log("表单正在提交");
  const result = await FieldValidator.validate([
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator,
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
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功，点击确定，跳转到登录页");
    location.href = "./login.html";
  }
};
