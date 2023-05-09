import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatOpenAIService } from './chatOpenAi';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatHistories, ChatHistoriesSchema } from './chat-histories.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ChatHistories.name, schema: ChatHistoriesSchema }])],
  controllers: [ChatsController],
  providers: [ChatsService, ChatOpenAIService]
})
export class ChatsModule {}
