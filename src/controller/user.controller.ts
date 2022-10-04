import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Put,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user';
import { Md5 } from 'ts-md5';

@Controller('/user')
export class UserController {
  @InjectEntityModel(User)
  userModel: Repository<User>;
  @Inject()
  ctx: Context;

  @Put('/:id')
  async updateUserInfo(@Param('id') id: number, @Body() userInfo) {
    const { name, avatar } = userInfo;
    const user = await this.userModel.findOneBy({ id });
    if (!user) {
      this.ctx.status = 400;
      this.ctx.body = {
        data: '用户不存在',
      };
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
  async updateUserPassword(@Param('id') id: number, @Body() passwordInfo) {
    const { old_password: oldPassword, new_password: newPassword } =
      passwordInfo;
    const user = await this.userModel.findOneBy({ id });
    if (!user) {
      this.ctx.status = 400;
      this.ctx.body = {
        data: '用户不存在',
      };
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
