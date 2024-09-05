import { IProofOfConcept, Scale } from '../../common/ProofOfConceptTypes';

export class ProofOfConceptLibrary implements IProofOfConcept {
  public version(): string {
    return '1.0.0.0';
  }

  public currentTemperature(cityOrZip: string, scale: Scale): number {
    // Implement the logic to fetch the current temperature for the given city or zip code
    // and convert it to the specified scale (e.g., Celsius or Fahrenheit).
    // Return the temperature as a number.
    // Example implementation:
    // const temperature = fetchTemperature(cityOrZip); // Fetch temperature from an API or database
    // const convertedTemperature = convertTemperature(temperature, scale); // Convert temperature to the specified scale
    // return convertedTemperature;
    switch (scale) {
      // return a random number between -20 and 45
      case Scale.Celsius:
        return Math.random() * 65 - 20;
      // return a random number between -4 and 113
      case Scale.Fahrenheit:
        return Math.random() * 117 - 4;
      // return a random number between 268.5 and 518.5
      case Scale.Kelvin:
        return Math.random() * 250 + 268.5;
      default:
        throw new Error('Invalid scale');
    }
    
  }

  public name(): string {
    return 'ProofOfConceptLibrary';
  }
}
