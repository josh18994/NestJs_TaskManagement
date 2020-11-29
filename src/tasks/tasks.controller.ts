import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FilterTaskDto } from "src/dto/filter-task.dto";
import { TaskStatusValidation } from "src/pipes/task-status-validation.pipe";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Task } from "./task.entity";
import { TasksService } from "./tasks.service";

@Controller("tasks")
@UseGuards(AuthGuard())
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
    public createTask(
        @Body(ValidationPipe) createTaskDto: CreateTaskDto,
        @Req() req): Promise<Task> {
        return this.taskService.createTask(createTaskDto, req.user);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    public editTask(
        @Param('id', ParseIntPipe) id: number,
        @Body() createTaskDto: CreateTaskDto,
        @Req() req): Promise<Task> {
        return this.taskService.editTask(id, createTaskDto.title, createTaskDto.description, req.user);
    }

    @Patch('/:id/status')
    @UsePipes(TaskStatusValidation)
    public editTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: { status: string },
        @Req() req): Promise<Task> {
        return this.taskService.editTaskStatus(id, payload, req.user);
    }
}
