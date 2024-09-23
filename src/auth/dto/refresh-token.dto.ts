import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRob25pQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwic3ViIjoiYTY2Y2I2YWQtYWJmMy00NGUzLWExNTQtMTliNmIxMzNiNDhkIiwiaWF0IjoxNzI2OTQzMzEzLCJleHAiOjE3Mjc1NDgxMTN9.C2N0kBUgoWrQ3Br9IRTPSLWJPg3cgyVJA3sb7aga7IQ',
    description: 'Generate access token by refresh token',
  })
  refresh_token: string;
}
