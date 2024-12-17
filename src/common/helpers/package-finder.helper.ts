import {
  CountryDto,
  PackageDto,
} from 'src/modules/airalo/dtos/responses/synchronize_plans.response.dto';

export function findPackageById(
  countries: CountryDto[],
  packageId: string,
): PackageDto | null {
  for (const country of countries) {
    for (const operator of country.operators) {
      const foundPackage = operator.packages.find(
        (pkg) => pkg.id === packageId,
      );

      if (foundPackage) {
        return foundPackage;
      }
    }
  }
  return null; // Return null if no package is found
}
