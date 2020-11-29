import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthenticateUserDto } from 'src/dto/auth-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('/signup')
    public signUpUser(@Body(ValidationPipe) authUserDto: AuthenticateUserDto): Promise<void> {
        return this.usersService.signUpUser(authUserDto);
    }

    @Get()
    public getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
    }

    @Post('/login')
    public loginUser(@Body(ValidationPipe) authUserDto: AuthenticateUserDto): Promise<{accessToken: string}> {
        return this.usersService.loginUser(authUserDto);
    }
}