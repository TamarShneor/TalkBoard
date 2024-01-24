import { Body, Controller, Get, Param, Post, Headers, Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { response } from 'express';
import { ObjectId } from 'mongoose';
import { RolesGuard } from 'src/roles.guard';
import { AuthGuard } from 'src/auth.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.SystemAdmin)
  @Get()
  getAll(): Promise<any> {
    return this.userService.getAll();
  }

  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @Get('getSystemAdmin')
  getSystemAdmin(): Promise<any> {
    return this.userService.getSystemAdmin();
  }

  @Get('getCurrentUser')
  getCurrentUser(@Headers('Authorization') auth: string): Promise<any> {
    return this.userService.getCurrentUser(auth);
  }

  @Get(':id')
  getUserById(@Param('id') id: number): any {
    return this.userService.getUserById(id);
  }

  @Get(':name/:email')
  getUser(@Param('name') name: string, @Param('email') email: string): any {
    return this.userService.getUser(name, email);
  }

  @Post('signUp')
  signUp(@Body() user: User): Promise<any> {
    try {      
      return this.userService.signUp(user);
    } catch (e) {      
      response.status(e.status).json(e.message)
  }
   }


  @Post('signIn')
  signIn(@Body() user: User): Promise<any> {
    return this.userService.signIn(user);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  update(@Param('id') id: ObjectId, @Body() forum: User, @Headers('Authorization') auth: string, @UploadedFile() image:Express.Multer.File) {
    return this.userService.update(id, forum, auth, image);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SystemAdmin)
  @Put('delete/:id')
  delete(@Param('id') id: ObjectId) {    
    return this.userService.delete(id);
  }

  @Post('forgerPassword')
  forgerPassword(@Body() user:User){
    return this.userService.forgerPassword(user)
  }
}


