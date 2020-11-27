import { IsOptional, IsIn } from "class-validator";
import { TaskStatus } from "src/enum/task-status.enum";

export class FilterTaskDto {
    @IsOptional()
    search: string;

    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.CLOSED])
    status: string;
}