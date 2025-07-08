using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TmbControl.Modules.OperationalControl.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate_OperationalControl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "operational_control");

            migrationBuilder.CreateTable(
                name: "frequencies",
                schema: "operational_control",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_frequencies", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "groups",
                schema: "operational_control",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_groups", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "statuses",
                schema: "operational_control",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_statuses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "actual_controls",
                schema: "operational_control",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    concept = table.Column<string>(type: "text", nullable: false),
                    control = table.Column<string>(type: "text", nullable: false),
                    observations = table.Column<string>(type: "text", nullable: true),
                    last_review = table.Column<DateOnly>(type: "date", nullable: true),
                    next_review = table.Column<DateOnly>(type: "date", nullable: true),
                    group_id = table.Column<int>(type: "integer", nullable: false),
                    frequency_id = table.Column<int>(type: "integer", nullable: false),
                    status_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_actual_controls", x => x.id);
                    table.ForeignKey(
                        name: "fk_actual_controls_frequencies_frequency_id",
                        column: x => x.frequency_id,
                        principalSchema: "operational_control",
                        principalTable: "frequencies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_actual_controls_groups_group_id",
                        column: x => x.group_id,
                        principalSchema: "operational_control",
                        principalTable: "groups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_actual_controls_statuses_status_id",
                        column: x => x.status_id,
                        principalSchema: "operational_control",
                        principalTable: "statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "revisions",
                schema: "operational_control",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    actual_control_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: true),
                    next_review = table.Column<DateOnly>(type: "date", nullable: true),
                    frequency_id = table.Column<int>(type: "integer", nullable: false),
                    status_id = table.Column<int>(type: "integer", nullable: false),
                    observations = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_revisions", x => x.id);
                    table.ForeignKey(
                        name: "fk_revisions_actual_controls_actual_control_id",
                        column: x => x.actual_control_id,
                        principalSchema: "operational_control",
                        principalTable: "actual_controls",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_revisions_frequencies_frequency_id",
                        column: x => x.frequency_id,
                        principalSchema: "operational_control",
                        principalTable: "frequencies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_revisions_statuses_status_id",
                        column: x => x.status_id,
                        principalSchema: "operational_control",
                        principalTable: "statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_actual_controls_frequency_id",
                schema: "operational_control",
                table: "actual_controls",
                column: "frequency_id");

            migrationBuilder.CreateIndex(
                name: "ix_actual_controls_group_id",
                schema: "operational_control",
                table: "actual_controls",
                column: "group_id");

            migrationBuilder.CreateIndex(
                name: "ix_actual_controls_status_id",
                schema: "operational_control",
                table: "actual_controls",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "ix_revisions_actual_control_id",
                schema: "operational_control",
                table: "revisions",
                column: "actual_control_id");

            migrationBuilder.CreateIndex(
                name: "ix_revisions_frequency_id",
                schema: "operational_control",
                table: "revisions",
                column: "frequency_id");

            migrationBuilder.CreateIndex(
                name: "ix_revisions_status_id",
                schema: "operational_control",
                table: "revisions",
                column: "status_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "revisions",
                schema: "operational_control");

            migrationBuilder.DropTable(
                name: "actual_controls",
                schema: "operational_control");

            migrationBuilder.DropTable(
                name: "frequencies",
                schema: "operational_control");

            migrationBuilder.DropTable(
                name: "groups",
                schema: "operational_control");

            migrationBuilder.DropTable(
                name: "statuses",
                schema: "operational_control");
        }
    }
}
