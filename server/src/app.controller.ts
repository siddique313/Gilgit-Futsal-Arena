import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: "Futsal Game GB API",
      docs: "/api",
      status: "ok",
    };
  }
}
