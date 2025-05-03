import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { TaskManager } from './taskManager.js';

const taskManager = new TaskManager();

function showMenu() {
    console.clear();
    console.log(chalk.blue('=== Gerenciador de Tarefas ==='));
    console.log('1. Adicionar tarefa');
    console.log('2. Listar tarefas');
    console.log('3. Marcar tarefa como concluida');
    console.log('4. Remover tarefa');
    console.log('5. Filtrar tarefas');
    console.log('6. Sair');
    return readlineSync.questionInt(chalk.yellow('\nEscolha uma opcao: '));
}

async function main() {
    while (true) {
        const option = showMenu();
        
        switch (option) {
            case 1:
                const title = readlineSync.question(chalk.green('Digite o titulo da tarefa: '));
                await taskManager.addTask(title);
                break;
            case 2:
                await taskManager.listTasks();
                break;
            case 3:
                const idComplete = readlineSync.questionInt(chalk.green('Digite o ID da tarefa: '));
                await taskManager.completeTask(idComplete);
                break;
            case 4:
                const idRemove = readlineSync.questionInt(chalk.green('Digite o ID da tarefa: '));
                await taskManager.removeTask(idRemove);
                break;
            case 5:
                const keyword = readlineSync.question(chalk.green('Digite a palavra-chave: '));
                await taskManager.filterTasks(keyword);
                break;
            case 6:
                console.log(chalk.blue('Ate logo!'));
                process.exit(0);
            default:
                console.log(chalk.red('Opcao invalida!'));
                readlineSync.keyInPause();
        }
    }
}

main().catch(console.error);