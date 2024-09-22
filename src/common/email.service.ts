import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', //Adjust with your email provider
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendTaskAssignedEmail(to: string, taskTitle: string) {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'You have been assigned a task',
      text: `You have been assigned to the task: ${taskTitle}`,
    });
  }

  async sendCommentNotification(
    to: string,
    taskTitle: string,
    commenterName: string,
  ) {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'New comment on your task',
      text: `${commenterName} has commented on the task: ${taskTitle}`,
    });
  }
}
