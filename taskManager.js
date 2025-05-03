import fs from 'fs/promises';
import chalk from 'chalk';
import readlineSync from 'readline-sync';

export class TaskManager {
    constructor() {
        this.tasksFile = './tasks.json';
    }

    async loadTasks() {
        try {
            const data = await fs.readFile(this.tasksFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log(chalk.yellow('Arquivo de tarefas não encontrado. Criando novo arquivo...'));
            try {
                const emptyTasks = [];
                await fs.writeFile(this.tasksFile, JSON.stringify(emptyTasks, null, 2));
                console.log(chalk.green('Arquivo de tarefas criado com sucesso!'));
                return emptyTasks;
            } catch (writeError) {
                console.error(chalk.red('Erro ao criar arquivo de tarefas:', writeError));
                return [];
            }
        }
    }

    async saveTasks(tasks) {
        await fs.writeFile(this.tasksFile, JSON.stringify(tasks, null, 2));
    }

    async addTask(title) {
        try {
            const tasks = await this.loadTasks();
            const newTask = {
                id: tasks.length + 1,
                title,
                completed: false,
                createdAt: new Date().toISOString()
            };
            tasks.push(newTask);
            await this.saveTasks(tasks);
            
            console.clear();
            console.log(chalk.green('\n=== Tarefa Adicionada com Sucesso! ==='));
            console.log(chalk.blue(`\nID: ${newTask.id}`));
            console.log(chalk.blue(`Título: ${newTask.title}`));
            console.log(chalk.blue(`Data de criação: ${new Date(newTask.createdAt).toLocaleString()}`));
            console.log(chalk.green('\nPressione qualquer tecla para continuar...'));
            readlineSync.keyInPause();
        } catch (error) {
            console.error(chalk.red('Erro ao adicionar tarefa:', error));
        }
    }

    async listTasks() {
        try {
            const tasks = await this.loadTasks();
            console.clear();
            console.log(chalk.blue('\n=== Lista de Tarefas ==='));
            console.log(chalk.gray(`Total de tarefas: ${tasks.length}`));
            
            if (tasks.length === 0) {
                console.log(chalk.yellow('\nNenhuma tarefa encontrada.'));
                console.log(chalk.green('\nPressione qualquer tecla para continuar...'));
                readlineSync.keyInPause();
                return;
            }

            tasks.forEach(task => {
                const status = task.completed ? chalk.green('✓') : chalk.red('✗');
                const date = new Date(task.createdAt).toLocaleString();
                console.log(chalk.blue(`\nTarefa #${task.id}`));
                console.log(`Status: ${status}`);
                console.log(`Título: ${task.title}`);
                console.log(`Data de criação: ${date}`);
                console.log(chalk.gray('-------------------'));
            });
            
            console.log(chalk.green('\nPressione qualquer tecla para continuar...'));
            readlineSync.keyInPause();
        } catch (error) {
            console.error(chalk.red('Erro ao listar tarefas:', error));
        }
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
        try {
            const tasks = await this.loadTasks();
            console.clear();
            console.log(chalk.blue('\n=== Resultado da Busca ==='));
            console.log(chalk.gray(`Palavra-chave: "${keyword}"`));
            
            const filteredTasks = tasks.filter(task => 
                task.title.toLowerCase().includes(keyword.toLowerCase())
            );

            if (filteredTasks.length === 0) {
                console.log(chalk.yellow('\nNenhuma tarefa encontrada com essa palavra-chave.'));
                console.log(chalk.green('\nPressione qualquer tecla para continuar...'));
                readlineSync.keyInPause();
                return;
            }

            console.log(chalk.gray(`\nTotal de tarefas encontradas: ${filteredTasks.length}`));
            
            filteredTasks.forEach(task => {
                const status = task.completed ? chalk.green('✓') : chalk.red('✗');
                const date = new Date(task.createdAt).toLocaleString();
                console.log(chalk.blue(`\nTarefa #${task.id}`));
                console.log(`Status: ${status}`);
                console.log(`Título: ${task.title}`);
                console.log(`Data de criação: ${date}`);
                console.log(chalk.gray('-------------------'));
            });
            
            console.log(chalk.green('\nPressione qualquer tecla para continuar...'));
            readlineSync.keyInPause();
        } catch (error) {
            console.error(chalk.red('Erro ao filtrar tarefas:', error));
        }
    }
}