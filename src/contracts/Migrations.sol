pragma solidity >=0.4.21 <0.6.0;

/* 
Миграция -- файл JavaScript, который отвечает за развёртывание контрактов внутри сети эфира
Файл создаётся при вызове команды "truffle init". 
 Truffle требует, чтобы в проекте присутствовал контракт Migrations, который отслеживает
 какие миграции были выполнены в текущей сети и затем отправляет их в сеть эфира.
Данный код был сгенерирован автоматически, это типичный шаблон для большинства проектов.
*/
contract Migrations { // Контракт (КЛАСС) Migrations
  address public owner; // Владелец (свойство)
  uint public last_completed_migration; // Последняя завершённая миграция (свойство)

  constructor() public { // Конструктор, который инициализирует свойство "Владелец" при деплое контракта
    owner = msg.sender;
  }

  modifier restricted() { // модификатор, который проверяет условие,
  // что владелец контракта совпадает с тем, кто вызывает что-либо
  // если условие модификатора выполнено не будет, в выполнении ф-ции (или другой инструкции) будет отказано
    if (msg.sender == owner) _;
  }

  function setCompleted(uint completed) public restricted { // Установить миграцию завершённой
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted { // Создать новую миграцию
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
