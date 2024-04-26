import { Controller, Post, Body, Inject, Req, Res, Get, Headers, Patch, HttpException, HttpStatus, UploadedFile, UseInterceptors, UnauthorizedException, Query, Param, Delete, Ip } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path'
import * as path from 'path';

import { ClientProxy } from '@nestjs/microservices';
import * as log4js from 'log4js';
import { catchError, throwError } from 'rxjs';
const logger = log4js.getLogger();
import { Request, Response } from 'express'

@Controller('admin')
export class AdminController {

  constructor(
    @Inject('COMMON_MICROSERVICE') private readonly commonClient: ClientProxy,
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientProxy,
    @Inject('ADMIN_MICROSERVICE') private readonly adminClient: ClientProxy,
  ) { }

  @Post('admin-register')
  async adminRegister(@Body() body: any, @Headers() headers: any) {
    try {

      const result = await this.adminClient.send({ cmd: 'register_admin' }, { body, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin register-user");
      logger.info(error);
      throw error;
    }
  }

  @Post('sub-admin-register')
  async subAdminRegister(@Body() body:any, @Headers() headers: any) {
    try {
      const result = await this.adminClient.send({ cmd: 'register_sub_admin' }, { body, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin register_sub_admin");
      logger.info(error);
      throw error;
    }
  }

  @Post('admin-login')
  async adminLogin(@Body() body: any, @Headers() headers: any) {
    try {
      const result = await this.adminClient.send({ cmd: 'admin_login' }, { body, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed12', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin-login");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-profile')
  async getProfile(@Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        // throw new HttpException('No token provided', 403);
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];
      // let role = 'user';
      return this.adminClient.send({ cmd: 'get_profile' }, { token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-profile");
      logger.info(error);
      throw error;
    }
  }

  @Patch('admin-logout')
  async adminLogout(@Body() body: any,@Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      const token = authorizationHeader.split('Bearer ')[1];

      return this.adminClient.send({ cmd: 'admin_logout' }, { token, headers, body })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin_logout");
      logger.info(error);
      throw error;
    }
  }

  @Get('refresh-token')
  async refreshToken(@Headers() headers: any) {
    try {
      const authorizationHeader = headers['authorization'];
      const token = authorizationHeader.split('Bearer ')[1];

      return this.authClient.send({ cmd: 'refresh_token' }, { token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin refresh-token");
      logger.info(error);
    }
  }

  @Get('get-ticket-list')
  async getTicketList(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        // throw new HttpException('No token provided', 403);
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      // let role = 'user';
      let page = req.query.page;
      let page_size = req.query.page_size;
      let search = req.query.search;

      return this.adminClient.send({ cmd: 'get_ticket_list' }, { page, page_size, search, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-ticket-list");
      logger.info(error);
      throw error;
    }
  }

  @Post('image-upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: path.join(__dirname, '..', '..', '..', 'admin', 'src', 'uploads'),
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  async imageUpload(@UploadedFile() file, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];
      return this.adminClient.send({ cmd: 'image_upload' }, { file, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin image-upload");
      logger.info(error);
      throw error;
    }
  }

  @Post('update-ticket-status')
  async updateTicketStatus(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.adminClient.send({ cmd: 'update_ticket_status' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway update_ticket_status");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-single-ticket')
  async getSingleTicket(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        // throw new HttpException('No token provided', 403);
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      // let role = 'user';
      // let page = req.query.page;
      // let page_size = req.query.page_size;
      let ticket_id = req.query.ticket_id;
      // console.log('inn',req.query);

      return this.adminClient.send({ cmd: 'get_single_ticket' }, { ticket_id, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-single-ticket");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-ticket-chat')
  async getTicketChat(@Query() query: any, @Headers() headers: any) {
    try {
      const ticket_id = query.ticket_id
      const page = query.page
      const limit = query.limit

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      const result = await this.adminClient.send({ cmd: 'get_ticket_chat' }, { ticket_id, page, limit, headers, token }).pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway get-ticket-chat");
      logger.info(error);
      throw error;
    }
  }

  @Post('update-password')
  async updatePassword(@Body() body: any, @Headers() headers: any) {
    try {
      const { current_password, new_password } = body;

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];
      return this.adminClient.send({ cmd: 'update_password' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));
      
    } catch (error) {
      logger.info("api-gateway update-password");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-contact-list')
  async getContactUsList(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];

      if (!authorizationHeader) {
        // throw new HttpException('No token provided', 403);
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      // let role = 'user';
      let page = req.query.page;
      let page_size = req.query.page_size;
      let search = req.query.search;

      return this.adminClient.send({ cmd: 'get_contact_list' }, { page, page_size, search, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-contact-list");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-user-list')
  async getUserList(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];

      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      let page = req.query.page;
      let page_size = req.query.page_size;
      let search = req.query.search;

      return this.adminClient.send({ cmd: 'get_user_list' }, { page, page_size, search, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-user-list");
      logger.info(error);
      throw error;
    }
  }

  @Post('update-user-status')
  async updateUserStatus(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.adminClient.send({ cmd: 'update_user_status' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin update_user_status");
      logger.info(error);
      throw error;
    }
  }


  @Post('update-role-status')
  async updateRoleStatus(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.adminClient.send({ cmd: 'update_role_status' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin update_role_status");
      logger.info(error);
      throw error;
    }
  }

  // *************************************************************************
  //                              Common services API
  // *************************************************************************

  @Get('get-faq-titles')
  async getFaqTitle(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'get_faq_title' }, { token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-faq-titles");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-faq-list')
  async getFaqList(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'get_faq_list' }, { token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-faq-list");
      logger.info(error);
      throw error;
    }
  }

  @Post('faq-add')
  async faqAdd(@Body() body: any, @Headers() headers: any) {
    try {
      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'faq_add' }, { body, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin faq-add");
      logger.info(error);
      throw error;
    }
  }

  @Post('faq-delete')
  async faqDelete(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'faq_delete' }, { body, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin faq_delete");
      logger.info(error);
      throw error;
    }
  }

  @Post('faq-data-delete')
  async faqDataDelete(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'faq_data_delete' }, { body, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin faq_data_delete");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-cms-list')
  async getCmsList(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];

      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      let page = req.query.page;
      let page_size = req.query.page_size;
      let search = req.query.search;

      return this.commonClient.send({ cmd: 'get_cms_list' }, { page, page_size, search, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-cms-list");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-cms/:id')
  async getCms(@Param('id') id: string, @Headers() headers: any) {
    try {
      const cms_id = id

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      const result = await this.commonClient.send({ cmd: 'get_cms' }, { cms_id, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin get-cms");
      logger.info(error);
      throw error;
    }
  }

  @Post('cms-add-update')
  async addCms(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'cmd_add_update' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin cmd-add-update");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-category-list')
  async getCategoryList(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];

      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      let page = req.query.page;
      let page_size = req.query.page_size;
      let search = req.query.search;

      return this.commonClient.send({ cmd: 'get_category_list' }, { page, page_size, search, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-category-list");
      logger.info(error);
      throw error;
    }
  }

  @Post('category-add-update')
  async addCategory(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'category_add_update' }, { body, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin category-add-update");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-category/:id')
  async getCategory(@Param('id') id: string, @Headers() headers: any) {
    try {
      const category_id = id

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      const result = await this.commonClient.send({ cmd: 'get_category' }, { category_id, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin get-category");
      logger.info(error);
      throw error;
    }
  }

  @Post('category-status')
  async categoryStatus(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'category_status' }, { body, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin category-status");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-category-names')
  async getCategoryName(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      const result = await this.commonClient.send({ cmd: 'get_category_names' }, { body, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin get-category-names");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-blog-list')
  async getBlogList(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];

      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      let page = req.query.page;
      let page_size = req.query.page_size;
      let search = req.query.search;

      return this.commonClient.send({ cmd: 'get_blog_list' }, { page, page_size, search, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin get-blog-list");
      logger.info(error);
      throw error;
    }
  }

  @Post('blog-add-update')
  async addBlog(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'blog_add_update' }, { body, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin blog-add-update");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-blog/:id')
  async getBlog(@Param('id') id: string, @Headers() headers: any) {
    try {
      const blog_id = id

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      const result = await this.commonClient.send({ cmd: 'get_blog' }, { blog_id, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin get-blog");
      logger.info(error);
      throw error;
    }
  }

  @Post('blog-status')
  async blogStatus(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'blog_status' }, { body, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin blog-status");
      logger.info(error);
      throw error;
    }
  }

  @Get('app-setting-list')
  async getAppSettingList(@Headers() headers: any, @Req() req: Request) {
    try {

      const authorizationHeader = headers['authorization'];

      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'app_setting_list' }, { token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin app-setting-list");
      logger.info(error);
      throw error;
    }
  }

  @Post('app-setting')
  async addAppSetting(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.commonClient.send({ cmd: 'add_app_setting' }, { body, headers, token })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin app-setting");
      logger.info(error);
      throw error;
    }
  }


  @Post('update-timeout-setting')
  async updateTimeout(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.adminClient.send({ cmd: 'update_timeout' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin update_timeout");
      logger.info(error);
      throw error;
    }
  }

  @Post('change-notification-setting')
  async notificationSetting(@Body() body: any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.adminClient.send({ cmd: 'notification_setting' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway admin notification_setting");
      logger.info(error);
      throw error;
    }
  }


  @Post('add-permission')
  async addAdminPermission(@Body() body:any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors:any = {token:'No token provided'}
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];
      
      const result = await this.adminClient.send({ cmd: 'add_permission' }, { body, token, headers })
      .pipe(catchError(errors => throwError(() => new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin add_permission");
      logger.info(error);
      throw error;
    }
  }

  @Post('update-permission')
  async updatePermission(@Body() body:any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors:any = {token:'No token provided'}
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];
      
      const result = await this.adminClient.send({ cmd: 'update_permission' }, { body, token, headers })
      .pipe(catchError(errors => throwError(() => new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin update-permission");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-role')
  async getRole(@Headers() headers: any, @Req() req:Request) {
    try {
      
      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        // throw new HttpException('No token provided', 403);
        let errors:any = {token:'No token provided'}
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      // let role = 'user';
      let page = req.query.page;
      let page_size = req.query.page_size;
      let search = req.query.search;
      // console.log('inn',req.query);
      
      return this.adminClient.send({ cmd: 'get_role' }, { page, page_size, search, token, headers }).pipe(catchError((errors) => {  
          if (errors.statusCode == 401) {
            throw new HttpException({ message: 'UNAUTHORIZED', errors },HttpStatus.UNAUTHORIZED);
          }else{
            return throwError(() => new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY));
          }
        }),
      );

    } catch (error) {
      logger.info("api-gateway admin get_role");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-single-role/:id')
  async getSingleRole(@Param('id') id: string,@Headers() headers: any, @Req() req:Request) {
    try {
      
      const role_id = id
      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        // throw new HttpException('No token provided', 403);
        let errors:any = {token:'No token provided'}
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      // let role = 'user';
      let page = req.query.page;
      let page_size = req.query.page_size;
      let search = req.query.search;
      
      return this.adminClient.send({ cmd: 'get_single_role' }, { role_id, token, headers }).pipe(catchError((errors) => {  
          if (errors.statusCode == 401) {
            throw new HttpException({ message: 'UNAUTHORIZED', errors },HttpStatus.UNAUTHORIZED);
          }else{
            return throwError(() => new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY));
          }
        }),
      );

    } catch (error) {
      logger.info("api-gateway admin get_single_role");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-single-user/:id')
  async getUser(@Param('id') id: string, @Headers() headers: any) {
    try {
      const user_id = id
      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      const result = await this.adminClient.send({ cmd: 'get_single_user' }, { user_id, headers, token })
      .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin get_single_user");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-dashboard')
  async getDashboard(@Body() body:any, @Headers() headers: any) {
    try {

      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors:any = {token:'No token provided'}
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];
      
      const result = await this.adminClient.send({ cmd: 'get_dashboard' }, { body, token, headers })
      .pipe(catchError(errors => throwError(() => new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin get_dashboard");
      logger.info(error);
      throw error;
    }
  }

  @Get('get-sub-admin')
  async getAdmin(@Headers() headers: any, @Req() req:Request) {
    try {

      const authorizationHeader = headers['authorization'];

      
      if (!authorizationHeader) {
        let errors:any = {token:'No token provided'}
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      const token = authorizationHeader.split('Bearer ')[1];
      let page = req.query.page;
      let page_size = req.query.page_size;
      let search = req.query.search;
      
      
      return this.adminClient.send({ cmd: 'get_sub_admin' }, { page, page_size, search, token, headers }).pipe(catchError((errors) => {  
          if (errors.statusCode == 401) {
            throw new HttpException({ message: 'UNAUTHORIZED', errors },HttpStatus.UNAUTHORIZED);
          }else{
            return throwError(() => new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY));
          }
        }),
      );

    } catch (error) {
      logger.info("api-gateway admin get_sub_admin");
      logger.info(error);
      throw error;
    }
  }


  @Get('get-single-subadmin/:id')
  async getSingleSubAdmin(@Param('id') id: string, @Headers() headers: any) {
    try {
      const user_id = id
      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors: any = { token: 'No token provided' }
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      const result = await this.adminClient.send({ cmd: 'get_single_subadmin' }, { user_id, headers, token })
      .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

      return result;
    } catch (error) {
      logger.info("api-gateway admin get_single_subadmin");
      logger.info(error);
      throw error;
    }
  }

  
  // *************************************************************************
  //                              Common services API
  // *************************************************************************


  
    
  // start --- Two Factor Authentication API ---

  @Get('generate-qrcode')
  async generate2Fa(@Body() body: any, @Headers() headers: any) {
    const authorizationHeader = headers['authorization'];
    if (!authorizationHeader) {
      let errors: any = { token: 'No token provided' }
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const token = authorizationHeader.split('Bearer ')[1];

    try {
      return this.adminClient.send({ cmd: 'generate_2fa_qr' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway generate-2fa");
      logger.info(error);
      throw error;
    }
  }

  @Post('enable-google-2fa')
  async enableGoogle2fa(@Body() body: any, @Headers() headers: any) {
    const authorizationHeader = headers['authorization'];
    if (!authorizationHeader) {
      let errors: any = { token: 'No token provided' }
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const token = authorizationHeader.split('Bearer ')[1];
    try {
      return this.adminClient.send({ cmd: 'enable_google_2fa' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway enable-google-2fa");
      logger.info(error);
      throw error;
    }
  }

  @Get('send-2fa-mail')
  async send2faEmailCode(@Body() body: any, @Headers() headers: any) {
    const authorizationHeader = headers['authorization'];
    if (!authorizationHeader) {
      let errors: any = { token: 'No token provided' }
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const token = authorizationHeader.split('Bearer ')[1];

    try {
      return this.adminClient.send({ cmd: 'send_2fa_mail' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway send-2fa-mail");
      logger.info(error);
      throw error;
    }
  }

  @Post('enable-email-2fa')
  async enableEmail2fa(@Body() body: any, @Headers() headers: any) {
    const authorizationHeader = headers['authorization'];
    if (!authorizationHeader) {
      let errors: any = { token: 'No token provided' }
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const token = authorizationHeader.split('Bearer ')[1];
    try {
      return this.adminClient.send({ cmd: 'enable_email_2fa' }, { body, token, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway enable-email-2fa");
      logger.info(error);
      throw error;
    }
  }



  @Post('verify-google-2fa')
  async verifyGoogle2faOTP(@Body() body: any, @Headers() headers: any) {
    try {
      return this.adminClient.send({ cmd: 'verify_google_2fa' }, { body, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway verify-google-2fa");
      logger.info(error);
      throw error;
    }
  }

  @Post('send-verify-mail')
  async sendVerifyEmailCode(@Body() body: any, @Headers() headers: any) {
    try {
      return this.adminClient.send({ cmd: 'send_verify_mail' }, { body, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway send-verify-mail");
      logger.info(error);
      throw error;
    }
  }
  
  @Post('verify-email-2fa')
  async verifyEmail2faOTP(@Body() body: any, @Headers() headers: any) {
    try {
      return this.adminClient.send({ cmd: 'verify_email_2fa' }, { body, headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway verify-email-2fa");
      logger.info(error);
      throw error;
    }
  }
  
  @Post('verify-login-2fa')
  async verifyLogin2faOTP(@Body() body: any, @Headers() headers: any, @Ip() ip: any) {
    try {
      return this.adminClient.send({ cmd: 'verify_2fa_login' }, { body, headers, ip })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: errors.message ?? 'Input data validation failed', errors: errors.errors ?? null }, errors.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY))));

    } catch (error) {
      logger.info("api-gateway verify-login-2fa");
      logger.info(error);
      throw error;
    }
  }

  // end --- Two Factor Authentication API ---


  @Post('update-profile')
  async updateProfile(@Body() body:any, @Headers() headers: any) {
    try {
      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader) {
        let errors:any = {token:'No token provided'}
        throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const token = authorizationHeader.split('Bearer ')[1];

      return this.adminClient.send({ cmd: 'update_profile' }, { body,token,headers })
        .pipe(catchError(errors => throwError(() => new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.UNPROCESSABLE_ENTITY))));
      
    } catch (error) {
      logger.info("api-gateway update-profile");
      logger.info(error);
      throw error;
    }
  }


}
