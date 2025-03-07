import Address from "../value-object/address";
import Customer from "./customer";
import EventDispatcher from '../../@shared/event/event-dispatcher';
import EnviaConsoleLog1Handler from '../event/handler/EnviaConsoleLog1Handler';
import EnviaConsoleLog2Handler from '../event/handler/EnviaConsoleLog2Handler';

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it('should log messages when customer is created', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    const customer = new Customer('123', 'John Doe');

    expect(consoleSpy).toHaveBeenCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');
    expect(consoleSpy).toHaveBeenCalledWith('Esse é o segundo console.log do evento: CustomerCreated');
  });

  it('should log message when customer address is changed', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const address = new Address("New Street", 123, "78000-000", "Cuiabá");
    const customer = new Customer('cust_change_addres', 'Mr Mover');

    customer.changeAddress(address);
    
    expect(consoleSpy).toHaveBeenCalledWith(`Endereço do cliente cust_change_addres, Mr Mover foi alterado para: New Street, 123, 78000-000, Cuiabá`);
  });
});
