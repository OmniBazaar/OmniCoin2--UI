const key = 'selectedEscrows';
export default class EscrowStorage {
  static getSelectedAgents() {
    const escrows = localStorage.getItem(key);
    if (escrows) {
      return JSON.parse(escrows);
    } else {
      localStorage.setItem(key, JSON.stringify([]));
      return [];
    }
  }

  static setSelectedAgents(agents) {
    localStorage.setItem(key, JSON.stringify(agents));
  }

  static addOrUpdateAgent(agent) {
    let escrows = EscrowStorage.getSelectedAgents();
    if(escrows.find(item => agent.name === item.name)) {
      escrows = escrows.map(item => {
        if (item.name === agent.name) {
          return agent;
        } else {
          return item;
        }
      });
    } else {
      escrows.push(agent);
    }
    EscrowStorage.setSelectedAgents(escrows);
  }

  static addOrUpdateAgents(agents) {
    agents.forEach(agent => EscrowStorage.addOrUpdateAgent(agent));
    return EscrowStorage.getSelectedAgents();
  }

  static removeAgents(agents) {
    let selectedAgents = this.getSelectedAgents();
    let afterRemove = selectedAgents.filter(agent => {
      return !agents.find(rmAgent => rmAgent.name === agent.name);
    });
    EscrowStorage.setSelectedAgents(afterRemove);
    return afterRemove;
  }
}
