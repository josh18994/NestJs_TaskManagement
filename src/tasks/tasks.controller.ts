import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { FilterTaskDto } from "src/dto/filter-task.dto";
import { TaskStatusValidation } from "src/pipes/task-status-validation.pipe";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Task } from "./task.entity";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController {
    constructor(private taskService: TasksService) { }

    //If we use ValidationPipe then it refers to validation in dto else if we use TaskStatusvalidation then it refers to custom validation

    @Get()
    public getTasks(@Query(TaskStatusValidation) filterTaskDto: FilterTaskDto): Promise<Task[]> {
        return this.taskService.getTasks(filterTaskDto);
    }

    @Get('/:id')
    public getTaskWithId(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskWithId(id);
    }

    @Post()
    public createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskService.createTask(createTaskDto);
    }

    @Delete('/:id')
    public deleteTask(@Param('id', ParseIntPipe) id: number): any {
        return this.taskService.deleteTask(id);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    public editTask(
        @Param('id', ParseIntPipe) id: number,
        @Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskService.editTask(id, createTaskDto.title, createTaskDto.description);
    }

    @Patch('/:id/status')
    @UsePipes(TaskStatusValidation)
    public editTaskStatus(@Param('id', ParseIntPipe) id: number, @Body() payload: {status: string}) {
        return this.taskService.editTaskStatus(id, payload);
    }
}
