import { ActualControl } from "../types/operationalControl";

export function buildNewActualControl(): ActualControl {
    return {
        id: "",
        group: {
            id:0,
            name:""
        },
        concept: "",
        control: "",
        lastReview: null,
        frequency: {
            id:0,
            name:""
        },
        nextReview: null,
        status: {
            id:0,
            name:""
        },
        observations: null,
        revisions: [],
    };
}