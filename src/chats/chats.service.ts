import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import {
  AIChatMessage,
  BaseChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { InjectModel } from "@nestjs/mongoose";
import { v4 as uuidv4 } from "uuid";

import { ChatOpenAIService } from "./chatOpenAi";
import { ChatHistories } from "./chat-histories.schema";

@Injectable()
export class ChatsService {
  constructor(
    @Inject(ChatOpenAIService) private readonly chatOpenAIService:
      ChatOpenAIService,
    @InjectModel(ChatHistories.name) private chatHistoriesModel: Model<
      ChatHistories
    >,
  ) {}

  async chat(message: string, chatHistoryId: string, chatId: string) {
    const chat = this.chatOpenAIService.getChat();

    if (!chatId) {
      const newChat = {
        chatId: uuidv4(),
        title: "",
        messages: [],
      };

      const humanMessage = new HumanChatMessage(message);
      const newHumanChatMessage = {
        chatMessageId: uuidv4(),
        type: "human",
        text: message,
      };
      newChat.messages.push(newHumanChatMessage);

      const response = await chat.call([humanMessage]);
      const newAIChatMessage = {
        chatMessageId: uuidv4(),
        type: "ai",
        text: response.text,
      };
      newChat.messages.push(newAIChatMessage);

      const newChatHistory = {
        chatHistoryId: uuidv4(),
        chats: [newChat],
      };
      await this.chatHistoriesModel.create(newChatHistory);

      return {
        response,
        chatHistoryId: newChatHistory.chatHistoryId,
        chatId: newChat.chatId,
      };
    } else {
      const chatHistory = await this.chatHistoriesModel.findOne({
        chatHistoryId,
      }).exec();
      if (!chatHistory) {
        throw new HttpException("chatHistory not found", HttpStatus.NOT_FOUND);
      }
      const currentChat = this.getCurrentChatById(chatHistory, chatId);

      const currentChatHidrated = this.hidrateChat(currentChat.messages);

      const newHumanChatMessage = {
        chatMessageId: uuidv4(),
        type: "human",
        text: message,
      };
      currentChat.messages.push(newHumanChatMessage);

      const response = await chat.call([
        ...currentChatHidrated,
        new HumanChatMessage(message),
      ]);
      const newAIChatMessage = {
        chatMessageId: uuidv4(),
        type: "ai",
        text: response.text,
      };
      currentChat.messages.push(newAIChatMessage);

      await this.chatHistoriesModel.updateOne(
        {
          chatHistoryId,
          "chats.chatId": chatId,
        },
        { $set: { "chats.$.messages": currentChat.messages } },
      );

      return {
        response,
        chatHistoryId: chatHistory.chatHistoryId,
        chatId: currentChat.chatId,
      };
    }
  }

  private getCurrentChatById(chatHistory: ChatHistories, id: string) {
    for (let i = 0; i < chatHistory.chats.length; i++) {
      const chat = chatHistory.chats[i];
      if (chat.chatId = id) {
        return chatHistory.chats[i];
      }
    }
  }

  private hidrateChat(chatMessages) {
    return chatMessages.map((message) => {
      let newMessage: BaseChatMessage;
      if (message.type === "human") {
        newMessage = new HumanChatMessage(message.text);
      } else {
        newMessage = new AIChatMessage(message.text);
      }

      return newMessage;
    });
  }
}
