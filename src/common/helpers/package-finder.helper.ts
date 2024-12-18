import { PackageResponseDto } from 'src/modules/airalo/dtos/responses/package.response';
import { CountryDto } from 'src/modules/airalo/dtos/responses/synchronize_plans.response.dto';

export function findPackageById(
  countries: CountryDto[],
  packageId: string,
): PackageResponseDto | null {
  for (const country of countries) {
    for (const operator of country.operators) {
      const foundPackage = operator.packages.find(
        (pkg) => pkg.id === packageId,
      );

      if (foundPackage) {
        // const { packages, ...rest } = operator;
        return {
          ...foundPackage,
          operator,
        };
      }
    }
  }
  return null; // Return null if no package is found
}
