import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ok } from 'assert';

@Injectable()
export class UserService {

  private users: User[] = [];
  private nextId = 1;

  private userAlreadyExists(dto: CreateUserDto): boolean {
    return this.users.some((u) => u.email === dto.email);
  }

  private withoutPassword(user: User){
    const { password, ...safe } = user;
    return safe;
  }

  findByEmail(email: string){
    return this.users.find((u) => u.email === email);
  }

  create(createUserDto: CreateUserDto){
    const user: User = { id: this.nextId++, ...createUserDto };
    const exists = this.userAlreadyExists(createUserDto);
    
    if (exists){
      throw new Error('User already exists.');
    }

    this.users.push(user);
    return { message: ok, name: user.name, email: user.email } ;
  }

  findAll() {
    return this.users.map((u) => this.withoutPassword(u));
  }

  findOne(id: number) {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error('User Doesn\'t exists.');
    return this.withoutPassword(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error('User Doesn\'t exists.');

    Object.assign(user, updateUserDto);
    return this.withoutPassword(user);
  }

  remove(id: number) {
    const index = this.users.findIndex((u) => u.id === id);
    if (!index) throw new Error('Not Found');
    return this.users.splice(index, 1);
  }
}
