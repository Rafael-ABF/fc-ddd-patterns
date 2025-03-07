import CustomerAddressChangedEvent from './customer-address-changed.event';

describe('CustomerAddressChangedEvent Tests', () => {
  it('should create an event with correct data', () => {
    const eventData = {
      id: 'cust_address_changed',
      name: 'Mr Customer Address Changed',
      address: {
        street: 'Street 1',
        number: 123,
        zip: '12345',
        city: 'City 1'
      }
    };
    const event = new CustomerAddressChangedEvent(eventData);

    expect(event.dataTimeOccurred).toBeInstanceOf(Date);
    expect(event.eventData).toEqual(eventData);
  });
});