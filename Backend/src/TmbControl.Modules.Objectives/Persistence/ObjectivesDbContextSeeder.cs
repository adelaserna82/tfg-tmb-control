using TmbControl.Modules.Objectives.Entities;

namespace TmbControl.Modules.Objectives.Persistence;

public static class ObjectivesDbContextSeeder
{
    public static async Task SeedAsync(ObjectivesDbContext context)
    {
        if (!context.Statuses.Any())
        {
            context.Statuses.AddRange(
                new Status { Name = "Pendiente"},
                new Status { Name = "En curso"},
                new Status { Name = "Finalizado"}
            );
        }
        await context.SaveChangesAsync();

        if (!context.Areas.Any())
        {
            var area1Id = Guid.NewGuid();
            var area2Id = Guid.NewGuid();
            var area3Id = Guid.NewGuid();

            context.Areas.AddRange(
                new Area
                {
                    Id = area1Id,
                    Name = "Área de sostenibilidad",
                    Description = "Gestión de iniciativas verdes",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "Seeder"
                },
                new Area
                {
                    Id = area2Id,
                    Name = "Área de innovación",
                    Description = "Desarrollo de nuevas tecnologías",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "Seeder"
                },
                new Area
                {
                    Id = area3Id,
                    Name = "Área de recursos humanos",
                    Description = "Gestión del talento y bienestar",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "Seeder"
                }
            );

            if (!context.Objectives.Any())
            {
                var objective1Id = Guid.NewGuid();
                var objective2Id = Guid.NewGuid();
                var objective3Id = Guid.NewGuid();
                var objective4Id = Guid.NewGuid();
                var objective5Id = Guid.NewGuid();
                var objective6Id = Guid.NewGuid();

                context.Objectives.AddRange(
                    new Objective
                    {
                        Id = objective1Id,
                        Name = "Reducir emisiones de CO2",
                        Description = "Objetivo principal ambiental",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "Seeder"
                    },
                    new Objective
                    {
                        Id = objective2Id,
                        Name = "Implementar IA en procesos",
                        Description = "Automatización mediante inteligencia artificial",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "Seeder"
                    },
                    new Objective
                    {
                        Id = objective3Id,
                        Name = "Mejorar la retención de empleados",
                        Description = "Iniciativas para aumentar la satisfacción laboral",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "Seeder"
                    },
                    new Objective
                    {
                        Id = objective4Id,
                        Name = "Promover el reciclaje interno",
                        Description = "Implementar puntos de reciclaje en oficinas",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "Seeder"
                    },
                    new Objective
                    {
                        Id = objective5Id,
                        Name = "Optimizar procesos de manufactura",
                        Description = "Reducir tiempos y costos mediante tecnología",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "Seeder"
                    },
                    new Objective
                    {
                        Id = objective6Id,
                        Name = "Fomentar el desarrollo profesional",
                        Description = "Programas de capacitación y mentoría",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "Seeder"
                    }
                );

                if (!context.ActionPlans.Any())
                {
                    context.ActionPlans.AddRange(
                        new ActionPlan
                        {
                            Id = Guid.NewGuid(),
                            Year=2025,
                            AreaId = area1Id,
                            ObjectiveId = objective1Id,
                            Name = "Instalación de paneles solares",
                            Description = "Colocación en la cubierta principal",
                            Order = 1,
                            StatusId = 2,
                            StartIn = DateOnly.FromDateTime(DateTime.UtcNow),
                            FinisIn = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(6)),
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = "Seeder"
                        },
                        new ActionPlan
                        {
                            Id = Guid.NewGuid(),
                            Year=2025,
                            AreaId = area2Id,
                            ObjectiveId = objective2Id,
                            Name = "Desarrollar un prototipo de IA",
                            Description = "Prototipo para análisis de datos",
                            Order = 1,
                            StatusId = 1,
                            StartIn = DateOnly.FromDateTime(DateTime.UtcNow),
                            FinisIn = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(3)),
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = "Seeder"
                        },
                        new ActionPlan
                        {
                            Id = Guid.NewGuid(),
                            Year=2025,
                            AreaId = area3Id,
                            ObjectiveId = objective3Id,
                            Name = "Organizar talleres de bienestar",
                            Description = "Talleres mensuales para empleados",
                            Order = 1,
                            StatusId = 3,
                            StartIn = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-2)),
                            FinisIn = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(1)),
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = "Seeder"
                        },
                        new ActionPlan
                        {
                            Id = Guid.NewGuid(),
                            Year=2025,
                            AreaId = area1Id,
                            ObjectiveId = objective4Id,
                            Name = "Colocar contenedores de reciclaje",
                            Description = "Distribuir contenedores en todas las oficinas",
                            Order = 2,
                            StatusId = 1,
                            StartIn = DateOnly.FromDateTime(DateTime.UtcNow),
                            FinisIn = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(2)),
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = "Seeder"
                        },
                        new ActionPlan
                        {
                            Id = Guid.NewGuid(),
                            Year=2025,
                            AreaId = area2Id,
                            ObjectiveId = objective5Id,
                            Name = "Implementar sensores IoT",
                            Description = "Sensores para monitorear procesos de manufactura",
                            Order = 2,
                            StatusId = 2,
                            StartIn = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-1)),
                            FinisIn = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(4)),
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = "Seeder"
                        },
                        new ActionPlan
                        {
                            Id = Guid.NewGuid(),
                            AreaId = area3Id,
                            ObjectiveId = objective6Id,
                            Name = "Lanzar programa de mentoría",
                            Description = "Asignar mentores a empleados junior",
                            Order = 2,
                            StatusId = 3,
                            StartIn = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-3)),
                            FinisIn = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(2)),
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = "Seeder"
                        }
                    );
                }
            }
        }

        await context.SaveChangesAsync();
    }
}
