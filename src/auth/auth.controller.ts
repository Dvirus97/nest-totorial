import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  /*(param) @Req() req: Request (express)*/
  /*(param) @Body() dto: AuthDto */
  /* @Body('email') email: string //this is for specific parameter */
  /* pipe is to transform data :  ParseIntPipe for integer */
  signUp(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
