import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserController } from './user.controller';
import { SocketGateway } from './socket.gateway';
import { SupportController } from './support.controller';
import { ChatGateway } from './chat.gateway';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/public',
      rootPath: join(__dirname, '..', '..', '..', 'user', 'src', 'uploads'),
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/support',
      rootPath: join(__dirname, '..', '..', '..', 'support_ticket', 'src', 'uploads'),
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/admin/images',
      rootPath: join(__dirname, '..', '..', '..', 'admin', 'src', 'uploads'),
    }),
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 9022 },
      },
      {
        name: 'USER_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 9023 },
      },
      {
        name: 'SUPPORT_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 9025 },
      },
      {
        name: 'CHAT_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 9026 },
      },
      {
        name: 'ADMIN_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 9027 },
      },
      {
        name: 'COMMON_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 9029 },
      },
    ]),
  ],
  controllers: [UserController, SupportController, AppController, AdminController],
  providers: [AppService, SocketGateway, ChatGateway],
})
export class AppModule { }