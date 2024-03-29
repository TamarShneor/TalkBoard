import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Forum } from 'src/schemas/forum.schema';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ForumService {

  constructor(@InjectModel(Forum.name) private forumModel: Model<Forum>, private readonly userService:UserService, private readonly messageService:MessageService) { }

  async getAll() {
    return await this.forumModel.find().exec()
  }

  async getForum(id: ObjectId, auth: string) {
    const forum = await this.forumModel.findById(id).exec()
    const currentUser = this.userService.getCurrentUser(auth);
    if ((!forum.isPublic) && (!forum.usersList.includes((await currentUser).email))) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return forum;
  }

  async create(forum: Forum, auth: string): Promise<any> {
    const f = this.forumModel.findOne({ password: forum.password });
    if (await f == null) {
      const currentUser = this.userService.getCurrentUser(auth);
      const newForum = new this.forumModel(forum);
      newForum.admin = (await currentUser)._id;
      if (!newForum.usersList.includes((await currentUser).email))
        newForum.usersList.push((await currentUser).email);
      return newForum.save();
    }
    throw new ConflictException('Forum with this password already exists');
  }

  async update(id: ObjectId, forum: Forum, auth: string) {
    const currentUser = await this.userService.getCurrentUser(auth);
    const f = await this.forumModel.findById(id).exec()
    if (!f) {
      throw new Error(`Forum with id ${id} not found`);
    }
    if (!forum.usersList.includes(currentUser.email))
      forum.usersList.push(currentUser.email);
    Object.assign(f, forum);
    const updatedForum = await f.save();
    return updatedForum;
  }

  async delete(id: ObjectId) {
    const f = await this.forumModel.findById(id).exec();
    if (!f) {
      throw new Error(`forum with id ${id} not found`);
    }
    this.messageService.deleteByForumId(id);
    await f.deleteOne();
    return f;
  }

  async enterToForum(auth: string, _forumId: ObjectId): Promise<any> {
    const forum = await this.forumModel.findById(_forumId).exec()
    const currentUser = this.userService.getCurrentUser(auth);
    if((await currentUser)._id.equals((await this.userService.getSystemAdmin())._id)){
      const [type, token] = auth.split(' ') ?? [];
      return token;
    }
      
    let payload = null;
    if ((await currentUser)._id.equals((forum).admin))
      payload = { username: (await currentUser).name, password: (await currentUser).password, roles: ['admin', 'user'] };

    else
      payload = { username: (await currentUser).name, password: (await currentUser).password, roles: ['user'] };

    const secretKey = 'talk board key';
    const forumToken = jwt.sign(payload, secretKey);
    return forumToken;

  }

  async updateDate(id: ObjectId) {
    return await this.forumModel.findOneAndUpdate({ _id: id }, { lastEdited: Date.now() }, { new: true }).exec();
  }



}
