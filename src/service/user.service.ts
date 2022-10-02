import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user';
import { IUserOptions } from '../interface';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  async addUser() {
    const user = new User();
    user.name = 'czd';
    user.password = '123456';
    const userResult = await this.userModel.save(user);
    console.log('user id =' + userResult.id);
  }

  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
