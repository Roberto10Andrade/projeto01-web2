import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { TaskManager } from './taskManager.js';

const taskManager = new TaskManager();

function showMenu() {
    console.clear();
    console.log(chalk.blue('=== Gerenciador de Tarefas ==='));
    console.log('1. Adicionar tarefa');
    console.log('2. Listar tarefas');
    console.log('3. Marcar tarefa como concluída');
    console.log('4. Remover tarefa');
    console.log('5. Filtrar tarefas');
    console.log('6. Sair');
    return readlineSync.questionInt(chalk.yellow('\nEscolha uma opção: '));
}

async function main() {
    while (true) {
        const option = showMenu();
        
        switch (option) {
            case 1:
                const title = readlineSync.question(chalk.green('Digite o título da tarefa: '));
                taskManager.addTask(title);
                break;
            case 2:
                taskManager.listTasks();
                readlineSync.keyInPause();
                break;
            case 3:
                const idComplete = readlineSync.questionInt(chalk.green('Digite o ID da tarefa: '));
                taskManager.completeTask(idComplete);
                break;
            case 4:
                const idRemove = readlineSync.questionInt(chalk.green('Digite o ID da tarefa: '));
                taskManager.removeTask(idRemove);
                break;
            case 5:
                const keyword = readlineSync.question(chalk.green('Digite a palavra-chave: '));
                taskManager.filterTasks(keyword);
                readlineSync.keyInPause();
                break;
            case 6:
                console.log(chalk.blue('Até logo!'));
                process.exit(0);
            default:
                console.log(chalk.red('Opção inválida!'));
                readlineSync.keyInPause();
        }
    }
}

main().catch(console.error);