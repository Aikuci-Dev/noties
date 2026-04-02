export type TBidirectionalNodePersonMap = BidirectionalNodePersonMap;
export class BidirectionalNodePersonMap {
  private map = new BaseBidirectionalMap<NodePerson, Person>();

  // Node Person
  setNodePerson({ person, nodePerson }: { person: Person; nodePerson: NodePerson }) {
    return this.map.setBy2(person, nodePerson);
  }
  getNodePerson({ id }: { id: Person["id"] }) {
    return this.map.getBy2(id);
  }

  // Person
  setPerson({ person, nodePerson }: { person: Person; nodePerson: NodePerson }) {
    return this.map.setBy1(nodePerson, person);
  }
  getPerson({ id }: { id: NodePerson["id"] }) {
    return this.map.getBy1(id);
  }
}
