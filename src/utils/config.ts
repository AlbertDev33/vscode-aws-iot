import { workspace } from 'vscode';

const configKey = "awsiot";

export interface AwsCreds {
    profile: string | undefined
    awsKeyId: string | undefined
    awsSecretKey: string | undefined
    region: string | undefined
}

export class Config {

    isCredentialsEmpty(): boolean {
        let config = workspace.getConfiguration(configKey);
        const profile = config.get("profile");
        const awsKeyId = config.get("awsKeyId");
        return (profile === undefined || profile === "")
            && (awsKeyId === undefined || awsKeyId === "");
    }

    getAWSProfile(): AwsCreds {
        let creds: AwsCreds;
        let config = workspace.getConfiguration(configKey);
        creds = {
            profile: config.get('profile'),
            region: config.get('region'),
            awsKeyId: undefined,
            awsSecretKey: undefined
        };
        return creds;
    }

    setAWSProfile(creds: AwsCreds) {
        let config = workspace.getConfiguration(configKey);
        if (creds.profile !== undefined) {
            config.update('profile', creds.profile, true);
        }
        if (creds.region !== undefined) {
            config.update('region', creds.region, true);
        }
    }
}