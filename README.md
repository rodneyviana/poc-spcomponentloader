# Library loaded by SPComponentLoader.loadComponentById() PoC

It is rather a **proof-of-concept** of instantiating library using the component id in ```ProofOfConceptLibrary.manifest.json```, this code has no other purpose than to show you a technique.

### This Proof of Concept includes two projects:

- **corporate-library** - a vanilla SPFx component library to be consumed by an also vanilla SPFx web part using simply ```SPComponentLoader.loadComponentById()``` with the library manifest id without using ```npm link``` as suggested [here](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/library-component-tutorial).
- **corporate-webpart** - a vanilla SPFx webpart using the SPFx component. More on creating a webpart [here](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/build-a-hello-world-web-part#to-create-a-new-web-part-project).


The only code that needs to be shared among the two projects is the interface defining the componentand the component id. For this example it is copied in each project. The methods chosen are really random, no particular need to use any of these methods in your own project.

This is the shared code, notice that you may create a npm library only for the types existent in the component library, in this case there is only a class, an enum and a constant.

```typescript
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
```
In case you are wondering how I've got the guid ```"7fca7997-87b9-42cf-9cf7-6b0c06c9e8b4"```, I simply copied it from the manifest of my component at ```ProofOfConceptLibrary.manifest.json```.

```json
{
  "id": "7fca7997-87b9-42cf-9cf7-6b0c06c9e8b4",
  "alias": "ProofOfConceptLibrary",
  "componentType": "Library",

  // The "*" signifies that the version should be taken from the package.json
  "version": "*",
  "manifestVersion": 2
}
```



## Instantiating it on an independent webpart

This is how the component is instantiated, please notice that you have to bundle the component project in production mode and deploy to your tenant or site collection App Catalog. Your webpart can be tested in debug mode after that.

**Bundling and Packaging your Component in production mode**
```bash
cd corporate-library
gulp clean --ship
gulp bundle --ship
gulp package-solution --ship
```
The package will be located in the subfolder ```sharepoint``` with the name ```poc-library.sppkg```. Make sure you deploy before testing your web application.

### How to consume the component

Consuming the component is the trick part as ```SPComponentLoader.loadComponentById()``` will not return an instance directly. This is the code to do so in ```ProofOfConceptWebpart.tsx```:


```typescript
import { IProofOfConcept, proofOfConceptGuId, verifyIfItIsProofOfConcept, Scale } from '../../../common/ProofOfConceptTypes';
 //.... code removed for space

  private async loadProofOfConcept(): Promise<IProofOfConcept | undefined> {
    const proofOfConceptModule: { ProofOfConceptLibrary: { prototype: IProofOfConcept}} = await SPComponentLoader.loadComponentById(proofOfConceptGuId);
    const proofOfConcept: IProofOfConcept = proofOfConceptModule.ProofOfConceptLibrary.prototype;
    if (verifyIfItIsProofOfConcept(proofOfConcept)) {
      this.setState({ proofOfConcept, errorLoadingProofOfConcept: false });
      return proofOfConcept;
    } else {
      this.setState({ errorLoadingProofOfConcept: true });
      console.error("The loaded component is not a valid ProofOfConcept or is undefined");
      return undefined;
    }
  }
  ```

  And later this is how I use the component in the ```render()``` method:

  ```typescript

    // first I get the temperature in Celcius (it's a mock method, just returning a random number)
    async componentDidMount(): Promise<void> {
    const proofOfConcept = await this.loadProofOfConcept();
    if(proofOfConcept) {
      const temperature = proofOfConcept.currentTemperature("Plano, TX", Scale.Celsius);
      this.setState({ temperature });
    }
  }

    public render(): React.ReactElement<IProofOfConceptWebpartProps> {
// .. some code .. //
    return (
      <section className={`${styles.proofOfConceptWebpart} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The temperature in Plano, TX is {this.state?.temperature}°C
          </p>

        </div>
      </section>
    );
  }

  ```