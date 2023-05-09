import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";

@Controller("chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    const { newMessage, chatHistoryId, chatId } = createChatDto;

    return this.chatsService.chat(newMessage, chatHistoryId, chatId);
  }

  // @Get()
  // findAll() {
  //   return this.chatsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chatsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
  //   return this.chatsService.update(+id, updateChatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatsService.remove(+id);
  // }
}
