import { ResourceManager } from "./ResourceManager";
import { ResourceSet } from "./ResourceSet";

export class ConfigurationManager extends ResourceManager {
    url: string;
    target: any;

    constructor(url: string) {
        super()
        this.url = url;
        this.add(new ResourceSet(this.url));
    }

    attach(target: any) {
        this.target = target;
        return this;
    }

    async load() {
        await super.load().then(() => {
            this.target && this.assign(this.target);
        });
    }
}