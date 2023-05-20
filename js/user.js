//用户登录与注册的表单项验证的通用

/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
  /**
   * 构造器
   * @param {String} txtId 文本框的Id
   * @param {Function} validatorFunc 验证规则函数，当需要对文本框验证时会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
   */
  constructor(txtId, validatorFunc) {
    this.input = $(`#${txtId}`);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    //   失去焦点时验证
    this.input.onblur = () => {
      this.validate();
    };
  }

  //   验证，成功返回true，失败返回false
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      //有错误
      this.p.innerText = err;
      return false;
    } else {
      //无错误
      this.p.innerText = "";
      return true;
    }
  }

  //静态方法
  /**
   *对传入的所有验证器进行统一验证
   * @param {Array} validators 所有验证器
   * @return {Boolean} 全都验证成功返回true，有一个失败就返回false
   */
  static async validate(validators) {
    const proms = validators.map((s) => s.validate());
    const result = await Promise.all(proms);
    return result.every((item) => item);
  }
}
