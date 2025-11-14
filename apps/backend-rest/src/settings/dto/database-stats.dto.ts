import { ApiProperty } from "@nestjs/swagger";

export class DatabaseStatsDto {
  @ApiProperty({
    description: "Total number of characters",
    example: 10,
  })
  characters: number;

  @ApiProperty({
    description: "Total number of users",
    example: 3,
  })
  users: number;
}
