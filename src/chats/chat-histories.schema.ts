import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ChatHistoriesDocument = HydratedDocument<ChatHistories>;

@Schema()
class ChatMessageSchema {
  @Prop()
  chatMessageId: string;

  @Prop()
  text: string;

  @Prop()
  type: string;
}

@Schema()
class ChatSchema {
  @Prop()
  chatId: string;

  @Prop()
  title: string;

  @Prop()
  messages: ChatMessageSchema[];
}

@Schema()
export class ChatHistories {
  @Prop()
  chatHistoryId: string;

  @Prop()
  chats: ChatSchema[];
}

export const ChatHistoriesSchema = SchemaFactory.createForClass(ChatHistories);
