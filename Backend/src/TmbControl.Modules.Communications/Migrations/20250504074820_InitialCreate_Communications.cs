using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TmbControl.Modules.Communications.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate_Communications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "communications");

            migrationBuilder.CreateTable(
                name: "categories",
                schema: "communications",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "formats",
                schema: "communications",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_formats", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "origins",
                schema: "communications",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_origins", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "statuses",
                schema: "communications",
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
                name: "communications",
                schema: "communications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    category_id = table.Column<int>(type: "integer", nullable: false),
                    origin_id = table.Column<int>(type: "integer", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    due_date = table.Column<DateOnly>(type: "date", nullable: true),
                    description = table.Column<string>(type: "text", nullable: false),
                    file_name = table.Column<string>(type: "text", nullable: true),
                    file_path = table.Column<string>(type: "text", nullable: true),
                    status_id = table.Column<int>(type: "integer", nullable: false),
                    format_id = table.Column<int>(type: "integer", nullable: true),
                    related_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_communications", x => x.id);
                    table.ForeignKey(
                        name: "fk_communications_categories_category_id",
                        column: x => x.category_id,
                        principalSchema: "communications",
                        principalTable: "categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_communications_communications_related_id",
                        column: x => x.related_id,
                        principalSchema: "communications",
                        principalTable: "communications",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_communications_formats_format_id",
                        column: x => x.format_id,
                        principalSchema: "communications",
                        principalTable: "formats",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_communications_origins_origin_id",
                        column: x => x.origin_id,
                        principalSchema: "communications",
                        principalTable: "origins",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_communications_statuses_status_id",
                        column: x => x.status_id,
                        principalSchema: "communications",
                        principalTable: "statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "responsibles",
                schema: "communications",
                columns: table => new
                {
                    communication_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_responsibles", x => new { x.communication_id, x.user_id });
                    table.ForeignKey(
                        name: "fk_responsibles_communications_communication_id",
                        column: x => x.communication_id,
                        principalSchema: "communications",
                        principalTable: "communications",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_communications_category_id",
                schema: "communications",
                table: "communications",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_communications_format_id",
                schema: "communications",
                table: "communications",
                column: "format_id");

            migrationBuilder.CreateIndex(
                name: "ix_communications_origin_id",
                schema: "communications",
                table: "communications",
                column: "origin_id");

            migrationBuilder.CreateIndex(
                name: "ix_communications_related_id",
                schema: "communications",
                table: "communications",
                column: "related_id");

            migrationBuilder.CreateIndex(
                name: "ix_communications_status_id",
                schema: "communications",
                table: "communications",
                column: "status_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "responsibles",
                schema: "communications");

            migrationBuilder.DropTable(
                name: "communications",
                schema: "communications");

            migrationBuilder.DropTable(
                name: "categories",
                schema: "communications");

            migrationBuilder.DropTable(
                name: "formats",
                schema: "communications");

            migrationBuilder.DropTable(
                name: "origins",
                schema: "communications");

            migrationBuilder.DropTable(
                name: "statuses",
                schema: "communications");
        }
    }
}
