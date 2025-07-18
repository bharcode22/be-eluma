import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { RegisDTO } from './dto/register-auth.dto';
import { LoginDTO } from './dto/login-auth.dto';
dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ){}

    async validateToken(token: string): Promise<any> {
        const secret = this.configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is missing or undefined');
        }

        const blacklistedToken = await this.prisma.blacklistedToken.findUnique({
            where: { token },
        });

        if (blacklistedToken) {
            throw new UnauthorizedException('Token has been blacklisted');
        }

        try {
            const decoded = this.jwtService.verify(token, { secret });
            return decoded;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async register(data: RegisDTO): Promise<User> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const newUser = await this.prisma.user.create({
            data: {
                username: data.username,
                name: data.name,
                email: data.email,
                password: hashedPassword,
            }
        });

        return newUser;
    }

    async login(data: LoginDTO): Promise<{ access_token: string; user: any }> {
        const jwtSecret = this.configService.get<string>('JWT_SECRET');
        const user = await this.prisma.user.findFirst({
            where: { 
                email: data.email 
            },
        });
    
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
    
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
    
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }
    
        const payload = { id: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload, { secret: jwtSecret });
    
        return { 
            user: {
                id       : user.id,
                username : user.username,
                name     : user.name,
                email    : user.email,
                role     : user.role
            },
            access_token
        };
    }

    async logout(token: string): Promise<{ id: number; createdAt: Date;}> {
        const existingToken = await this.prisma.blacklistedToken.findUnique({
            where: { token },
        });
    
        if (existingToken) {
            return {
                id: existingToken.id, 
                createdAt: existingToken.createdAt 
            };
        }
    
        const blacklistedToken = await this.prisma.blacklistedToken.create({
            data: { token },
        });
    
        return blacklistedToken
    }
}