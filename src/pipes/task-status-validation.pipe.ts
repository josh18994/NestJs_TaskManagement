import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "src/enum/task-status.enum";

export class TaskStatusValidation implements PipeTransform {
    readonly acceptedValues = [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.CLOSED];

    transform(value: any) {
        if (value.status) {
            value.status = value.status.toUpperCase();
            if (this.acceptedValues.indexOf(value.status) < 0) {
                throw new BadRequestException('Invalid Status')
            }
        }
        return value;
    }
}