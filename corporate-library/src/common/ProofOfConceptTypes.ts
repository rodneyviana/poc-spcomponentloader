// Use this to get a hold on the ProofOfConcept object
// import { SPComponentLoader } from "@microsoft/sp-loader";
// import { IProofOfConcept, proofOfConceptGuId, verifyIfItIsProofOfConcept } from "../common/ProofOfConceptTypes";
//
// const proofOfConcept = await SPComponentLoader.loadComponentById<IProofOfConcept>(proofOfConceptGuId); {
//     if (verifyIfItIsProofOfConcept(proofOfConcept)) {
//         console.log(proofOfConcept.name());
//         console.log(proofOfConcept.version());
//         console.log(proofOfConcept.currentTemperature("Seattle", Scale.Celsius));
//     } else {
//         console.error("The loaded component is not a valid ProofOfConcept");
//     }
export const proofOfConceptGuId = "7fca7997-87b9-42cf-9cf7-6b0c06c9e8b4";

export enum Scale {
    Celsius,
    Fahrenheit,
    Kelvin,
}

export interface IProofOfConcept {
    name(): string;
    version(): string;
    currentTemperature(cityOrZip: string, scale: Scale): number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyIfItIsProofOfConcept = (instance: any): instance is IProofOfConcept => {
    return instance?.name !== undefined &&
        instance?.version !== undefined &&
        instance?.currentTemperature !== undefined;
}