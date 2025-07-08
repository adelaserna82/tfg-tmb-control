using TmbControl.Modules.OperationalControl.Entities;

namespace TmbControl.Modules.OperationalControl.Persistence;

public static class OperationalControlDbContextSeeder
{
    public static async Task SeedAsync(OperationalControlDbContext context)
    {
        if (!context.Statuses.Any())
        {
            context.Statuses.AddRange(
                new Status { Name = "Conforme", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Status { Name = "Pendiente", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Status { Name = "No requiere revisión", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" }
            );
        }

        if (!context.Frequencies.Any())
        {
            context.Frequencies.AddRange(
                new Frequency { Name = "No aplica", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Frequency { Name = "Periódica", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder"  },
                new Frequency { Name = "Mensual", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder"  },
                new Frequency { Name = "Cada 2 meses", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder"  },
                new Frequency { Name = "Cada 6 meses", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder"  },
                new Frequency { Name = "Anual", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder"  },
                new Frequency { Name = "Trimestral", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder"  },
                new Frequency { Name = "Cada 2 años", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder"  },
                new Frequency { Name = "Cada 3 años", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder"  },
                new Frequency { Name = "Cada 10 años", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder"  }
            );
        }

        if (!context.Groups.Any())
        {
            context.Groups.AddRange(
                new Group { Name = "Licencias y permisos", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Group { Name = "Gestiones administrativas", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" }
            );
        }

        await context.SaveChangesAsync();

        if (!context.ActualControls.Any())
        {
            var controls = new List<ActualControl>
            {
                new ActualControl
                {
                    Id = Guid.NewGuid(),
                    Concept = "Revisión de Licencia Ambiental",
                    Control = "Verificar que la licencia esté vigente y en regla",
                    Observations = "Última revisión sin incidencias",
                    LastReview = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-6)),
                    NextReview = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(6)),
                    GroupId = 1,
                    FrequencyId = 1,
                    StatusId = 1,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "Seeder"
                },
                new ActualControl
                {
                    Id = Guid.NewGuid(),
                    Concept = "Inspección de Seguridad",
                    Control = "Revisar las medidas de seguridad en el lugar de trabajo",
                    Observations = "Se detectaron áreas de mejora",
                    LastReview = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-3)),
                    NextReview = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(3)),
                    GroupId = 2,
                    FrequencyId = 2,
                    StatusId = 2,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "Seeder"
                }
            };

            for (int i = 1; i <= 100; i++)
            {
                controls.Add(new ActualControl
                {
                    Id = Guid.NewGuid(),
                    Concept = $"Control Programado {i}",
                    Control = $"Descripción del control {i}",
                    Observations = $"Observaciones del control {i}",
                    LastReview = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-i)),
                    NextReview = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(i)),
                    GroupId = i % 2 == 0 ? 1 : 2,
                    FrequencyId = (i % 3) + 1,
                    StatusId = (i % 3) + 1,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "Seeder"
                });
            }

            context.ActualControls.AddRange(controls);
        }

        if (!context.Revisions.Any())
        {
            var revisions = new List<Revision>();

            var actualControls = context.ActualControls.ToList();
            foreach (var control in actualControls.Take(10)) // Add revisions for the first 10 controls
            {
                revisions.Add(new Revision
                {
                    Id = Guid.NewGuid(),
                    ActualControlId = control.Id,
                    Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30)),
                    NextReview = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
                    FrequencyId = control.FrequencyId,
                    StatusId = control.StatusId,
                    Observations = $"Revisión para el control {control.Concept}",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "Seeder"
                });
            }

            context.Revisions.AddRange(revisions);
        }

        await context.SaveChangesAsync();
    }
}
