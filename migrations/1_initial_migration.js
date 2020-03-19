
/* 
Это стандартный (типичный) файл, который необходимо создавать для каждого проекта
Он нужен для того, чтобы мы могли в дальнейшем пользоваться функциями миграции
Префикс в названии файла говорит о том, в каком порядке необходимо обрабатывать миграции
*/
const Migrations = artifacts.require("Migrations");
// Сообщаем truffle с каким контрактом, мы хотим взаимодействовать
// Все миграции экспортируются через синтаксис module.exports.
// Этот объект помогает развёртывать смарт-контракты.
// deployer -- средство развёртывания
// Ниже происходит развёртывание контракта в сети
module.exports = deployer => deployer.deploy(migrations);
