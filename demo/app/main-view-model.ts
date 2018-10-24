import { Observable } from 'tns-core-modules/data/observable';
import { HereMaps } from 'nativescript-here-maps';

export class HelloWorldModel extends Observable {
  private hereMaps: HereMaps;

  constructor() {
    super();

    this.hereMaps = new HereMaps();
  }
}
