import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { AuthenticateUserDto } from 'src/dto/auth-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtService: JwtService) { }

    public signUpUser(authUserDto: AuthenticateUserDto): Promise<void> {
        return this.usersRepository.signUpUser(authUserDto);
    }

    public async getAllUsers(): Promise<User[]> {
        const query = this.usersRepository.createQueryBuilder('user');
        const users = await query.getMany();

        return users;
    }

    public async loginUser(authUserDto: AuthenticateUserDto): Promise<{accessToken: string}> {
        const response = await this.usersRepository.loginUser(authUserDto);
        if (response) {
            const accessToken = await this.jwtService.sign(response)
            return { accessToken };
        }
    }
}
