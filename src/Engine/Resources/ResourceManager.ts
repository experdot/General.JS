import { HttpWebRequest } from "../Network/Network";
import { ResourceSet } from "./ResourceSet";

export class ResourceManager {
    sets: ResourceSet[];
    preload: (preloaded?: Function) => void;

    constructor() {
        this.sets = [];
    }

    add(...sets: ResourceSet[]) {
        this.sets.push(...sets);
    }

    clear() {
        this.sets = [];
        return this;
    }

    async load() {
        const requests = this.sets.map(element => fetch(element.src).then(resposne => resposne.json()).then(json => {
            element.init(json);
        }));
        await Promise.all(requests);
    }

    assign(target: any) {
        this.sets.forEach(element => {
            for (const key in target) {
                const value = element.data[key]
                if (value !== undefined) {
                    target[key] = element.data[key];
                }
            }
        });
        return this;
    }
}