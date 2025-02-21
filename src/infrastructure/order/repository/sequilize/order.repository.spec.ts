import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
			sync: { force: true },
		});

		await sequelize.addModels([
			CustomerModel,
			OrderModel,
			OrderItemModel,
			ProductModel,
		]);
		await sequelize.sync();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it("should create a new order", async () => {
		const customerRepository = new CustomerRepository();
		const customer = new Customer("cust_1", "Mr. Customer");
		const address = new Address("Street A", 1, "Zipcode 1", "Cuiaba");
		customer.changeAddress(address);
		await customerRepository.create(customer);

		const productRepository = new ProductRepository();
		const product = new Product("prod_1", "Product 1", 10);
		await productRepository.create(product);

		const orderItem = new OrderItem(
			"ord_it_1",
			product.name,
			product.price,
			product.id,
			2
		);

		const order = new Order("ord_1", "cust_1", [orderItem]);

		const orderRepository = new OrderRepository();
		await orderRepository.create(order);

		const orderModel = await OrderModel.findOne({
			where: { id: order.id },
			include: ["items"],
		});

		expect(orderModel.toJSON()).toStrictEqual({
			id: "ord_1",
			customer_id: "cust_1",
			total: order.total(),
			items: [
				{
					id: orderItem.id,
					name: orderItem.name,
					price: orderItem.price,
					quantity: orderItem.quantity,
					order_id: "ord_1",
					product_id: "prod_1",
				},
			],
		});
	});

	it("should update an order", async () => {
		const customerRepository = new CustomerRepository();
		const customer = new Customer("cust_1", "Mr. Customer");
		const address = new Address("Street A", 1, "Zipcode 1", "Cuiaba");
		customer.changeAddress(address);
		await customerRepository.create(customer);

		const productRepository = new ProductRepository();
		const product = new Product("prod_1", "Product 1", 10);
		await productRepository.create(product);

		const orderItem = new OrderItem(
			"ord_it_1",
			product.name,
			product.price,
			product.id,
			2
		);

		const order = new Order("ord_1", "cust_1", [orderItem]);

		const orderRepository = new OrderRepository();
		await orderRepository.create(order);

		const product2 = new Product("prod_2", "Product 2", 11);
		await productRepository.create(product2);

		const orderItem2 = new OrderItem(
			"ord_it_2",
			product2.name,
			product2.price,
			product2.id,
			3
		);

		order.changeItems([orderItem, orderItem2]);
		await orderRepository.update(order);

		const orderModel = await OrderModel.findOne({
			where: { id: order.id },
			include: ["items"],
		});

		expect(orderModel.toJSON()).toStrictEqual({
			id: "ord_1",
			customer_id: "cust_1",
			total: order.total(),
			items: [
				{
					id: orderItem.id,
					name: orderItem.name,
					price: orderItem.price,
					quantity: orderItem.quantity,
					order_id: "ord_1",
					product_id: "prod_1",
				},
				{
					id: orderItem2.id,
					name: orderItem2.name,
					price: orderItem2.price,
					quantity: orderItem2.quantity,
					order_id: "ord_1",
					product_id: "prod_2",
				},
			],
		});
	});

	it("should find an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("cust_find", "Mr. Customer Find");
        const address = new Address("Street B", 2, "Zipcode 2", "Curitiba");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("prod_find", "Product Found", 7);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "ord_item_find",
            product.name,
            product.price,
            product.id,
            3
        );

        const order = new Order("ord_find", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find("ord_find");

        expect(order).toStrictEqual(orderResult);
    });
	
	it("should not find an order", async () => {
		const orderRepository = new OrderRepository();
		await expect(orderRepository.find("ord_not_found")).rejects.toThrowError("Order not found");
	});

	it("should find all orders", async () => {
		const customerRepository = new CustomerRepository();
		const customer = new Customer("cust_all_1", "Mr. Customer All One");
		const address = new Address("Street C", 3, "Zipcode 3", "Curvelandia");
		customer.changeAddress(address);
		await customerRepository.create(customer);

		const productRepository = new ProductRepository();
		const product = new Product("prod_all_1", "Product All One", 1);
		await productRepository.create(product);

		const orderItem = new OrderItem(
			"ord_item_all_1",
			product.name,
			product.price,
			product.id,
			3
		);

		const order = new Order("ord_all", customer.id, [orderItem]);

		const orderRepository = new OrderRepository();
		await orderRepository.create(order);

		//segundo customer, produto e order
		const customer2 = new Customer("cust_all_2", "Mr. Customer All Two");
		const address2 = new Address("Street D", 4, "Zipcode 4", "Cuba");
		customer2.changeAddress(address2);
		await customerRepository.create(customer2);

		const product2 = new Product("prod_all_2", "Product All Two", 2);
		await productRepository.create(product2);

		const orderItem2 = new OrderItem(
			"ord_item_all_2",
			product2.name,
			product2.price,
			product2.id,
			5
		);

		const order2 = new Order("ord_all_2", customer2.id, [orderItem2]);

		await orderRepository.create(order2);

		const orders = await orderRepository.findAll();

		expect(orders).toStrictEqual([order, order2]);
	});
});
