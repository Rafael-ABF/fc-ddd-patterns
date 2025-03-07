import CustomerCreatedEvent from './customer-created.event';

describe('CustomerCreatedEvent Tests', () => {
  it('should create an event with correct data', () => {
    const eventData = {
      id: 'cust_created',
      name: 'Mr Customer Created',
      email: 'created@customer.com'
    };
    const event = new CustomerCreatedEvent(eventData);

    expect(event.dataTimeOccurred).toBeInstanceOf(Date);
    expect(event.eventData).toEqual(eventData);
  });
});