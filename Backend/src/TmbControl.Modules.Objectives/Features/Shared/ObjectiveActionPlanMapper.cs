using System.Linq.Expressions;
using TmbControl.Modules.Objectives.Entities;

namespace TmbControl.Modules.Objectives.Features.Shared;

public static class ObjectiveActionPlanMapper
{
    public static readonly Expression<Func<ActionPlan, ObjectiveActionPlanDto>> ProjectToDto = action => new ObjectiveActionPlanDto
    {
        Id = action.Id,
        Name = action.Name,
        Description = action.Description,
        Year = action.Year,
        StartIn = action.StartIn,
        FinisIn = action.FinisIn,
        Area = new ObjectiveAreaDto
        {
            Id = action.Area.Id,
            Name = action.Area.Name,
            Description = action.Area.Description,
        },
        Objective = new ObjectiveDto
        {
            Id = action.Objective.Id,
            Name = action.Objective.Name,
            Description = action.Objective.Description

        },
        Status = new ObjectiveStatusDto
        {
            Id = action.Status.Id,
            Name = action.Status.Name
        }
    };
}
