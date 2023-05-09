import { Injectable } from "@nestjs/common";
import { ChatOpenAI } from "langchain/chat_models/openai";

@Injectable()
export class ChatOpenAIService {
  private chat = new ChatOpenAI({ temperature: 0 });

  getChat(): ChatOpenAI {
    return this.chat;
  }
}
