import { ZodError } from "zod";

export function validSchema(dataBody: any, schema: any) {
  try {
    const data = schema.parse(dataBody);

    return [false, data];
  } catch (error: any) {
    const erroZod: ZodError = error;
    const errorValidateData: { message: string; campo: string }[] = [];

    JSON.parse(erroZod.message).map((item: any) => {
      errorValidateData.push({
        campo: item.path[0],
        message: item.message,
      });
    });

    return [true, errorValidateData];
  }
}
