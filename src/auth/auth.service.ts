import { Injectable, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ){}

  sign(dto: LoginUserDto){
    const email = dto.email;
    const user = this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('정보가 없습니다.');

    if (user.password !== dto.password) throw new UnauthorizedException();

    const payload = { sub : user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }
}
