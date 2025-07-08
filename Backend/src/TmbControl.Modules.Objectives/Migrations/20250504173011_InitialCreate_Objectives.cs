using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TmbControl.Modules.Objectives.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate_Objectives : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "objectives");

            migrationBuilder.CreateTable(
                name: "areas",
                schema: "objectives",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_areas", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "statuses",
                schema: "objectives",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_statuses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "objectives",
                schema: "objectives",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true),
                    status_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_objectives", x => x.id);
                    table.ForeignKey(
                        name: "fk_objectives_statuses_status_id",
                        column: x => x.status_id,
                        principalSchema: "objectives",
                        principalTable: "statuses",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "action_plans",
                schema: "objectives",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    year = table.Column<int>(type: "integer", nullable: false),
                    area_id = table.Column<Guid>(type: "uuid", nullable: false),
                    objective_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    status_id = table.Column<int>(type: "integer", nullable: false),
                    start_in = table.Column<DateOnly>(type: "date", nullable: false),
                    finis_in = table.Column<DateOnly>(type: "date", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_action_plans", x => x.id);
                    table.ForeignKey(
                        name: "fk_action_plans_areas_area_id",
                        column: x => x.area_id,
                        principalSchema: "objectives",
                        principalTable: "areas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_action_plans_objectives_objective_id",
                        column: x => x.objective_id,
                        principalSchema: "objectives",
                        principalTable: "objectives",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_action_plans_statuses_status_id",
                        column: x => x.status_id,
                        principalSchema: "objectives",
                        principalTable: "statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_action_plans_area_id",
                schema: "objectives",
                table: "action_plans",
                column: "area_id");

            migrationBuilder.CreateIndex(
                name: "ix_action_plans_objective_id",
                schema: "objectives",
                table: "action_plans",
                column: "objective_id");

            migrationBuilder.CreateIndex(
                name: "ix_action_plans_status_id",
                schema: "objectives",
                table: "action_plans",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "ix_objectives_status_id",
                schema: "objectives",
                table: "objectives",
                column: "status_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "action_plans",
                schema: "objectives");

            migrationBuilder.DropTable(
                name: "areas",
                schema: "objectives");

            migrationBuilder.DropTable(
                name: "objectives",
                schema: "objectives");

            migrationBuilder.DropTable(
                name: "statuses",
                schema: "objectives");
        }
    }
}
