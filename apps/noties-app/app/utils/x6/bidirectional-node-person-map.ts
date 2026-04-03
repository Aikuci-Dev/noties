export type TBidirectionalNodePersonMap = BidirectionalNodePersonMap;
export class BidirectionalNodePersonMap {
  private map = new BaseBidirectionalMap<PersonNode, Person>();

  // Node Person
  setNodePerson({ person, nodePerson }: { person: Person; nodePerson: PersonNode }) {
    return this.map.setBy2(person, nodePerson);
  }
  getNodePerson({ id }: { id: Person["id"] }) {
    return this.map.getBy2(id);
  }

  // Person
  setPerson({ person, nodePerson }: { person: Person; nodePerson: PersonNode }) {
    return this.map.setBy1(nodePerson, person);
  }
  getPerson({ id }: { id: PersonNode["id"] }) {
    return this.map.getBy1(id);
  }
}
