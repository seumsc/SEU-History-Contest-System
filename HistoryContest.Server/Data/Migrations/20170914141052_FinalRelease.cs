using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace HistoryContest.Server.Data.Migrations
{
    public partial class FinalRelease : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "PhoneNumber",
                table: "Counselors",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.CreateTable(
                name: "DepartmentWuIDs",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    StudentID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepartmentWuIDs", x => x.ID);
                    table.ForeignKey(
                        name: "FK_DepartmentWuIDs_Students_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Students",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DepartmentWuIDs_StudentID",
                table: "DepartmentWuIDs",
                column: "StudentID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DepartmentWuIDs");

            migrationBuilder.AlterColumn<int>(
                name: "PhoneNumber",
                table: "Counselors",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");
        }
    }
}
