import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumModule } from './forum/forum.module';
import { MessageModule } from './message/message.module';
import { CategoryModule } from './category/category.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailController } from './mail/mail.controller';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { FilesModule } from './files/files.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/TalkBoarddb'),
  UserModule,
  ForumModule,
  MessageModule,
  CategoryModule,
  MailModule, 
  FilesModule,
  CustomerModule,
  MailerModule.forRoot({
    transport: {
      // service:"Gmail",
      // host: 'localhost',
      // port: 1080,
      host: `smtp.gmail.com`,
      port: 465,
      ignoreTLS: true,
      secure: true,
      auth: {
        user: 'talkboard999@gmail.com',
        pass: 'gpuj kgge kaip vweu',
      },
      tls: {
        rejectUnauthorized: false
    }
    },
    
    defaults: {
      from: '"No Reply" <no-reply@localhost>',
    },
    // preview: true,
    template: {
      dir: process.cwd() + '/template/',
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    },
  }),
],
  controllers: [AppController, MailController],
  providers: [AppService, MailService],
})
export class AppModule {}
