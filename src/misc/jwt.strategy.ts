import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from "src/users/user.entity";
import { UsersRepository } from "src/users/users.repository";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository) 
        private usersRepository: UsersRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'SUPER+AWESOME_SECRET_007'
        });
    }

    public async validate(req): Promise<User> {
        const user = await this.usersRepository.findOne({username: req.username});
        if(!user) throw new UnauthorizedException();
        return user;
    }

}