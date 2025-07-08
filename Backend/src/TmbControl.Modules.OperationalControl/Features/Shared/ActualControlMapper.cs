using System.Linq.Expressions;
using TmbControl.Modules.OperationalControl.Entities;

namespace TmbControl.Modules.OperationalControl.Features.Shared;

public static class ActualControlMapper
{
    public static readonly Expression<Func<ActualControl, ActualControlDto>> ProjectToDto = control => new ActualControlDto
    {
        Id = control.Id,
        Concept = control.Concept,
        Control = control.Control,
        Observations = control.Observations,
        LastReview = control.LastReview,
        NextReview = control.NextReview,
        Group = new OperationalControlGroupDto { Id = control.Group.Id, Name = control.Group.Name },
        Frequency = new OperationalControlFrequencyDto { Id = control.Frequency.Id, Name = control.Frequency.Name },
        Status = new OperationalControlStatusDto { Id = control.Status.Id, Name = control.Status.Name },
        Revisions = control.Revisions
            .OrderByDescending(r => r.Date)
            //.Take(5)
            .Select(r => new OperationalControlRevisionDto
            {
                Date = r.Date,
                NextReview = r.NextReview,
                Observations = r.Observations,
                Frequency = new OperationalControlFrequencyDto { Id = r.Frequency.Id, Name = r.Frequency.Name },
                Status = new OperationalControlStatusDto { Id = r.Status.Id, Name = r.Status.Name }
            }).ToList()
    };
}
