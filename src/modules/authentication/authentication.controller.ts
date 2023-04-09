import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { LoginAuthenticationDto } from './dto/login-authentication.dto';
import { Request, Response } from 'express';
import { User } from './Entities/user.Entity';
import { ApplyUser } from './guard/current-user.guard';
import { CurrentUser } from './decorator/user.decorator';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  async loginUser(@Body() loginDto: any, @Res() res: Response) {
    const user = await this.authenticationService.login(
      loginDto as LoginAuthenticationDto
    );

    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('Authentication', user.token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    }); // max age 2 hours

    return res.status(200).send({ success: true });
  }

  @Post('register')
  async registerUser(
    @Body() body: CreateAuthenticationDto,
    @Res() res: Response
  ) {
    const user = await this.authenticationService.register(body);
    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('Authentication', user.token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    }); // max age 2 hours
    return res.status(200).send({ success: true });
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('IsAuthenticated');
    res.clearCookie('Authentication');
    return res.status(200).send({ success: true });
  }

  @Get('authstatus')
  @UseGuards(ApplyUser)
  authStatus(@CurrentUser() user: User) {
    return { status: !!user, user };
  }
}
