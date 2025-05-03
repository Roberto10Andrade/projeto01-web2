import fs from 'fs/promises';
import chalk from 'chalk';

export class TaskManager {
    constructor() {
        this.tasksFile = './tasks.json';
    }

    async loadTasks() {
        try {
            const data = await fs.readFile(this.tasksFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveTasks(tasks) {
        await fs.writeFile(this.tasksFile, JSON.stringify(tasks, null, 2));
    }

    async addTask(title) {
        const tasks = await this.loadTasks();
        const newTask = {
            id: tasks.length + 1,
            title,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        await this.saveTasks(tasks);
        console.log(chalk.green('Tarefa adicionada com sucesso!'));
    }

    async listTasks() {
        const tasks = await this.loadTasks();
        if (tasks.length === 0) {
            console.log(chalk.yellow('Nenhuma tarefa encontrada.'));
            return;
        }

        tasks.forEach(task => {
            const status = task.completed ? chalk.green('✓') : chalk.red('✗');
            const date = new Date(task.createdAt).toLocaleString();
            console.log(`${status} [${task.id}] ${task.title} (Criada em: ${date})`);
        });
    }

    async completeTask(id) {
        const tasks = await this.loadTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = true;
            await this.saveTasks(tasks);
            console.log(chalk.green('Tarefa marcada como concluída!'));
        } else {
            console.log(chalk.red('Tarefa não encontrada!'));
        }
    }

    async removeTask(id) {
        const tasks = await this.loadTasks();
        const filteredTasks = tasks.filter(t => t.id !== id);
        if (tasks.length !== filteredTasks.length) {
            await this.saveTasks(filteredTasks);
            console.log(chalk.green('Tarefa removida com sucesso!'));
        } else {
            console.log(chalk.red('Tarefa não encontrada!'));
        }
    }

    async filterTasks(keyword) {
        const tasks = await this.loadTasks();
        const filteredTasks = tasks.filter(task => 
            task.title.toLowerCase().includes(keyword.toLowerCase())
        );

        if (filteredTasks.length === 0) {
            console.log(chalk.yellow('Nenhuma tarefa encontrada com essa palavra-chave.'));
            return;
        }

        filteredTasks.forEach(task => {
            const status = task.completed ? chalk.green('✓') : chalk.red('✗');
            const date = new Date(task.createdAt).toLocaleString();
            console.log(`${status} [${task.id}] ${task.title} (Criada em: ${date})`);
        });
    }
}