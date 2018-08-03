import { HttpWebRequest } from "../Network/Network";
import { CultureInfo } from "../Globalization/CultureInfo";

export class ResourceManager {
    data: any;
    loaded: boolean;

    constructor() {
        this.data = {};
    }

    get(key) {
        return this.data[key];
    }

    load(src, target) {
        this.loaded = false;
        HttpWebRequest.get(src, response => {
            this.data = JSON.parse(response);
            target && this._attach(target);
            this.loaded = true;
        });
        return this;
    }

    wait(callback, timeout = 10) {
        let waitHandler = () => {
            if (this.loaded) {
                callback && callback();
            } else {
                setTimeout(waitHandler, timeout, callback);
            }
        };
        waitHandler();
    }

    _attach(target) {
        for (let key in target) {
            target[key] = this.data[key];
        }
    }
}

export class CultureResourceManager extends ResourceManager {
    config: CultureResourceConfig;

    constructor(config) {
        super();
        this.config = config;
    }

    load(target, culture = CultureInfo.Default) {
        return super.load(this.config.get(culture.language), target);
    }
}

export class CultureResourceConfig {
    template: string;
    languages: any[];
    replace: string;

    constructor(template, languages = [], replace = "{{language}}") {
        this.template = template;
        this.languages = languages;
        this.replace = replace;
    }

    get(language) {
        if (this.languages.findIndex(v => v === language) < 0) {
            language = this.languages[0];
        }
        return this.template.replace(this.replace, language);
    }
}