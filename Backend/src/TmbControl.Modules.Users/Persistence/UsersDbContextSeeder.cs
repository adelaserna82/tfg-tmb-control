using TmbControl.Modules.Users.Entities;
using TmbControl.Modules.Users.Options;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Users.Persistence;

public static class UsersDbContextSeeder
{
    public static async Task SeedAsync(UsersDbContext db, AdminUserOptions adminOptions)
    {
        if (!db.Roles.Any())
        {
            var now = DateTime.UtcNow;

            var permissions = new[]
            {
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Indicators.ToString(), Action = PermissionAction.View.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Indicators.ToString(), Action = PermissionAction.Create.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Indicators.ToString(), Action = PermissionAction.Edit.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Indicators.ToString(), Action = PermissionAction.Delete.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Indicators.ToString(), Action = PermissionAction.IngestMany.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Indicators.ToString(), Action = PermissionAction.ReceiveNotification.ToString(), CreatedAt = now, CreatedBy = "Seeder" },

                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Communications.ToString(), Action = PermissionAction.View.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Communications.ToString(), Action = PermissionAction.Create.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Communications.ToString(), Action = PermissionAction.Delete.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Communications.ToString(), Action = PermissionAction.Edit.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Communications.ToString(), Action = PermissionAction.Responsible.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Communications.ToString(), Action = PermissionAction.ReceiveNotification.ToString(), CreatedAt = now, CreatedBy = "Seeder" },

                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Objectives.ToString(), Action = PermissionAction.View.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Objectives.ToString(), Action = PermissionAction.Create.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Objectives.ToString(), Action = PermissionAction.Edit.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Objectives.ToString(), Action = PermissionAction.Delete.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Objectives.ToString(), Action = PermissionAction.ReceiveNotification.ToString(), CreatedAt = now, CreatedBy = "Seeder" },

                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.OperationalControl.ToString(), Action = PermissionAction.View.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.OperationalControl.ToString(), Action = PermissionAction.Create.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.OperationalControl.ToString(), Action = PermissionAction.Edit.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.OperationalControl.ToString(), Action = PermissionAction.Delete.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.OperationalControl.ToString(), Action = PermissionAction.ReceiveNotification.ToString(), CreatedAt = now, CreatedBy = "Seeder" },


                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Sites.ToString(), Action = PermissionAction.View.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Sites.ToString(), Action = PermissionAction.Create.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Sites.ToString(), Action = PermissionAction.Edit.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Sites.ToString(), Action = PermissionAction.Delete.ToString(), CreatedAt = now, CreatedBy = "Seeder" },

                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Users.ToString(), Action = PermissionAction.View.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Users.ToString(), Action = PermissionAction.Create.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Users.ToString(), Action = PermissionAction.Edit.ToString(), CreatedAt = now, CreatedBy = "Seeder" },
                new RolePermission { Id = Guid.NewGuid(), Module = PermissionModule.Users.ToString(), Action = PermissionAction.Delete.ToString(), CreatedAt = now, CreatedBy = "Seeder" }
                
            };
            db.RolePermissions.AddRange(permissions);

            RolePermission P(PermissionModule module, PermissionAction action)
            {
                var perm = permissions.FirstOrDefault(p => p.Module == module.ToString() && p.Action == action.ToString());
                if (perm == null)
                    throw new InvalidOperationException($"No permission found for module '{module}' and action '{action}'.");
                return perm;
            }

            var adminRole = new Role
            {
                Id = Guid.NewGuid(),
                Code = "admin",
                Name = "Administrador",
                CreatedAt = now,
                CreatedBy = "Seeder",
                Permissions =
                [
                    P(PermissionModule.Indicators, PermissionAction.View),
                    P(PermissionModule.Indicators, PermissionAction.Create),
                    P(PermissionModule.Indicators, PermissionAction.Edit),
                    P(PermissionModule.Indicators, PermissionAction.Delete),
                    P(PermissionModule.Indicators, PermissionAction.ReceiveNotification),

                    P(PermissionModule.Communications, PermissionAction.View),
                    P(PermissionModule.Communications, PermissionAction.Create),
                    P(PermissionModule.Communications, PermissionAction.Delete),
                    P(PermissionModule.Communications, PermissionAction.Edit),
                    P(PermissionModule.Communications, PermissionAction.Responsible),
                    P(PermissionModule.Communications, PermissionAction.ReceiveNotification),

                    P(PermissionModule.Objectives, PermissionAction.View),
                    P(PermissionModule.Objectives, PermissionAction.Create),
                    P(PermissionModule.Objectives, PermissionAction.Edit),
                    P(PermissionModule.Objectives, PermissionAction.Delete),
                    P(PermissionModule.Objectives, PermissionAction.ReceiveNotification),

                    P(PermissionModule.OperationalControl, PermissionAction.View),
                    P(PermissionModule.OperationalControl, PermissionAction.Create),
                    P(PermissionModule.OperationalControl, PermissionAction.Edit),
                    P(PermissionModule.OperationalControl, PermissionAction.Delete),
                    P(PermissionModule.Indicators, PermissionAction.ReceiveNotification),

                    P(PermissionModule.Sites, PermissionAction.View),
                    P(PermissionModule.Sites, PermissionAction.Create),
                    P(PermissionModule.Sites, PermissionAction.Edit),
                    P(PermissionModule.Sites, PermissionAction.Delete),

                    P(PermissionModule.Users, PermissionAction.View),
                    P(PermissionModule.Users, PermissionAction.Create),
                    P(PermissionModule.Users, PermissionAction.Edit),
                    P(PermissionModule.Users, PermissionAction.Delete)
                ]
            };


            var readOnlyIndicatorsRole = new Role
            {
                Id = Guid.NewGuid(),
                Code = "read_only_indicators",
                Name = "Solo Lectura (Indicadores)",
                CreatedAt = now,
                CreatedBy = "Seeder",
                Permissions = new List<RolePermission> { P(PermissionModule.Indicators, PermissionAction.View) }
            };

            db.Roles.AddRange(adminRole, readOnlyIndicatorsRole);


            db.Users.AddRange(
                new User
                {
                    Id = Guid.NewGuid(),
                    Name = adminOptions.Name,
                    Email = adminOptions.Email,
                    Mobile = "600000000",
                    Phone = "910000000",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminOptions.Password), 
                    Role = adminRole,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = "Seeder"
                },

                new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Lectura Indicadores",
                    Email = "readonlyindicators@example.com",
                    Mobile = "600000003",
                    Phone = "910000003",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("readonly123"), 
                    Role = readOnlyIndicatorsRole,
                    IsActive = true,
                    CreatedAt = now,
                    CreatedBy = "Seeder"
                }
            );
        }

        await db.SaveChangesAsync();
    }
}
