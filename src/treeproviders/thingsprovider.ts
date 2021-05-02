import { TreeDataProvider, TreeItem, TreeItemCollapsibleState } from "vscode";
import { IotData } from '../utils/data';
import { Config } from '../utils/config';
import { Attributes } from 'aws-sdk/clients/iot';

class TreeDependecy extends TreeItem {
    /**
     *
     */
    constructor(thingName: string, collapsibleState?: TreeItemCollapsibleState, rootName?: string, attributes?: Attributes) {
        super(thingName, collapsibleState);
        this.tooltip = `Thing ${thingName}`;
        this.contextValue = rootName;
        if (rootName !== undefined) {
            this.command = {
                command: 'awsiot.getThing',
                title: "Open thing details",
                arguments: [this.label || "Thing", attributes]
            };
        }
    }
}

export class ThingsProvider implements TreeDataProvider<TreeDependecy>{

    private config: Config;
    constructor(config: Config) {
        this.config = config;
    }

    getTreeItem(element: TreeDependecy): TreeItem | Thenable<TreeItem> {
        return element;
    }
    async getChildren(element?: TreeDependecy): Promise<TreeDependecy[]> {
        try {
            const client = new IotData(this.config.getAWSProfile());
            if (!!element) {
                let typeName = element.label === "No Type" ? undefined : element.label;
                let things = await client.listThings(undefined, typeName);
                if (typeName === undefined) {
                    things = things.filter((thing) => thing.thingTypeName === null);
                }
                return Promise.resolve(things.map((thing) => {
                    return new TreeDependecy(thing.thingName || "", TreeItemCollapsibleState.None, element.label, thing.attributes);
                }));
            } else {
                let types = await client.listTypes();
                types.push({
                    thingTypeName: "No Type"
                });
                return Promise.resolve(types.map((type) => {
                    return new TreeDependecy(type.thingTypeName || "", TreeItemCollapsibleState.Collapsed);
                }));
            }
        } catch (error) {
            return Promise.reject([error.message]);
        }
    }


}