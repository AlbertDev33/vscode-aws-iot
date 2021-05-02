import { AwsCreds } from "./config";
import { Iot, SharedIniFileCredentials } from 'aws-sdk';
export class IotData {
    private creds: AwsCreds;
    constructor(creds: AwsCreds) {
        this.creds = creds;
    }

    async listThings(token?: string, thingType?:string): Promise<Iot.ThingAttributeList> {
        let things: Iot.ThingAttributeList;
        let client = new Iot({
            region: this.creds.region,
            credentials: new SharedIniFileCredentials({
                profile: this.creds.profile
            })
        });
        let response = await client.listThings({
            nextToken: token,
            thingTypeName:thingType
        }).promise();
        things = response.things || [];
        if (!!response.nextToken) {
            things.push(... await this.listThings(response.nextToken, thingType));
        }
        return things;
    }

    async listTypes(token?: string): Promise<Iot.ThingTypeList> {
        let types: Iot.ThingTypeList;
        let client = new Iot({
            region: this.creds.region,
            credentials: new SharedIniFileCredentials({
                profile: this.creds.profile
            })
        });
        let response = await client.listThingTypes({
            nextToken: token
        }).promise();
        types = response.thingTypes || [];
        if (!!response.nextToken) {
            types.push(...await this.listTypes(token));
        }
        return types;
    }
}