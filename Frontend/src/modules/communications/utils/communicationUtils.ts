import { Communication } from "../types/communication";
import { sortByDateAscending } from "./dateUtils";

export function getHistory(comm: Communication, all: Communication[]): Communication[] {
  let parent: Communication | undefined = comm;
  let children: Communication[] = [];

  if (comm.relatedId) {
    parent = all.find(c => c.id === comm.relatedId) ?? comm;
  }
  children = all.filter(c => c.relatedId === parent.id);
  return sortByDateAscending([...(parent ? [parent] : []), ...children]);
}

export function buildNewCommunication(): Communication {
  return {
    id: "",
    category: {
      id: 0,
      name:""
    },
    origin: {
      id: 0,
      name:""
    },
    format: {
      id: 0,
      name:""
    },
    responsibles: [],
    date: new Date().toISOString().slice(0, 10),
    description: "",
    relatedId: null,
    related: null,
    status: {
      id: 0,
      name:""
    },
    filePath: "",
  };
}

export function buildChildCommunication(parent: Communication): Communication {
  return {
    id: "",
    category: {
      id: 0,
      name:""
    },
    origin: parent.origin,
    format: parent.format ?? null,
    responsibles: [],
    date: new Date().toISOString().slice(0, 10),
    description: "",
    relatedId: parent.id,
    related: parent,
    status: {
      id: 0,
      name:""
    },
    filePath: "",
  };
}
