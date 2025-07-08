using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TmbControl.Modules.Indicators.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate_Indicators : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "indicators");

            migrationBuilder.CreateTable(
                name: "categories",
                schema: "indicators",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "frequencies",
                schema: "indicators",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_frequencies", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "statuses",
                schema: "indicators",
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
                name: "indicators",
                schema: "indicators",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    code = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    value = table.Column<double>(type: "double precision", nullable: true),
                    date = table.Column<DateOnly>(type: "date", nullable: true),
                    frequency_id = table.Column<int>(type: "integer", nullable: false),
                    category_id = table.Column<int>(type: "integer", nullable: false),
                    status_id = table.Column<int>(type: "integer", nullable: false),
                    min = table.Column<double>(type: "double precision", nullable: false),
                    max = table.Column<double>(type: "double precision", nullable: false),
                    unit = table.Column<string>(type: "text", nullable: false),
                    x_location = table.Column<double>(type: "double precision", nullable: false),
                    y_location = table.Column<double>(type: "double precision", nullable: false),
                    is_error_configured = table.Column<bool>(type: "boolean", nullable: false),
                    min_error = table.Column<double>(type: "double precision", nullable: true),
                    max_error = table.Column<double>(type: "double precision", nullable: true),
                    is_alert_configured = table.Column<bool>(type: "boolean", nullable: false),
                    min_alert = table.Column<double>(type: "double precision", nullable: true),
                    max_alert = table.Column<double>(type: "double precision", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_indicators", x => x.id);
                    table.ForeignKey(
                        name: "fk_indicators_categories_category_id",
                        column: x => x.category_id,
                        principalSchema: "indicators",
                        principalTable: "categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_indicators_frequencies_frequency_id",
                        column: x => x.frequency_id,
                        principalSchema: "indicators",
                        principalTable: "frequencies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_indicators_statuses_status_id",
                        column: x => x.status_id,
                        principalSchema: "indicators",
                        principalTable: "statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "indicator_histories",
                schema: "indicators",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    indicator_id = table.Column<Guid>(type: "uuid", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    value = table.Column<double>(type: "double precision", nullable: false),
                    status_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_indicator_histories", x => x.id);
                    table.ForeignKey(
                        name: "fk_indicator_histories_indicators_indicator_id",
                        column: x => x.indicator_id,
                        principalSchema: "indicators",
                        principalTable: "indicators",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_indicator_histories_statuses_status_id",
                        column: x => x.status_id,
                        principalSchema: "indicators",
                        principalTable: "statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_indicator_histories_indicator_id",
                schema: "indicators",
                table: "indicator_histories",
                column: "indicator_id");

            migrationBuilder.CreateIndex(
                name: "ix_indicator_histories_status_id",
                schema: "indicators",
                table: "indicator_histories",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "ix_indicators_category_id",
                schema: "indicators",
                table: "indicators",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_indicators_frequency_id",
                schema: "indicators",
                table: "indicators",
                column: "frequency_id");

            migrationBuilder.CreateIndex(
                name: "ix_indicators_status_id",
                schema: "indicators",
                table: "indicators",
                column: "status_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "indicator_histories",
                schema: "indicators");

            migrationBuilder.DropTable(
                name: "indicators",
                schema: "indicators");

            migrationBuilder.DropTable(
                name: "categories",
                schema: "indicators");

            migrationBuilder.DropTable(
                name: "frequencies",
                schema: "indicators");

            migrationBuilder.DropTable(
                name: "statuses",
                schema: "indicators");
        }
    }
}
