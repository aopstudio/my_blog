import { Controller, Inject, Post } from '@midwayjs/decorator';
import { UserService } from '../service/user.service';

@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Post('/')
  async addUser(): Promise<string> {
    await this.userService.addUser();
    return '添加成功';
  }
}
