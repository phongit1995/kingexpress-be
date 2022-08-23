import { plainToClass } from 'class-transformer';
import { IsNumber, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  PORT: number;
}

export function envValidate(config: Record<string, unknown>) {
  //console.log(config);
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
