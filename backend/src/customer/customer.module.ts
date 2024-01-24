import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from 'src/schemas/customer.schema';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';
import { GridFsMulterConfigService } from 'src/files/multer-config.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema}]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
  }),
    FilesModule 
    ],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
