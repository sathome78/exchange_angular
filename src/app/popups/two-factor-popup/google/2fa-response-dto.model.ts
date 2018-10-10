
export class TwoFaResponseDto implements ITwoFaResponseDto{
  error: string;
  message: string;

  constructor(error: string, message: string) {
    this.error = error;
    this.message = message;
  }
}

export interface ITwoFaResponseDto {
  message: string;
  error: string;

}
