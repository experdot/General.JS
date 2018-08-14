
import { ResourceManager } from "./ResourceManager";
import { CultureInfo } from "../Globalization/CultureInfo";
import { ResourceSet } from "./ResourceSet";
import { ConfigurationManager } from "./ConfigurationManager";

export class CultureResourceManager extends ResourceManager {
    config: CultureResourceConfig;
    target: any;
    onPrepared: Function;

    constructor(config?: CultureResourceConfig) {
        super();
        this.config = config;
        this.onPrepared = () => { };
    }

    init(config: CultureResourceConfig) {
        this.config = config;
        return this;
    }

    load(loaded?: Function) {
        super.load(() => {
            this.target && this.assign(this.target);
            loaded && loaded();
        });
        return this;
    }

    attach(target: any, culture: CultureInfo = CultureInfo.Netural) {
        if (this.config) {
            this.add(new ResourceSet(this.config.get(culture.language)));
            this.target = target;
        }
        return this;
    }

    switch(culture: CultureInfo = CultureInfo.Netural, loaded?: Function) {
        if (this.config) {
            this.sets = [];
            this.attach(this.target, culture).load(loaded);
        }
        return this;
    }
}

export class CultureResourceConfig {
    template: string;
    languages: any[];
    replace: string;

    constructor(template?: string, languages?: string[], replace = "{{language}}") {
        this.template = template;
        this.languages = languages;
        this.replace = replace;
    }

    get(language: string) {
        if (this.languages.findIndex(v => v === language) < 0) {
            language = this.languages[0];
        }
        return this.template.replace(this.replace, language);
    }
}