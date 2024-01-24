import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors, Get, Param } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from 'src/auth.guard';
import { Customer } from 'src/schemas/customer.schema';
import { Role } from 'src/role.enum';
import { Roles } from 'src/roles.decorator';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose, { ObjectId } from 'mongoose';
import { RolesGuard } from 'src/roles.guard';

@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @Post(':userId')
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
  create(@Param('userId') userId: mongoose.Types.ObjectId, @Body()customer:Customer, @UploadedFile() image) {
    return this.customerService.create(customer, image, userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get()
  getAll(){
    return this.customerService.getAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get(':userId')
  getCustomer(@Param('userId') usreId:mongoose.Types.ObjectId){
    return this.customerService.getCustomer(usreId)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SystemAdmin)
  @Post('delete/:id')
  delete(@Param('id') id:mongoose.Types.ObjectId){  
    console.log('delete');
    return this.customerService.delete(id)
  }

}


