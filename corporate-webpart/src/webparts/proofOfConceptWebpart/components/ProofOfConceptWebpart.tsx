import * as React from 'react';
import styles from './ProofOfConceptWebpart.module.scss';
import type { IProofOfConceptWebpartProps } from './IProofOfConceptWebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
import { IProofOfConcept, proofOfConceptGuId, verifyIfItIsProofOfConcept, Scale } from '../../../common/ProofOfConceptTypes';
import { MessageBar, Spinner, MessageBarType } from '@fluentui/react';

interface IProofOfConceptWebpartState {
  proofOfConcept?: IProofOfConcept;
  errorLoadingProofOfConcept?: boolean;
  temperature?: number;
}

export default class ProofOfConceptWebpart extends React.Component<IProofOfConceptWebpartProps, IProofOfConceptWebpartState> {

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

  async componentDidMount(): Promise<void> {
    const proofOfConcept = await this.loadProofOfConcept();
    if(proofOfConcept) {
      const temperature = proofOfConcept.currentTemperature("Plano, TX", Scale.Celsius);
      this.setState({ temperature });
    }
  }

  public render(): React.ReactElement<IProofOfConceptWebpartProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    if(this.state?.errorLoadingProofOfConcept === true) {
        return (
          <h1>Error loading component: {proofOfConceptGuId}</h1>
        );
    }

    if(!this.state?.proofOfConcept) {
        return (
          <Spinner label="Loading ProofOfConcept component..." />
        );
    }

    if(!this.state?.proofOfConcept) {
      return (
        <MessageBar 
          messageBarType={MessageBarType.error}
          isMultiline={false}
          dismissButtonAriaLabel="Close"
        >
          Fatal error loading ProofOfConcept component
        </MessageBar>
      );
    }

    
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
}
