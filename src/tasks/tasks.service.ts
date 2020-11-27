import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterTaskDto } from 'src/dto/filter-task.dto';
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

    public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    public async deleteTask(id: number) {
        const found = await this.getTaskWithId(id);
        await this.taskRepository.delete(found.id);
        return {
            message: 'Delete successful'
        }
    }

    public async editTask(id: number, title: string, description: string): Promise<Task> {
        await this.taskRepository.update(id, {title, description});
        return this.getTaskWithId(id);
    }

    public async editTaskStatus(id: number, payload: {status: string}) {
        await this.taskRepository.update(id, payload);
        const task = await this.getTaskWithId(id);
        return task;
    }
}
