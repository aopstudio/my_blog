import { Body, Controller, Inject, Param, Put } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user';
import { Md5 } from 'ts-md5';
import { PasswordInfo, UserInfo } from '../interface';

@Controller('/user')
export class UserController {
  @InjectEntityModel(User)
  userModel: Repository<User>;
  @Inject()
  ctx: Context;

  @Put('/:id')
  async update(@Param('id') id: number, @Body() userInfo: UserInfo) {
    const { name, avatar } = userInfo;
    const user = await this.userModel.findOneBy({ id });
    if (!user) {
      this.ctx.status = 400;
      this.ctx.body = {
        data: '用户不存在',
      };
      return;
    }
    if (name) {
      user.name = name;
    }
    if (avatar) {
      user.avatar = avatar;
    }
    await this.userModel.save(user);
  }

  @Put('/password/:id')
  async updatePassword(
    @Param('id') id: number,
    @Body() passwordInfo: PasswordInfo
  ) {
    const { old_password: oldPassword, new_password: newPassword } =
      passwordInfo;
    const user = await this.userModel.findOneBy({ id });
    if (!user) {
      this.ctx.status = 400;
      this.ctx.body = {
        data: '用户不存在',
      };
      return;
    }
    const { password } = user;
    if (Md5.hashStr(oldPassword) === password) {
      user.password = Md5.hashStr(newPassword);
      await this.userModel.save(user);
    } else {
      console.log(Md5.hashStr(oldPassword));
      this.ctx.status = 400;
      this.ctx.body = {
        data: '原密码错误',
      };
    }
  }
}
