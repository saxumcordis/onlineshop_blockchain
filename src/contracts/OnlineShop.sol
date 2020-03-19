pragma solidity ^0.5.0;

contract OnlineShop {
    string public name; //Свойство name

    uint public productCount = 0; //Количество текущих продуктов (свойство)
    mapping(uint => Product) public products; //"Словарь" ID -> PRODUCT 


    struct Product { // Структура продукта
    	uint id; //ID продукта
    	string name; //Имя продукта
    	uint price; //Цена продукта
    	address payable owner; //Адрес владельца продукта
    	bool purchased; //Состояние: куплен или нет
    }

    event ProductCreated ( // Создаём событие, которое будет посылаться в БлокЧейн, 
        //чтобы можно было прослушать (узнать о) создание продукта
    	uint id,
    	string name,
    	uint price,
    	address payable owner,
    	bool purchased
    );

    event ProductPurchased ( //Создаём событие, которое будет посылаться в БлокЧейн, 
        //чтобы можно было прослушать (узнать о) покупку продукта
    	uint id,
    	string name,
    	uint price,
    	address payable owner,
    	bool purchased
    );


    constructor() public { //Конструктор, который задаёт свойство "ИМЯ" нашему контракту
        name = "Online Shop";
    }	

    function createProduct(string _name, uint _price) public { //Функция создания продукта. На вход
    	// Убеждаемся, что введены непустое имя и неотрицательная цена
    	require(bytes(_name).length > 0 && _price > 0);
    	// Увеличиваем счётчик продуктов на 1
    	productCount++;
    	// Добавляем продукт в "словарь". msg.sender -- адрес того, кто вызвал эту ф-цию
    	products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    	//Вызываем событие, которое отправлит "транзакцию" в блокчейн
    	emit ProductCreated(productCount, _name, _price, msg.sender, false);

    }

    function purchaseProduct (uint _id) public payable {
    	//Достанем продукт из нашего списка. "memory" используется, так как это переменная структуры,
        // которые стандартно задаются storage переменными (вечно хранящимися в блокчейне)
        // memory-переменная будет очищена после выхода из ф-ции
    	Product memory _product = products[_id];
    	//Достаём адрес владельца продукта
    	address payable _seller = _product.owner;
    	//Проверяем, правильный ли это продукт (Существует ли он исходя из наших правил организации магазина
        // ID > 0 и ID < Кол-ва продуктов)
        // require требует, чтобы условие в скобках выполнялось, иначе функция завершит свою работу на этом этапе.
    	require(_product.id > 0 && _product.id < productCount);
    	// Достаточно ли было отправлено денег (msg.value -- количество ETH, которые были переданы при вызове ф-ции)
    	require(msg.value >= _product.price);
    	//Проверка, что продукт не был приобретён раннее
    	require(!_product.purchased);
    	//Проверка, чтобы владелец товара не купил его сам у себя
    	require(_seller != msg.sender);
    	//Смена владельца продукта
    	_product.owner = msg.sender;
    	//Обозначаем продукт приобретённым
    	_product.purchased = true;
    	//Обновляем продукт в нашем списке
    	products[_id] = _product;
    	//Переводим первому владельцу средства
    	address(_seller).transfer(msg.value);
    	//Вызываем событие, которое отправит "транзакцию" в блокчейн
    	emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}

  