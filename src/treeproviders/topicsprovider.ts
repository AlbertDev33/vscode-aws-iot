import { ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, window } from "vscode";
import { Iot } from 'aws-sdk';

class TopicDependecy extends TreeItem {
    /**
     *
     */
    constructor(topic: string, collapsibleState?: TreeItemCollapsibleState) {
        super(topic, collapsibleState);
        this.label = topic;
        this.tooltip = `Topic ${topic}`;
    }
}

export class TopicsProvider implements TreeDataProvider<TopicDependecy>{

    private readonly topics: Array<string>;
    constructor(topics: Array<string>) {
        this.topics = topics;
    }

    getTreeItem(element: TopicDependecy): TreeItem | Thenable<TreeItem> {
        return element;
    }
    async getChildren(element?: TopicDependecy): Promise<TopicDependecy[]> {
       if(!element){
           return Promise.resolve(this.topics.map((topic)=>{
               return new TopicDependecy(topic, TreeItemCollapsibleState.Collapsed);
           }));
       }else{
           return Promise.resolve([]);
       }
    }


}