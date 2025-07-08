import { Action } from "../types/action";

export function buildNewAction(): Action {
    return {
        id: "",
        year: new Date().getFullYear(),
        area: {
          id: "",
          name: "",
          description: ""
          },
        objective: {
          id: "",
          name: "",
          description: ""
        },
        name: "",
        description: "",
        order: 0,
        status: {
          id: 0,
          name: ""
        },
        startIn: "",
        finisIn: "",
      };
}