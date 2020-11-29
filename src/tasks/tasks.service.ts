import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterTaskDto } from 'src/dto/filter-task.dto';
import { User } from 'src/users/user.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository) { }


    public async getTasks(filterTaskDto: FilterTaskDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterTaskDto);
    }


    public async getTaskWithId(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    public async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    public async deleteTask(id: number) {
        const found = await this.getTaskWithId(id);
        await this.taskRepository.delete(found.id);
        return {
            message: 'Delete successful'
        }
    }

    public async editTask(id: number, title: string, description: string, user: User): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: {id, userId: user.id}});
        if(!task) throw new NotFoundException();
        await this.taskRepository.update(id, {title, description});
        return await this.getTaskWithId(id);
    }

    public async editTaskStatus(id: number, payload: {status: string}, user: User) {
        const task = await this.taskRepository.findOne({ where: {id, userId: user.id}});
        if(!task) throw new NotFoundException();
        await this.taskRepository.update(id, payload);
        return await this.getTaskWithId(id);
    }
}
