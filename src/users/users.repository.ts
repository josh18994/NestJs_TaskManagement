import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthenticateUserDto } from 'src/dto/auth-user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";


@EntityRepository(User)
export class UsersRepository extends Repository<User> {

    public async signUpUser(authUserDto: AuthenticateUserDto): Promise<void> {
        const { username, password } = authUserDto;
        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') throw new ConflictException(error.detail)
            else throw new InternalServerErrorException();
        }
    }

    public async loginUser(authUserDto: AuthenticateUserDto): Promise<{username: string}> {
        const user = await this.findOne({ username: authUserDto.username });
        if (!user) {
            throw new NotFoundException(`User with username: ${authUserDto.username} not found`);
        }

        const validation = await user.authenticateUser(authUserDto.password);
        if(!validation) {
            throw new UnauthorizedException('Credentials do not match');
        }

        return {username: user.username};
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}