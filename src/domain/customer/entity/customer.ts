import Address from "../value-object/address";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "../event/handler/EnviaConsoleLog1Handler";
import EnviaConsoleLog2Handler from "../event/handler/EnviaConsoleLog2Handler";
import EnviaConsoleLogHandler from "../event/handler/EnviaConsoleLogHandler";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private eventDispatcher: EventDispatcher;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    this.eventDispatcher = new EventDispatcher();

    // Registrar os handlers
    const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    const enviaConsoleLogHandler = new EnviaConsoleLogHandler();
    this.eventDispatcher.register('CustomerCreatedEvent', enviaConsoleLog1Handler);
    this.eventDispatcher.register('CustomerCreatedEvent', enviaConsoleLog2Handler);
    this.eventDispatcher.register('CustomerAddressChangedEvent', enviaConsoleLogHandler);
    
    const event = new CustomerCreatedEvent({ id: this.id, name: this.name });
    this.eventDispatcher.notify(event);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
    const event = new CustomerAddressChangedEvent({
      id: this._id,
      name: this._name,
      address: {
        street: address.street,
        number: address.number,
        zip: address.zip,
        city: address.city
      }
    });
    this.eventDispatcher.notify(event);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
