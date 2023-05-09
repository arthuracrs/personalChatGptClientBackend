import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://user:pass@localhost:27017'), ChatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
