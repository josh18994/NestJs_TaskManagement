import { CreateTaskDto } from "src/dto/create-task.dto";
import { FilterTaskDto } from "src/dto/filter-task.dto";
import { TaskStatus } from "src/enum/task-status.enum";
import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        let task = new Task();
        task = {
            ...task,
            ...createTaskDto,
            status: TaskStatus.OPEN
        } as Task;
        await this.save(task);

        return task
    }

    public async getTasks(filterTaskDto: FilterTaskDto): Promise<Task[]> {
        const query = this.createQueryBuilder('task');
        const {search, status} = filterTaskDto;
        
        if(status) {
            query.andWhere('task.status = :status', { status }) 
        }

        if(search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search : `%${search}%`});
        }
        
        const tasks = await query.getMany();
        
        return tasks;
    }
}